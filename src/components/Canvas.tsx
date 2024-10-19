import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { Component, Connection } from '../types/LogicGateTypes';

interface CanvasProps {
  scale: number;
  offset: { x: number; y: number };
  components: Component[];
  selectedComponents: Component[];
  onUpdateComponent: (component: Component) => void;
  onSelectComponent: (component: Component | null) => void;
  onConnect: (source: Connection, target: Connection) => void;
  isSimulating: boolean;
}

const Canvas = forwardRef<HTMLCanvasElement, CanvasProps>(
  (
    {
      scale,
      offset,
      components,
      selectedComponents,
      onUpdateComponent,
      onSelectComponent,
      onConnect,
      isSimulating,
    },
    ref
  ) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [draggedComponent, setDraggedComponent] = useState<Component | null>(
      null
    );
    const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
      null
    );
    const [connectingNode, setConnectingNode] = useState<Connection | null>(
      null
    );

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const resizeCanvas = () => {
        const { width, height } = canvas.getBoundingClientRect();
        canvas.width = width * window.devicePixelRatio;
        canvas.height = height * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      };

      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);

      const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.scale(scale, scale);
        ctx.translate(offset.x, offset.y);

        // Draw components
        components.forEach((component) => {
          drawComponent(ctx, component);
        });

        // Draw connections
        components.forEach((component) => {
          component.outputs.forEach((output) => {
            const connectedInput = components
              .flatMap((c) => c.inputs)
              .find((input) => input.connectedFrom === output.id);
            if (connectedInput) {
              drawConnection(ctx, output, connectedInput);
            }
          });
        });

        // Draw connecting line if in progress
        if (connectingNode) {
          const mousePos = getMousePos(canvas, { clientX: 15, clientY: 30 });
          drawConnection(ctx, connectingNode, {
            x: mousePos.x,
            y: mousePos.y,
            type: 'temp',
          } as Connection);
        }

        ctx.restore();
      };

      draw();

      return () => {
        window.removeEventListener('resize', resizeCanvas);
      };
    }, [scale, offset, components, connectingNode, isSimulating]);

    const drawComponent = (
      ctx: CanvasRenderingContext2D,
      component: Component
    ) => {
      ctx.fillStyle = selectedComponents.includes(component)
        ? '#4CAF50'
        : '#2196F3';
      ctx.fillRect(component.x, component.y, 50, 50);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '12px Arial';
      ctx.fillText(component.type, component.x + 5, component.y + 30);

      // Draw input and output nodes
      component.inputs.forEach((input, index) => {
        drawNode(
          ctx,
          component.x - 5,
          component.y + 10 + index * 20,
          '#FF5722'
        );
      });
      component.outputs.forEach((output, index) => {
        drawNode(
          ctx,
          component.x + 55,
          component.y + 10 + index * 20,
          '#FFC107'
        );
      });

      if (isSimulating) {
        // Add visual indicators for simulation state
        // This is a placeholder and should be replaced with actual simulation logic
        ctx.fillStyle = '#00FF00';
        ctx.beginPath();
        ctx.arc(component.x + 25, component.y + 25, 5, 0, 2 * Math.PI);
        ctx.fill();
      }
    };

    const drawNode = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      color: string
    ) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fill();
    };

    const drawConnection = (
      ctx: CanvasRenderingContext2D,
      start: Connection,
      end: Connection
    ) => {
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    };

    const getMousePos = (
      canvas: HTMLCanvasElement,
      evt: { clientX: number; clientY: number }
    ) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: (evt.clientX - rect.left - offset.x) / scale,
        y: (evt.clientY - rect.top - offset.y) / scale,
      };
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
      const mousePos = getMousePos(canvasRef.current!, e);
      const clickedComponent = components.find(
        (c) =>
          mousePos.x >= c.x &&
          mousePos.x <= c.x + 50 &&
          mousePos.y >= c.y &&
          mousePos.y <= c.y + 50
      );

      if (clickedComponent) {
        setDraggedComponent(clickedComponent);
        setDragStart({
          x: mousePos.x - clickedComponent.x,
          y: mousePos.y - clickedComponent.y,
        });
        onSelectComponent(clickedComponent);
      } else {
        onSelectComponent(null);
      }

      const clickedNode = components
        .flatMap((c) => [...c.inputs, ...c.outputs])
        .find(
          (node) =>
            Math.sqrt(
              Math.pow(mousePos.x - node.x, 2) +
                Math.pow(mousePos.y - node.y, 2)
            ) <= 5
        );

      if (clickedNode) {
        setConnectingNode(clickedNode);
      }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
      const mousePos = getMousePos(canvasRef.current!, e);
      if (draggedComponent && dragStart) {
        const updatedComponent = {
          ...draggedComponent,
          x: mousePos.x - dragStart.x,
          y: mousePos.y - dragStart.y,
          inputs: draggedComponent.inputs.map((input) => ({
            ...input,
            x: mousePos.x - dragStart.x - 5,
            y:
              mousePos.y -
              dragStart.y +
              10 +
              draggedComponent.inputs.indexOf(input) * 20,
          })),
          outputs: draggedComponent.outputs.map((output) => ({
            ...output,
            x: mousePos.x - dragStart.x + 55,
            y:
              mousePos.y -
              dragStart.y +
              10 +
              draggedComponent.outputs.indexOf(output) * 20,
          })),
        };
        onUpdateComponent(updatedComponent);
      }
      if (connectingNode) {
        // Force a re-render to update the connecting line
        setConnectingNode({ ...connectingNode });
      }
    };

    const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (connectingNode) {
        const mousePos = getMousePos(canvasRef.current!, e);
        const targetNode = components
          .flatMap((c) => [...c.inputs, ...c.outputs])
          .find(
            (node) =>
              Math.sqrt(
                Math.pow(mousePos.x - node.x, 2) +
                  Math.pow(mousePos.y - node.y, 2)
              ) <= 5
          );

        if (targetNode && targetNode !== connectingNode) {
          onConnect(connectingNode, targetNode);
        }
        setConnectingNode(null);
      }

      setDraggedComponent(null);
      setDragStart(null);
    };

    return (
      <canvas
        ref={(node) => {
          canvasRef.current = node;
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        className="absolute top-0 left-0 w-full h-full bg-gray-800"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
    );
  }
);

export default Canvas;
