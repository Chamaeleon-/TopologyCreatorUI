import React, { useCallback } from 'react';
import { NodeProps, ItemTypes } from './Board';
import styles from './Node.module.css';
import { useDrag } from 'react-dnd';

type Props = {
  node: NodeProps;
  setActiveNode: (n?: NodeProps) => void;
};
export function Node({ node, setActiveNode }: Props) {
  const onClick = useCallback(() => setActiveNode(node), [node, setActiveNode]);
  const [{ isDragging }, drag] = useDrag({
    item: { type: ItemTypes.NODE, node },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const diffPosition = {
    opacity: isDragging ? 0.5 : 1,
    cursor: 'move',
    left: `${node.xPosition}px`,
    top: `${node.yPosition}px`,
  };

  return (
    <div
      className={styles.node}
      onClick={onClick}
      ref={drag}
      style={diffPosition}
    >
      <span className={styles.tooltiptext}>{node.name}</span>
    </div>
  );
}
