import { getX } from './LinkTransitions';
import { StratifiedList } from './ProvVis';

export default function nodeTransitions(
  xOffset: number,
  yOffset: number,
  clusterOffset: number,
  backboneOffset: number,
  duration: number = 500,
  nodeList: any[],
  clusteredList: string[]
) {
  xOffset = -xOffset;
  backboneOffset = -backboneOffset;
  const start = () => {
    return { x: 0, y: 0, opacity: 0 };
  };

  const enter = (data: any) => {
    let clusteredNodesInFront = 0;

    for (let i = 0; i < nodeList.length; i++) {
      if (
        data.width == 0 &&
        nodeList[i].width == 0 &&
        nodeList[i].depth <= data.depth &&
        clusteredList.includes(nodeList[i].id)
      ) {
        clusteredNodesInFront++;
      }
    }

    const x = getX(data.width, xOffset, backboneOffset);

    clusteredNodesInFront =
      clusteredNodesInFront == 0 ? clusteredNodesInFront : clusteredNodesInFront - 1;

    let y = yOffset * data.depth - (yOffset - clusterOffset) * clusteredNodesInFront;

    return {
      x: [x],
      y: [y],
      opactiy: 1,
      timing: { duration }
    };
  };

  const update = (data: any) => {
    let clusteredNodesInFront = 0;

    for (let i = 0; i < nodeList.length; i++) {
      if (
        data.width == 0 &&
        nodeList[i].width == 0 &&
        nodeList[i].depth <= data.depth &&
        clusteredList.includes(nodeList[i].id)
      ) {
        clusteredNodesInFront++;
      }
    }

    const x = getX(data.width, xOffset, backboneOffset);

    clusteredNodesInFront =
      clusteredNodesInFront == 0 ? clusteredNodesInFront : clusteredNodesInFront - 1;

    let y = yOffset * data.depth - (yOffset - clusterOffset) * clusteredNodesInFront;

    return {
      x: [x],
      y: [y],
      opactiy: 1,
      timing: { duration }
    };
  };

  return { enter, leave: start, update, start };
}
