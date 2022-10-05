import React, { useCallback, useState } from 'react';
import { ForeignObject } from 'react-native-svg';
import { Text, View } from 'react-native';

const PADDING = 10;
const TRIANGLE_SIZE = 5;

export const TooltipItem = ({ x, y, currentX, currentY, width, value }) => {
  const [contentSize, setContentSize] = useState(null);
  const [newPosition, setNewPosition] = useState({
    x: currentX,
    y: currentY,
  });
  const [placement, setPlacement] = useState(null);
  const [refreshId, setRefreshId] = useState(Date.now());
  const [opacity, setOpacity] = useState(0);

  const onLayout = useCallback(
    ({ nativeEvent }) => {
      const { width: layoutWidth, height: layoutHeight } = nativeEvent.layout;
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
      const newYPosition = newY < 0 ? currentY + PADDING + TRIANGLE_SIZE : newY;
      setNewPosition({
        x: newXPosition,
        y: newYPosition,
      });
      setRefreshId(Date.now());
      setOpacity(1);
    },
    [x, y, currentX, currentY, width],
  );

  return (
    <ForeignObject key={refreshId} x={newPosition.x} y={newPosition.y}>
      <View
        style={{
          alignSelf: 'center',
          flexDirection: placement === 'top' ? 'column-reverse' : 'column',
          opacity,
        }}
        onLayout={!contentSize && onLayout}>
        <View
          style={{
            backgroundColor: '#541868',
            alignSelf: 'center',
            paddingVertical: 5,
            paddingHorizontal: 10,
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
          <Text style={{ fontSize: 12, color: '#fff', fontWeight: '700' }}>
            {value}
          </Text>
        </View>
        <View
          style={[
            {
              alignSelf: 'center',
              width: 0,
              height: 0,
              borderStyle: 'solid',
              backgroundColor: 'transparent',
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
              borderBottomColor: '#541868',
              borderTopColor: '#541868',
            },
            {
              borderLeftWidth: TRIANGLE_SIZE,
              borderRightWidth: TRIANGLE_SIZE,
            },
            placement === 'top' && {
              borderBottomWidth: TRIANGLE_SIZE,
            },
            placement === 'bottom' && {
              borderTopWidth: TRIANGLE_SIZE,
            },
          ]}
        />
      </View>
    </ForeignObject>
  );
};
