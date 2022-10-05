import React from 'react';
import { LineChart } from 'react-native-svg-charts'
import { View } from 'react-native'
import { G, Line } from 'react-native-svg'

export const PartialAreaChartExample = () => {
  const data = [50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80]

  const CustomGrid = ({ x, y, data, ticks }) => (
    <G>
      {
        // Horizontal grid
        ticks.map(tick => (
          <Line
            key={tick}
            x1={'0%'}
            x2={'100%'}
            y1={y(tick)}
            y2={y(tick)}
            stroke={'red'}
          />
        ))
      }
      {
        // Vertical grid
        data.map((_, index) => (
          <Line
            key={index}
            y1={'0%'}
            y2={'100%'}
            x1={x(index)}
            x2={x(index)}
            stroke={'red'}
          />
        ))
      }
    </G>
  )

  return (
    <View style={{ height: 200, flexDirection: 'row' }}>
      <LineChart
        style={{ flex: 1 }}
        data={data}
        svg={{
          stroke: 'rgb(134, 65, 244)',
        }}
        renderGrid={CustomGrid}
      />
    </View>
  )
};