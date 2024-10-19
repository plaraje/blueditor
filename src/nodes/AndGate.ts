import { BaseNode } from './BaseNode';

export class AndGate extends BaseNode {
  constructor(x: number, y: number) {
    super('AND', x, y, 80, 60, 2, 1);
  }

  update(): void {
    this.outputs[0] = this.inputs[0] && this.inputs[1];
  }
}