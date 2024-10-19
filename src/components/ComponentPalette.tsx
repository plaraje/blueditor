import React from 'react';
import { ToggleLeft, Circle, Square, Hash } from 'lucide-react';

interface ComponentPaletteProps {
  onAddComponent: (componentType: string) => void;
}

const ComponentPalette: React.FC<ComponentPaletteProps> = ({ onAddComponent }) => {
  const components = [
    { type: 'button', icon: Circle },
    { type: 'switch', icon: ToggleLeft },
    { type: 'highConstant', icon: Square },
    { type: 'lowConstant', icon: Square },
    { type: '7SegDisplay', icon: Hash },
  ];

  return (
    <div className="bg-gray-800 p-2 w-16">
      {components.map((component) => (
        <button
          key={component.type}
          onClick={() => onAddComponent(component.type)}
          className="p-2 mb-2 bg-gray-700 hover:bg-gray-600 rounded w-full flex justify-center"
        >
          <component.icon size={24} />
        </button>
      ))}
    </div>
  );
};

export default ComponentPalette;