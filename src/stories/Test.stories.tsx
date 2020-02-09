import React, { FC } from 'react';
import { ProvVis } from '../provvis';
import { ProvenanceGraph, initProvenance, NodeID } from '@visdesignlab/provenance-lib-core';
import { Button } from 'semantic-ui-react';
import { inject, observer, Provider } from 'mobx-react';
import { observable } from 'mobx';
import 'semantic-ui-css/semantic.min.css';

export default { title: 'ProvVis' };

interface Props {
  store?: any;
}

interface DemoState {
  tasks: string[];
}

const defaultState: DemoState = {
  tasks: []
};

const prov = initProvenance<DemoState>(defaultState);

class DemoStore {
  @observable graph: ProvenanceGraph<DemoState> = prov.graph();
  @observable tasks: string[] = [];
  @observable isRoot: boolean = false;
  @observable isLatest: boolean = false;
}

const store = new DemoStore();

prov.addGlobalObserver(() => {
  const current = prov.current();

  let isRoot = current.id === prov.graph().root;

  store.isRoot = isRoot;
  store.isLatest = prov.current().children.length === 0;

  store.graph = prov.graph();
});

prov.addObserver(['tasks'], (state?: DemoState) => {
  if (state) {
    store.tasks = [...state.tasks];
  }
});

let taskNo: number = 1;

const addTask = () => {
  prov.applyAction(`Adding task #: ${taskNo}`, (state: DemoState) => {
    state.tasks.push(`Task ${taskNo}`);
    return state;
  });

  taskNo++;
};

const undo = () => prov.goBackOneStep();
const redo = () => prov.goForwardOneStep();
const goToNode = (nodeId: NodeID) => {
  prov.goToNode(nodeId);
};

const BaseComponent: FC<Props> = ({ store }: Props) => {
  const { graph, isRoot, isLatest } = store!;
  const { root, nodes, current } = graph;

  return (
    <>
      <ProvVis
        width={500}
        height={450}
        sideOffset={350}
        graph={graph}
        root={root}
        current={current}
        nodeMap={nodes}
        changeCurrent={goToNode}
        gutter={15}
        backboneGutter={40}
        verticalSpace={30}
      />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Button.Group>
          <Button disabled={isRoot} onClick={undo}>
            Undo
          </Button>
          <Button.Or></Button.Or>
          <Button disabled={isLatest} onClick={redo}>
            Redo
          </Button>
          <Button.Or></Button.Or>
          <Button onClick={addTask}>Add Task</Button>
        </Button.Group>
      </div>
    </>
  );
};

const BaseComponentWithStore = inject('store')(observer(BaseComponent));

const _DemoComponent: FC = () => {
  return (
    <Provider store={store}>
      <BaseComponentWithStore></BaseComponentWithStore>
    </Provider>
  );
};

export const DemoComponent = () => <_DemoComponent />;

const setupInital = () => {
  addTask();
  addTask();
  addTask();
  undo();
  undo();
  addTask();
  addTask();
  undo();
  undo();
  addTask();
  addTask();
  addTask();
  addTask();
  addTask();
  addTask();
  undo();
  undo();
  undo();
  undo();
  undo();
  addTask();
  addTask();
  addTask();
  addTask();
  addTask();
  addTask();
};

setupInital();
