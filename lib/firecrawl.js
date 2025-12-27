import Firecrawl from "@mendable/firecrawl-js";


const firecrawl = new Firecrawl({
  apiKey: process.env.FIRECRAWL_API_KEY,
});

export async function scrapeProduct(url) {
  try {
    const result = await firecrawl.scrape(url, {
      formats: [
        {
          type: "json",
          schema: {
            type: "object",
            required: ["productName", "currentPrice"],
            properties: {
              productName: {
                type: "string",
              },
              currentPrice: {
                type: "string",
              },
              currencyCode: {
                type: "string",
              },
              productImageUrl: {
                type: "string",
              },
            },
          },
          prompt:
            "Extract the product name as 'productName', current price as 'currentPrice', currency code (USD, EUR, etc) as 'currencyCode', and product image URL as 'productImageUrl' if available",
        },
      ],
    });

    const extractedData = result.json;

    if (
      !extractedData ||
      !extractedData.productName ||
      !extractedData.currentPrice
    ) {
      throw new Error("Failed to extract product data");
    }

    return extractedData;
  } catch (error) {
    console.error("Error scraping product:", error);
    throw new Error(`Failed to scrape product: ${error.message}`);
  }
}
