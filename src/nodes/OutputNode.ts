import { BaseNode } from './BaseNode';

export class OutputNode extends BaseNode {
  constructor(x: number, y: number) {
    super('Output', x, y, 60, 60, 1, 0);
  }

  update(): void {
    // No update logic needed for output node
  }

  render(ctx: CanvasRenderingContext2D, selected: boolean, hovered: boolean): void {
    super.render(ctx, selected, hovered);
    
    // Draw a light bulb
    ctx.beginPath();
    ctx.arc(this.x + this.width / 2, this.y + this.height / 2, 20, 0, 2 * Math.PI);
    ctx.fillStyle = this.inputs[0] ? '#FFEB3B' : '#333333';
    ctx.fill();
  }
}