import { expect, test } from "vitest";
import { saltate } from "../utils/models/ripples/lib";

const h = [0, 1, 1, 1];
const l = 1;
const b = 1;
const nx = h.length;

const { h: saltated0 } = saltate(h, l, b, nx);

test("Saltate step matches manual math", () => {
  expect(saltated0).toEqual([0, 1.1, 0.9, 1]);
});
