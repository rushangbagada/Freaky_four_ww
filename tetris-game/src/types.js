export const Block = {
  I: 'I',
  J: 'J',
  L: 'L',
  O: 'O',
  S: 'S',
  T: 'T',
  Z: 'Z',
};

export const EmptyCell = {
  Empty: 'Empty',
  Ghost: 'Ghost',
};

// Game statistics
export const GameStats = {
  LINES_PER_LEVEL: 10,
  MAX_LEVEL: 20,
  BASE_SCORE: {
    SINGLE: 40,
    DOUBLE: 100,
    TRIPLE: 300,
    TETRIS: 1200,
  },
};

export const SHAPES = {
  I: {
    shape: [
      [false, false, false, false],
      [false, false, false, false],
      [true, true, true, true],
      [false, false, false, false],
    ],
  },
  J: {
    shape: [
      [false, false, false],
      [true, false, false],
      [true, true, true],
    ],
  },
  L: {
    shape: [
      [false, false, false],
      [false, false, true],
      [true, true, true],
    ],
  },
  O: {
    shape: [
      [true, true],
      [true, true],
    ],
  },
  S: {
    shape: [
      [false, false, false],
      [false, true, true],
      [true, true, false],
    ],
  },
  T: {
    shape: [
      [false, false, false],
      [false, true, false],
      [true, true, true],
    ],
  },
  Z: {
    shape: [
      [false, false, false],
      [true, true, false],
      [false, true, true],
    ],
  },
};
