import { BaseNode } from './BaseNode';

export class NotGate extends BaseNode {
  constructor(x: number, y: number) {
    super('NOT', x, y, 80, 60, 1, 1);
  }

  update(): void {
    this.outputs[0] = !this.inputs[0];
  }
}