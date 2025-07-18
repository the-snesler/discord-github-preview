import React from "react";
import { ColorTheme } from "../types";
import { fontFamily } from "../helpers/fonts";
import { statusColors } from "../helpers/themes";
import { prettyDuration } from "../helpers/utils";
import { AnimatedText } from "./AnimatedDuration";

interface TimestampProps {
  x: number;
  y: number;
  colors: ColorTheme;
  timeStart?: number;
  timeEnd?: number;
  progressBar?: boolean;
}
export default function TimestampSVG({
  x,
  y,
  colors,
  timeStart,
  timeEnd,
  progressBar,
}: TimestampProps) {
  // 4 flavors: nothing (don't show), start only (icon + "hh:mm"), end only (icon + "hh:mm left"), both (icon + "hh:mm elapsed - hh:mm left")
  if (!timeStart && !timeEnd) return "";
  if (timeStart && timeEnd && progressBar)
    return (
      <RenderProgressBar timeStart={timeStart} timeEnd={timeEnd} x={x} y={y} colors={colors} />
    );
  return <RenderText timeStart={timeStart} timeEnd={timeEnd} x={x} y={y} />;
}

interface TextProps {
  timeStart?: number;
  timeEnd?: number;
  x: number;
  y: number;
}

const ControllerPath = ({ x, y }: { x: number; y: number }) => (
  <path
    transform={`translate(${x} ${y + 14}) scale(${25 / 32})`}
    fill={statusColors.online}
    fillRule="evenodd"
    d="M20.97 4.06c0 .18.08.35.24.43.55.28.9.82 1.04 1.42.3 1.24.75 3.7.75 7.09v4.91a3.09 3.09 0 0 1-5.85 1.38l-1.76-3.51a1.09 1.09 0 0 0-1.23-.55c-.57.13-1.36.27-2.16.27s-1.6-.14-2.16-.27c-.49-.11-1 .1-1.23.55l-1.76 3.51A3.09 3.09 0 0 1 1 17.91V13c0-3.38.46-5.85.75-7.1.15-.6.49-1.13 1.04-1.4a.47.47 0 0 0 .24-.44c0-.7.48-1.32 1.2-1.47l2.93-.62c.5-.1 1 .06 1.36.4.35.34.78.71 1.28.68a42.4 42.4 0 0 1 4.4 0c.5.03.93-.34 1.28-.69.35-.33.86-.5 1.36-.39l2.94.62c.7.15 1.19.78 1.19 1.47ZM20 7.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM15.5 12a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM5 7a1 1 0 0 1 2 0v1h1a1 1 0 0 1 0 2H7v1a1 1 0 1 1-2 0v-1H4a1 1 0 1 1 0-2h1V7Z"
    clipRule="evenodd"
    className=""
  ></path>
);

function RenderText({ timeStart, timeEnd, x, y }: TextProps) {
  const currentTime = Date.now();
  const durationValues: string[] = [];
  if (timeStart && timeEnd) {
    for (let i = 0; i < 30; i++) {
      const futureElapsed = currentTime - timeStart + i * 1000;
      const futureRemaining = timeEnd - currentTime - i * 1000;
      durationValues.push(
        `${prettyDuration(futureElapsed)} - ${prettyDuration(futureRemaining)} left`
      );
    }
  } else if (timeStart) {
    for (let i = 0; i < 30; i++) {
      const futureElapsed = currentTime - timeStart + i * 1000;
      durationValues.push(`${prettyDuration(futureElapsed)}`);
    }
  } else if (timeEnd) {
    for (let i = 0; i < 30; i++) {
      const futureRemaining = timeEnd - currentTime - i * 1000;
      durationValues.push(`${prettyDuration(futureRemaining)} left`);
    }
  } else {
    return "";
  }
  return (
    <g>
      <ControllerPath x={x} y={y} />
      <AnimatedText
        strings={durationValues}
        attrs={{
          style: {
            fill: statusColors.online,
            fontFamily: fontFamily,
            fontSize: "20px",
            fontWeight: 600,
          },
          x: x + 25,
          y: y + 30,
        }}
      />
    </g>
  );
}

interface ProgressBarProps {
  timeStart: number;
  timeEnd: number;
  x: number;
  y: number;
  colors: ColorTheme;
}

function RenderProgressBar({ timeStart, timeEnd, x, y, colors }: ProgressBarProps) {
  const totalActivityLength = prettyDuration(timeEnd - timeStart);
  const progress = Math.min((Date.now() - timeStart) / (timeEnd - timeStart), 1);
  const timeElapsed = timeStart ? prettyDuration(Date.now() - timeStart) : "";
  const barWidth = 700 - x - 140;

  return (
    <g>
      <text
        style={{
          fill: colors.colorT2,
          fontFamily: fontFamily,
          fontSize: "20px",
        }}
        x={x}
        y={y + 30}
      >
        {Date.now() > timeEnd ? totalActivityLength : timeElapsed}
      </text>
      <rect
        x={x + 50}
        y={y + 22}
        width={barWidth}
        height="6"
        rx="3"
        style={{ fill: colors.colorB3 }}
      />
      <rect
        x={x + 50}
        y={y + 22}
        width={barWidth * progress}
        height="6"
        rx="3"
        style={{ fill: colors.colorT1 }}
      />
      <text
        style={{
          fill: colors.colorT2,
          fontFamily: fontFamily,
          fontSize: "20px",
        }}
        x={x + barWidth + 60}
        y={y + 30}
      >
        {totalActivityLength}
      </text>
    </g>
  );
}
