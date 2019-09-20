export function* combinations<T>(array: T[], r: number): IterableIterator<Array<T>> {
  if (array.length < r || r <= 0) {
    return
  } else if (r === 1) {
    for (const element of array) {
      yield [element]
    }
    return
  }
  const end = array.length - r
  for (let index = 0; index <= end; index++) {
    const prefix: T[] = [array[index]]
    const subarray: T[] = array.slice(index + 1)
    for (const suffix of combinations(subarray, r - 1)) {
      yield prefix.concat(suffix)
    }
  }
}
