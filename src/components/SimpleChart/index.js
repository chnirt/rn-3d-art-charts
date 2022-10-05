// https://medium.com/@oriharel/pie-animation-in-react-native-using-svg-55d7d3f90156
import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Animated, Button, Easing, StyleSheet, Text, View } from 'react-native';
import * as shape from 'd3-shape';
import Svg, { Path, G, ForeignObject } from 'react-native-svg';

function currencyFormat(num, prefix) {
  return prefix + num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

const Slice = forwardRef((props, ref) => {
  const createPieArc = (index, endAngle = 0, data) => {
    const arcs = shape
      .pie()
      .value(item => item.number)
      .sort(null)
      .startAngle(0)
      .endAngle(2 * Math.PI)(data);

    let arcData = arcs[index];

    const arcGenerator = shape
      .arc()
      .outerRadius(100)
      .padAngle(0.05)
      .innerRadius(0);
    return arcGenerator(arcData);
  };

  const { endAngle, color, index, data } = props;
  let val = data[index].number;

  return (
    <Path
      ref={ref}
      onPress={props.onSelect}
      d={createPieArc(index, endAngle, data)}
      fill={color}
    />
  );
});

const Tooltip = memo(({ x, y, item, index, isSelected }) => {
  console.log(`hello-${index}`, x, y, item, isSelected);
  const [textWidth, setTextWidth] = useState(0);
  const [textHeight, setTextHeight] = useState(0);

  const onTextLayout = useCallback(e => {
    const textLayout = e.nativeEvent.layout;
    const { height, width } = textLayout;
    // console.log(textLayout)
    // console.log("asd-", height, width, textWidth, textHeight)
    if (height && width && textWidth === 0 && textHeight === 0) {
      setTextWidth(width);
      setTextHeight(height);
    }
  }, []);

  let newX = x;
  let newY = y;

  if (x < 0) {
    newX -= textWidth;
  }
  if (y < 0) {
    newY -= textHeight;
  }

  if (!isSelected) return null;

  return (
    <AnimatedForeignObject x={newX} y={newY}>
      <View
        style={{
          borderColor: '#E6E9EC',
          borderWidth: 1,
          borderRadius: 2,
          alignSelf: 'center',
          maxWidth: 120,
          backgroundColor: '#fff',
          paddingHorizontal: 10,
          paddingVertical: 5,
          borderRadius: 1,
        }}>
        <Text>{item?.number}</Text>
      </View>
    </AnimatedForeignObject>
  );

  return (
    <AnimatedForeignObject x={newX} y={newY}>
      <View
        style={{
          borderColor: '#E6E9EC',
          borderWidth: 1,
          borderRadius: 2,
          alignSelf: 'center',
          maxWidth: 120,
          // display: isSelected ? 'flex' : 'none',
        }}
        onLayout={onTextLayout}>
        <View
          style={{
            backgroundColor: '#fff',
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 1,
          }}>
          <Text style={{ color: '#888888', textAlign: x > 0 ? 'left' : 'right' }}>
            {item?.label}
            {/* {textWidth} */}
            {'\n'}
            <Text
              style={{
                color: '#222222',
                fontSize: 12,
                fontWeight: '600',
              }}>
              {currencyFormat(item?.number ?? 0, '$')}
            </Text>
          </Text>
        </View>
      </View>
    </AnimatedForeignObject>
  );
});

const AnimatedSlice = Animated.createAnimatedComponent(Slice);
const AnimatedForeignObject = Animated.createAnimatedComponent(ForeignObject);

export const SimpleChart = memo(
  forwardRef(({ data = [] }, ref) => {
    const [selectedIndexList, setSelectedIndexList] = useState([]);
    const slices = useRef(
      Array.from({ length: data.length }, _ => new Animated.Value(0)),
    ).current;
    const indexInputRef = useRef(null);
    const componentsRef = useRef([]);

    const outerRadius = 100;

    const createPieArc = useCallback(
      (index, endAngle = 0, outerRadiusInput = 100, data) => {
        const arcs = shape
          .pie()
          .value(item => item.number)
          .sort(null)
          .startAngle(0)
          .endAngle(endAngle)(data);

        let arcData = arcs[index];

        const arcGenerator = shape
          .arc()
          .outerRadius(outerRadiusInput ?? outerRadius)
          .padAngle(0.02)
          .innerRadius(outerRadius * 0.8);
        return arcGenerator(arcData);
      },
      [],
    );

    const createPieCentroid = useCallback((index, endAngle = 0, data) => {
      const arcs = shape
        .pie()
        .value(item => item.number)
        .sort(null)
        .startAngle(0)
        .endAngle(endAngle)(data);

      let arcData = arcs[index];

      const arcGenerator = shape
        .arc()
        .outerRadius(outerRadius + 30)
        .padAngle(0.02)
        .innerRadius(outerRadius * 0.8);
      return arcGenerator.centroid(arcData);
    }, []);

    useEffect(() => {
      slices.map((slice, i) => {
        slice.addListener(({ value }) => {
          // console.log("slice.addListener---", value)
          componentsRef.current[i].setNativeProps({
            d: createPieArc(i, value, 100, data),
          });
          // if (i === indexInputRef.current) {
          //   componentsRef.current[i].setNativeProps({
          //     d: createPieArc(indexInputRef.current, 2 * Math.PI, 110, data),
          //   });
          // } else {
          //   componentsRef.current[i].setNativeProps({
          //     d: createPieArc(i, value, 100, data),
          //   });
          // }
        });
      });

      animate();

      return () => {
        setSelectedIndexList([]);
      };
    }, []);

    const animate = () => {
      memoizedData.map((_, i) => {
        Animated.timing(slices[i], {
          toValue: 2 * Math.PI,
          duration: 500,
          easing: Easing.inOut(Easing.quad), // Make it take a while
          useNativeDriver: true,
        }).start(({ finished }) => {
          if (finished) {
          }
        });
      });
    };

    const handleOnSelect = indexInput => {
      indexInputRef.current = indexInput;
      setSelectedIndexList(prevState => {
        if (prevState.includes(indexInput)) {
          return prevState.filter(index => index !== indexInput);
        }
        return [...prevState, indexInput];
      });
    };

    const memoizedData = useMemo(() => data, []);

    return (
      <View style={styles.container}>
        <Svg
          style={styles.pieSVG}
          width={400}
          height={400}
          viewBox={`-200 -200 400 400`}>
          {data.map((item, index) => {
            const isSelected = selectedIndexList.includes(index);
            return (
              <G key={`pie-group-${index}`}>
                <AnimatedSlice
                  ref={refInput => (componentsRef.current[index] = refInput)}
                  index={index}
                  color={item.color}
                  data={data}
                  key={'pie_shape_' + index}
                  onSelect={() => handleOnSelect(index)}
                />
                <Tooltip
                  index={index}
                  x={createPieCentroid(index, 2 * Math.PI, data)[0]}
                  y={createPieCentroid(index, 2 * Math.PI, data)[1]}
                  item={item}
                  isSelected={isSelected}
                />
              </G>
            );
          })}
        </Svg>
        <View style={{ marginTop: 20 }}>
          <Button onPress={animate} title="Ok" />
        </View>
      </View>
    );
  }),
);

const styles = StyleSheet.create({
  container: {},
  pieSVG: {},
});
