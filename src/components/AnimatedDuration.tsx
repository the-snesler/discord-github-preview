import React from 'react';
import { ColorTheme } from "../types";
import { fontFamily } from "../helpers/fonts";

interface AnimatedDurationProps {
  strings: string[];
  x: number;
  y: number;
  colors: ColorTheme;
}

export default function AnimatedDuration({ strings, x, y, colors }: AnimatedDurationProps) {
  return (
    <>
      {strings.map((str, index) => {
        const animations = [];
        
        if (index === 0) {
          animations.push(
            <set key="hide" attributeName="opacity" to="0" begin="1s" fill="freeze" />
          );
        } else {
          animations.push(
            <set key="show" attributeName="opacity" to="1" begin={`${index}s`} fill="freeze" />
          );
          if (index < strings.length - 1) {
            animations.push(
              <set key="hide" attributeName="opacity" to="0" begin={`${index + 1}s`} fill="freeze" />
            );
          }
        }

        return (
          <text
            key={index}
            x={x}
            y={y}
            fontFamily={fontFamily}
            fontSize="14"
            fill={colors.colorT2}
            opacity={index === 0 ? 1 : 0}
          >
            {str}
            {animations}
          </text>
        );
      })}
    </>
  );
}

interface AnimatedTextProps {
  strings: string[];
  attrs: React.SVGProps<SVGTextElement>;
}

export function AnimatedText({ strings, attrs }: AnimatedTextProps) {
  return (
    <>
      {strings.map((str, index) => {
        const animations = [];
        
        if (index === 0) {
          animations.push(
            <set key="hide" attributeName="opacity" to="0" begin="1s" fill="freeze" />
          );
        } else {
          animations.push(
            <set key="show" attributeName="opacity" to="1" begin={`${index}s`} fill="freeze" />
          );
          if (index < strings.length - 1) {
            animations.push(
              <set key="hide" attributeName="opacity" to="0" begin={`${index + 1}s`} fill="freeze" />
            );
          }
        }

        return (
          <text key={index} {...attrs} opacity={index === 0 ? 1 : 0}>
            {str}
            {animations}
          </text>
        );
      })}
    </>
  );
}
