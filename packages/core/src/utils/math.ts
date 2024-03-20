import { makeDestructurable } from "@bernankez/utils";

export function degreeToAngle(degree: number) {
  return degree * Math.PI / 180;
}

export function getRightAngleSides(hypotenuseLength: number, degree: number) {
  const side1 = hypotenuseLength * Math.cos(degreeToAngle(degree)); // 对边
  const side2 = hypotenuseLength * Math.sin(degreeToAngle(degree)); // 邻边
  return [side1, side2];
}

export function measureRectangle(width: number, height: number, degree: number) {
  degree = degree % 180;
  const [h1, w2] = getRightAngleSides(width, degree);
  const [w1, h2] = getRightAngleSides(height, degree);
  let w: number, h: number;
  w = w1 + w2;
  h = h1 + h2;
  if (degree < 90) {
    // Swap w and h
    const t = w;
    w = h;
    h = t;
  }
  return makeDestructurable({
    w,
    h,
  }, [w, h]);
}
