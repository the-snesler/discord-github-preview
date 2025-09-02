import readyClient from "../bot";
import { makeCard } from "../helpers/card";
import { CardOptions } from "../types";
import { validateId, fetchUserInfo } from "../helpers/discord";
import type { RequestHandler } from "express";
import { URItoBase64 } from "../helpers/utils";
import * as z from "zod/v4";

export const discordSelf: RequestHandler = async (req, res, next) => {
  const client = await readyClient;
  res.status(200).send(`Discord logged in as ${client.user.username}`);
}

export const discordDebug: RequestHandler = async (req, res, next) => {
  const client = await readyClient;
  const id = req.params.id || process.env.TEST_USER_ID || "214167454291722241";
  
  try {
    // Fetch the user first
    let user = await fetchUserInfo(client, id);
    if (!user) {
      res.status(404).send("User not found");
      return;
    }
    
    // Force add the About Me for testing
    const options = {
      animate: false,
      width: 500,
      aboutMe: "This is a test about me section",
      theme: "nitroDark",
      primaryColor: "#7289DA", // Discord blue
      accentColor: "#99AAB5", // Discord grey
      hideDecoration: false,
      hideSpotify: false,
    } as CardOptions;
    
    const card = await makeCard(user, options);
    res.set('Content-Type', 'image/svg+xml')
      .status(200)
      .send(card);
  } catch (error) {
    next(error);
  }
}

const isHex = (input: string) => !isNaN(parseInt(input, 16)) && input.length >= 3 && input.length <= 8
const hexMessage = { error: "Colors must be in hexadecimal format without a leading #" }

const ParamsSchema = z.object({
  width: z.coerce.number().default(500),
  animate: z.coerce.boolean().default(false),
  banner: z.url({
    protocol: /^https?$/,
    hostname: z.regexes.domain,
    error: "Banner URL must be a valid HTTP or HTTPS URL."
  }).optional(),
  aboutMe: z.string().optional(),
  hideDecoration: z.coerce.boolean().default(false),
  hideSpotify: z.coerce.boolean().default(false),
  theme: z.enum(["dark", "light", "custom", "nitroDark", "nitroLight"]).default("dark"),
  primaryColor: z.string().default("ecaff3").refine(isHex, hexMessage).transform((val) => "#" + val),
  accentColor: z.string().default("44a17a").refine(isHex, hexMessage).transform((val) => "#" + val),
  colorB1: z.string().default("111214").refine(isHex, hexMessage).transform((val) => "#" + val),
  colorB2: z.string().default("313338").refine(isHex, hexMessage).transform((val) => "#" + val),
  colorB3: z.string().default("505059").refine(isHex, hexMessage).transform((val) => "#" + val),
  colorT1: z.string().default("fff").refine(isHex, hexMessage).transform((val) => "#" + val),
  colorT2: z.string().default("d2d6d8").refine(isHex, hexMessage).transform((val) => "#" + val),
}).check((ctx) => {
  const data = ctx.value;
  if (data.theme === "nitroDark" || data.theme === "nitroLight") {
    if (!data.primaryColor || !data.accentColor) {
      ctx.issues.push({
        code: "custom",
        error: "Primary and accent colors must be provided for nitro themes.",
        input: ctx.value,
      });
    }
  }
  if (data.theme === "custom") {
    if (!data.colorB1 || !data.colorB2 || !data.colorB3 || !data.colorT1 || !data.colorT2) {
      ctx.issues.push({
        code: "custom",
        error: "Custom theme colors must be provided when theme is 'custom'.",
        input: ctx.value
      });
    }
  }
});

const errorSvg = (
  errorMessage: string
) => `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="200" viewBox="0 0 512 200">
    <rect width="512" height="200" rx="15" fill="#ff4444"/>
    <text x="20" y="30" font-family="Arial, sans-serif" font-size="16" fill="white" font-weight="bold">Error:</text>
    <text x="20" y="50" font-family="Arial, sans-serif" font-size="12" fill="white">${errorMessage}</text>
  </svg>`;

export const discordUser: RequestHandler = async (req, res, next) => {
  const client = await readyClient;
  const id = req.params.id;
  const { success, data: options, error } = ParamsSchema.safeParse(req.query);
  if (!success) {
    const errorMessage = error.issues
      .map((e) => `<tspan x="20" dy="1.2em">${e.message}</tspan>`)
      .join("");
    res.set("Content-Type", "image/svg+xml").status(400).send(errorSvg(errorMessage));
    return;
  }
  if (!validateId(id)) {
    res.status(400).send("Invalid ID");
    return;
  }
  try {
    const user = await fetchUserInfo(client, id, options.animate, options.width);
    if (!user) {
      res.status(404).send("User not found");
      return;
    }
    if (options.banner) {
      user.bannerURL = URItoBase64(options.banner);
    }
    const card = await makeCard(user, options);
    res.set("Content-Type", "image/svg+xml").status(200).send(card);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Error";
    res
      .set("Content-Type", "image/svg+xml")
      .status(400)
      .send(errorSvg(`<tspan x="20" dy="1.2em">${errorMessage}</tspan>`));
    next(error);
  }
};

export const discordUsername: RequestHandler = async (req, res, next) => {
  const client = await readyClient;
  const id = req.params.id;
  
  if (!validateId(id)) {
    res.status(400).send("Invalid ID");
    return;
  }
  
  try {
    const user = await fetchUserInfo(client, id, false, 0);
    if (!user) {
      res.status(404).send("User not found");
      return;
    }
    
    res.status(200).json({ username: user.username });
  } catch (error) {
    next(error);
  }
}
