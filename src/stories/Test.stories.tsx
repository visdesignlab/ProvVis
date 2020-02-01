import React from 'react';
import { ProvVis } from '../provvis';
import { ProvenanceGraph } from '@visdesignlab/provenance-lib-core';
const prov = require('./provenance.json');

export default { title: 'ProvVis' };

const provenance: ProvenanceGraph<unknown> = prov;

const fauxRoot = Object.keys(provenance.nodes).find(d =>
  provenance.nodes[d].label.includes('initial visible')
)!;

export const basic = () => (
  <ProvVis graph={prov} root={fauxRoot} current={provenance.current} nodeMap={provenance.nodes} />
);
