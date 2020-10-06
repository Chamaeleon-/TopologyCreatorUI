import React from 'react';
import { NodeProps } from './Board';
import { isReachable } from './Export';

type Props = {
  nodeList: Array<NodeProps>;
  scale: number;
};

export function NodeLinks({ nodeList, scale }: Props) {
  let svgLines: Array<any> = [];
  nodeList.forEach((node1, i) => {
    nodeList.forEach((node2, j) => {
      if (i !== j && isReachable(node1, node2, scale)) {
        const newLine = (
          <line
            key={node1.name + node2.name}
            x1={node1.xPosition + 10}
            y1={node1.yPosition + 10}
            x2={node2.xPosition + 10}
            y2={node2.yPosition + 10}
            stroke="white"
          />
        );
        svgLines.push(newLine);
      }
    });
  });
  return (
    <svg width="100vw" height="100vh">
      {svgLines.map((line) => line)}
    </svg>
  );
}
