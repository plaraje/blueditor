import { Node, Point } from '../types/LogicGateTypes';

export abstract class BaseNode implements Node {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  inputs: boolean[];
  outputs: boolean[];

  constructor(
    type: string,
    x: number,
    y: number,
    width: number,
    height: number,
    inputCount: number,
    outputCount: number
  ) {
    this.id = `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.type = type;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.inputs = new Array(inputCount).fill(false);
    this.outputs = new Array(outputCount).fill(false);
  }

  isPointInside(point: Point): boolean {
    return (
      point.x >= this.x &&
      point.x <= this.x + this.width &&
      point.y >= this.y &&
      point.y <= this.y + this.height
    );
  }

  getPortPosition(port: number, isInput: boolean): Point {
    const portSpacing =
      this.height /
      (isInput ? this.inputs.length + 1 : this.outputs.length + 1);
    return {
      x: isInput ? this.x : this.x + this.width,
      y: this.y + portSpacing * (port + 1),
    };
  }

  getPortAtPosition(point: Point): { index: number; isInput: boolean } | null {
    const portRadius = 5;
    for (let i = 0; i < this.inputs.length; i++) {
      const pos = this.getPortPosition(i, true);
      if (
        Math.sqrt(
          Math.pow(point.x - pos.x, 2) + Math.pow(point.y - pos.y, 2)
        ) <= portRadius
      ) {
        return { index: i, isInput: true };
      }
    }
    for (let i = 0; i < this.outputs.length; i++) {
      const pos = this.getPortPosition(i, false);
      if (
        Math.sqrt(
          Math.pow(point.x - pos.x, 2) + Math.pow(point.y - pos.y, 2)
        ) <= portRadius
      ) {
        return { index: i, isInput: false };
      }
    }
    return null;
  }

  setPosition(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }

  abstract update(): void;

  render(
    ctx: CanvasRenderingContext2D,
    selected: boolean,
    hovered: boolean
  ): void {
    ctx.fillStyle = selected ? '#5A6578' : hovered ? '#4A5568' : '#2D3748';
    ctx.fillRect(this.x, this.y, this.width, this.height);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '12px Arial';
    ctx.fillText(this.type, this.x + 5, this.y + 5);

    this.inputs.forEach((_, i) => {
      const pos = this.getPortPosition(i, true);
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 5, 0, 2 * Math.PI);
      ctx.fillStyle = this.inputs[i] ? '#4CAF50' : '#FF5722';
      ctx.fill();
    });

    this.outputs.forEach((_, i) => {
      const pos = this.getPortPosition(i, false);
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 5, 0, 2 * Math.PI);
      ctx.fillStyle = this.outputs[i] ? '#4CAF50' : '#FF5722';
      ctx.fill();
    });
  }
}
