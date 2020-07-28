import React from 'react';
import { Board, NodeProps } from './Board';
import styles from './Node.module.css';

type Props = {
  node: NodeProps;
  setActiveNode: (n?: NodeProps) => void;
};
export class Node extends React.Component<Props> {
  render() {
    return (
      <div
        className={styles.node}
        onClick={this.onClick}
        onMouseOver={this.onMouseOver}
      ></div>
    );
  }
  onMouseOver = () => {
    // TODO show name
  };
  onClick = () => {
    //open node window
    this.props.setActiveNode(this.props.node);
  };
}
