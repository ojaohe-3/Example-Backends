const FLOAT_ERROR_MARGIN = 0.01;

export function within_range(a: number, b: number) {
  const diff = Math.abs(a - b);
  return diff < FLOAT_ERROR_MARGIN;
}

// Sum of array, probably already exists somewheref in a standard library.
export function Sum(values: number[]): number {
  let sum = 0;
  values.map((v) => (sum += v));
  return sum;
}

/// Calculate Average, or variance.
export function Avg(values: number[]): number {
  let sum = Sum(values);
  return sum / values.length;
}

/// Calculate the standard diviation metric
export function Std(values: number[]): number {
  const avg = Avg(values);

  let sum_variance = Sum(values.map((v) => Math.pow(v - avg, 2)));
  let stg = Math.sqrt(sum_variance / values.length);

  return stg;
}