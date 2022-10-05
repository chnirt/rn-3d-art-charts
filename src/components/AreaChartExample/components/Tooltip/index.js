import React from 'react';
import { TooltipItem } from '../TooltipItem';

export const Tooltip = ({ x, y, selectedIndex, data, barData, width }) => {
  return [...(barData ? barData : data)].map((item, vi) => {
    const isSelected = selectedIndex === vi;
    if (!isSelected) {
      return null;
    }
    const currentX = x(vi);
    const currentY = y(item);
    return (
      <TooltipItem
        key={`tooltip-item-${vi}`}
        isSelected={isSelected}
        x={x}
        y={y}
        currentX={currentX}
        currentY={currentY}
        width={width}
        value={item}
      />
    );
  });
};
