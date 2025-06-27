import { Activity } from "discord.js";

interface CardOptions {
  width: number;
  animate: boolean;
  overrideBannerUrl?: string;
  aboutMe?: string;
  hideDecoration: boolean;
  hideSpotify: boolean;
  theme: "dark" | "light" | "custom" | "nitroDark" | "nitroLight";
  primaryColor: string;
  accentColor: string;
  customColors?: ColorTheme;
}

interface ColorTheme {
  colorB1: string;
  colorB2: string;
  colorB3: string;
  colorT1: string;
  colorT2: string;
}

interface ActivityDisplay {
  height: number;
  matches: (activity: Activity) => boolean;
  render: (activity: Activity, colors: ColorTheme, y: number, width: number) => Promise<string>;
}
