export function calcAvg(user) {
  let length = user.filter((x) => x !== -1).length;
  return (
    user.filter((x) => x != -1).reduce((prev, curr) => prev + curr) / length
  );
}

export function calcBias(rating, avg) {
  return rating - avg;
}

