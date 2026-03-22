import { shopifyFetch, GET_ALL_PRODUCTS } from "@/lib/shopify";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await shopifyFetch({
      query: GET_ALL_PRODUCTS,
      variables: { first: 20 },
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error("Shopify API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
