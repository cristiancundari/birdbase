export function checkParentele(
  a: [string, string][][],
  b: [string, string][][]
) {
  const liv = Math.min(5, Math.max(a.length, b.length));
  for (let j = 0; j <= liv; j++) {
    for (let i = 0; i < j; i++) {
      const res = confrontaLivelli(a[i], b[j]);
      if (res) {
        return [i, j];
      }
    }
    for (let i = 0; i <= j; i++) {
      const res = confrontaLivelli(a[j], b[i]);
      if (res) {
        return [j, i];
      }
    }
  }
  return false;
}

function confrontaLivelli(a: [string, string][], b: [string, string][]) {
  if (!a || !b) {
    return false;
  }

  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < b.length; j++) {
      return confrontaTuple(a[i], b[j]);
    }
  }
  return false;
}

function confrontaTuple(a: [string, string], b: [string, string]) {
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < b.length; j++) {
      return a[i] == b[j] && a[i] != null;
    }
  }
  return false;
}
