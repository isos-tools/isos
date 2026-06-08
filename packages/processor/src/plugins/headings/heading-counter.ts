export type HeadingCounter = {
  get: (depth: number) => number;
  getCounts: (depth: number) => number[];
  setCount: (depth: number, value: number) => void;
  increment: (depth: number, hasPart?: boolean) => void;
};

export function createHeadingCounter(): HeadingCounter {
  const count = [0, 0, 0, 0, 0, 0];
  let lastDepth = 0;
  return {
    get(depth) {
      return count[depth - 1];
    },
    getCounts(depth) {
      return count.slice(1, depth);
    },
    setCount(depth, value) {
      count[depth - 1] = value - 1;
    },
    increment(depth, hasPart) {
      ++count[depth - 1];

      if (depth < lastDepth) {
        // bit awkward, but quick fix to allow chapters to increment independently of parts
        if (hasPart && depth === 2) {
          count.fill(0, depth + 1, count.length);
        } else {
          count.fill(0, depth, count.length);
        }
      }
      lastDepth = depth;
    },
  };
}
