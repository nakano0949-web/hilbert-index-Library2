// ---------------------------------------------
// 3D Hilbert curve utilities
// ---------------------------------------------
function hilbert3D(x, y, z, order) {
  let n = 1 << order;
  let h = 0;

  for (let s = order - 1; s >= 0; s--) {
    let rx = (x >> s) & 1;
    let ry = (y >> s) & 1;
    let rz = (z >> s) & 1;

    let index = (rx << 2) | (ry << 1) | rz;
    h = (h << 3) | index;

    // rotate cube
    if (ry === 0) {
      if (rx === 1) {
        x = n - 1 - x;
        y = n - 1 - y;
      }
      [x, y] = [y, x];
    }
  }
  return h;
}

// ---------------------------------------------
// HilbertIndex3D class
// ---------------------------------------------
class HilbertIndex3D {
  constructor(order = 8) {
    this.order = order;
    this.points = [];
  }

  insert(x, y, z, value) {
    const h = hilbert3D(x, y, z, this.order);
    this.points.push({ h, x, y, z, value });
  }

  build() {
    this.points.sort((a, b) => a.h - b.h);
  }

  // ---------------------------------------------
  // 3D range search (axis-aligned box)
  // ---------------------------------------------
  range(box) {
    const { x0, y0, z0, x1, y1, z1 } = box;

    const results = [];
    for (const p of this.points) {
      if (
        p.x >= x0 && p.x <= x1 &&
        p.y >= y0 && p.y <= y1 &&
        p.z >= z0 && p.z <= z1
      ) {
        results.push(p);
      }
    }
    return results;
  }

  // ---------------------------------------------
  // 3D kNN search
  // ---------------------------------------------
  knn(qx, qy, qz, k) {
    const qh = hilbert3D(qx, qy, qz, this.order);

    // 二分探索
    let left = 0;
    let right = this.points.length;
    while (left < right) {
      const mid = (left + right) >> 1;
      if (this.points[mid].h < qh) left = mid + 1;
      else right = mid;
    }

    let L = left - 1;
    let R = left;

    const result = [];

    function dist2(p) {
      const dx = p.x - qx;
      const dy = p.y - qy;
      const dz = p.z - qz;
      return dx * dx + dy * dy + dz * dz;
    }

    while (result.length < k && (L >= 0 || R < this.points.length)) {
      let chooseLeft = false;

      if (L >= 0 && R < this.points.length) {
        chooseLeft = dist2(this.points[L]) < dist2(this.points[R]);
      } else if (L >= 0) {
        chooseLeft = true;
      }

      if (chooseLeft) {
        result.push(this.points[L--]);
      } else {
        result.push(this.points[R++]);
      }
    }

    result.sort((a, b) => dist2(a) - dist2(b));
    return result;
  }
}

// ---------------------------------------------
// export
// ---------------------------------------------
module.exports = { HilbertIndex3D };
