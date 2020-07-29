import React from 'react';
import { type } from 'os';
import { Node } from './Node';
import { NodeWindow } from './NodeWindow';
import styles from './Board.module.css';

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

type Props = {};
type State = {
  nodes: Array<NodeProps>;
  activeNode?: NodeProps;
};

export class Board extends React.Component<Props> {
  state: State = {
    nodes: [],
    // activeNode: {
    //   name: 'Node1',
    //   noisefloor: 2,
    //   sesitivityOffset: 2,
    //   txPower: 2,
    //   temperaturFileneme: '2',
    //   binaryFilename: '2',
    //   xPosition: 2,
    //   yPosition: 2,
    // },
  };
  render() {
    return (
      <div>
        <button className="newNode" onClick={this.onNewNodeClick}>
          New Node
        </button>
        {/* {this.state.nodes.length} */}
        {this.state.nodes.map((node) => (
          <Node node={node} setActiveNode={this.setActiveNode} />
        ))}
        {this.state.activeNode && (
          <EditNodeProperties
            node={this.state.activeNode}
            unsetActiveNode={this.setActiveNode}
            updateNodes={this.updateNodes}
          />
        )}
      </div>
    );
  }
  setActiveNode = (n?: NodeProps) => {
    this.setState({
      activeNode: n,
    });
  };
  updateNodes = (oldNode: NodeProps, newNode?: NodeProps) => {
    const newNodes = this.state.nodes.filter((n) => n !== oldNode);
    if (newNode) {
      newNodes.push(newNode);
    }
    this.setState({ nodes: newNodes, activeNode: undefined });
  };
  onNewNodeClick = () => {
    this.setState({
      nodes: [
        ...this.state.nodes,
        {
          name: 'Node1',
          noisefloor: 2,
          sensitivityOffset: 2,
          txPower: 2,
          temperatureFilename: '2',
          binaryFilename: '2',
          xPosition: 2,
          yPosition: 2,
        },
      ],
    });
  };
}
