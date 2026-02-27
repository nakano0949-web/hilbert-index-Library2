// 3D Hilbert curve fast implementation
function hilbert3D_fast(x, y, z, order) {
  let h = 0;
  let rotation = 0;

  // 3D Hilbert rotation tables
  const rotLUT = [
    [0, 7, 3, 4, 1, 6, 2, 5],
    [1, 6, 2, 5, 0, 7, 3, 4],
    [3, 4, 0, 7, 2, 5, 1, 6],
    [2, 5, 1, 6, 3, 4, 0, 7],
    [4, 3, 7, 0, 5, 2, 6, 1],
    [5, 2, 6, 1, 4, 3, 7, 0],
    [7, 0, 4, 3, 6, 1, 5, 2],
    [6, 1, 5, 2, 7, 0, 4, 3]
  ];

  for (let i = order - 1; i >= 0; i--) {
    const xi = (x >> i) & 1;
    const yi = (y >> i) & 1;
    const zi = (z >> i) & 1;

    let idx = (xi << 2) | (yi << 1) | zi;
    idx = rotLUT[rotation][idx];

    h = (h << 3) | idx;
    rotation = idx;
  }

  return h;
}
