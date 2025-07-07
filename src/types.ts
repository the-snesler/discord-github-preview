import { Activity } from "discord.js";
import React from "react";
import { UserProperties } from "./helpers/discord";

export interface ColorTheme {
  colorB1: string;
  colorB2: string;
  colorB3: string;
  colorT1: string;
  colorT2: string;
}

export interface CardOptions {
  width: number;
  animate: boolean;
  banner?: string;
  aboutMe?: string;
  hideDecoration: boolean;
  hideSpotify: boolean;
  theme: "dark" | "light" | "custom" | "nitroDark" | "nitroLight";
  primaryColor?: string;
  accentColor?: string;
  colorB1?: string;
  colorB2?: string;
  colorB3?: string;
  colorT1?: string;
  colorT2?: string;
}

export interface ActivityDisplay {
  height: number;
  matches: (activity: Activity) => boolean;
  render: (activity: Activity, colors: ColorTheme, y: number, width: number) => Promise<string>;
}

interface DisplayableComponentProps<T> {
  user: UserProperties;
  options: CardOptions;
  activity?: Activity;
  colors: ColorTheme;
  y: number;
  bannerHeight: number;
  serverProp: T;
}

export interface PrerenderProps {
  user: UserProperties;
  options: CardOptions;
  activity?: Activity;
}
export interface DisplayableComponent<T> {
  height?: number;
  // Determines whether the component should be displayed. For activity displayables, this is checked for each activity. For static components (bio), it's checked once.
  matches?: (props: PrerenderProps) => boolean;
  // Fetches properties needed for rendering the component (images usually). This is called once per match and the result is recieived in the render function.
  fetchServerProp?: (props: PrerenderProps) => Promise<T>;
  render: React.FC<DisplayableComponentProps<T>>;
}

export type BakedDisplayableComponent<T> = DisplayableComponent<T> & { props: DisplayableComponentProps<T> };
