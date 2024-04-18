import { describe, expect, it } from "vitest";
import { degreeToAngle, getRightAngleSides, measureRectangle } from "../../packages/core/src";

describe("degree to angle", () => {
  it("should convert to angle", () => {
    expect(degreeToAngle(90)).toBe(Math.PI / 2);
  });
});

describe("get right angle sides", () => {
  it("should get right angle sides", () => {
    expect(getRightAngleSides(1, 45)).toEqual(
      {
        side1: 0.7071067811865476,
        side2: 0.7071067811865475,
      },
    );
  });
});

describe("measure reactangle", () => {
  it("should measure rectangle", () => {
    expect(measureRectangle(1, 1, 45)).toEqual(
      {
        h: 1.414213562373095,
        w: 1.414213562373095,
      },
    );
  });
});
