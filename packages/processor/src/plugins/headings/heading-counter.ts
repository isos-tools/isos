type HeadingCounter = {
  get: (depth: number) => number;
  getCounts: (depth: number) => number[];
  setCount: (depth: number, value: number) => void;
  increment: (depth: number) => void;
};

export function createHeadingCounter(): HeadingCounter {
  const count = [0, 0, 0, 0, 0, 0];
  let lastDepth = 0;
  return {
    get(depth: number) {
      return count[depth - 1];
    },
    getCounts(depth: number) {
      return count.slice(1, depth);
    },
    setCount(depth: number, value: number) {
      count[depth - 1] = value - 1;
    },
    increment(depth: number) {
      ++count[depth - 1];

      if (depth < lastDepth) {
        count.fill(0, depth, count.length);
      }
      lastDepth = depth;
    },
  };
}
