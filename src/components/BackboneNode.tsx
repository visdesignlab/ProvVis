import React, { FC } from 'react';
import translate from '../Utils/translate';
import { ProvenanceNode } from '@visdesignlab/provenance-lib-core';
import { treeColor } from './Styles';
import { Animate } from 'react-move';
import { EventConfig } from '../Utils/EventConfig';
import { BundleMap } from '../Utils/BundleMap';
import  findBackboneBundleNodes  from '../Utils/findBackboneBundleNodes';

interface BackboneNodeProps<T, S extends string, A> {
  first: boolean;
  current: boolean;
  duration: number;
  node: ProvenanceNode<T, S, A>;
  radius: number;
  strokeWidth: number;
  textSize: number;
  nodeMap:any,
  bundleMap?:BundleMap
  clusterLabels:boolean;
  eventConfig?: EventConfig<S>;
}

function BackboneNode<T, S extends string, A>({
  first,
  current,
  node,
  duration,
  radius,
  strokeWidth,
  textSize,
  nodeMap,
  bundleMap,
  clusterLabels,
  eventConfig
}: BackboneNodeProps<T, S, A>) {
  const padding = 15;

  let glyph = <circle className={treeColor(current)} r={radius} strokeWidth={strokeWidth} />;

  let backboneBundleNodes = findBackboneBundleNodes(nodeMap, bundleMap)

  if (eventConfig) {
    const eventType = node.metadata.type;
    if (eventType && eventType in eventConfig && eventType !== 'Root') {
      const { bundleGlyph, currentGlyph, backboneGlyph } = eventConfig[eventType];
      if(backboneBundleNodes.includes(node.id))
      {
        glyph = <g fontWeight={'none'}>{bundleGlyph}</g>
      }
      else if(current)
      {
        glyph = <g fontWeight={'bold'}>{currentGlyph}</g>
      }
      else{
        glyph = <g fontWeight={'none'}>{backboneGlyph}</g>
      }
    }
  }

  let label = '';

  if(bundleMap && Object.keys(bundleMap).includes(node.id) && clusterLabels)
  {
    label = bundleMap[node.id].bundleLabel;
  }
  else if(!backboneBundleNodes.includes(node.id) || !clusterLabels)
  {
    label = node.label;
  }

  return (
    <Animate
      start={{ opacity: 0 }}
      enter={{ opacity: [1], timing: { duration: 100, delay: first ? 0 : duration } }}
    >
      {state => (
        <>
          {glyph}
          <g style={{ opacity: state.opacity }} transform={translate(padding, 0)}>
            <Label
              label={label}
              dominantBaseline="middle"
              textAnchor="start"
              fontSize={textSize}
              fontWeight={current ? 'bold' : 'regular'}
            />
          </g>
        </>
      )}
    </Animate>
  );
}

export default BackboneNode;

const Label: FC<{ label: string } & React.SVGProps<SVGTextElement>> = (props: {
  label: string;
}) => {
  return <text {...props}>{props.label}</text>;
};
