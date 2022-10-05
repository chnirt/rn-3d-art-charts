import React, { useCallback, useState } from 'react';
import { View, Text } from 'react-native';
import Svg, {
  G,
  Text as SVGText,
} from 'react-native-svg';
import * as d3Scale from 'd3-scale';
import * as d3Array from 'd3-array';

export const CustomXAxis = props => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const {
    style,
    scale,
    data,
    xAccessor,
    formatLabel,
    numberOfTicks,
    svg,
    activeSvg,
    children,
    min,
    max,
    selectedIndexes
  } = props;

  const _onLayout = useCallback(event => {
    const {
      nativeEvent: {
        layout: { width: layoutWidth, height: layoutHeight },
      },
    } = event;

    if (layoutWidth !== width) {
      setWidth(layoutWidth);
      setHeight(layoutHeight);
    }
  }, []);

  const _getX = domain => {
    const {
      scale,
      spacingInner,
      spacingOuter,
      contentInset: { left = 0, right = 0 },
    } = props;

    const x = scale()
      .domain(domain)
      .range([left, width - right]);

    if (scale === d3Scale.scaleBand) {
      x.paddingInner([spacingInner]).paddingOuter([spacingOuter]);

      //add half a bar to center label
      return value => x(value) + x.bandwidth() / 2;
    }

    return x;
  };

  if (data.length === 0) {
    return <View style={style} />;
  }

  const values = data.map((item, index) => xAccessor({ item, index }));
  const extent = d3Array.extent(values);
  const domain =
    scale === d3Scale.scaleBand ? values : [min || extent[0], max || extent[1]];

  const x = _getX(domain);
  const ticks = numberOfTicks ? x.ticks(numberOfTicks) : values;

  const extraProps = {
    x,
    ticks,
    width,
    height,
    formatLabel,
  };
  return (
    <View style={style}>
      <View style={{ flexGrow: 1 }} onLayout={_onLayout}>
        {/*invisible text to allow for parent resizing*/}
        <Text
          style={{
            opacity: 0,
            fontSize: svg.fontSize,
            fontFamily: svg.fontFamily,
            fontWeight: svg.fontWeight,
          }}>
          {formatLabel(ticks[0], 0)}
        </Text>
        {height > 0 && width > 0 && (
          <Svg
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height,
              width,
            }}>
            <G>
              {React.Children.map(children, child => {
                return React.cloneElement(child, extraProps);
              })}
              {
                // don't render labels if width isn't measured yet,
                // causes rendering issues
                width > 0 &&
                ticks.map((value, index) => {
                  const { svg: valueSvg = {} } = data[index] || {};
                  const isSelected = selectedIndexes.includes(index);

                  return (
                    <SVGText
                      textAnchor={'middle'}
                      originX={x(value)}
                      alignmentBaseline={'hanging'}
                      {...svg}
                      {...valueSvg}
                      {...(isSelected ? activeSvg : {})}
                      key={index}
                      x={x(value)}>
                      {formatLabel(value, index)}
                    </SVGText>
                  );
                })
              }
            </G>
          </Svg>
        )}
      </View>
    </View>
  );
};