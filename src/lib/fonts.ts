import { readFileSync } from 'fs';
import { join } from 'path';

const fontsDir = join(process.cwd(), 'src', 'fonts');

const ggSansBase64 = readFileSync(join(fontsDir, 'ggsans.woff2')).toString('base64');
const ggSansBoldBase64 = readFileSync(join(fontsDir, 'ggsansbold.woff2')).toString('base64');
export const GG_SANS_FONT_FACE = `
@font-face {
  font-family: 'GG Sans';
  font-style: normal;
  font-weight: 400;
  src: url('data:font/woff2;charset=utf-8;base64,${ggSansBase64}') format('woff2');
}
@font-face {
  font-family: 'GG Sans';
  font-style: normal;
  font-weight: 700;
  src: url('data:font/woff2;charset=utf-8;base64,${ggSansBoldBase64}') format('woff2');
}
`;
export const FONT_FAMILY = "GG Sans,sans-serif";
