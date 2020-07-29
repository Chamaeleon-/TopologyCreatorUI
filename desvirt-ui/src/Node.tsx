import React, { useCallback } from 'react';
import { NodeProps } from './Board';
import styles from './Node.module.css';

type Props = {
  node: NodeProps;
  setActiveNode: (n?: NodeProps) => void;
};
export function Node({ node, setActiveNode }: Props) {
  const onClick = useCallback(() => setActiveNode(node), [node, setActiveNode]);
  const diffPosition = {
    left: `${node.xPosition}px`,
    top: `${node.yPosition}px`,
  };
  return (
    <div className={styles.node} onClick={onClick} style={diffPosition}>
      <span className={styles.tooltiptext}>{node.name}</span>
    </div>
  );
}
