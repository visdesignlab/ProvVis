import React, { useState } from 'react';
import { ProvVis } from '../provvis';
import { ProvenanceGraph } from '@visdesignlab/provenance-lib-core';
const prov = require('./provenance.json');

export default { title: 'ProvVis' };

const provenance: ProvenanceGraph<unknown> = prov;

const fauxRoot = Object.keys(provenance.nodes).find(d =>
  provenance.nodes[d].label.includes('initial visible')
)!;

// provenance.current = '4bf77c2e-ac50-4b6d-b879-93c722eb67f2';
// provenance.current = '4bf77c2e-ac50-4b6d-b879-93c722eb67f2';
// provenance.current = '247f3360-0c79-4ee9-811d-c9e05be285eb';

export const basic = () => {
  let [current, setCurrent] = useState(provenance.current);
  return (
    <ProvVis
      graph={prov}
      root={fauxRoot}
      current={current}
      nodeMap={provenance.nodes}
      changeCurrent={setCurrent}
    />
  );
};
