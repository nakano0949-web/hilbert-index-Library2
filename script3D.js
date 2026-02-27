const { HilbertIndex3D } = require("./hilbert3D.js");

const idx = new HilbertIndex3D(6); // 64x64x64

for (let i = 0; i < 20000; i++) {
  idx.insert(
    Math.random() * 64 | 0,
    Math.random() * 64 | 0,
    Math.random() * 64 | 0,
    i
  );
}

idx.build();

console.log("range:", idx.range({
  x0: 10, y0: 10, z0: 10,
  x1: 30, y1: 30, z1: 30
}).length);

console.log("knn:", idx.knn(20, 20, 20, 10).length);
