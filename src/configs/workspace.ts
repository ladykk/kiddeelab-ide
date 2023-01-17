import { BlocklyOptions } from "blockly";

import "@blockly/block-plus-minus";

export const defaultOptions: BlocklyOptions = {
  renderer: "zelos",
  theme: "zelos",
  grid: {
    spacing: 35,
    length: 2,
    colour: "#d1d5db",
    snap: true,
  },
  move: {
    scrollbars: {
      horizontal: true,
      vertical: true,
    },
    drag: true,
    wheel: true,
  },
  zoom: {
    wheel: true,
    controls: true,
    startScale: 0.7,
    maxScale: 2,
    minScale: 0.5,
    scaleSpeed: 1.2,
    pinch: true,
  },
};
