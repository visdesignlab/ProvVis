import { getX } from './LinkTransitions';
import { BundleMap } from '../Utils/BundleMap';
import { StratifiedMap } from './ProvVis';


export default function bundleTransitions(
  xOffset: number,
  yOffset: number,
  clusterOffset:number,
  backboneOffset: number,
  duration: number = 500,
  stratifiedMap:any,
  nodeList:any[],
  clusteredList:string[],
  bundleMap?:BundleMap
) {

  xOffset = -xOffset;
  backboneOffset = -backboneOffset;
  const start = () => {
    return { x: 0, y: 0, opacity: 0 };
  };

  const enter = (data: any) => {
    let clusteredNodesInFront = 0;

    const x = getX(stratifiedMap[data].width, xOffset, backboneOffset);

    let highestDepth = stratifiedMap[data].depth;

    if(bundleMap)
    {
      for(let i = 0; i < bundleMap[data].bunchedNodes.length; i++)
      {
        if(stratifiedMap[bundleMap[data].bunchedNodes[i]].depth < highestDepth)
        {
          highestDepth = stratifiedMap[bundleMap[data].bunchedNodes[i]].depth;
        }
      }

      let node = stratifiedMap[data];

      for(let i = 0; i < nodeList.length; i++)
      {
        if(node.width == 0
          && nodeList[i].width == 0
          && nodeList[i].depth <= highestDepth
          && clusteredList.includes(nodeList[i].id))
        {
          clusteredNodesInFront++;
        }
      }
    }

    clusteredNodesInFront = clusteredNodesInFront == 0 ? clusteredNodesInFront : clusteredNodesInFront - 1

    let y = yOffset * highestDepth - ((yOffset - clusterOffset) * clusteredNodesInFront);


    return {
      x: [x],
      y: [y],
      opactiy: 1,
      timing: { duration }
    };
  };

  const update = (data: any) => {
    let clusteredNodesInFront = 0;

    const x = getX(stratifiedMap[data].width, xOffset, backboneOffset);

    let highestDepth = stratifiedMap[data].depth;

    if(bundleMap)
    {
      for(let i = 0; i < bundleMap[data].bunchedNodes.length; i++)
      {
        if(stratifiedMap[bundleMap[data].bunchedNodes[i]].depth < highestDepth)
        {
          highestDepth = stratifiedMap[bundleMap[data].bunchedNodes[i]].depth;
        }
      }

      let node = stratifiedMap[data];

      for(let i = 0; i < nodeList.length; i++)
      {
        if(node.width == 0
          && nodeList[i].width == 0
          && nodeList[i].depth <= highestDepth
          && clusteredList.includes(nodeList[i].id))
        {
          clusteredNodesInFront++;
        }
      }
    }

    clusteredNodesInFront = clusteredNodesInFront == 0 ? clusteredNodesInFront : clusteredNodesInFront - 1

    let y = yOffset * highestDepth - ((yOffset - clusterOffset) * clusteredNodesInFront);


    return {
      x: [x],
      y: [y],
      opactiy: 1,
      timing: { duration }
    };
  };

  return { enter, leave: start, update, start };
}
