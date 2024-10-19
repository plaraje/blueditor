import { BaseNode } from './BaseNode';

export class InputNode extends BaseNode {
  constructor(x: number, y: number) {
    super('Input', x, y, 60, 60, 0, 1);
  }

  update(): void {
    // No update logic needed for input node
  }

  toggleInput(): void {
    this.outputs[0] = !this.outputs[0];
  }

  render(
    ctx: CanvasRenderingContext2D,
    selected: boolean,
    hovered: boolean
  ): void {
    super.render(ctx, selected, hovered);

    // Tamaño y radio para las esquinas redondeadas
    const cornerRadius = 10;
    const rectX = this.x + (this.width - 40) / 2; // Centra el rectángulo
    const rectY = this.y + (this.height - 40) / 2; // Centra el rectángulo
    const rectWidth = 40;
    const rectHeight = 40;

    // Dibujar un cuadrado con esquinas redondeadas
    ctx.beginPath();
    ctx.moveTo(rectX + cornerRadius, rectY);
    ctx.lineTo(rectX + rectWidth - cornerRadius, rectY);
    ctx.arcTo(
      rectX + rectWidth,
      rectY,
      rectX + rectWidth,
      rectY + cornerRadius,
      cornerRadius
    );
    ctx.lineTo(rectX + rectWidth, rectY + rectHeight - cornerRadius);
    ctx.arcTo(
      rectX + rectWidth,
      rectY + rectHeight,
      rectX + rectWidth - cornerRadius,
      rectY + rectHeight,
      cornerRadius
    );
    ctx.lineTo(rectX + cornerRadius, rectY + rectHeight);
    ctx.arcTo(
      rectX,
      rectY + rectHeight,
      rectX,
      rectY + rectHeight - cornerRadius,
      cornerRadius
    );
    ctx.lineTo(rectX, rectY + cornerRadius);
    ctx.arcTo(rectX, rectY, rectX + cornerRadius, rectY, cornerRadius);

    // Establecer el color del rectángulo
    ctx.fillStyle = this.outputs[0] ? '#4CAF50' : '#FF5722';
    ctx.fill();
  }
}
