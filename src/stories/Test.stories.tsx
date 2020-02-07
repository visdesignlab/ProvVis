import React, { useState } from 'react';
import { ProvVis } from '../provvis';
import { ProvenanceGraph } from '@visdesignlab/provenance-lib-core';
const prov = require('./provenance.json');

export default { title: 'ProvVis' };

const provenance: ProvenanceGraph<unknown> = prov;

const fauxRoot = Object.keys(provenance.nodes).find(d =>
  provenance.nodes[d].label.includes('initial visible')
)!;

export const basic = () => {
  let [current, setCurrent] = useState(provenance.current);
  return (
    <ProvVis
      width={500}
      height={450}
      sideOffset={350}
      graph={prov}
      root={fauxRoot}
      current={current}
      nodeMap={provenance.nodes}
      changeCurrent={setCurrent}
      gutter={15}
      backboneGutter={40}
      verticalSpace={30}
    />
  );
};
