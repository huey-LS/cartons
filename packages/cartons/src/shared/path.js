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

export function formatPath (path) {
  return splitPath(path)
    .map((path) => {
      let arrayPath;
      if (arrayPath = checkPathIsArray(path)) {
        return arrayPath;
      } else {
        return {
          key: path
        }
      }
    });
}

// export function concatPath (path, ...otherPath) {
//   return splitPath(path).concat(otherPath).join('.');
// }

// export function stringifyPath (pathArray) {
//   if (!Array.isArray(pathArray)) return '';
//   return pathArray.reduce((path, p) => (
//     `${path ? `${path}.` : ''}${p.key}${p.type === 'array' ? `[${p.index}]` : ''}`
//   ), '')
// }

export function getDataWithPath (path, data) {
  let pathArray = formatPath(path);
  let next = data;
  return pathArray.reduce((next, path) => {
    if (
      'undefined' === typeof next
      || null === next
    ) return next;
    if (path.type === 'array') {
      return (next[path.key] || [])[path.index];
    } else {
      return next[path.key];
    }
  }, next);
}
