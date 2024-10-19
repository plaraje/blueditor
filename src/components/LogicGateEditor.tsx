import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Node, Connection, Point } from '../types/LogicGateTypes';
import { CanvasRenderer } from '../utils/CanvasRenderer';
import { handleMouseInteractions } from '../utils/MouseInteractions';
import { createNode } from '../nodes/NodeFactory';

const LogicGateEditor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Point>({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectingStart, setConnectingStart] = useState<{ node: Node; port: number; isInput: boolean } | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; type: string } | null>(null);

  const renderer = useRef<CanvasRenderer | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      renderer.current = new CanvasRenderer(canvasRef.current);
      renderer.current.setScale(scale);
      renderer.current.setOffset(offset);
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
    }
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  const resizeCanvas = () => {
    if (canvasRef.current) {
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
      redraw();
    }
  };

  const redraw = useCallback(() => {
    if (renderer.current) {
      renderer.current.clear();
      renderer.current.drawGrid();
      renderer.current.drawNodes(nodes, hoveredNode);
      renderer.current.drawConnections(connections);
      renderer.current.drawUI();
      if (isConnecting && connectingStart) {
        renderer.current.drawTempConnection(
          connectingStart.node.getPortPosition(connectingStart.port, connectingStart.isInput),
          { x: dragStart.x, y: dragStart.y }
        );
      }
      if (contextMenu) {
        renderer.current.drawContextMenu(contextMenu);
      }
    }
  }, [nodes, connections, scale, offset, hoveredNode, isConnecting, connectingStart, contextMenu]);

  useEffect(() => {
    redraw();
  }, [redraw]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale - offset.x;
    const y = (e.clientY - rect.top) / scale - offset.y;

    const { action, data } = handleMouseInteractions({ x, y }, nodes, connections, scale, offset);
    
    switch (action) {
      case 'startDragging':
        setIsDragging(true);
        setDragStart({ x: e.clientX, y: e.clientY });
        break;
      case 'selectNode':
        setSelectedNode(data);
        setIsDragging(true);
        setDragStart({ x: e.clientX - data.x * scale, y: e.clientY - data.y * scale });
        break;
      case 'startConnection':
        setIsConnecting(true);
        setConnectingStart(data);
        break;
      case 'addNode':
        addNode(data, x, y);
        break;
      case 'toggleInput':
        data.node.toggleInput(data.inputIndex);
        setNodes([...nodes]);
        break;
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale - offset.x;
    const y = (e.clientY - rect.top) / scale - offset.y;

    setHoveredNode(nodes.find(n => n.isPointInside({ x, y })) || null);

    if (isDragging && selectedNode) {
      const newX = (e.clientX - dragStart.x) / scale;
      const newY = (e.clientY - dragStart.y) / scale;
      updateNodePosition(selectedNode, newX, newY);
    } else if (isDragging) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      setOffset(prev => ({ x: prev.x + dx / scale, y: prev.y + dy / scale }));
      setDragStart({ x: e.clientX, y: e.clientY });
    }

    if (isConnecting) {
      setDragStart({ x, y });
    }

    redraw();
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isConnecting && connectingStart) {
      const rect = canvasRef.current!.getBoundingClientRect();
      const x = (e.clientX - rect.left) / scale - offset.x;
      const y = (e.clientY - rect.top) / scale - offset.y;
      const endNode = nodes.find(n => n.isPointInside({ x, y }));
      if (endNode) {
        const portInfo = endNode.getPortAtPosition({ x, y });
        if (portInfo && portInfo.isInput !== connectingStart.isInput) {
          addConnection(
            connectingStart.isInput ? endNode : connectingStart.node,
            connectingStart.isInput ? portInfo.index : connectingStart.port,
            connectingStart.isInput ? connectingStart.node : endNode,
            connectingStart.isInput ? connectingStart.port : portInfo.index
          );
        }
      }
    }
    setIsDragging(false);
    setSelectedNode(null);
    setIsConnecting(false);
    setConnectingStart(null);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const zoomIntensity = 0.1;
    const delta = e.deltaY > 0 ? -zoomIntensity : zoomIntensity;
    const newScale = Math.max(0.1, Math.min(5, scale * (1 + delta)));
    setScale(newScale);
    if (renderer.current) {
      renderer.current.setScale(newScale);
    }
  };

  const handleContextMenu = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale - offset.x;
    const y = (e.clientY - rect.top) / scale - offset.y;
    const node = nodes.find(n => n.isPointInside({ x, y }));
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      type: node ? 'node' : 'canvas'
    });
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (contextMenu) {
      setContextMenu(null);
    }
  };

  const addNode = (type: string, x: number, y: number) => {
    const newNode = createNode(type, x, y);
    setNodes(prev => [...prev, newNode]);
  };

  const updateNodePosition = (node: Node, x: number, y: number) => {
    node.setPosition(x, y);
    setNodes([...nodes]);
  };

  const addConnection = (sourceNode: Node, sourcePort: number, targetNode: Node, targetPort: number) => {
    const newConnection: Connection = {
      id: `connection-${Date.now()}`,
      sourceNode,
      sourcePort,
      targetNode,
      targetPort
    };
    setConnections(prev => [...prev, newConnection]);
  };

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      onContextMenu={handleContextMenu}
      onClick={handleCanvasClick}
    />
  );
};

export default LogicGateEditor;