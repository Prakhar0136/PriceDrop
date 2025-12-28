import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPriceDropAlert(
  userEmail,
  product,
  oldPrice,
  newPrice
) {
  try {
    const priceDrop = oldPrice - newPrice;
    const percentageDrop = ((priceDrop / oldPrice) * 100).toFixed(1);

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: userEmail,
      subject: `Price Drop Alert: ${product.name}`,
      html: `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #FA5D19 0%, #FF8C42 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
      <h1 style="color: white; margin: 0;">🎉 Price Drop Alert!</h1>
    </div>

    <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
      ${
        product.image_url
          ? `
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="${product.image_url}" alt="${product.name}" style="max-width: 200px; border-radius: 8px; border: 1px solid #e5e7eb;" />
        </div>
      `
          : ""
      }

      <h2 style="color: #1f2937;">${product.name}</h2>

      <p><strong>Price dropped by ${percentageDrop}%</strong></p>

      <p>
        <del>${product.currency} ${oldPrice.toFixed(2)}</del><br />
        <strong>${product.currency} ${newPrice.toFixed(2)}</strong>
      </p>

      <a href="${product.url}" style="display: inline-block; background: #FA5D19; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none;">
        View Product →
      </a>

      <p style="margin-top: 20px; font-size: 12px; color: #6b7280;">
        View all tracked products:
        <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="color: #FA5D19;">PriceLens</a>
      </p>
    </div>
  </body>
</html>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return { error };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Email send error:", err);
    return { error: err.message };
  }
}
