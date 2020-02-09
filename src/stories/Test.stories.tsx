import React, { FC } from 'react';
import { ProvVis } from '../provvis';
import { ProvenanceGraph, initProvenance, NodeID } from '@visdesignlab/provenance-lib-core';
import { Button } from 'semantic-ui-react';
import { inject, observer, Provider } from 'mobx-react';
import { observable } from 'mobx';
import 'semantic-ui-css/semantic.min.css';
import { EventConfig } from '../Utils/EventConfig';

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

type Events = 'Add Task';

const prov = initProvenance<DemoState, Events>(defaultState);

class DemoStore {
  @observable graph: ProvenanceGraph<DemoState, Events> = prov.graph();
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
  prov.applyAction(
    `Adding task #: ${taskNo}`,
    (state: DemoState) => {
      state.tasks.push(`Task ${taskNo}`);
      return state;
    },
    undefined,
    { type: 'Add Task' }
  );

  taskNo++;
};

const undo = () => prov.goBackOneStep();
const redo = () => prov.goForwardOneStep();
const goToNode = (nodeId: NodeID) => {
  prov.goToNode(nodeId);
};

const eventConfig: EventConfig<Events> = {
  'Add Task': {
    backboneGlyph: (
      <g>
        <circle r="12" fill="white" stroke="#ccc" strokeWidth="2" />
        <text fontSize="20" dominantBaseline="middle" textAnchor="middle" fill="#ccc">
          A
        </text>
      </g>
    ),
    currentGlyph: (
      <g>
        <circle r="12" fill="white" stroke="#ccc" strokeWidth="2" />
        <text fontSize="20" dominantBaseline="middle" textAnchor="middle" fill="#f00">
          A
        </text>
      </g>
    ),
    regularGlyph: (
      <g>
        <circle r="8" fill="white" stroke="#ccc" strokeWidth="2" />
        <text fontSize="10" dominantBaseline="middle" textAnchor="middle" fill="#ccc">
          A
        </text>
      </g>
    )
  }
};

const BaseComponent: FC<Props> = ({ store }: Props) => {
  const { graph, isRoot, isLatest } = store!;
  const { root, nodes, current } = graph;

  return (
    <>
      <ProvVis
        width={500}
        height={800}
        sideOffset={200}
        graph={graph}
        root={root}
        current={current}
        nodeMap={nodes}
        changeCurrent={goToNode}
        gutter={20}
        backboneGutter={40}
        verticalSpace={50}
        eventConfig={eventConfig}
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
