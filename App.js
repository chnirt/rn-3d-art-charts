/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useCallback, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Button } from 'react-native';
// import { ProgressCircle } from 'react-native-svg-charts';
import LinearGradient from 'react-native-linear-gradient';
import {
  AreaChart,
  LineChart,
  Grid,
  YAxis,
  XAxis,
} from 'react-native-svg-charts';
import * as scale from 'd3-scale';
import * as shape from 'd3-shape';

import { PieChart } from './src/components';
import { ProgressCircle } from './src/components/ProgressCircle';
import { G, Line, Circle, Path } from 'react-native-svg';
import { CustomChart } from './src/components/CustomChart';
import { InteractiveChart } from './src/components/InteractiveChart';
import { BarChartVerticalWithLabels } from './src/components/BarChartVerticalWithLabels';
import { ColorBarExample } from './src/components/ColorBarExample';
import { ChinPieChart } from './src/components/ChinPieChart';
import { SimpleChart } from './src/components/SimpleChart';
import { AndroidPieChart } from './src/components/AndroidPieChart';
import moment from 'moment';
import { PartialAreaChartExample } from './src/components/PartialAreaChartExample';
import { XAxisExample } from './src/components/XAxisExample';
import { AreaChartExample } from './src/components/AreaChartExample';
import { GradientLineExample } from './src/components/GradientLineExample';
import { Remove0ValueChart } from './src/components/Remove0ValueChart';

const Hello = React.memo(
  React.forwardRef((props, ref) => {
    console.log('hello,,,,');
    return (
      <View>
        <Text>Hello</Text>
      </View>
    );
  }),
);

const data = [
  {
    number: 5000000,
    color: ['#FD8152', '#FD8F65'],
  },
  {
    number: 2000000,
    color: ['#40BFFD', '#5EC9FD'],
  },
  {
    number: 5000000,
    color: ['#19D59B', '#44E7B6'],
  },
  {
    number: 4000000,
    color: ['#517CFC', '#5B59FA'],
  },
  {
    number: 1000000,
    color: ['#D1465F', '#F1738C'],
  },
  {
    number: 5000000,
    color: ['#DB9B2C', '#FFB022'],
  },
  {
    number: 6000000,
    color: ['#1BA2C3', '#6BD0E8'],
  },
  {
    number: 20000000,
    color: ['#8E57FC', '#B178FC'],
  },
];

const data2 = [
  {
    label: 'Essential',
    number: 19000,
    color: ['#FD8F65', '#FD8152'],
  },
  {
    label: 'Discretionary',
    number: 11000,
    color: ['#FF5271', '#FF4A6A'],
  },
];

const data3 = [
  {
    number: 6000,
    color: '#0d2f51',
    label: 'Essential Expense',
  },
  {
    number: 12000,
    color: '#28BD8B',
    label: 'Discretionary Expense',
  },
  {
    number: 15000,
    color: '#F66A6A',
    label: 'Targeted Surplus',
  },
];

const shadowCircle = 170;

const App = () => {
  const [selectedIndexs, setSelectedIndexs] = useState([]);
  const [selectedIndex1s, setSelectedIndex1s] = useState([]);
  const onSelect = useCallback(indexInput => {
    setSelectedIndexs(prevState => {
      if (prevState.includes(indexInput)) {
        return prevState.filter(index => index !== indexInput);
      }
      return [...prevState, indexInput];
    });
  }, []);
  const onSelect1 = useCallback(indexInput => {
    setSelectedIndex1s(prevState => {
      if (prevState.includes(indexInput)) {
        return prevState.filter(index => index !== indexInput);
      }
      return [...prevState, indexInput];
    });
  }, []);

  const enumerateDaysBetweenDates = (startDate, endDate) => {
    var now = startDate.clone(),
      dates = [];

    while (now.isSameOrBefore(endDate)) {
      dates.push(now.format('MM/DD/YYYY'));
      now.add(1, 'days');
    }
    return dates;

    var dates = [];

    var currDate = moment(startDate).startOf('day');
    var lastDate = moment(endDate).startOf('day');

    while (currDate.add(1, 'days').diff(lastDate) < 0) {
      console.log(currDate.toDate());
      dates.push(currDate.clone().toDate());
    }

    return dates;
  };

  // const dates = enumerateDaysBetweenDates(
  //   moment('2021-01-01'),
  //   moment('2021-01-12'),
  // );
  // console.log(moment('2021-01-01').add(0, 'days').format("MMM'DD"));

  const data = [...Array(12).keys()].map(i => ({
    key: i,
    value: Math.round(Math.random() * 150000 + 0, 0),
    date: new Date(2015, 2, i),
  }));

  const [count, setCount] = useState(0);
  return (
    <View style={styles.container}>
      <Text>{count}</Text>
      <Button onPress={() => setCount(count + 1)} title="Count" />
      {/* <PieChart
        style={styles.pieSVG}
        size={400}
        selectedIndexs={selectedIndexs}
        data={data}
        valueAccessor={({ item }) => item.number}
        spacing={0.03}
        outerRadius={'60%'}
        activeOuterRadius={'70%'}
        innerRadius={'40%'}
        tooltipOuterRadius={'90%'}
        centeredText={'$10000'}
        startAngle={0.1 * Math.PI}
        endAngle={2.1 * Math.PI}
        onSelect={onSelect}
      /> */}

      {/* <PieChart
        style={styles.pieSVG}
        size={210}
        width={210 * 2}
        height={210}
        selectedIndexs={selectedIndex1s}
        data={data2}
        valueAccessor={({ item }) => item.number}
        labelAccessor={({ item }) => item.label}
        spacing={0.02}
        outerRadius={'75%'}
        activeOuterRadius={'80%'}
        innerRadius={'60%'}
        tooltipOuterRadius={'90%'}
        cornerRadius={0}
        centeredText={() => {
          return (
            <View
              style={{
                position: 'absolute',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{ fontSize: 12, color: '#222222' }}>
                Total Expense
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  color: '#222222',
                  fontWeight: '600',
                  marginTop: 5,
                }}>
                $30,000
              </Text>
            </View>
          );
        }}
        startAngle={0 * Math.PI}
        endAngle={2 * Math.PI}
        onSelect={onSelect1}
      /> */}

      {/* <View>
        <ProgressCircle
          style={styles.semiCircleSVG}
          size={224}
          width={224}
          height={224}
          // spacing={0.03}
          outerRadius={'100%'}
          innerRadius={'85%'}
          // tooltipOuterRadius={'60%'}
          // cornerRadius={0}

          progress={0.7}
          progressColor={['#40c0fe', '#5ec9fd']}
          backgroundColor={['#f2f2f8']}
          startAngle={-Math.PI / 2}
          endAngle={Math.PI / 2}>
          <View
            style={{
              position: 'absolute',
              bottom: 0,
            }}>
            <LinearGradient
              colors={['#f8f6fb', '#fff']}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: shadowCircle,
                height: shadowCircle / 2,
                borderTopStartRadius: shadowCircle / 2,
                borderTopEndRadius: shadowCircle / 2,
                borderWidth: 1,
                borderColor: '#f8f6fb',
                backgroundColor: '#f8f6fb',
              }}>
              <Text style={{ fontSize: 12, color: '#222222' }}>
                Current Surplus
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  color: '#222222',
                  fontWeight: '600',
                  marginTop: 5,
                }}>
                $20,000
              </Text>
            </LinearGradient>
          </View>
        </ProgressCircle>
      </View> */}

      {/* <ChinPieChart data={data2} /> */}
      {/* <Hello /> */}

      {/* <AndroidPieChart data={data2} /> */}
      {/* <SimpleChart
        data={data3}
        selectedIndexList={selectedIndexs}
        onSelect={onSelect}
      /> */}
      {/* <CustomChart
        type="bar-chart"
        data={data}
        index={4}
        min={0}
        max={140000}
        dateHeight={10}
        activeColor="#fd8354"
        color="#ececf5"
      /> */}
      {/* <CustomChart
        data={data}
        index={4}
        min={0}
        max={140000}
        dateHeight={10}
        color='#028feb'
      /> */}
      {/* <AreaChartExample /> */}
      {/* <XAxisExample /> */}
      {/* <PartialAreaChartExample /> */}
      {/* <InteractiveChart /> */}
      {/* <BarChartVerticalWithLabels /> */}
      {/* <ColorBarExample /> */}
      {/* <GradientLineExample /> */}
      <Remove0ValueChart />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pieSVG: {
    // shadowColor: 'rgba(59, 74, 116, 0.35)',
    // shadowOffset: {
    //   width: 0,
    //   height: 32,
    // },
    // elevation: 12,
    // shadowRadius: 12.5,
    // shadowOpacity: 1,
    // borderWidth: 1,
  },
  semiCircleSVG: {
    // shadowColor: 'rgba(59, 74, 116, 0.35)',
    // shadowOffset: {
    //   width: 0,
    //   height: 32,
    // },
    // elevation: 12,
    // shadowRadius: 12.5,
    // shadowOpacity: 1,
    // borderWidth: 1,
  },
});

export default App;
