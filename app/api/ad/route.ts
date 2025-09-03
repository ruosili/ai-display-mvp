import { NextRequest, NextResponse } from "next/server";
import { queryToCategory } from "@/lib/match";

type Ad = {
  disclosure: "Sponsored";
  advertiser: string;
  title: string;
  body: string;
  cta_label: string;
  cta_url: string;
  image_url?: string;
  safety_tags?: string[];
};

type Catalog = Record<string, Ad[]>;

let CATALOG_CACHE: Catalog | null = null;

export const GET = async (req: NextRequest) => {
  // Compute an absolute URL to /catalog.json using the request origin
  const origin = req.nextUrl.origin;
  if (!CATALOG_CACHE) {
    const res = await fetch(`${origin}/catalog.json`, { cache: "no-store" });
    CATALOG_CACHE = await res.json();
  }

  const q = (req.nextUrl.searchParams.get("q") || "").trim();
  const country = req.nextUrl.searchParams.get("country") || "US";
  const placement = req.nextUrl.searchParams.get("placement") || "inline_answer";

  const category = queryToCategory(q);
  const ad: Ad | null = category && CATALOG_CACHE![category]?.[0] ? CATALOG_CACHE![category][0] : null;

  console.log(JSON.stringify({ event:"ad_request", q, country, placement, category, matched: !!ad, ts: Date.now() }));

  if (!ad) {
    return NextResponse.json({ decision: "no_fill" });
  }

  // Always label Sponsored; do not add PII; keep payload minimal
  return NextResponse.json({
    decision: "serve",
    ad
  });
};
