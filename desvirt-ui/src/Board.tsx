import React, { useState, useCallback } from 'react';
import { Node } from './Node';
import { NodeWindow } from './NodeWindow';
import styles from './Board.module.css';
import { useDrop } from 'react-dnd';
import { generateXML } from './Export';
import { NodeLinks } from './NodeLinks';

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
  const [scale, setScale] = useState(1);

  const onChangeScale = useCallback(() => {
    const newScale = window.prompt(
      'Set new Scale: 100px = ? meter',
      scale.toString()
    );
    const number = Number.parseFloat(newScale || '');
    if (Number.isNaN(number)) {
      return;
    }
    setScale(number);
  }, [scale]);
  const onSaveXMLClick = useCallback(() => {
    generateXML(nodes, scale);
  }, [nodes, scale]);

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

  const onNewMesh = useCallback(() => {
    const askedWidth = window.prompt('Mesh width in nodes:');
    const askedHeight = window.prompt('Mesh height in nodes:');
    const askedSpace = window.prompt('Space between nodes in meter:');
    const width = Number.parseFloat(askedWidth || '');
    if (Number.isNaN(width)) {
      return;
    }
    const height = Number.parseFloat(askedHeight || '');
    if (Number.isNaN(height)) {
      return;
    }
    const space = Number.parseFloat(askedSpace || '');
    if (Number.isNaN(space)) {
      return;
    }
    // TODO: catch grids bigger than viewport and alter scale
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
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
              xPosition: 300 + (100 / scale) * space * i,
              yPosition: 300 + (100 / scale) * space * j,
            },
          ]);
          return n + 1;
        });
      }
    }
  }, [scale]);

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
        <button className={styles.navButton} onClick={onNewMesh}>
          Create Grid
        </button>
        <button className={styles.navButton} onClick={onSaveXMLClick}>
          Save as XML
        </button>
        <div className={styles.scale} onClick={onChangeScale}>
          {scale} meter
        </div>
      </nav>
      {nodes.map((node, index) => (
        <Node node={node} key={index} setActiveNode={setActiveNode} />
      ))}
      <NodeLinks nodeList={nodes} scale={scale}></NodeLinks>
    </div>
  );
}
