import readyClient from "@/lib/bot";
import { makeCard } from "@/lib/card";
import { validateId, fetchUserInfo } from "@/lib/discord";
import { URItoBase64 } from "@/lib/utils";
import { NextRequest } from "next/server";
import { z } from "zod";

export const dynamic = 'force-dynamic'
export const revalidate = 60;

const ParamsSchema = z.object({
  width: z.coerce.number().default(500),
  animate: z.coerce.boolean().default(false),
  overrideBannerUrl: z.string().optional().refine((val) => {
    if (!val) return true;
    if (!val.startsWith("http")) return false;
  }, {
    message: "Banner URL must be a valid HTTP or HTTPS URL.",
  }),
  aboutMe: z.string().optional(),
  hideDecoration: z.coerce.boolean().default(false),
  hideSpotify: z.coerce.boolean().default(false),
  theme: z.enum(["dark", "light", "custom", "nitroDark", "nitroLight"]).default("dark"),
  primaryColor: z.string().default("ecaff3"),
  accentColor: z.string().default("44a17a"),
  colorB1: z.string().default("111214"),
  colorB2: z.string().default("313338"),
  colorB3: z.string().default("505059"),
  colorT1: z.string().default("fff"),
  colorT2: z.string().default("d2d6d8"),
}).superRefine((data, ctx) => {
  if (data.theme === "nitroDark" || data.theme === "nitroLight") {
    if (!data.primaryColor || !data.accentColor) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Primary and accent colors must be provided for nitro themes.",
      });
    }
  }
  if (data.theme === "custom") {
    if (!data.colorB1 || !data.colorB2 || !data.colorB3 || !data.colorT1 || !data.colorT2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Custom theme colors must be provided when theme is 'custom'.",
      });
    }
  }
});

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const client = await readyClient;
  const id = (await params).id;
  const searchParams = request.nextUrl.searchParams
  const { success, data: options, error } = ParamsSchema.safeParse(Object.fromEntries(searchParams.entries()));
  if (!success) {
    return Response.json(error.errors.map(e => e.message), { status: 400 });
  }
  if (!validateId(id)) {
    return Response.json({ error: "Invalid ID" }, { status: 400 });
  }
  try {
    const user = await fetchUserInfo(client, id, options.animate, options.width);
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }
    if (options.overrideBannerUrl) {
      user.bannerURL = URItoBase64(options.overrideBannerUrl);
    }
    const card = await makeCard(user, options);
    return new Response(card, {
      headers: { 'Content-Type': 'image/svg+xml' },
      status: 200,
    });
  } catch (error) {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
