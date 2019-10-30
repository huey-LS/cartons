export function randomCreator (length = 32, radix = 16) {
  return function () {
    return (~~(Math.random() * Math.pow(2, length))).toString(radix);
  }
}

export function incrementCreator (prefix = '') {
  let incrementNumber = 0;
  return function () {
    return prefix + (++incrementNumber);
  }
}

export interface KeyCreator<T = any> {
  (): T
}
