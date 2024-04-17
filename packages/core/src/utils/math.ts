import { makeDestructurable } from "@bernankez/utils";

export function degreeToAngle(degree: number) {
  return degree * Math.PI / 180;
}

export function getRightAngleSides(hypotenuseLength: number, degree: number) {
  const side1 = hypotenuseLength * Math.cos(degreeToAngle(degree)); // 对边
  const side2 = hypotenuseLength * Math.sin(degreeToAngle(degree)); // 邻边
  return makeDestructurable({
    side1,
    side2,
  }, [side1, side2]);
}

export function measureRectangle(width: number, height: number, degree: number) {
  degree = degree % 180;
  const [w1, h2] = getRightAngleSides(width, degree);
  const [h1, w2] = getRightAngleSides(height, degree);
  const w = Math.abs(w1) + Math.abs(w2);
  const h = Math.abs(h1) + Math.abs(h2);
  return makeDestructurable({
    w,
    h,
  }, [w, h]);
}
