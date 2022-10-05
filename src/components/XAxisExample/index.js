import React from 'react';
import { BarChart, XAxis } from 'react-native-svg-charts'
import { View } from 'react-native'
import * as scale from 'd3-scale'

export const XAxisExample = () => {
  const data = [14, 80, 100, 55]

  return (
    <View style={{ height: 200, width: 200, padding: 20 }}>
      <BarChart
        style={{ flex: 1 }}
        data={data}
        gridMin={0}
        svg={{ fill: 'rgb(134, 65, 244)' }}
        contentInset={{
          left: 10,
          right: 10
        }}
      />
      <XAxis
        // style={{ marginTop: 10, borderWidth: 1 }}
        data={data}
        scale={scale.scaleBand}
        // formatLabel={(value, index) => index}
        contentInset={{
          left: 10,
          right: 10
        }}
        svg={{
          fill: "#000"
        }}
      />
    </View>
  )
};
