export function randomCreator (length = 32, radix = 16) {
  return function () {
    return parseInt(Math.random() * Math.pow(2, length), 10).toString(radix);
  }
}

export function incrementCreator (prefix = '') {
  let incrementNumber = 0;
  return function () {
    return prefix + (++incrementNumber);
  }
}