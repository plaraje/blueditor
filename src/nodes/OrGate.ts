import { BaseNode } from './BaseNode';

export class OrGate extends BaseNode {
  constructor(x: number, y: number) {
    super('OR', x, y, 80, 60, 2, 1);
  }

  update(): void {
    this.outputs[0] = this.inputs[0] || this.inputs[1];
  }
}