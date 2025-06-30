import React from "react";
import { UserProperties } from "../helpers/discord";
import { CardOptions, ColorTheme } from "../types";
import { mixColors } from "../helpers/utils";
import { GG_SANS_FONT_FACE } from "../helpers/fonts";
import { statusColors } from "../helpers/themes";
import AboutMe from "./AboutMe";
import { options } from "apicache";
import { bannerHeight, isNitroProfile } from "../helpers/card";
import UserCardBackground from "./UserCardBackground";

interface SVGCardProps {
  user: UserProperties;
  options: CardOptions;
  colors: ColorTheme;
  totalHeight: number;
  aboutMeY: number;
  resources: {
    avatar: string | null;
    banner: string | null;
    decoration: string | null;
    awaitedActivities: string[];
    name: string;
  };
}

export const SVGCard: React.FC<SVGCardProps> = ({
  user,
  options,
  colors,
  totalHeight,
  aboutMeY,
  resources,
}) => {
  const statusString = (
    user.presence?.status && statusColors.hasOwnProperty(user.presence.status)
      ? user.presence.status
      : "online"
  ) as keyof typeof statusColors;
  const useNitroTheme = isNitroProfile(options.theme);

  return (
    <svg
      width={`${options.width}px`}
      height="100%"
      viewBox={`0 0 700 ${totalHeight}`}
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      xmlSpace="preserve"
      style={{
        fillRule: "evenodd",
        clipRule: "evenodd",
        strokeLinejoin: "round",
        strokeMiterlimit: 2,
      }}
    >
      <defs>
        <style>{GG_SANS_FONT_FACE}</style>
        <clipPath id="background">
          <rect x="0" y="0" width="700" height={totalHeight} rx="35px" />
        </clipPath>
        {useNitroTheme && (
          <>
            <clipPath id="innerBackground">
              <rect
                x="5"
                y="5"
                width="690"
                height={totalHeight - 10}
                rx="30px"
              />
            </clipPath>
            <linearGradient id="nitroGradient" x1="0" y1="0" x2="0" y2="100%">
              <stop offset="0%" style={{ stopColor: options.primaryColor }} />
              <stop offset="100%" style={{ stopColor: options.accentColor }} />
            </linearGradient>
            <linearGradient id="nitroOverlay" x1="0" y1="0" x2="0" y2="100%">
              <stop
                offset="0%"
                style={{
                  stopColor: mixColors(
                    options.primaryColor!,
                    colors.colorB1,
                    0.35
                  ),
                }}
              />
              <stop
                offset="100%"
                style={{
                  stopColor: mixColors(
                    options.accentColor!,
                    colors.colorB1,
                    0.35
                  ),
                }}
              />
            </linearGradient>
          </>
        )}
      </defs>

      <UserCardBackground
        colors={colors}
        nitro={useNitroTheme}
        totalHeight={totalHeight}
        banner={resources.banner}
        user={user}
      />

      {/* Avatar */}
      <g>
        <clipPath id="avatar">
          <circle cx="100" cy={bannerHeight} r="83" />
        </clipPath>
        <g clipPath="url(#avatar)">
          {resources.avatar && (
            <image
              xlinkHref={resources.avatar}
              x="17"
              y={bannerHeight - 83}
              height="166"
              width="166"
            />
          )}
        </g>
      </g>

      {/* Avatar Decoration */}
      {resources.decoration && (
        <g>
          <image
            xlinkHref={resources.decoration}
            x="0"
            y={bannerHeight - 100}
            height="200"
            width="200"
          />
        </g>
      )}

      {/* Status masks */}
      <g>
        <mask
          id="status-online"
          maskContentUnits="objectBoundingBox"
          viewBox="0 0 1 1"
        >
          <circle fill="white" cx="0.5" cy="0.5" r="0.5"></circle>
        </mask>
        <mask
          id="status-idle"
          maskContentUnits="objectBoundingBox"
          viewBox="0 0 1 1"
        >
          <circle fill="white" cx="0.5" cy="0.5" r="0.5"></circle>
          <circle fill="black" cx="0.25" cy="0.25" r="0.375"></circle>
        </mask>
        <mask
          id="status-dnd"
          maskContentUnits="objectBoundingBox"
          viewBox="0 0 1 1"
        >
          <circle fill="white" cx="0.5" cy="0.5" r="0.5"></circle>
          <rect
            fill="black"
            x="0.125"
            y="0.375"
            width="0.75"
            height="0.25"
            rx="0.125"
            ry="0.125"
          ></rect>
        </mask>
        <mask
          id="status-offline"
          maskContentUnits="objectBoundingBox"
          viewBox="0 0 1 1"
        >
          <circle fill="white" cx="0.5" cy="0.5" r="0.5"></circle>
          <circle fill="black" cx="0.5" cy="0.5" r="0.25"></circle>
        </mask>
      </g>

      {/* Status indicator */}
      <g>
        <circle
          cx="160"
          cy={bannerHeight + 60}
          r="30"
          style={{
            fill: mixColors(
              colors.colorB1,
              options.primaryColor || colors.colorB1,
              0.85
            ),
          }}
        />
        <rect
          x="140"
          y={bannerHeight + 40}
          width="40"
          height="40"
          style={{
            fill: statusColors[statusString],
            mask: `url('#status-${statusString}')`,
          }}
        />
      </g>

      {/* Display Name, Badges and Server Tag */}
      <g dangerouslySetInnerHTML={{ __html: resources.name }} />

      {/* Discord Icon */}
      <path
        fill="#fff"
        transform="translate(645 15) scale(0.3)"
        d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"
      />

      {/* Activities */}
      {resources.awaitedActivities.map((activity, index) => (
        <g key={index} dangerouslySetInnerHTML={{ __html: activity }} />
      ))}
      {options.aboutMe && (
        <AboutMe content={options.aboutMe} colors={colors} startY={aboutMeY} />
      )}
    </svg>
  );
};
