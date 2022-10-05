import React from 'react';
import { View } from 'react-native';
import { BarChart, Grid } from 'react-native-svg-charts';
import { Text } from 'react-native-svg';
import { G } from 'react-native-svg';
import { Rect } from 'react-native-svg';
import { Path } from 'react-native-svg';

/**
 * Get path data for a rounded rectangle. Allows for different radius on each corner.
 * @param  {Number} w   Width of rounded rectangle
 * @param  {Number} h   Height of rounded rectangle
 * @param  {Number} tlr Top left corner radius
 * @param  {Number} trr Top right corner radius
 * @param  {Number} brr Bottom right corner radius
 * @param  {Number} blr Bottom left corner radius
 * @return {String}     Rounded rectangle SVG path data
 */

var roundedRectData = function (w, h, tlr, trr, brr, blr) {
  return 'M 0 ' + tlr
    + ' A ' + tlr + ' ' + tlr + ' 0 0 1 ' + tlr + ' 0'
    + ' L ' + (w - trr) + ' 0'
    + ' A ' + trr + ' ' + trr + ' 0 0 1 ' + w + ' ' + trr
    + ' L ' + w + ' ' + (h - brr)
    + ' A ' + brr + ' ' + brr + ' 0 0 1 ' + (w - brr) + ' ' + h
    + ' L ' + blr + ' ' + h
    + ' A ' + blr + ' ' + blr + ' 0 0 1 0 ' + (h - blr)
    + ' Z';
};

export const BarChartVerticalWithLabels = ({
  color = 'rgba(134, 65, 244, 1)',
}) => {
  const data = [10, 5, 25, 15, 20];

  const CUT_OFF = 20;
  const Labels = ({ x, y, bandwidth, data }) =>
    data.map((value, index) => (
      <G>
        <Text
          key={index}
          x={x(index) + bandwidth / 2}
          y={value < CUT_OFF ? y(value) - 10 : y(value) + 15}
          fontSize={14}
          fill={value >= CUT_OFF ? 'white' : 'black'}
          alignmentBaseline={'middle'}
          textAnchor={'middle'}>
          {value}
        </Text>
        {/* <Rect
          x={x(index)}
          y={y(value) - 5} // Subtract Height / 2 to make half of the Rect above the bar
          rx={5} // Set to Height / 2
          ry={5} // Set to Height / 2
          width={bandwidth}
          height={10} // Height of the Rect
          fill={color}
        /> */}
      </G>
    ));

  const RoundedBars = ({ x, y, bandwidth, data, height, contentInset }) => {
    return data.map((item, index) => (
      // <G x={x(index)} y={y(item.value)}>
      <G x={x(index)} y={y(item)}>
        <Path
          d={roundedRectData(
            bandwidth,
            // height - y(item.value) - (contentInset?.bottom || 0),
            height - y(item) - (contentInset?.bottom || 0),
            bandwidth / 2,
            bandwidth / 2,
          )}
          // fill={item.svg.fill}
          fill={"red"}
        />
      </G>
    ));
  };

  return (
    <View style={{ flexDirection: 'row', height: 200, paddingVertical: 16 }}>
      <BarChart
        style={{ flex: 1, borderWidth: 1 }}
        data={data}
        svg={{ fill: color }}
        contentInset={{ top: 10, bottom: 10 }}
        spacing={0.5}
        spacingInner={0.5}
        spacingOuter={0.5}
        gridMin={0}
        animate={true}
        animationDuration={500}
      >
        <Grid direction={Grid.Direction.HORIZONTAL} />
        <Labels />
        {/* <RoundedBars /> */}
      </BarChart>
    </View>
  );
};
