import { ColorTheme } from "../../types";
import { bannerHeight } from "../card";
import { UserProperties } from "../discord";

export function cardBackground(colors: ColorTheme, nitro: boolean, totalHeight: number, banner: string | null, user: UserProperties) {
  const bgColor = colors.background;
  if (nitro) {
    return `<g>
<rect x="0" y="0" width="700" height="${totalHeight}" rx="35px" style="fill:url(#nitroGradient);"/>
<g clip-path="url(#innerBackground)">
  <mask id="not-banner">
    <circle cx="100" cy="${bannerHeight}" r="93" fill="white"/>
  </mask>
  <rect x="5" y="${bannerHeight}" width="690" height="${totalHeight - bannerHeight - 5}" style="fill:url(#nitroOverlay);" />
  <rect x="5" y="5" width="690" height="${bannerHeight - 5}" style="fill:url(#nitroOverlay); mask:url(#not-banner);" />
  <g>
    <mask id="banner">
      <rect x="0" y="0" width="700" height="${bannerHeight}" fill="white"/>
      <circle cx="100" cy="${bannerHeight}" r="93" fill="black"/>
    </mask>
    <g mask="url(#banner)">
      ${banner ? `<image x="5" y="5" xlink:href="${banner}" height="${bannerHeight - 5}" width="690" preserveAspectRatio="xMidYMid slice" />` : ''}
    </g>
  </g>
</g>
</g>
`;
  } else {
    return `<g>
<rect x="0" y="0" width="700" height="${totalHeight}" rx="35px" style="fill:${bgColor};"/>
<g clip-path="url(#background)">
  <g>
    <mask id="banner">
      <rect x="0" y="0" width="700" height="${bannerHeight}" fill="white"/>
      <circle cx="100" cy="${bannerHeight}" r="93" fill="black"/>
    </mask>
    <g mask="url(#banner)">
      <rect x="0" y="0" width="700" height="${bannerHeight}" style="fill:${banner ? colors.secondaryBackground : user.accentColor || bgColor};"/>
      ${banner ? `<image xlink:href="${banner}" height="${bannerHeight}" width="700" preserveAspectRatio="xMidYMid slice" />` : ''}
    </g>
  </g>
</g>
</g>
`;
  }
}
