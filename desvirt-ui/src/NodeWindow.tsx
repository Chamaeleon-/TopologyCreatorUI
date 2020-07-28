import React from 'react';
import { NodeProps } from './Board';
import { isNumber } from 'util';

type Props = {
  node: NodeProps;
  unsetActiveNode: (n?: NodeProps) => void;
  updateNodes: (oldNode: NodeProps, newNode?: NodeProps) => void;
};

type State = Omit<NodeProps, 'xPosition' | 'yPosition'>;

export class EditNodeProperties extends React.Component<Props> {
  state = {
    name: this.props.node.name,
    noisefloor: this.props.node.noisefloor,
    sensitivityOffset: this.props.node.sensitivityOffset,
    txPower: this.props.node.txPower,
    temperatureFilename: this.props.node.temperatureFilename,
    binaryFilename: this.props.node.binaryFilename,
  };

  setNumberstate = (
    key: 'noisefloor' | 'sensitivityOffset' | 'txPower',
    input: string
  ) => {
    const number = Number.parseInt(input);
    if (Number.isNaN(number)) {
      return;
    }
    this.setState({ [key]: number });
  };
  handleSubmit = (event: React.FormEvent) => {
    const newNode = {
      ...this.state,
      xPosition: this.props.node.xPosition,
      yPosition: this.props.node.yPosition,
    };
    this.props.updateNodes(this.props.node, newNode);
    event.preventDefault();
  };

  render() {
    return (
      <div>
        <h3>Node: {this.state.name}</h3>
        <form onSubmit={this.handleSubmit}>
          <label>
            Choose new Name:
            <input
              type="text"
              value={this.state.name}
              onChange={(e) => this.setState({ name: e.target.value })}
            />
          </label>
          <label>
            Noisefloor:
            <input
              type="number"
              value={this.state.noisefloor}
              onChange={(e) =>
                this.setNumberstate('noisefloor', e.target.value)
              }
            />
          </label>
          <label>
            Sensitivity Offset:
            <input
              type="number"
              value={this.state.sensitivityOffset}
              onChange={(e) =>
                this.setNumberstate('sensitivityOffset', e.target.value)
              }
            />
          </label>
          <label>
            Tx Power:
            <input
              type="number"
              value={this.state.txPower}
              onChange={(e) => this.setNumberstate('txPower', e.target.value)}
            />
          </label>
          <label>
            Choose Temperature Filename:
            <input
              type="text"
              value={this.state.temperatureFilename}
              onChange={(e) =>
                this.setState({ temperatureFilename: e.target.value })
              }
            />
          </label>
          <label>
            Choose Binary Filename:
            <input
              type="text"
              value={this.state.binaryFilename}
              onChange={(e) =>
                this.setState({ binaryFilename: e.target.value })
              }
            />
          </label>
          <input type="submit" value="Submit" />
          <input
            type="button"
            value="Cancel"
            onClick={() => this.props.unsetActiveNode()}
          />
        </form>
      </div>
    );
  }
}
