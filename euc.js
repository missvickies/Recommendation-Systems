// let item1 = [3, 5, 4, 1];
// let item2 = [3, 4, 3, 1];

//takes two arrays: a and b
export function eucDistance(a, b) {
  return (
    a
      .map((x) => x ** 2) // square the difference
      .reduce((sum, now) => sum + now) ** // sum
      (1 / 2) *
    b
      .map((x) => x ** 2) // square the difference
      .reduce((sum, now) => sum + now) ** // sum
      (1 / 2)
  );
}

//takes two arrays a,b
export function dotProduct(a, b) {
  let count = 0;
  for (let i = 0; i < a.length; i++) {
    count += a[i] * b[i];
  }
  return count;
}

// let dotP = dotProduct(item1, item2);
// let euc = eucDistance(item1, item2);

// console.log(dotP / euc);
