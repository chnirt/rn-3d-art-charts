import React from 'react';
import { G, Line } from 'react-native-svg';
import { Grid } from 'react-native-svg-charts';

export const CustomGrid = ({
  x,
  y,
  data,
  ticks,
  direction,
  stroke = '#ececf5',
  strokeWidth = 1,
  strokeDasharray = [],
}) => {
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
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            onPress={() => {
              // console.log(`horizontal-column-${ti}`);
            }}
          />
        ))
      }
      {
        // Vertical grid
        (isVertical || isBoth) &&
        data.map((item, ii) => (
          <Line
            key={`vertical-line-${ii}`}
            x1={x(item.date)}
            x2={x(item.date)}
            y1={'0%'}
            y2={'100%'}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            onPress={() => {
              // console.log(`vertical-column-${ii}`);
            }}
          />
        ))
      }
    </G>
  );
};
