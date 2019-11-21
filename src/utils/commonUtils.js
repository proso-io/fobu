const ID_DELIMITER = '-';
/*
  if returnParent is true, getBlock returns the parent of matched block.
*/
export function getBlock(schema, blockId, parentId, returnParent) {
  if (!blockId) {
    return schema;
  }

  let id,
    idArr = blockId.split(ID_DELIMITER),
    children = schema.children;
  if (parentId) {
    id = `${parentId}${ID_DELIMITER}${idArr[0]}`;
  } else {
    id = idArr[0];
  }
  for (var i = 0; i < children.length; i++) {
    if (children[i].id === id) {
      if (idArr.length === 1) {
        return returnParent ? schema : children[i];
      } else {
        idArr.shift();
        return getBlock(
          children[i],
          idArr.join(ID_DELIMITER),
          id,
          returnParent
        );
      }
    }
  }
}
