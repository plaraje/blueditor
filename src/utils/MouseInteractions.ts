import { Node, Connection, Point } from '../types/LogicGateTypes';

interface InteractionResult {
  action: 'startDragging' | 'selectNode' | 'startConnection' | 'addNode' | 'toggleInput' | 'none';
  data?: any;
}

export function handleMouseInteractions(
  mousePos: Point,
  nodes: Node[],
  connections: Connection[],
  scale: number,
  offset: Point
): InteractionResult {
  // Check if mouse is over a UI element
  if (isOverToolbar(mousePos)) {
    const nodeType = getToolbarButtonClicked(mousePos);
    if (nodeType) {
      return { action: 'addNode', data: nodeType };
    }
  }

  // Check if mouse is over a node
  const clickedNode = nodes.find(node => node.isPointInside(mousePos));

  if (clickedNode) {
    // Check if it's an input node and the click is on the button area
    if (clickedNode.type === 'Input' && isOverInputButton(mousePos, clickedNode)) {
      return { action: 'toggleInput', data: { node: clickedNode, inputIndex: 0 } };
    }

    // Check if the click is on a port
    const portInfo = clickedNode.getPortAtPosition(mousePos);
    if (portInfo) {
      return { action: 'startConnection', data: { node: clickedNode, ...portInfo } };
    }

    return { action: 'selectNode', data: clickedNode };
  }

  // If not over any interactive element, start panning
  return { action: 'startDragging' };
}

function isOverToolbar(point: Point): boolean {
  return point.y <= 50; // Assuming toolbar height is 50px
}

function getToolbarButtonClicked(point: Point): string | null {
  const buttons = ['AND Gate', 'OR Gate', 'NOT Gate', 'Input', 'Output'];
  const buttonIndex = Math.floor((point.x - 20) / 60);
  return buttonIndex >= 0 && buttonIndex < buttons.length ? buttons[buttonIndex] : null;
}

function isOverInputButton(point: Point, node: Node): boolean {
  const buttonRadius = 20;
  const buttonCenter = {
    x: node.x + node.width / 2,
    y: node.y + node.height / 2
  };
  const distance = Math.sqrt(
    Math.pow(point.x - buttonCenter.x, 2) + Math.pow(point.y - buttonCenter.y, 2)
  );
  return distance <= buttonRadius;
}