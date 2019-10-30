export function splitPath (path: string) {
  let pathArray: string[] = [];
  if (Array.isArray(path)) {
    pathArray = path;
  } else if ('string' === typeof path) {
    pathArray = path.split('.');
  }
  return pathArray;
}

export function formatPathIfArray (
  path: string
): DataPath|undefined {
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
  path: string
): DataPath[] {
  return splitPath(path)
    .map((path) => {
      let arrayPath = formatPathIfArray(path);
      if (arrayPath) {
        return arrayPath;
      } else {
        return {
          type: 'object',
          key: path
        }
      }
    });
}

export function getPathData (
  data: any,
  path: string
) {
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


export function getNewParentPathData (
  data: any,
  path: string
) {
  let pathArray = formatPath(path);

  let newProperties;
  if (Array.isArray(data)) {
    newProperties = data.slice(0);
  } else {
    newProperties = Object.assign({}, data);
  }
  let current = newProperties;
  let key;

  for (let i = 0, len = pathArray.length; i < len; i++) {
    const path = pathArray[i];
    key = path.key;
    if (path.type === 'array') {
      // next to next
      if ('undefined' === typeof current[key]) {
        current[key] = [];
      } else {
        current[key] = current[key].slice(0);
      }
      current = current[key];
      key = path.index;
    }

    let oldNextValue = current[key];
    let next;

    if (Array.isArray(oldNextValue)) {
      next = oldNextValue.slice(0);
    } else if ('object' === typeof oldNextValue ) {
      next = Object.assign({}, oldNextValue);
    } else if ('undefined' === typeof oldNextValue) {
      next = {};
    } else {
      next = oldNextValue;
    }

    current[key] = next;
    if (i < len - 1) {
      current = next;
    }
  }

  return [
    newProperties,
    current,
    key
  ];
}

interface ArrayDataPath {
  type: 'array',
  key: string,
  index: number
}

interface ObjectDataPath {
  type: 'object',
  key: string
}

type DataPath = ArrayDataPath | ObjectDataPath;
