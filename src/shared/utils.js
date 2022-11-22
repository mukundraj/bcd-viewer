
export function getPaths(readData) {

  let regionTreeNodePaths = {};
  // console.log('readData in getPaths', readData);
  function traverse(node, path) {
    // console.log('traverse called', node, path);
    if (node.children) {
      node.children.forEach(function (child, idx) {
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
  
