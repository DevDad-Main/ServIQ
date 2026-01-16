import { db } from "@/db/client";
import { isUserAuthorized } from "@/lib/isAuthorized";
import { logger } from "devdad-express-utils";
import { NextRequest, NextResponse } from "next/server";
import { metadata } from "@/db/schema";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const user = await isUserAuthorized();

  if (!user) {
    logger.error(`${__dirname}: User Not Authorized`, {
      URL: req.url,
    });
    return NextResponse.json({ error: "User Unauthorized" }, { status: 401 });
  }

  const { business_name, website_url, external_links } = await req.json();

  if (!business_name || !website_url) {
    logger.error("Missing Required Fields.. Business Name or Website URL", {
      BODY: await req.json(),
    });
    return NextResponse.json(
      {
        error: "Missing business name or website URL, Required Information.",
      },
      { status: 400 },
    );
  }

  const metadataResponse = await db.insert(metadata).values({
    user_email: user.email,
    business_name,
    website_url,
    external_links,
  });

  (await cookies()).set("metadata", JSON.stringify({ business_name }));

  return NextResponse.json({ metadataResponse }, { status: 201 });
}
