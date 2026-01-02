import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { UserProperties } from "./discord";
import { setOpacity } from "./utils";
import { darkColors, lightColors } from "./themes";
import { BakedDisplayableComponent, CardOptions, DisplayableComponent, PrerenderProps } from "../types";
import { SVGCard } from "../components/UserCard";
import { spotifyActivity } from "../displayables/SpotifyActivity";
import { customStatus } from "../displayables/CustomStatus";
import { richPresence } from "../displayables/RichPresence";
import { genericActivity } from "../displayables/GenericActivity";
import { name } from "../displayables/Name";
import { aboutMeHeight } from "../components/AboutMe";

export const bannerHeight = 180;
const userHeaderHeight = 180;

export function sanitizeString(str: string) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export const isNitroProfile = (theme: CardOptions["theme"]) => {
  return theme === "nitroDark" || theme === "nitroLight";
}

const singleMatchers = [name];
const activityMatchers = [customStatus, spotifyActivity, richPresence, genericActivity];

export const makeCard = async (user: UserProperties, options: CardOptions) => {
  const activities = user.presence?.activities || [];
  if (process.env.NODE_ENV === "development") {
    console.log("User", user);
    console.log("Activities", activities);
  }

  if (options.hideDecoration) {
    user.avatarDecorationURL = null;
  }
  // Handle theme color settings
  let colors = { ...darkColors };
  if (options.theme === "light" || options.theme === "nitroLight") {
    colors = { ...lightColors };
  } else if (options.theme === "custom") {
    colors = {
      colorB1: options.colorB1,
      colorB2: options.colorB2,
      colorB3: options.colorB3,
      colorT1: options.colorT1,
      colorT2: options.colorT2,
    }
  }
  const useNitroTheme = isNitroProfile(options.theme);
  if (useNitroTheme) {
    colors.colorB2 = setOpacity(colors.colorB1, 0.7);
  }
  let currentHeight = bannerHeight + userHeaderHeight;

  // Filter out Spotify activities if hideSpotify is true
  const filteredActivities = options.hideSpotify
    ? activities.filter(activity => activity.name !== "Spotify")
    : activities;

  // Start working through our displayables
  const displayables: BakedDisplayableComponent<any>[] = [];
  const displayablePromises = [];
  let prerenderProps: PrerenderProps = { user, options }
  for (let i = 0; i < singleMatchers.length; i++) {
    const displayable = singleMatchers[i] as BakedDisplayableComponent<any>;
    if (displayable.matches ? !displayable.matches(prerenderProps) : false) continue;
    const serverProp = displayable.fetchServerProp ? displayable.fetchServerProp(prerenderProps) : null;
    displayable.props = { user, options, colors, bannerHeight, serverProp: null, y: 0 }
    displayables.push(displayable);
    displayablePromises.push(serverProp);
  }
  for (let i = 0; i < filteredActivities.length; i++) {
    const activity = filteredActivities[i];
    prerenderProps.activity = activity;
    const matcher = activityMatchers.find(displayable => displayable.matches ? displayable.matches(prerenderProps) : true);
    const displayable = { ...matcher } as BakedDisplayableComponent<any>;
    const serverProp = displayable.fetchServerProp ? displayable.fetchServerProp(prerenderProps) : null;
    displayable.props = { user, options, colors, bannerHeight, serverProp: null, activity, y: currentHeight }
    currentHeight += displayable.height ? displayable.height + 10 : 0;
    displayables.push(displayable);
    displayablePromises.push(serverProp);
  }
  // about me
  let aboutMeY = currentHeight;
  if (options.aboutMe) {
    const estimatedHeight = aboutMeHeight(sanitizeString(options.aboutMe));
    currentHeight += estimatedHeight + 10;
  }
  const totalHeight = currentHeight + 10; // padding at the bottom
  // Await all the various promises
  const [avatar, banner, decoration, serverProps] = await Promise.all([
    user.avatarURL,
    user.bannerURL,
    user.avatarDecorationURL,
    Promise.all(displayablePromises)
  ]);

  for (let i = 0; i < displayables.length; i++) {
    displayables[i].props.serverProp = serverProps[i]
  }

  const svgComponent = React.createElement(SVGCard, {
    user,
    options,
    colors,
    totalHeight,
    aboutMeY,
    avatar,
    banner,
    decoration,
    displayables,
  });

  const svgMarkup = renderToStaticMarkup(svgComponent);

  return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
  <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
  ${svgMarkup}`.replace(/\n\s+/g, "");
}
