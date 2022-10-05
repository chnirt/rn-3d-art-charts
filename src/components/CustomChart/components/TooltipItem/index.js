import React, {memo, useCallback, useState} from 'react';
import {View, Text, Animated} from 'react-native';
import {ForeignObject} from 'react-native-svg';

export const TooltipItem = memo(
  ({width, currentX = 0, currentY = 0, value}) => {
    const PADDING = 10;
    const TRIANGLE_SIZE = 5;

    const [contentSize, setContentSize] = useState(null);
    const [newPosition, setNewPosition] = useState({
      x: currentX,
      y: currentY,
    });
    const [placement, setPlacement] = useState(null);
    const [refreshId, setRefreshId] = useState(Date.now());

    const onLayout = useCallback(
      ({nativeEvent}) => {
        const {width: layoutWidth, height: layoutHeight} = nativeEvent.layout;
        const newX = currentX - layoutWidth * 0.5;
        const newY = currentY - layoutHeight * 1.5;
        const newXPosition =
          newX < 0
            ? PADDING
            : newX + layoutWidth > width
            ? width - layoutWidth - PADDING
            : newX;

        setContentSize({
          width: layoutWidth,
          height: layoutHeight,
        });
        setPlacement(newY < 0 ? 'top' : 'bottom');
        const newYPosition =
          newY < 0 ? currentY + PADDING + TRIANGLE_SIZE : newY;
        setNewPosition({
          x: newXPosition,
          y: newYPosition,
        });
        setRefreshId(Date.now());
      },
      [currentX, currentY],
    );

    return (
      <ForeignObject x={newPosition.x} y={newPosition.y} key={refreshId}>
        <Animated.View
          style={{
            alignSelf: 'center',
          }}
          onLayout={!contentSize && onLayout}>
          <View
            style={{
              backgroundColor: '#541868',
              alignSelf: 'center',
              margin: 5,
              padding: 5,
              borderRadius: 5,

              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.22,
              shadowRadius: 2.22,

              elevation: 3,
            }}>
            <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 12}}>
              {value}
            </Text>
            {placement === 'top' && (
              <View
                style={[
                  {
                    position: 'absolute',
                    alignSelf: 'center',
                    borderLeftWidth: TRIANGLE_SIZE,
                    borderRightWidth: TRIANGLE_SIZE,
                    borderLeftColor: 'transparent',
                    borderRightColor: 'transparent',
                    borderColor: '#541868',
                    top: -TRIANGLE_SIZE,
                    borderBottomWidth: TRIANGLE_SIZE,
                  },
                  {},
                ]}
              />
            )}
            {placement === 'bottom' && (
              <View
                style={{
                  position: 'absolute',
                  alignSelf: 'center',
                  borderLeftWidth: TRIANGLE_SIZE,
                  borderRightWidth: TRIANGLE_SIZE,
                  borderLeftColor: 'transparent',
                  borderRightColor: 'transparent',
                  borderColor: '#541868',
                  bottom: -TRIANGLE_SIZE,
                  borderTopWidth: TRIANGLE_SIZE,
                }}
              />
            )}
          </View>
        </Animated.View>
      </ForeignObject>
    );
  },
);
