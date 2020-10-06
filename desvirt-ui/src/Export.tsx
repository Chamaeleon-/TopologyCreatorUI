import { NodeProps } from './Board';
import prettier from 'prettier/standalone';
// @ts-ignore
import prettierXML from '@prettier/plugin-xml';

function distance(node1: NodeProps, node2: NodeProps, scale: number) {
  return (
    (Math.sqrt(
      (node1.xPosition - node2.xPosition) ** 2 +
        (node1.yPosition - node2.yPosition) ** 2
    ) *
      scale) /
    100
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
  const xmlDoctype: string = '<?xml version="1.0" encoding="UTF-8"?>';
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
  nodeList.forEach((node) => {
    const newNode = doc.createElement('node');
    newNode.setAttribute('binary', node.binaryFilename);
    newNode.setAttribute('name', node.name);
    newNode.setAttribute('type', 'riot_native');
    nodes.appendChild(newNode);
  });
  net.appendChild(nodes);
  const links = doc.createElement('links');
  // create links here
  nodeList.forEach((node1, i) => {
    nodeList.forEach((node2, j) => {
      if (i !== j && isReachable(node1, node2, scale)) {
        const newLink = doc.createElement('link');
        newLink.setAttribute('from_node', node1.name);
        newLink.setAttribute('from_if', 'cc2420');
        newLink.setAttribute('to_node', node2.name);
        newLink.setAttribute('to_if', 'cc2420');
        newLink.setAttribute(
          'distance',
          distance(node1, node2, scale).toFixed(3)
        );
        newLink.setAttribute('noise_floor', node2.noisefloor.toString());
        newLink.setAttribute(
          'sensitivity_offset',
          node2.sensitivityOffset.toString()
        );
        newLink.setAttribute('tx_power', node1.txPower.toString());
        newLink.setAttribute('temperatureFile', node2.temperatureFilename);
        newLink.setAttribute('loss', '0');
        newLink.setAttribute('uni', 'true');
        links.appendChild(newLink);
      }
    });
  });
  net.appendChild(links);
  topology.appendChild(net);
  doc.appendChild(topology);
  const xmlOutput = `${xmlDoctype} ${doc.documentElement.outerHTML}`;
  // @ts-ignore
  const formattedXml = prettier.format(xmlOutput, {
    parser: 'xml',
    plugins: [prettierXML],
  });
  console.log(formattedXml);
  save('newTopo.xml', formattedXml);
}

function save(filename: string, data: string) {
  var blob = new Blob([data], { type: 'text/xml' });
  var elem = window.document.createElement('a');
  elem.href = window.URL.createObjectURL(blob);
  elem.download = filename;
  document.body.appendChild(elem);
  elem.click();
  document.body.removeChild(elem);
}
