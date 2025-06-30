import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { UserProperties } from "./discord";
import { setOpacity } from "./utils";
import { darkColors, lightColors } from "./themes";
import { ActivityDisplay, CardOptions } from "../types";
import { spotifyActivity } from "./displayables/spotifyActivity";
import { customStatus } from "./displayables/customStatus";
import { richPresence } from "./displayables/richPresence";
import { genericActivity } from "./displayables/genericActivity";
import { aboutMeHeight } from "../components/AboutMe";
import { nameSVG } from "../components/Name";
import { SVGCard } from "../components/UserCard";

export const bannerHeight = 180;
const userHeaderHeight = 180;

export function sanitizeString(str: string) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export const isNitroProfile = (theme: CardOptions["theme"]) => {
  return theme === "nitroDark" || theme === "nitroLight";
}

const displayables = [customStatus, spotifyActivity, richPresence, genericActivity];

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
      ...darkColors,
      ...options.customColors,
    }
  }
  const useNitroTheme = isNitroProfile(options.theme);
  if (useNitroTheme) {
    colors.colorB2 = setOpacity(colors.colorB1, 0.7);
  }
  // Generate promises all at once so they can be awaited in parallel (activities use promises to load their images)
  const activityPromises: Promise<string>[] = []
  let currentHeight = bannerHeight + userHeaderHeight;

  // Filter out Spotify activities if hideSpotify is true
  const filteredActivities = options.hideSpotify
    ? activities.filter(activity => activity.name !== "Spotify")
    : activities;

  for (let i = 0; i < filteredActivities.length; i++) {
    const activity = filteredActivities[i];
    const display = displayables.find(displayable => displayable.matches(activity)) as ActivityDisplay;
    activityPromises.push(display.render(activity, colors, currentHeight, options.width));
    currentHeight += display.height + 10;
  }
  // about me
  let aboutMeY = currentHeight;
  if (options.aboutMe) {
    const estimatedHeight = aboutMeHeight(sanitizeString(options.aboutMe));
    currentHeight += estimatedHeight + 10;
  }
  const totalHeight = currentHeight + 10; // padding at the bottom
  // Await all at once for images to load
  const [avatar, banner, decoration, awaitedActivities, name] = await Promise.all([
    user.avatarURL,
    user.bannerURL,
    user.avatarDecorationURL,
    Promise.all(activityPromises),
    nameSVG(user, colors, bannerHeight)
  ]);

  const svgComponent = React.createElement(SVGCard, {
    user,
    options,
    colors,
    totalHeight,
    aboutMeY,
    resources: {
      avatar,
      banner,
      decoration,
      awaitedActivities,
      name
    }
  });

  const svgMarkup = renderToStaticMarkup(svgComponent);

  return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
  <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
  ${svgMarkup}`.replace(/\n\s+/g, "");
}
