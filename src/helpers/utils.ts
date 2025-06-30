import fs from "fs/promises";

const mimeTypeMap: { [key: string]: string } = {
  png: "image/png",
  jpg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
};

/**
 * Converts a URI to a Base64 string.
 * If the URI is a local file, it will be read using `fs.readFile`, otherwise it will be fetched.
 * @param uri The URI to convert.
 */
export async function URItoBase64(uri: string) {
  if (!uri) {return null}
  const ext = uri.split('.').pop();
  if (uri.startsWith('./')) {
    const buffer = await fs.readFile(uri);
    const dataType = mimeTypeMap[ext as string] || "application/octet-stream";
    return `data:${dataType};base64,${buffer.toString('base64')}`;
  }
  const res = await fetch(uri);
  const buffer = await res.arrayBuffer();
  const contentType = res.headers.get("content-type");
  return `data:${contentType};base64,${Buffer.from(buffer).toString("base64")}`;
}

export function prettyDuration(duration: number) {
  const seconds = Math.floor(duration / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const set = [days, hours % 24, minutes % 60, seconds % 60]
  const string = [];
  for (let i = 0; i < set.length; i++) {
    const unit = set[i];
    if (!unit && !string.length && i < 2) continue;
    if (string.length) {
      string.push(unit.toString().padStart(2, "0"));
    } else {
      string.push(unit.toString());
    }
  }
  return string.join(":");
}

export const truncate = (text: string, maxLen: number) => (text.length <= maxLen) ? text : text.substring(0, maxLen) + "...";

export const formatDuration = (time: number) => {
  const minutes = Math.floor(time / 60000);
  const seconds = Math.floor((time % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

// Converts a hex color string to an RGB array (e.g., "#FF5733" to [255, 87, 51], #FF5733AA to [255, 87, 51])
const hexToRgb = (hex: string) => {
  const bigint = parseInt(hex.slice(1, 8), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b];
};

const rgbToHex = (r: number, g: number, b: number, a?: number) => {
  const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  return a !== undefined && a !== 1 ? `${hex}${Math.round(a * 255).toString(16).padStart(2, '0')}` : hex;
};

/**
 * Mixes two hex colors together based on a strength value. Supports transparency in said hex colors
 * @param color1 - The first color in hex format (e.g., "#FF5733")
 * @param color2 - The second color in hex format (e.g., "#33FF57AA")
 * @param strength - A value between 0 and 1 representing the mix strength
 * @returns - The mixed color in hex format. If either color had an alpha channel, the result will also have an alpha channel.
 */
export const mixColors = (color1: string, color2: string, strength: number): string => {
  const [r1, g1, b1] = hexToRgb(color1);
  const [r2, g2, b2] = hexToRgb(color2);

  const mixedR = Math.round(r1 * strength + r2 * (1 - strength));
  const mixedG = Math.round(g1 * strength + g2 * (1 - strength));
  const mixedB = Math.round(b1 * strength + b2 * (1 - strength));

  // Check for alpha channel in color1 and color2, default to 1
  const alpha1 = parseInt(color1.slice(7, 9), 16) / 255 || 1;
  const alpha2 = parseInt(color2.slice(7, 9), 16) / 255 || 1;
  const alpha = Math.round((alpha1 * strength + alpha2 * (1 - strength)) * 100) / 100; // Round to 2 decimal places

  return rgbToHex(mixedR, mixedG, mixedB, alpha);
}

export const setOpacity = (color: string, opacity: number): string => {
  const [r, g, b] = hexToRgb(color);
  return rgbToHex(r, g, b, opacity);
}


/**
 * Takes in an object of resources where each value is a Promise or null, and returns a Promise that resolves to an object with the same keys, where each value is the resolved value of the corresponding Promise.
 */
export const bundlePromises = async <T extends Record<string, Promise<any> | null>>(resources: T): Promise<{
  [K in keyof T]: T[K] extends Promise<infer U> | null ? U : null
}> => {
  // Filter out null values and keep track of which keys had actual promises
  const entries = Object.entries(resources);
  const validEntries = entries.map(([key, val]) => val === null ? [key, Promise.resolve(null)] : [key, val]);

  const results = await Promise.all(validEntries.map(([_, promise]) => promise));

  return Object.keys(resources).reduce((acc, key, index) => {
    const resource = resources[key];
    if (resource === null) {
      acc[key as keyof T] = null as any;
    } else {
      const resultIndex = validEntries.findIndex(([k]) => k === key);
      acc[key as keyof T] = results[resultIndex] as any;
    }
    return acc;
  }, {} as any);
}
