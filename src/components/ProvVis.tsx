import React, { FC } from 'react';
import 'semantic-ui-css/semantic.min.css';
import {
  ProvenanceGraph,
  NodeID,
  Nodes,
  ProvenanceNode,
  isStateNode
} from '@visdesignlab/provenance-lib-core';
import { stratify, hierarchy, HierarchyNode, tree } from 'd3';
import { treeLayout } from '../Utils/TreeLayout';
import translate from '../Utils/translate';
import { Popup, Card } from 'semantic-ui-react';

interface ProvVisProps {
  graph: ProvenanceGraph<unknown>;
  root: NodeID;
  height?: number;
  width?: number;
  current: NodeID;
  nodeMap: Nodes<unknown>;
  changeCurrent: any;
}

export type StratifiedMap = { [key: string]: HierarchyNode<ProvenanceNode<unknown>> };
export type StratifiedList = HierarchyNode<ProvenanceNode<unknown>>[];

const ProvVis: FC<ProvVisProps> = ({
  nodeMap,
  width = 1500,
  height = 2000,
  root,
  current,
  changeCurrent
}: ProvVisProps) => {
  const nodeList = Object.values(nodeMap).filter(
    d => d.metadata.createdOn! >= nodeMap[root].metadata.createdOn!
  );

  const strat = stratify<ProvenanceNode<unknown>>()
    .id(d => d.id)
    .parentId(d => {
      if (d.id === root) return null;
      if (isStateNode(d)) {
        return d.parent;
      } else {
        return null;
      }
    });

  const stratifiedTree = strat(nodeList);
  const stratifiedList: StratifiedList = stratifiedTree.descendants();
  const stratifiedMap: StratifiedMap = {};

  stratifiedList.forEach(c => (stratifiedMap[c.id!] = c));
  const currentPath = treeLayout(stratifiedMap, stratifiedList, current, root);

  const adjustedWidth = width * 0.8;
  const adjustedHeight = height * 0.8;

  console.log(stratifiedList);

  const links = stratifiedTree.links();

  return (
    <div id="prov-vis">
      <svg height={height} width={width}>
        <rect height={height} width={width} fill="none" stroke="black" />
        <g transform={translate(width / 2, (height - adjustedHeight) / 2)}>
          {stratifiedList.map(d => {
            const temp: any = d;
            return (
              <g key={d.id || ''} transform={translate(-150 * temp.width, 100 * temp.depth)}>
                <Popup
                  content={
                    <div>
                      <p>Width: {temp.width}</p>
                      <p>Depth: {temp.depth}</p>
                      <p>Height: {temp.height}</p>
                      <p>ID: {temp.id}</p>
                      <p>Parent: {temp.parent?.id}</p>
                    </div>
                  }
                  trigger={
                    <g>
                      <circle
                        onClick={() => changeCurrent(d.id)}
                        r="10"
                        fill={currentPath.includes(d.id!) ? 'red' : 'blue'}
                        stroke={d.id! === current ? 'black' : 'none'}
                        strokeWidth={5}
                      />
                      <text textAnchor="middle" transform="rotate(-45)translate(0, 25)">
                        {temp.data.label}
                      </text>
                    </g>
                  }
                ></Popup>
              </g>
            );
          })}{' '}
          {links.map((d: any) => {
            const { source, target } = d;

            return (
              <g key={`${source.id}${target.id}}`}>
                <line
                  x1={-150 * source.width}
                  x2={-150 * target.width}
                  y1={100 * source.depth}
                  y2={100 * target.depth}
                  stroke="black"
                />
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};

export default ProvVis;
