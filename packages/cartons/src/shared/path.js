export function splitPath (path) {
  let pathArray = [];
  if (Array.isArray(path)) {
    pathArray = path;
  } else if ('string' === typeof path) {
    pathArray = path.split('.');
  }
  return pathArray;
}

export function checkPathIsArray (path) {
  let reg = /^(\w+)\[([0-9]+)\]$/;
  let result = reg.exec(path);
  if (result) {
    return {
      index: parseInt(result[2]),
      key: result[1],
      type: 'array'
    }
  }
}

export function formatPath (
  path
) {
  return splitPath(path)
    .map((path) => {
      let arrayPath;
      if (arrayPath = checkPathIsArray(path)) {
        return arrayPath;
      } else {
        return {
          type: 'object',
          key: path
        }
      }
    });
}

export function getDataWithPath (path, data) {
  let pathArray = formatPath(path);
  let next = data;
  return pathArray.reduce((next, path) => {
    if (
      'undefined' === typeof next
      || null === next
    ) return next;
    if (path.type === 'array') {
      let index = path.index;
      return (next[path.key] || [])[index];
    } else {
      return next[path.key];
    }
  }, next);
}
