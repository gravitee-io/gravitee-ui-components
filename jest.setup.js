import { jest } from '@jest/globals';

// Mock Popper.js as there is no need to have it
jest.mock('@popperjs/core');

document.createRange = () => {
  const range = new Range();

  range.getBoundingClientRect = jest.fn();

  range.getClientRects = () => {
    return {
      item: () => null,
      length: 0,
      [Symbol.iterator]: jest.fn(),
    };
  };

  return range;
};
