export default function MovingAverage(
  values: number[],
  window_size: number
): number[] {
  const ma: number[]= [];
  const remainder = values.length % window_size;

  for (let i = 0; i < values.length; i+window_size) {
        let slice: number[] | undefined = values.slice(i, i+window_size);
        if(slice)
            ma.push(Avg(slice))
  }
  return ma;
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
export function Stg(values: number[]): number {
  const avg = Avg(values);

  let sum_variance = Sum(values.map((v) => Math.pow(v - avg, 2)))
  let stg = Math.sqrt(sum_variance / (values.length));

  return stg;
}
