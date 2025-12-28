import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { scrapeProduct } from "@/lib/firecrawl";
import { sendPriceDropAlert } from "@/lib/email";

export async function GET() {
  return NextResponse.json({
    message: "Cron endpoint is live",
  });
}

export async function POST(request) {
  try {
    /* -------------------- AUTH CHECK -------------------- */
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    /* -------------------- SUPABASE CLIENT -------------------- */
    const supabase = await createClient();

    /* -------------------- FETCH PRODUCTS -------------------- */
    const { data: products, error } = await supabase
      .from("products")
      .select("*");

    if (error) throw error;

    console.log(`Found ${products.length} products to check`);

    const results = {
      total: products.length,
      updated: 0,
      failed: 0,
      priceChanges: 0,
      alertsSent: 0,
    };

    /* -------------------- PROCESS EACH PRODUCT -------------------- */
    for (const product of products) {
      try {
        const productData = await scrapeProduct(product.url);

        if (!productData?.currentPrice) {
          results.failed++;
          continue;
        }

        const newPrice = parseFloat(
          productData.currentPrice.replace(/[^0-9.-]+/g, "")
        );
        const oldPrice = parseFloat(product.current_price);

        /* -------------------- UPDATE PRODUCT -------------------- */
        await supabase
          .from("products")
          .update({
            current_price: newPrice,
            currency: productData.currencyCode || product.currency,
            name: productData.productName || product.name,
            image_url: productData.productImageUrl || product.image_url,
            updated_at: new Date().toISOString(),
          })
          .eq("id", product.id);

        /* -------------------- PRICE CHANGE -------------------- */
        if (newPrice !== oldPrice) {
          await supabase.from("price_history").insert({
            product_id: product.id,
            price: newPrice,
            currency: productData.currencyCode || product.currency,
          });

          results.priceChanges++;

          /* -------------------- PRICE DROP EMAIL -------------------- */
          if (newPrice < oldPrice) {
            const { data: userData } =
              await supabase.auth.admin.getUserById(product.user_id);

            const user = userData?.user;

            if (user?.email) {
              const emailResult = await sendPriceDropAlert(
                user.email,
                product,
                oldPrice,
                newPrice
              );

              if (emailResult?.success) {
                results.alertsSent++;
              }
            }
          }
        }

        results.updated++;
      } catch (err) {
        console.error(
          `Error processing product ${product.id}:`,
          err
        );
        results.failed++;
      }
    }

    /* -------------------- RESPONSE -------------------- */
    return NextResponse.json({
      success: true,
      message: "Price check completed",
      results,
    });
  } catch (err) {
    console.error("Cron job failed:", err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
