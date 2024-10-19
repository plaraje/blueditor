export interface Point {
  x: number;
  y: number;
}

export interface Node {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  inputs: boolean[];
  outputs: boolean[];
  isPointInside(point: Point): boolean;
  getPortPosition(port: number, isInput: boolean): Point;
  getPortAtPosition(point: Point): { index: number; isInput: boolean } | null;
  setPosition(x: number, y: number): void;
  update(): void;
  render(ctx: CanvasRenderingContext2D, selected: boolean, hovered: boolean): void;
  toggleInput?(inputIndex: number): void;
}

export interface Connection {
  id: string;
  sourceNode: Node;
  sourcePort: number;
  targetNode: Node;
  targetPort: number;
}