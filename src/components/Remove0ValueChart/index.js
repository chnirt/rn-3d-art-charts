import React from 'react';
import { ClipPath, Defs, Rect } from 'react-native-svg';
import { LineChart, Path, AreaChart } from 'react-native-svg-charts';
import * as d3Shape from 'd3-shape';

export const Remove0ValueChart = () => {
  const data = [
    50, 0, 0, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 0, 0, 24, 50, -20, -80,
  ];

  // const data = [10, 20, 0, 0, 0, 50, 0, 0, 0, 100];

  function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  const Clips = ({ x }) => {
    return (
      <Defs key={'clips'}>
        {data.length > 0 &&
          data.map((_, ii) => {
            return (
              <ClipPath id={`clip-path-${ii}`} key={ii}>
                <Rect x={x(ii)} y={'0'} width={x(ii + 1)} height={'100%'} />
              </ClipPath>
            );
          })}
      </Defs>
    );
  };

  // Line extras:
  const DashedLine = ({ index, line }) => {
    const currentValue = data[index];
    const nextValue = data[index + 1];
    const equalZero = currentValue === 0 && nextValue === 0;
    return (
      <Path
        key={`line-${index}`}
        d={line}
        stroke={equalZero ? 'white' : getRandomColor()}
        strokeWidth={4}
        fill={'none'}
        // strokeDasharray={equalZero ? [] : [4, 4]}
        clipPath={`url(#clip-path-${index})`}
      />
    );
  };

  const Line = ({ line }) => (
    <Path key={'line '} d={line} stroke={'rgb(134, 65, 244)'} fill={'none'} />
  );

  return (
    <AreaChart
      style={{ height: 300, width: 300 }}
      data={data}
      svg={{ fill: 'rgba(134, 65, 244, 0.2)' }}
      curve={d3Shape.curveMonotoneX}
      gridMax={500}
      gridMin={-500}>
      <Clips />
      {data.length > 0 &&
        data.map((_, ii) => {
          return <DashedLine key={`dashed-line-${ii}`} index={ii} />;
        })}
    </AreaChart>
  );

  return (
    <LineChart
      style={{ height: 300, width: 300 }}
      data={data}
      contentInset={{ top: 20, bottom: 20 }}
      svg={
        {
          // stroke: 'rgb(134, 65, 244)',
          // strokeWidth: 4,
          // clipPath: 'url(#clip-path-1)',
        }
      }>
      <Clips />
      {data.length > 0 &&
        data.map((_, ii) => {
          return <DashedLine key={`dashed-line-${ii}`} index={ii} />;
        })}
    </LineChart>
  );
};
