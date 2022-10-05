// https://stackoverflow.com/questions/63864016/positioning-icon-in-svg-in-react-native
import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  LayoutAnimation,
  Platform,
  Text,
  UIManager,
  View,
  Image,
  StyleSheet,
  Easing,
} from 'react-native';
import Svg, {
  Circle,
  Text as SvgText,
  G,
  ForeignObject,
  Path,
  LinearGradient,
  Stop,
} from 'react-native-svg';
import * as shape from 'd3-shape';
import { Defs } from 'react-native-svg';

const demoData = [
  {
    number: 160,
    // color: ['#D1465F'],
    color: ['#D1465F', '#F1738C'],
  },
  {
    number: 150,
    // color: '#28BD8B',
    color: ['#8E57FC', '#B178FC'],
  },
  {
    number: 5,
    // color: '#F66A6A',
    color: ['#1BA2C3', '#6BD0E8'],
  },
];

const Slice = forwardRef((props, ref) => {
  const createPieArc = (index, data) => {
    const arcs = shape
      .pie()
      .value(item => item.number)
      .sort(null)
      .startAngle(0)
      .endAngle(2 * Math.PI)(data);

    let arcData = arcs[index];

    const arcGenerator = shape
      .arc()
      .outerRadius(90)
      .innerRadius(50)
      .cornerRadius(5)
      .padAngle(0.03);
    return arcGenerator(arcData);
  };

  const { index, data } = props;

  return (
    <Path
      ref={ref}
      onPress={props.onPress}
      d={createPieArc(index, data)}
      fill={color}
    />
  );
});

const AnimatedSlice = Animated.createAnimatedComponent(Slice);

export const AndroidPieChart = () => {
  const [selectedIndexList, setSelectedIndexList] = useState([]);
  const slices = useRef(
    Array.from({ length: demoData.length }, _ => new Animated.Value(0)),
  ).current;

  const indexInputRef = useRef(null);
  const componentsRef = useRef([]);

  useEffect(() => {
    slices.map((slice, i) => {
      slice.addListener(({ value }) => {
        // console.log("value---", value)
        // console.log(indexInputRef.current)
        componentsRef.current[indexInputRef.current].setNativeProps({
          d: createPieArc(indexInputRef.current, demoData, 90 + value * 10),
        });
      });
    });
  }, []);

  const handleOnSelect = indexInput => {
    // console.log('indexInput---', indexInput);
    indexInputRef.current = indexInput;
    Animated.timing(slices[indexInput], {
      toValue: slices[indexInput]._value === 1 ? 0 : 1,
      duration: 500,
      easing: Easing.inOut(Easing.quad), // Make it take a while
      useNativeDriver: false, // not work android
    }).start(({ finished }) => {
      if (finished) {
        // console.log('finished---', finished);
        setSelectedIndexList(prevState => {
          if (prevState.includes(indexInput)) {
            return prevState.filter(index => index !== indexInput);
          }
          return [...prevState, indexInput];
        });
      }
    });
  };

  const createPieArc = (index, data, newOuterRadius) => {
    const arcs = shape
      .pie()
      .value(item => item.number)
      .sort(null)
      .startAngle(0)
      .endAngle(2 * Math.PI)(data);

    let arcData = arcs[index];

    const arcGenerator = shape
      .arc()
      .outerRadius(newOuterRadius)
      .innerRadius(50)
      .cornerRadius(5)
      .padAngle(0.03);
    return arcGenerator(arcData);
  };

  return (
    <View style={styles.container}>
      <Svg
        style={styles.pieSVG}
        width={200}
        height={200}
        viewBox={`-100 -100 200 200`}>
        {demoData.map((item, index) => {
          const isSelected = selectedIndexList.includes(index);
          return (
            <G key={`pie-group-${index}`}>
              {typeof item.color !== 'string' && (
                <Defs>
                  <LinearGradient
                    key={`pie-lineargradient-${index}`}
                    id={`pie-lineargradient-${index}`}
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  // gradientUnits="userSpaceOnUse"
                  // gradientTransform="matrix(-1 0 0 1 528.02 0)"
                  >
                    {item.color.length > 0 &&
                      item.color.map((color, index) => {
                        return (
                          <Stop
                            key={`pie-stop-${index}`}
                            offset={index / (item.color.length - 1)}
                            stopColor={color}
                          />
                        );
                      })}
                  </LinearGradient>
                </Defs>
              )}
              <Path
                key={`pie-path-${index}`}
                index={index}
                d={createPieArc(index, demoData, 90)}
                fill={
                  typeof item.color !== 'string'
                    ? `url(#pie-lineargradient-${index})`
                    : item.color
                }
                ref={refInput => (componentsRef.current[index] = refInput)}
                onPress={() => handleOnSelect(index)}
              />
            </G>
          );
        })}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pieSVG: {
    flex: 1,
  },
});
