import { NodeProps } from './Board';
import { Interface } from 'readline';

function distance(node1: NodeProps, node2: NodeProps, scale: number) {
  return (
    Math.sqrt(
      (node1.xPosition - node2.xPosition) ** 2 +
        (node1.yPosition - node2.yPosition) ** 2
    ) * scale
  );
}

function calculateBer(node1: NodeProps, node2: NodeProps, scale: number) {
  const frequence: number = 2440; // in MHz
  const maxTemperaturSignalOffset: number = 1; // in dB
  const fspl: number =
    20 * Math.log10(distance(node1, node2, scale)) +
    20 * Math.log10(frequence) -
    27.55;
  const snr: number =
    node1.txPower + maxTemperaturSignalOffset - fspl - node2.noisefloor;
  return Math.exp(-0.6 * (snr + 0.5));
}

export const isReachable = (
  node1: NodeProps,
  node2: NodeProps,
  scale: number
) => calculateBer(node1, node2, scale) < 1;

export function generateXML(nodeList: Array<NodeProps>, scale: number) {
  const doc = document.implementation.createDocument('', '', null);
  const topology = doc.createElement('topology');
  topology.setAttribute('version', '1');
  const net = doc.createElement('net');
  net.setAttribute('description', 'ui created');
  net.setAttribute('name', 'newTopo');
  const nodeTypes = doc.createElement('nodeTypes');
  const nodeType = doc.createElement('nodeType');
  nodeType.setAttribute('name', 'riot_native');
  const interfaces = doc.createElement('interfaces');
  const interface_variant = doc.createElement('interface');
  interface_variant.setAttribute('name', 'cc2420');
  interface_variant.setAttribute('type', '802.15.4');
  interfaces.appendChild(interface_variant);
  nodeType.appendChild(interfaces);
  nodeTypes.appendChild(nodeType);
  net.appendChild(nodeTypes);
  const nodes = doc.createElement('nodes');
  // create nodes here
  net.appendChild(nodes);
  const links = doc.createElement('links');
  // create links here
  net.appendChild(links);
  topology.appendChild(net);
  doc.appendChild(topology);
  console.log(doc.documentElement.outerHTML);
}
