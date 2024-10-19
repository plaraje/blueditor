import { Node, Connection, Point } from '../types/LogicGateTypes';

export class CanvasRenderer {
  private ctx: CanvasRenderingContext2D;
  private scale: number = 1;
  private offset: Point = { x: 0, y: 0 };

  constructor(private canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d')!;
  }

  setScale(scale: number) {
    this.scale = scale;
  }

  setOffset(offset: Point) {
    this.offset = offset;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawGrid() {
    const gridSize = 20 * this.scale;
    const offsetX = this.offset.x % gridSize;
    const offsetY = this.offset.y % gridSize;

    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    this.ctx.lineWidth = 1;

    for (let x = offsetX; x < this.canvas.width; x += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvas.height);
      this.ctx.stroke();
    }

    for (let y = offsetY; y < this.canvas.height; y += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvas.width, y);
      this.ctx.stroke();
    }
  }

  drawNodes(nodes: Node[], hoveredNode: Node | null) {
    this.ctx.save();
    this.ctx.scale(this.scale, this.scale);
    this.ctx.translate(this.offset.x, this.offset.y);

    nodes.forEach(node => {
      node.render(this.ctx, false, node === hoveredNode);
    });

    this.ctx.restore();
  }

  drawConnections(connections: Connection[]) {
    this.ctx.save();
    this.ctx.scale(this.scale, this.scale);
    this.ctx.translate(this.offset.x, this.offset.y);

    connections.forEach(connection => {
      const startPos = connection.sourceNode.getPortPosition(connection.sourcePort, false);
      const endPos = connection.targetNode.getPortPosition(connection.targetPort, true);

      this.ctx.strokeStyle = '#FFFFFF';
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.moveTo(startPos.x, startPos.y);
      this.ctx.lineTo(endPos.x, endPos.y);
      this.ctx.stroke();
    });

    this.ctx.restore();
  }

  drawTempConnection(start: Point, end: Point) {
    this.ctx.save();
    this.ctx.scale(this.scale, this.scale);
    this.ctx.translate(this.offset.x, this.offset.y);

    this.ctx.strokeStyle = '#FFFFFF';
    this.ctx.lineWidth = 2;
    this.ctx.setLineDash([5, 5]);
    this.ctx.beginPath();
    this.ctx.moveTo(start.x, start.y);
    this.ctx.lineTo(end.x, end.y);
    this.ctx.stroke();
    this.ctx.setLineDash([]);

    this.ctx.restore();
  }

  drawUI() {
    // Draw toolbar
    this.ctx.fillStyle = 'rgba(45, 55, 72, 0.9)';
    this.ctx.fillRect(10, 10, 300, 40);

    // Draw toolbar buttons
    const buttons = ['AND Gate', 'OR Gate', 'NOT Gate', 'Input', 'Output'];
    buttons.forEach((button, index) => {
      this.ctx.fillStyle = '#4A5568';
      this.ctx.fillRect(20 + index * 60, 15, 50, 30);
      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.font = '12px Arial';
      this.ctx.fillText(button, 25 + index * 60, 35);
    });
  }

  drawContextMenu(menu: { x: number; y: number; type: string }) {
    this.ctx.fillStyle = 'rgba(45, 55, 72, 0.9)';
    this.ctx.fillRect(menu.x, menu.y, 120, menu.type === 'node' ? 60 : 30);

    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.font = '12px Arial';
    if (menu.type === 'node') {
      this.ctx.fillText('Delete', menu.x + 10, menu.y + 20);
      this.ctx.fillText('Properties', menu.x + 10, menu.y + 40);
    } else {
      this.ctx.fillText('Add Node', menu.x + 10, menu.y + 20);
    }
  }
}