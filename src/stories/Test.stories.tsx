import React, { FC } from 'react';
import { ProvVis } from '../provvis';
import { ProvenanceGraph, initProvenance, NodeID, StateNode } from '@visdesignlab/provenance-lib-core';
import { Button } from 'semantic-ui-react';
import { inject, observer, Provider } from 'mobx-react';
import { observable } from 'mobx';
import 'semantic-ui-css/semantic.min.css';
import { EventConfig } from '../Utils/EventConfig';
import { BundleMap } from '../Utils/BundleMap';
import { AddTaskGlyph, ChangeTaskGlyph } from './Nodes';

export default { title: 'ProvVis' };

interface Task {
  key: number;
  desc: string;
}

interface DemoState {
  tasks: Task[];
}

interface DemoAnnotation {
  note: string;
}

const defaultState: DemoState = {
  tasks: []
};

type Events = 'Add Task' | 'Change Task';

const prov = initProvenance<DemoState, Events, DemoAnnotation>(defaultState);

class DemoStore {
  @observable graph: ProvenanceGraph<DemoState, Events, DemoAnnotation> = prov.graph();
  @observable tasks: Task[] = defaultState.tasks;
  @observable isRoot: boolean = false;
  @observable isLatest: boolean = false;
}

const store = new DemoStore();

let map:BundleMap;
let idList:string[] = [];

const popup = (node: StateNode<DemoState, Events, DemoAnnotation>) => {

  return <p>{node.id}</p>;
}

const annotiation = (node: StateNode<DemoState, Events, DemoAnnotation>) => {

  // console.log(JSON.parse(JSON.stringify(node)))

  return(
  <g transform='translate(0, 5)'>
    <text x="10" y="35" fontSize="1em">Sample annotation</text>
  </g>)
}

prov.addGlobalObserver(() => {
  const current = prov.current();

  let isRoot = current.id === prov.graph().root;

  store.isRoot = isRoot;
  store.isLatest = prov.current().children.length === 0;

  store.graph = prov.graph();
});

prov.addObserver(['tasks'], (state?: DemoState) => {

  idList.push(prov.graph().current);
  if(idList.length > 30)
  {
    map = {
      [idList[12]]: {
        metadata: idList[12],
        bundleLabel: "Clustering Label",
        bunchedNodes: [idList[10], idList[11]]
      },

      [idList[24]]: {
        metadata: idList[24],
        bundleLabel: "Clustering Label",
        bunchedNodes: [idList[22], idList[23], idList[21]]
      }
    };
  }
  if (state) {

    store.tasks = [...state.tasks];
  }
});

let taskNo: number = 1;

const addTask = (desc: string = 'Random Task') => {
  prov.applyAction(
    `Adding task #: ${taskNo}`,
    (state: DemoState) => {
      state.tasks.push({
        key: taskNo,
        desc
      });
      return state;
    },
    undefined,
    { type: 'Add Task' }
  );

  taskNo++;
};

function updateTask(taskId: number, desc: string = 'Changed String ') {
  prov.applyAction(
    `Changing task #: ${taskId}`,
    (state: DemoState) => {
      const idx = state.tasks.findIndex(d => d.key === taskId);
      if (idx !== -1) {
        state.tasks[idx].desc = desc;
      }
      return state;
    },
    undefined,
    { type: 'Change Task' }
  );
}

const undo = () => prov.goBackOneStep();
const redo = () => prov.goForwardOneStep();
const goToNode = (nodeId: NodeID) => {
  prov.goToNode(nodeId);
};

/////////////////////////////////////////////////////////////////

const eventConfig: EventConfig<Events> = {
  'Add Task': {
    backboneGlyph: <AddTaskGlyph size={14} />,
    currentGlyph: <AddTaskGlyph size={20} />,
    regularGlyph: <AddTaskGlyph size={12} />,
    bundleGlyph:  <AddTaskGlyph size={14} fill={"cornflowerblue"}/>
  },
  'Change Task': {
    backboneGlyph: <ChangeTaskGlyph size={14} />,
    currentGlyph: <ChangeTaskGlyph size={20} />,
    regularGlyph: <ChangeTaskGlyph size={12} />,
    bundleGlyph: <ChangeTaskGlyph size={14} fill={"cornflowerblue"}/>
  }
};

interface Props {
  store?: any;
}

const BaseComponent: FC<Props> = ({ store }: Props) => {
  const { graph, isRoot, isLatest, tasks } = store!;
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
        clusterVerticalSpace={50}
        bundleMap={map}
        clusterLabels={false}
        popupContent={popup}
        annotationHeight={50}
        annotationContent={annotiation}
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
          <Button
            onClick={() => {
              addTask(Math.random().toString());
            }}
          >
            Add Task
          </Button>
        </Button.Group>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>
          {tasks.map((d: any) => {
            return (
              <div key={d.key}>
                {d.key} --- {d.desc}
              </div>
            );
          })}
        </div>
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
  undo();
  undo();
  undo();
  updateTask(1);
  updateTask(12);
  updateTask(14);
};

setupInital();
