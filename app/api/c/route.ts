import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const url = new URL(req.url);
  const dest = url.searchParams.get("dest") || "";
  const cid  = url.searchParams.get("cid")  || "test";
  const ua   = req.headers.get("user-agent") || "";
  const ip   = req.headers.get("x-forwarded-for") || "unknown";

  console.log(JSON.stringify({ event:"ad_click", cid, dest, ua, ip, ts: Date.now() }));

  try {
    const valid = new URL(dest);
    return NextResponse.redirect(valid.toString(), 302);
  } catch {
    return new NextResponse("Bad dest", { status: 400 });
  }
};
