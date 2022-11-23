export function getPaths(readData) {

  let regionTreeNodePaths = {};
  // console.log('readData in getPaths', readData);
  function traverse(node, path) {
    // console.log('traverse called', node, path);
    if (node.children) {
      node.children.forEach(function (child, idx) {
        regionTreeNodePaths[node.value] = path;
        traverse(child, path.concat([idx]));
      });
    } else {
      regionTreeNodePaths[node.value] = path;
    }
  }
  traverse({children:readData}, []);
  // console.log('regionTreeNodePaths', regionTreeNodePaths);
  return regionTreeNodePaths;
}

export function markDendroDataNode(dendroData, regionTreeNodePaths, regId, checkedStatus) {
  console.log('markDendroDataNode called', regionTreeNodePaths, regId, checkedStatus);
  let path = regionTreeNodePaths[regId];
  let node = dendroData;
  console.log('path', path, 'node', node);
  node = node[path[0]];

  if (path.length>1){
    for (let i = 1; i < path.length; i++) {
      node = node.children[path[i]];
    }
  }
  node.checked = checkedStatus;
  // console.log('dendroData node', node);
  console.log('dendroData updated', dendroData);
  return dendroData;
}
