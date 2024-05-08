"use client";
type StringUnits = `${number}px` | `${number}rem`
const getUnitValue = (s: StringUnits) => {
  const unit = s.includes("px") ? "px" : "rem";
  const value = parseInt(s.replace(unit, ""));
  return { unit, value };
};
export function getPadding(s: StringUnits) {
  const { unit, value } = getUnitValue(s);
  const pTopButton = value * 0.15;
  const pLeftRight = value * 0.25;
  return `${pTopButton}${unit} ${pLeftRight}${unit}`;
}
export function getFontSize(s: StringUnits) {
  const { unit, value } = getUnitValue(s);
  const fontSize = value * 0.45
  return `${fontSize}${unit}`;
}
export function getHeightIcons(s: StringUnits) {
  const { unit, value } = getUnitValue(s);
  const height = value * 0.70
  return `${height}${unit}`;
}
export function calculatePercents (s: StringUnits, percents: number) {
  const { unit, value } = getUnitValue(s);
  const fontSize = value * percents
  return `${fontSize}${unit}`;
}
