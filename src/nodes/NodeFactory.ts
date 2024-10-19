import { Node } from '../types/LogicGateTypes';
import { AndGate } from './AndGate';
import { OrGate } from './OrGate';
import { NotGate } from './NotGate';
import { InputNode } from './InputNode';
import { OutputNode } from './OutputNode';

export function createNode(type: string, x: number, y: number): Node {
  switch (type) {
    case 'AND Gate':
      return new AndGate(x, y);
    case 'OR Gate':
      return new OrGate(x, y);
    case 'NOT Gate':
      return new NotGate(x, y);
    case 'Input':
      return new InputNode(x, y);
    case 'Output':
      return new OutputNode(x, y);
    default:
      throw new Error(`Unknown node type: ${type}`);
  }
}