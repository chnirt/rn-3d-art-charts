// https://thewidlarzgroup.com/rn-svg-charts-ts/
import React, { useState } from 'react';
import {
  Path,
  Stop,
  Defs,
  LinearGradient,
  Circle,
  Line,
  Rect,
} from 'react-native-svg';
import { AreaChart, BarChart, Grid, YAxis, XAxis } from 'react-native-svg-charts';
import * as shape from 'd3-shape';
import { ScrollView, View, StyleSheet } from 'react-native';
import { CustomGrid, Tooltip } from './components';

export const AreaChartExample = ({
  type = 'combine-chart',
  width = 350 * 2,
  height = 350,
}) => {
  const isAreaChart = type === 'area-chart';
  const isBarChart = type === 'bar-chart';
  const isCombineChart = type === 'combine-chart';
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [selectedType, setSelectedType] = useState(type);
  const data = [50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80];
  // const data = [50];
  const data2 = [
    -87, 66, -69, 92, -40, -61, 16, 62, 20, -93, -53, 37, -89, -44, 18,
  ];
  // const data2 = [-87];
  const max =
    Math.max(...[...data, ...data2].map(item => Math.abs(item))) * 1.1;
  const min = -max;

  const contentInset = {
    right: 20,
    top: 20,
    left: 20,
    bottom: 20,
  };
  const svg = { fontSize: 10, fill: 'grey' };
  const xAxisHeight = 20;

  const Decorator = ({ x, y, data }) => {
    return data.map((value, index) => {
      if (selectedIndex === null) return null;
      const isSelected =
        selectedIndex === index && selectedType === 'area-chart';
      return (
        <Circle
          key={index}
          cx={x(index)}
          cy={y(value)}
          r={6}
          stroke={isSelected ? '#FFF' : 'transparent'}
          strokeWidth={4}
          fill={isSelected ? '#008FEB' : 'transparent'}
          onPress={() => {
            setSelectedIndex(index);
            setSelectedType('area-chart');
          }}
        />
      );
    });
  };

  const CustomLine = ({ line, ...rest }) => (
    <Path
      key={'line'}
      d={line}
      stroke={'#008FEB'}
      strokeWidth={2}
      fill={'none'}
      onPress={(event) => {
        console.log("-------------")
        console.log("locationX", event.nativeEvent.locationX)
        console.log("locationY", event.nativeEvent.locationY)
        console.log("pageX", event.nativeEvent.pageX)
        console.log("pageY", event.nativeEvent.pageY)
        // console.log("rest", JSON.stringify(rest, null, 2))
      }}
    />
  );

  const Gradient = ({ index }) => (
    <Defs key={index}>
      <LinearGradient id={'gradient'} x1={'0%'} y1={'0%'} x2={'0%'} y2={'100%'}>
        <Stop offset={'0%'} stopColor={'#008FEB'} stopOpacity={0.3} />
        <Stop offset={'70%'} stopColor={'#008FEB'} stopOpacity={0} />
      </LinearGradient>
    </Defs>
  );

  const VerticalLine = ({ x }) => {
    if (selectedIndex === null) return null;
    return (
      <Line
        key={'vertical-line'}
        x1={x(selectedIndex)}
        x2={x(selectedIndex)}
        y1={'0%'}
        y2={'100%'}
        stroke={'#60608E'}
        strokeWidth={1}
      />
    );
  };

  const HorizontalLine = ({ y }) => {
    if (selectedIndex === null) return null;
    const value = data.find((_, index) => index === selectedIndex);
    return (
      <Line
        key={'center-horizontal-line'}
        x1={'0%'}
        x2={'100%'}
        y1={y(value)}
        y2={y(value)}
        stroke={'#D2D2E6'}
        strokeWidth={1}
        strokeDasharray={[3, 3]}
      />
    );
  };

  const CenterHorizontalLine = ({ y }) => (
    <Line
      key={'center-horizontal-line'}
      x1={'0%'}
      x2={'100%'}
      y1={y(0)}
      y2={y(0)}
      stroke={'#60608E'}
      strokeWidth={1}
    />
  );

  const HighHorizontalLine = ({ y }) => (
    <Line
      key={'center-horizontal-line'}
      x1={'0%'}
      x2={'100%'}
      y1={y(20)}
      y2={y(20)}
      stroke={'#008FEB'}
      strokeWidth={1}
      strokeDasharray={[3, 3]}
    />
  );

  const LowHorizontalLine = ({ y }) => (
    <Line
      key={'center-horizontal-line'}
      x1={'0%'}
      x2={'100%'}
      y1={y(-20)}
      y2={y(-20)}
      stroke={'#FF0000'}
      strokeWidth={1}
      strokeDasharray={[3, 3]}
    />
  );

  const Bar = ({ x, y, barData }) => {
    return barData.map((value, index) => {
      return (
        <Rect
          key={`bar-rect-${index}`}
          x={x(index)}
          y={y(value)}
          height={y(0) - y(value)}
          stroke={'#E34242'}
          strokeWidth={10}
          strokeLinejoin="round"
          onPress={() => {
            setSelectedIndex(index);
            setSelectedType('bar-chart');
          }}
        />
      );
    });
  };

  return (
    <View style={{ flexDirection: 'row' }}>
      <YAxis
        data={data}
        style={{
          // borderWidth: 1,
          marginBottom: xAxisHeight,
        }}
        contentInset={{ top: contentInset.top, bottom: contentInset.bottom }}
        svg={svg}
        min={min}
        max={max}
        numberOfTicks={10}
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          {(isAreaChart || isCombineChart) && (
            <AreaChart
              style={{ width, height }}
              data={data}
              contentInset={contentInset}
              curve={shape.curveNatural}
              svg={{
                fill: 'url(#gradient)',
              }}
              gridMin={min}
              gridMax={max}
              numberOfTicks={10}
            >
              <CustomGrid
                belowChart
                direction={Grid.Direction.BOTH}
                svg={{
                  stroke: '#ececf5',
                }}
                horizontalSvg={{
                  strokeDasharray: [3, 3],
                }}
              />
              <Gradient />
              <CenterHorizontalLine />
              {selectedType === 'area-chart' && <HorizontalLine />}
              {selectedType === 'area-chart' && <VerticalLine />}
              {!isAreaChart && <Bar belowChart barData={data2} />}
              <CustomLine />
              <HighHorizontalLine />
              <LowHorizontalLine />
              <Decorator />
              {selectedType === 'area-chart' && (
                <Tooltip selectedIndex={selectedIndex} width={width} />
              )}
              {selectedType === 'bar-chart' && (
                <Tooltip
                  selectedIndex={selectedIndex}
                  width={width}
                  barData={data2}
                />
              )}
            </AreaChart>
          )}
          {isBarChart && (
            <BarChart
              style={[
                StyleSheet.absoluteFill,
                {
                  paddingBottom: xAxisHeight,
                },
              ]}
              data={data2}
              contentInset={{
                top: contentInset.top,
                bottom: contentInset.bottom,
              }}
              gridMin={0}
              svg={{
                strokeWidth: 10,
                strokeLinejoin: 'round',
                // scaleY: 0.985,
                stroke: '#E34242',
              }}
              spacingInner={1}
              spacingOuter={0.425}></BarChart>
          )}
          <XAxis
            style={{
              height: xAxisHeight,
            }}
            data={data}
            formatLabel={(value, index) => index}
            contentInset={{ left: contentInset.left, right: contentInset.right }}
            svg={svg}
          />
        </View>
      </ScrollView>
    </View>
  );
};
