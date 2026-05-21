export interface Vector2D {
  id: string;
  name: string;
  color: string;
  x: number; // original X coord (for custom vectors, we can have starting / interactive ones)
  y: number; // original Y coord
  visible: boolean;
}

export interface Matrix2D {
  a: number; // M11 (top-left) - image of i (x-coord)
  b: number; // M12 (top-right) - image of j (x-coord)
  c: number; // M21 (bottom-left) - image of i (y-coord)
  d: number; // M22 (bottom-right) - image of j (y-coord)
}

export interface Line2D {
  id: string;
  name: string;
  color: string;
  slope: number; // y = mx
  intercept: number; // y = mx + c (let's do y = m*x + b or passing through points for arbitrary lines)
  point1: { x: number; y: number };
  point2: { x: number; y: number };
  visible: boolean;
}

export interface Triangle2D {
  v1: { x: number; y: number };
  v2: { x: number; y: number };
  v3: { x: number; y: number };
  color: string;
  visible: boolean;
}

export interface PresetTransform {
  id: string;
  name: string;
  description: string;
  matrix: Matrix2D;
  params?: {
    label: string;
    min: number;
    max: number;
    step: number;
    value: number;
    onChange: (val: number, current: Matrix2D) => Matrix2D;
  }[];
}
