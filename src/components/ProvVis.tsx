import React, { FC, useState, useEffect } from 'react';
import 'semantic-ui-css/semantic.min.css';
import {
  ProvenanceGraph,
  NodeID,
  Nodes,
  ProvenanceNode,
  isStateNode
} from '@visdesignlab/provenance-lib-core';
import { stratify, HierarchyNode } from 'd3';
import { treeLayout } from '../Utils/TreeLayout';
import translate from '../Utils/translate';
import { NodeGroup } from 'react-move';
import BackboneNode from './BackboneNode';
import Link from './Link';
import { treeColor } from './Styles';
import nodeTransitions from './NodeTransitions';
import linkTransitions from './LinkTransitions';
import { style } from 'typestyle';
import { EventConfig } from '../Utils/EventConfig';

interface ProvVisProps<T, S extends string> {
  graph: ProvenanceGraph<T, S>;
  root: NodeID;
  sideOffset?: number;
  current: NodeID;
  nodeMap: Nodes<T, S>;
  changeCurrent: (id: NodeID) => void;
  gutter?: number;
  backboneGutter?: number;
  verticalSpace?: number;
  regularCircleRadius?: number;
  backboneCircleRadius?: number;
  regularCircleStroke?: number;
  backboneCircleStroke?: number;
  topOffset?: number;
  textSize?: number;
  height?: number;
  width?: number;
  linkWidth?: number;
  duration?: number;
  eventConfig?: EventConfig<S>;
}

export type StratifiedMap<T, S> = { [key: string]: HierarchyNode<ProvenanceNode<T, S>> };
export type StratifiedList<T, S> = HierarchyNode<ProvenanceNode<T, S>>[];

function ProvVis<T, S extends string>({
  nodeMap,
  width = 1500,
  height = 2000,
  root,
  current,
  changeCurrent,
  gutter = 15,
  backboneGutter = 20,
  verticalSpace = 50,
  regularCircleRadius = 4,
  backboneCircleRadius = 5,
  regularCircleStroke = 3,
  backboneCircleStroke = 3,
  sideOffset = 200,
  topOffset = 30,
  textSize = 15,
  linkWidth = 4,
  duration = 600,
  eventConfig
}: ProvVisProps<T, S>) {
  const [first, setFirst] = useState(true);

  useEffect(() => {
    setFirst(false);
  }, []);

  const nodeList = Object.values(nodeMap).filter(
    d => d.metadata.createdOn! >= nodeMap[root].metadata.createdOn!
  );

  const strat = stratify<ProvenanceNode<T, S>>()
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
  const stratifiedList: StratifiedList<T, S> = stratifiedTree.descendants();
  const stratifiedMap: StratifiedMap<T, S> = {};

  stratifiedList.forEach(c => (stratifiedMap[c.id!] = c));
  treeLayout(stratifiedMap, current, root);

  const links = stratifiedTree.links();

  const xOffset = gutter;
  const yOffset = verticalSpace;

  function regularGlyph(node: ProvenanceNode<T, S>) {
    if (eventConfig) {
      const eventType = node.metadata.type;
      if (eventType && eventType in eventConfig && eventType !== 'Root') {
        return eventConfig[eventType].regularGlyph;
      }
    }
    return (
      <circle
        r={regularCircleRadius}
        strokeWidth={regularCircleStroke}
        className={treeColor(false)}
      />
    );
  }

  return (
    <div className={container} id="prov-vis">
      <svg height={height} width={width}>
        <rect height={height} width={width} fill="none" stroke="black" />
        <g transform={translate(width - sideOffset, topOffset)}>
          <NodeGroup
            data={links}
            keyAccessor={link => `${link.source.id}${link.target.id}`}
            {...linkTransitions(xOffset, yOffset, backboneGutter - gutter, duration)}
          >
            {linkArr => (
              <>
                {linkArr.map(link => {
                  const { key, state } = link;

                  return (
                    <g key={key}>
                      <Link {...state} className={treeColor(true)} strokeWidth={linkWidth} />
                    </g>
                  );
                })}
              </>
            )}
          </NodeGroup>
          <NodeGroup
            data={stratifiedList}
            keyAccessor={d => d.id}
            {...nodeTransitions(xOffset, yOffset, backboneGutter - gutter, duration)}
          >
            {nodes => {
              return (
                <>
                  {nodes.map(node => {
                    const { data: d, key, state } = node;
                    return (
                      <g
                        key={key}
                        onClick={() => changeCurrent(d.id)}
                        transform={translate(state.x, state.y)}
                      >
                        {d.width === 0 ? (
                          <BackboneNode
                            textSize={textSize}
                            radius={backboneCircleRadius}
                            strokeWidth={backboneCircleStroke}
                            duration={duration}
                            first={first}
                            current={current === d.id}
                            node={d.data}
                            eventConfig={eventConfig}
                          />
                        ) : (
                          <g onClick={() => changeCurrent(d.id)}>{regularGlyph(d.data)}</g>
                        )}
                      </g>
                    );
                  })}
                </>
              );
            }}
          </NodeGroup>
        </g>
      </svg>
    </div>
  );
}

export default ProvVis;

const container = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'auto'
});
