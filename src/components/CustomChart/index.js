import React, { useCallback, useState } from 'react';
import { ScrollView, View } from 'react-native';
import {
  Circle,
  Defs,
  G,
  Line,
  LinearGradient,
  Path,
  Stop,
  ForeignObject,
  Text as SvgText,
} from 'react-native-svg';
import { AreaChart, BarChart, YAxis, Grid } from 'react-native-svg-charts';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import moment from 'moment';

import { CustomXAxis, CustomGrid, TooltipItem } from './components';

function currencyFormat(num) {
  return '$' + num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

export const CustomChart = ({
  type = 'area-chart',
  width = 600,
  height = 300,
  data = [],
  activeColor = '#fd8354',
  color = '#ececf5',
  min = 0,
  max = 140000,
  numberOfTicks = 8,
  contentInset = { top: 20, bottom: 20, left: 20, right: 20 },
  dateHeight = 20,
  defaultIndexes = [],
}) => {
  const [selectedIndexes, setSelectedIndexes] = useState(defaultIndexes);

  const handlePress = useCallback(index => {
    setSelectedIndexes(prevState => {
      if (prevState.includes(index)) {
        return prevState.filter(pv => pv !== index);
      }
      return [...prevState, index];
    });
  }, []);

  const CustomLine = ({ line, strokeDasharray = [] }) => (
    <Path
      key={'line'}
      d={line}
      stroke={color}
      fill={'none'}
      strokeDasharray={strokeDasharray}
      onPress={(a) => {
        console.log("asd---", a)
      }}
    />
  );

  const Decorator = ({ x, y, data, size = 10 }) => {
    return data.map((item, vi) => {
      return (
        <G
          key={`decorator-group-${vi}`}
          x={x(item.date)}
          y={y(item.value)}
          onPress={() => handlePress(vi)}>
          <Circle r={size / 2} />
          <ForeignObject
            key={`foreign-object-${vi}`}
            x={-size / 2}
            y={-size / 2}>
            <View
              style={{
                width: size,
                height: size,
                borderRadius: size / 2,
                backgroundColor: color,
                borderWidth: size / 4,
                borderColor: '#fff',

                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.2,
                shadowRadius: 1.41,

                elevation: 2,
              }}
            />
          </ForeignObject>
        </G>
      );
    });
  };

  const Tooltip = React.memo(({ x, y, data }) => {
    return data.map((item, vi) => {
      const isSelected = selectedIndexes.includes(vi);
      if (!isSelected) return null;
      const currentX = x(type === 'bar-chart' ? vi : item.date);
      const currentY = y(item.value);

      return (
        <TooltipItem
          key={`foreign-object-${vi}`}
          width={width}
          currentX={currentX}
          currentY={currentY}
          value={currencyFormat(data[vi].value)}
        />
      );
    });
  });

  const HorizontalLine = ({
    y,
    data,
    stroke = '#d2d2e7',
    strokeWidth = 1,
    strokeDasharray = [4, 4],
  }) => {
    return data.map((item, vi) => {
      const isSelected = selectedIndexes.includes(vi);
      if (!isSelected) return null;
      return (
        <Line
          key={`horizontal-line-${vi}`}
          x1={'0%'}
          x2={'100%'}
          y1={y(item.value)}
          y2={y(item.value)}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
        />
      );
    });
  };

  const VerticalLine = ({
    x,
    data,
    stroke = '#60608e',
    strokeWidth = 1,
    strokeDasharray = [],
  }) => {
    return data.map((item, vi) => {
      const isSelected = selectedIndexes.includes(vi);
      if (!isSelected) return null;
      return (
        <Line
          key={`vertical-line-${vi}`}
          x1={x(item.date)}
          x2={x(item.date)}
          y1={'0%'}
          y2={'100%'}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
        />
      );
    });
  };

  const Gradient = ({ index }) => (
    <Defs key={`gradient-defs-${index}`}>
      <LinearGradient id={'gradient'} x1={'0%'} y1={'0%'} x2={'0%'} y2={'100%'}>
        <Stop offset={'0%'} stopColor={color} stopOpacity={0.3} />
        <Stop offset={'75%'} stopColor={color} stopOpacity={0} />
      </LinearGradient>
    </Defs>
  );

  const AxisYLine = props => (
    <View
      style={{
        height: 277,
        width: 1,
        position: 'absolute',
        left: 9,
        bottom: 12,
        backgroundColor: 'red',
      }}
    />
  );

  const VerticalArrow = () => (
    <View
      style={{
        height: 5,
        width: 5,
        position: 'absolute',
        left: 7,
        top: 10,
        borderLeftWidth: 1,
        borderLeftColor: 'red',
        borderTopWidth: 1,
        borderTopColor: 'red',
        transform: [
          {
            rotate: '45deg',
          },
        ],
      }}
    />
  );

  const AxisXLine = ({ width }) => (
    <View
      style={{
        height: 1,
        width,
        position: 'absolute',
        left: 0,
        bottom: 22,
        backgroundColor: 'red',
      }}
    />
  );

  const HorizontalArrow = props => (
    <View
      style={{
        height: 5,
        width: 5,
        position: 'absolute',
        right: 0,
        bottom: 20,
        borderLeftWidth: 1,
        borderLeftColor: 'red',
        borderTopWidth: 1,
        borderTopColor: 'red',
        transform: [
          {
            rotate: '135deg',
          },
        ],
      }}
    />
  );

  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
      }}>
      <YAxis
        data={data}
        yAccessor={({ item }) => item?.value}
        contentInset={{ top: contentInset.top, bottom: contentInset.bottom }}
        svg={{
          fill: '#888888',
          fontSize: 10,
        }}
        formatLabel={value => value}
        style={{
          paddingBottom: dateHeight,
          minWidth: 50,
          backgroundColor: '#fff',
          // borderWidth: 1,
        }}
        min={min}
        max={max}
        numberOfTicks={numberOfTicks}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        <View
          style={{
            width,
            height,
            // borderWidth: 1,
          }}
          onLayout={event => {
            const { width } = event?.nativeEvent?.layout;
            // console.log(width);
          }}>
          {/* <AxisYLine /> */}
          {/* <VerticalArrow /> */}
          {type === 'bar-chart' && (
            <BarChart
              style={{ flex: 1 }}
              data={data.map((item, ii) => ({
                ...item,
                svg: {
                  ...item.svg,
                  strokeWidth: 10,
                  strokeLinejoin: 'round',
                  scaleY: 0.985,
                  stroke: selectedIndexes.includes(ii) ? activeColor : color,
                  onPress: () => handlePress(ii),
                },
              }))}
              xAccessor={({ item }) => item?.date}
              xScale={d3Scale.scaleTime}
              yAccessor={({ item }) => item?.value}
              gridMin={min}
              gridMax={max}
              numberOfTicks={numberOfTicks}
              contentInset={contentInset}
              spacingInner={1}
              spacingOuter={0.5}
              animate>
              <CustomGrid
                belowChart={true}
                direction={Grid.Direction.HORIZONTAL}
                strokeDasharray={[4, 4]}
              />
              <Tooltip />
            </BarChart>
          )}
          {type === 'area-chart' && (
            <AreaChart
              style={{ flex: 1 }}
              // data={data}
              data={data.map((item, ii) => ({
                ...item,
                svg: {
                  ...item.svg,
                  onPress: () => {
                    handlePress(ii);
                  },
                },
              }))}
              xAccessor={({ item }) => item?.date}
              xScale={d3Scale.scaleTime}
              yAccessor={({ item }) => item?.value}
              gridMin={min}
              gridMax={max}
              numberOfTicks={numberOfTicks}
              contentInset={contentInset}
              svg={{
                fill: 'url(#gradient)',
              }}
              curve={d3Shape.curveNatural}
              animate>
              <CustomGrid
                belowChart={true}
                direction={Grid.Direction.VERTICAL}
              />
              <CustomLine />
              <HorizontalLine />
              <VerticalLine />
              <Decorator />
              <Gradient />
              <Tooltip />
            </AreaChart>
          )}
          <View
            style={{
              height: dateHeight,
              justifyContent: 'flex-end',
              // borderWidth: 1,
            }}>
            <CustomXAxis
              style={{}}
              data={data}
              xAccessor={({ item }) => item?.date}
              scale={
                type === 'bar-chart' ? d3Scale.scaleBand : d3Scale.scaleTime
              }
              formatLabel={value => moment(value).format("MMM'DD")}
              contentInset={{
                left: contentInset.left,
                right: contentInset.right,
              }}
              svg={{
                fill: '#888888',
                fontSize: 8,
                fontWeight: 'bold',
                // rotation: 20,
                // originY: 30,
                // y: 5,
              }}
              activeSvg={{
                fill: '#541868',
              }}
              selectedIndexes={selectedIndexes}
            />
          </View>
          {/* <AxisXLine width={componentWidth} /> */}
          {/* <HorizontalArrow /> */}
        </View>
      </ScrollView>
    </View>
  );
};
