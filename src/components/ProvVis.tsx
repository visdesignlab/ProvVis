import React, { FC } from 'react';
import 'semantic-ui-css/semantic.min.css';
import {
  ProvenanceGraph,
  NodeID,
  Nodes,
  ProvenanceNode,
  isStateNode
} from '@visdesignlab/provenance-lib-core';
import translate from '../Utils/translate';
import { stratify, hierarchy } from 'd3';

interface ProvVisProps {
  graph: ProvenanceGraph<unknown>;
  root: NodeID;
  height?: number;
  width?: number;
  current: NodeID;
  nodeMap: Nodes<unknown>;
}

const ProvVis: FC<ProvVisProps> = ({
  nodeMap,
  width = 500,
  height = 600,
  root,
  current
}: ProvVisProps) => {
  const nodes: ProvenanceNode<unknown>[] = [];

  let travellingNode = current;

  while (travellingNode !== root) {
    const node = nodeMap[travellingNode];
    nodes.push(node);
    if (isStateNode(node)) {
      travellingNode = node.parent;
    }
  }

  nodes.push(nodeMap[root]);

  nodes.reverse();

  const nodeList = Object.values(nodeMap).filter(
    d => d.metadata.createdOn! >= nodeMap[root].metadata.createdOn!
  );

  const strat = stratify()
    .id((d: any) => d.id)
    .parentId((d: any) => {
      if (d.id === root) return null;
      return d.parent ? d.parent : null;
    });

  let rootNode = strat(nodeList);

  let heirarchicalRootNode = hierarchy(rootNode, d => d.children);

  console.log(rootNode, heirarchicalRootNode, root);

  const ht = (nodes.length + 1) * 30;

  return (
    <div id="prov-vis">
      <svg height={ht} width={width}>
        <rect height={ht} width={width} fill="none" stroke="black" />
        {nodes.map((node, idx) => {
          return (
            <text
              key={node.id}
              transform={translate(0, 30 * (idx + 1))}
              style={{ fontWeight: node.id === current ? 'bold' : 'initial' }}
            >
              {node.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

export default ProvVis;
