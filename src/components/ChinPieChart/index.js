// https://stackoverflow.com/questions/63864016/positioning-icon-in-svg-in-react-native
import React, { useMemo, useRef, useState } from 'react';
import {
  Animated,
  LayoutAnimation,
  Platform,
  Text,
  UIManager,
  View,
  Image,
} from 'react-native';
import Svg, { Circle, Text as SvgText, G, ForeignObject } from 'react-native-svg';
import { PieChart } from 'react-native-svg-charts';

export const ChinPieChart = () => {
  const [indexList, setIndexList] = useState([]);
  const pieChartRef = useRef(new Animated.Value(0));
  const data = [50, 10, 40];

  // const pieData = [
  //   {
  //     key: 1,
  //     value: 50,
  //     svg: { fill: '#600080' },
  //     arc: { outerRadius: '130%', cornerRadius: 10 },
  //   },
  //   {
  //     key: 2,
  //     value: 50,
  //     svg: { fill: '#9900cc' },
  //   },
  //   {
  //     key: 3,
  //     value: 40,
  //     svg: { fill: '#c61aff' },
  //   },
  //   {
  //     key: 4,
  //     value: 95,
  //     svg: { fill: '#d966ff' },
  //   },
  //   {
  //     key: 5,
  //     value: 35,
  //     svg: { fill: '#ecb3ff' },
  //   },
  // ];

  const randomColor = () =>
    ('#' + ((Math.random() * 0xffffff) << 0).toString(16) + '000000').slice(
      0,
      7,
    );

  const pieData = useMemo(
    () =>
      data
        .filter(value => value > 0)
        .map((value, indexInput) => ({
          key: `pie-${indexInput}`,
          value,
          svg: {
            fill: randomColor(),
            onPress: () => {
              setIndexList(prevState => {
                if (prevState.includes(indexInput)) {
                  return prevState.filter(index => index !== indexInput);
                }
                return [...prevState, indexInput];
              });
            },
          },
          arc: indexList.includes(indexInput)
            ? { outerRadius: '110%', cornerRadius: 10 }
            : {},
        })),
    [indexList],
  );

  const Labels = ({ slices, height, width }) => {
    return slices.map((slice, index) => {
      const { labelCentroid, pieCentroid, data } = slice;
      console.log(slice);
      return (
        <G key={index} x={labelCentroid[0]} y={labelCentroid[1]}>
          <SvgText
            key={index}
            x={pieCentroid[0]}
            y={pieCentroid[1]}
            fill={'white'}
            textAnchor={'middle'}
            alignmentBaseline={'middle'}
            fontSize={24}
            stroke={'black'}
            strokeWidth={1}>
            {data.value}
          </SvgText>
        </G>
      );
    });
  };

  const Tooltips = ({ slices, height, width }) => {
    return slices.map((slice, index) => {
      const isSelected = indexList.includes(index);
      const { labelCentroid, pieCentroid, data } = slice;
      const xPosition =
        labelCentroid[0] < 0 ? labelCentroid[0] - 65 : labelCentroid[0] - 55;
      const yPosition =
        labelCentroid[1] < 0 ? labelCentroid[1] - 10 : labelCentroid[1] - 60;
      if (!isSelected) return null;
      return (
        <G key={index} x={labelCentroid[0]} y={labelCentroid[1]}>
          {/* <ForeignObject x={pieCentroid[0]} y={pieCentroid[1]}> */}
          <ForeignObject x={xPosition} y={yPosition}>
            <Text
              style={{
                width: 100,
                backgroundColor: '#fff',
                borderWidth: 1,
                borderColor: '#E6E9EC',
                borderRadius: 1,
                paddingVertical: 5,
                paddingHorizontal: 10,
                color: '#888888',
                alignSelf: 'center',
                writingDirection: pieCentroid[0] < 0 ? 'rtl' : 'ltr',
              }}>
              {data.value} xxxxxxxxxxxxxxxxx
              {'\n'}
              <Text
                style={{
                  color: '#222222',
                }}>
                -$15,000
              </Text>
            </Text>
          </ForeignObject>
        </G>
      );
    });
  };

  return (
    <View>
      <PieChart
        ref={pieChartRef}
        style={{ height: 400, width: 400 }}
        data={pieData}
        sort={(a, b) => a.key - b.key}
        animate
        animationDuration={200}
        outerRadius={'40%'}
        innerRadius={20}>
        {/* <Labels /> */}
        {/* <Tooltips /> */}
      </PieChart>
      {/* <Text>{indexList.join(',')}</Text> */}
    </View>
  );
};
