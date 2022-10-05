// https://wattenberger.com/blog/gauge
import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Animated,
  Easing,
  Platform,
  UIManager,
  LayoutAnimation,
} from 'react-native';
import Svg, {
  Defs,
  G,
  LinearGradient,
  Rect,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import { Slice } from './Slice';
import * as shape from 'd3-shape';
const d3 = { shape };

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const styles = StyleSheet.create({
  graphWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    position: 'absolute',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 24,
    color: '#000',
  },
});

function currencyFormat(num) {
  return '$' + num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

export const PieChart = forwardRef(
  (
    {
      style,
      size = 200,
      width = 200,
      height = 200,
      selectedIndexs = [],
      data = [],
      valueAccessor = () => { },
      labelAccessor = () => { },
      outerRadius = size / 2,
      activeOuterRadius = size / 2,
      tooltipOuterRadius = size / 2,
      innerRadius = 0,
      cornerRadius = 45,
      spacing = 0,
      centeredText,
      startAngle = 0,
      endAngle = 2 * Math.PI,
      onSelect = () => { },
    },
    ref,
  ) => {
    console.log("asd")
    const slices = useRef(
      Array.from({ length: data.length }, _ => new Animated.Value(0)),
    ).current;
    const componentsRef = useRef([]);
    const indexInputRef = useRef(null);
    const radius = size / 2;

    const newOuterRadius =
      typeof outerRadius === 'string'
        ? (radius * parseFloat(outerRadius)) / 100
        : outerRadius;
    const newActiveOuterRadius =
      typeof activeOuterRadius === 'string'
        ? (radius * parseFloat(activeOuterRadius)) / 100
        : activeOuterRadius;
    const newTooltipOuterRadius =
      typeof tooltipOuterRadius === 'string'
        ? (radius * parseFloat(tooltipOuterRadius)) / 100
        : tooltipOuterRadius;
    const newInnerRadius =
      typeof innerRadius === 'string'
        ? (radius * parseFloat(innerRadius)) / 100
        : innerRadius;

    useEffect(() => {
      slices.map((slice, i) => {
        slice.addListener(event => {
          componentsRef.current[indexInputRef.current].setNativeProps({
            d: createPieArc(
              indexInputRef.current,
              newOuterRadius +
              event.value * (newActiveOuterRadius - newOuterRadius),
            ),
          });
        });
      });
    }, []);

    const handleOnSelect = useCallback(indexInput => {
      indexInputRef.current = indexInput;
      onSelect(indexInput);
      Animated.timing(slices[indexInput], {
        toValue: slices[indexInput]._value === 1 ? 0 : 1,
        duration: 500,
        easing: Easing.inOut(Easing.quad), // Make it take a while
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
        }
      });
    }, []);

    const getArcs = () => {
      return d3.shape
        .pie()
        .value(item => valueAccessor({ item }))
        .sort(null)
        .startAngle(startAngle)
        .endAngle(endAngle)(data);
    };

    const createPieArc = useCallback((index, newActiveOuterRadius) => {
      const arcs = getArcs();

      let arcData = arcs[index];

      const arcGenerator = d3.shape
        .arc()
        .outerRadius(newActiveOuterRadius)
        .padAngle(spacing)
        .innerRadius(newInnerRadius)
        .cornerRadius(cornerRadius);
      return arcGenerator(arcData);
    }, []);

    const createPieCentroid = useCallback(index => {
      const arcs = getArcs();

      let arcData = arcs[index];

      const arcGenerator = d3.shape
        .arc()
        .outerRadius(newTooltipOuterRadius)
        .padAngle(spacing)
        .innerRadius(newInnerRadius);

      return arcGenerator.centroid(arcData);
    }, []);

    if (data.length === 0) return null;

    const MemoizedTooltip = memo(
      ({ id, isSelected = false, x, y, label, text }) => {
        const [textWidth, setTextWidth] = useState(0);
        const [textHeight, setTextHeight] = useState(0);

        const onTextLayout = e => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          const textLayout = e.nativeEvent.layout;
          const { height, width } = textLayout;
          if (!isSelected) {
            setTextWidth(0);
            setTextHeight(0);
            return;
          }
          if (height && !textWidth) {
            setTextWidth(width);
            setTextHeight(height);
          }
        };

        const PADDING = 8;

        let newX = x;
        let newY = y;

        if (x < 0) {
          newX = newX - textWidth;
        }
        if (y > 0) {
          newY = newY + textHeight;
        }

        if (!isSelected) {
          return null;
        }

        return (
          <G
            key={'tooltip'}
            onLayout={onTextLayout}
            onPress={() => console.log('tooltip clicked', x, y)}>
            <Rect
              height={textHeight + PADDING}
              width={textWidth + PADDING}
              stroke={'#E6E9EC'}
              fill={'#FFF'}
              x={newX - PADDING}
              y={newY - textHeight}
            />
            <SvgText x={newX} y={newY - 20} fill="#888888" fontSize={12}>
              {label}
            </SvgText>
            <SvgText
              x={newX}
              y={newY}
              fill="#000"
              fontSize={12}
              fontWeight="600">
              {currencyFormat(text)}
            </SvgText>
          </G>
        );
      },
    );

    const Tooltip = ({ index, selectedIndexs, ...rest }) => {
      const isSelected = selectedIndexs.includes(index);

      return useMemo(() => {
        // The rest of your rendering logic
        return <MemoizedTooltip {...rest} isSelected={isSelected} />;
      }, [rest, isSelected]);
    };

    const renderCenteredText = useCallback(centeredTextInput => {
      switch (typeof centeredTextInput) {
        case 'function': {
          return centeredText();
        }
        case 'string': {
          return (
            <Text fill={'#000'} style={styles.label}>
              {centeredTextInput}
            </Text>
          );
        }
        default: {
          return null;
        }
      }
    });

    return (
      <View style={styles.graphWrapper}>
        <Svg
          style={style}
          width={width}
          height={height}
          viewBox={`${-width / 2} ${-height / 2} ${width} ${height}`}
          pointerEvents={Platform.OS === 'android' && 'box-none'}>
          <Defs>
            {data.map((item, index) => {
              return (
                <LinearGradient key={index} id={`gradient-${index}`}>
                  {item.color.length > 0 &&
                    item.color.map((color, index) => {
                      return (
                        <Stop
                          key={`stop-path-${index}`}
                          offset={index / (item.color.length - 1)}
                          stopColor={color}
                        />
                      );
                    })}
                </LinearGradient>
              );
            })}
          </Defs>
          <G>
            {data.map((item, index) => {
              return (
                <G key={`pie-path-${index}`}>
                  <Slice
                    index={index}
                    d={createPieArc(index, newOuterRadius)}
                    fill={`url(#gradient-${index})`}
                    ref={refInput => (componentsRef.current[index] = refInput)}
                    onSelect={() => handleOnSelect(index)}
                  />
                  <Tooltip
                    id={`pie-tooltip-${index}`}
                    x={createPieCentroid(index)[0]}
                    y={createPieCentroid(index)[1]}
                    label={labelAccessor({ item })}
                    text={valueAccessor({ item })}
                    index={index}
                    selectedIndexs={selectedIndexs}
                  />
                </G>
              );
            })}
          </G>
        </Svg>
        {renderCenteredText(centeredText)}
      </View>
    );
  },
);
