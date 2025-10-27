import { DEVIATION_COLORS, DEVIATION_THRESHOLDS } from "./prediction.constants";

export const calculateDeviation = (actual, predicted) => {
  if (!predicted || !actual || predicted <= 0) {
    return 0;
  }
  return ((actual - predicted) / predicted) * 100;
};

export const getDeviationColor = (deviation) => {
  if (deviation > DEVIATION_THRESHOLDS.CRITICAL)
    return DEVIATION_COLORS.CRITICAL;
  if (deviation > DEVIATION_THRESHOLDS.WARNING) return DEVIATION_COLORS.WARNING;
  if (deviation > DEVIATION_THRESHOLDS.GOOD_LOW) return DEVIATION_COLORS.GOOD;
  return DEVIATION_COLORS.LOW;
};