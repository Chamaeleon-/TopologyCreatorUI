import React, { useState, useCallback } from 'react';
import { Node } from './Node';
import { NodeWindow } from './NodeWindow';
import styles from './Board.module.css';
import { useDrop } from 'react-dnd';

export type NodeProps = {
  name: string;
  noisefloor: number;
  sensitivityOffset: number;
  txPower: number;
  temperatureFilename: string;
  binaryFilename: string;
  xPosition: number;
  yPosition: number;
};

type DragItem = {
  type: ItemTypes.NODE;
  node: NodeProps;
};

export enum ItemTypes {
  NODE = 'node',
}

export function Board() {
  const [nodes, setNodes] = useState<NodeProps[]>([]);
  const [, setNodeNumber] = useState(0);
  const [activeNode, setActiveNode] = useState<NodeProps>();

  //   const onSaveXMLClick = useCallback();
  const updateNodes = useCallback((oldNode: NodeProps, newNode?: NodeProps) => {
    setNodes((oldNodes) => {
      const newNodes = oldNodes.filter((n) => n !== oldNode);
      if (newNode) newNodes.push(newNode);
      return newNodes;
    });
    setActiveNode(undefined);
  }, []);

  const onNewNodeClick = useCallback(() => {
    setNodeNumber((n) => {
      setNodes((x) => [
        ...x,
        {
          name: 'Node' + n,
          noisefloor: -100,
          sensitivityOffset: 2,
          txPower: 2,
          temperatureFilename: './temp',
          binaryFilename: './gnrc_networking.elf',
          xPosition: 300 + 100 * Math.random(),
          yPosition: 300 + 100 * Math.random(),
        },
      ]);
      return n + 1;
    });
  }, []);

  const [, drop] = useDrop({
    accept: ItemTypes.NODE,
    drop: (item: DragItem, monitor) => {
      const newNode = {
        ...item.node,
        xPosition: monitor.getSourceClientOffset()!.x,
        yPosition: monitor.getSourceClientOffset()!.y,
      };
      updateNodes(item.node, newNode);
    },
  });

  return (
    <div className={styles.board} ref={drop}>
      <div className={styles.sidebox}>
        <h1>TopologyCreator</h1>
        {activeNode && (
          <NodeWindow
            node={activeNode}
            unsetActiveNode={setActiveNode}
            updateNodes={updateNodes}
          />
        )}
      </div>
      <nav className={styles.buttonRow}>
        <button className={styles.navButton} onClick={onNewNodeClick}>
          New Node
        </button>
        <button className={styles.navButton}>Save as XML</button>
      </nav>
      {nodes.map((node, index) => (
        <Node node={node} key={index} setActiveNode={setActiveNode} />
      ))}
    </div>
  );
}
