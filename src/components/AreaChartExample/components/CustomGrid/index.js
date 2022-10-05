import React from 'react';
import { Platform } from 'react-native';
import { G, Line } from 'react-native-svg';
import { Grid } from 'react-native-svg-charts';

export const CustomGrid = ({ x, y, ticks, data, direction, svg, horizontalSvg, verticalSvg }) => {
  const stroke = '#ececf5';
  const strokeWidth = 1;
  const strokeDasharray = [];
  const isIOS = Platform.OS === 'ios';
  const isHorizontal = direction === Grid.Direction.HORIZONTAL;
  const isVertical = direction === Grid.Direction.VERTICAL;
  const isBoth = direction === Grid.Direction.BOTH;
  return (
    <G>
      {
        // Horizontal grid
        (isHorizontal || isBoth) &&
        ticks.map((tick, ti) => (
          <Line
            key={`horizontal-line-${ti}`}
            x1={'0%'}
            x2={'100%'}
            y1={y(tick)}
            y2={y(tick)}
            // stroke={stroke}
            // strokeWidth={strokeWidth}
            // strokeDasharray={isIOS ? strokeDasharray : null}
            {...svg}
            {...horizontalSvg}
            onPress={() => {
              // console.log(`horizontal-column-${ti}`);
            }}
          />
        ))
      }
      {
        // Vertical grid
        (isVertical || isBoth) &&
        data.map((_, ii) => {
          return (
            <Line
              key={`grid-vertical-line-${ii}`}
              x1={x(ii)}
              x2={x(ii)}
              y1={'0%'}
              y2={'100%'}
              stroke={stroke}
              strokeWidth={strokeWidth}
              strokeDasharray={isIOS ? strokeDasharray : null}
              {...svg}
              {...verticalSvg}
              onPress={() => {
                // console.log(`vertical-column-${ii}`);
              }}
            />
          );
        })
      }
    </G>
  );
};
