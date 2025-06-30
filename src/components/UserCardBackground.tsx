import React from "react";
import { ColorTheme } from "../types";
import { bannerHeight } from "../helpers/card";
import { UserProperties } from "../helpers/discord";

interface Props {
  colors: ColorTheme;
  nitro: boolean;
  totalHeight: number;
  banner: string | null;
  user: UserProperties;
}
export default function cardBackground({
  colors,
  nitro,
  totalHeight,
  banner,
  user,
}: Props) {
  const bgColor = colors.colorB1;
  if (nitro) {
    return (
      <g>
        <rect
          x="0"
          y="0"
          width="700"
          height={totalHeight}
          rx="35px"
          style={{ fill: "url(#nitroGradient);" }}
        />
        <g clip-path="url(#innerBackground)">
          <mask id="not-banner">
            <circle cx="100" cy={bannerHeight} r="93" fill="white" />
          </mask>
          <rect
            x="5"
            y={bannerHeight}
            width="690"
            height={totalHeight - bannerHeight - 5}
            style={{ fill: "url(#nitroOverlay);" }}
          />
          <rect
            x="5"
            y="5"
            width="690"
            height={bannerHeight - 5}
            style={{ fill: "url(#nitroOverlay);", mask: "url(#not-banner);" }}
          />
          <g>
            <mask id="banner">
              <rect
                x="0"
                y="0"
                width="700"
                height={bannerHeight}
                fill="white"
              />
              <circle cx="100" cy={bannerHeight} r="93" fill="black" />
            </mask>
            <g mask="url(#banner)">
              {banner && (
                <image
                  x="5"
                  y="5"
                  xlinkHref={banner}
                  height={bannerHeight - 5}
                  width={690}
                  preserveAspectRatio="xMidYMid slice"
                />
              )}
            </g>
          </g>
        </g>
      </g>
    );
  } else {
    return (
      <g>
        <rect
          x="0"
          y="0"
          width="700"
          height={totalHeight}
          rx="35px"
          style={{ fill: bgColor }}
        />
        <g clip-path="url(#background)">
          <g>
            <mask id="banner">
              <rect
                x="0"
                y="0"
                width="700"
                height={bannerHeight}
                fill="white"
              />
              <circle cx="100" cy={bannerHeight} r="93" fill="black" />
            </mask>
            <g mask="url(#banner)">
              <rect
                x="0"
                y="0"
                width="700"
                height={bannerHeight}
                style={{
                  fill: banner ? colors.colorB2 : user.accentColor || bgColor,
                }}
              />
              {banner && (
                <image
                  xlinkHref={banner}
                  height={bannerHeight}
                  width={700}
                  preserveAspectRatio="xMidYMid slice"
                />
              )}
            </g>
          </g>
        </g>
      </g>
    );
  }
}
