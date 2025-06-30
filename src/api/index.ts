import readyClient from "../bot";
import { makeCard } from "../helpers/card";
import { CardOptions } from "../types";
import { validateId, fetchUserInfo } from "../helpers/discord";
import type { RequestHandler } from "express";
import { URItoBase64 } from "../helpers/utils";
import z from "zod";

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
    const options: CardOptions = {
      animate: false,
      width: 500,
      aboutMe: "This is a test about me section",
      theme: "nitroDark",
      primaryColor: "#7289DA", // Discord blue
      accentColor: "#99AAB5", // Discord grey
      hideDecoration: false,
      hideSpotify: false,
    }
    
    const card = await makeCard(user, options);
    res.set('Content-Type', 'image/svg+xml')
      .status(200)
      .send(card);
  } catch (error) {
    next(error);
  }
}


const ParamsSchema = z.object({
  width: z.coerce.number().default(500),
  animate: z.coerce.boolean().default(false),
  overrideBannerUrl: z.string().optional().refine((val) => {
    if (!val) return true;
    if (!val.startsWith("http")) return false;
  }, {
    // Banner override must be a valid URL, and also shouldn't point to a local file
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

export const discordUser: RequestHandler = async (req, res, next) => {
  const client = await readyClient;
  const id = req.params.id;
  const { success, data: options, error } = ParamsSchema.safeParse(req.query);
  if (!success) {
    res.status(400).send(error.errors.map(e => e.message).join(", "));
    return;
  }
  if (options.overrideBannerUrl && !options.overrideBannerUrl.startsWith("http")) {
    res.status(400).send("Invalid banner URL");
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
    if (options.overrideBannerUrl) {
      user.bannerURL = URItoBase64(options.overrideBannerUrl);
    }
    const card = await makeCard(user, options);
    res.set('Content-Type', 'image/svg+xml')
      .status(200)
      .send(card);
  } catch (error) {
    next(error);
  }
}

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
