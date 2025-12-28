import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';


export async function GET(){
    return NextResponse.json({
        message: "Cron job to check prices executed."
    });
}

export async function POST(request){
try{
    const authHeader = request.headers.get('Authorization');
    const cronSecret = process.env.CRON_SECRET;
    if(!cronSecret || authHeader !== `Bearer ${cronSecret}`){
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const {data: products, error: productsError} = await supabase
    .from('products')
    .select("*");

    if(productsError) throw productsError;

    console.log(`found ${products.length} products to check`)

    const results = {
        total:products.length,
        updated:0,
        failed:0,
        priceChanges:0,
        alertsSent:0,
    }

    for(const product of products){
        try{
            const productData = await scrapeProductData(product.url);

            if(!productsData.currentPrice){
                results.failed++;
                continue;
            }

            const newPrice = parseFloat(productData.currentPrice)
            const oldPrice = parseFloat(product.current_Price)

            await supabase.from("products").update({
                currentPrice : newPrice,
                currency: productData.currencyCode || product.currency,
                name: productData.name || product.name,
                image_url: productData.productImageUrl || product.image_url,
                updated_at: new Date().toISOString(),

            })
            .eq("id",product.id);

            if(oldPrice!=newPrice){
                await supabase.from("price_history").insert({
                    product_id:product.id,
                    price:newPrice,
                    currency:productData.currencyCode || product.currency,
                })

                results.priceChanges++

                if(newPrice<oldPrice){
                    const{data:{user}}=
                    await supabase.auth.admin.getUserId(product.user_id)

                    if(user?.email){
                        const emailResult = await sendPriceDropAlert(
                            user.email,
                            product,
                            oldPrice,
                            newPrice
                        )

                        if(emailResult.success){
                            results.alertsSent++
                        }
                    }
                }
            }

            results.updated++
        }
        catch(error){
            console.error(`error processing product ${product.id}:`,error)
            results.failed++;
        }
    }

    return NextResponse.json({
        success:true,
        message:"price check completed",
        results,
    })
}
catch(error){
    console.error("cron job error",error)
    return NextResponse.json({error:error.message},{status:500})
}
}
