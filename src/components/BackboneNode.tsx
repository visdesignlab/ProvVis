import React, { FC } from 'react';
import translate from '../Utils/translate';
import { ProvenanceNode } from '@visdesignlab/provenance-lib-core';
import { treeColor } from './Styles';
import { Animate } from 'react-move';
import { EventConfig } from '../Utils/EventConfig';

interface BackboneNodeProps<T, S extends string> {
  first: boolean;
  current: boolean;
  duration: number;
  node: ProvenanceNode<T, S>;
  radius: number;
  strokeWidth: number;
  textSize: number;
  eventConfig?: EventConfig<S>;
}

function BackboneNode<T, S extends string>({
  first,
  current,
  node,
  duration,
  radius,
  strokeWidth,
  textSize,
  eventConfig
}: BackboneNodeProps<T, S>) {
  const padding = 15;

  let glyph = <circle className={treeColor(current)} r={radius} strokeWidth={strokeWidth} />;

  if (eventConfig) {
    const eventType = node.metadata.type;
    if (eventType && eventType in eventConfig && eventType !== 'Root') {
      const { currentGlyph, backboneGlyph } = eventConfig[eventType];
      glyph = (
        <g fontWeight={current ? 'bold' : 'none'}>{current ? currentGlyph : backboneGlyph}</g>
      );
    }
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
              label={node.label}
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
