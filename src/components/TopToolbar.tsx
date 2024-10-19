import React, { useState } from 'react';
import { ZoomIn, ZoomOut, Copy, Save, Clipboard, Play, Undo, Redo, FolderOpen, Group } from 'lucide-react';

interface TopToolbarProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onCopy: () => void;
  onPaste: () => void;
  onSave: () => void;
  onLoad: () => void;
  onAddComponent: (componentType: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  onSimulate: () => void;
  onCreateCustomComponent: () => void;
}

const TopToolbar: React.FC<TopToolbarProps> = ({
  onZoomIn,
  onZoomOut,
  onCopy,
  onPaste,
  onSave,
  onLoad,
  onAddComponent,
  onUndo,
  onRedo,
  onSimulate,
  onCreateCustomComponent,
}) => {
  const [isComponentMenuOpen, setIsComponentMenuOpen] = useState(false);

  return (
    <div className="bg-gray-800 p-2 flex justify-center items-center">
      <div className="flex space-x-2">
        <button onClick={onZoomIn} className="p-2 bg-gray-700 hover:bg-gray-600 rounded">
          <ZoomIn size={24} />
        </button>
        <button onClick={onZoomOut} className="p-2 bg-gray-700 hover:bg-gray-600 rounded">
          <ZoomOut size={24} />
        </button>
        <button onClick={onCopy} className="p-2 bg-gray-700 hover:bg-gray-600 rounded">
          <Copy size={24} />
        </button>
        <button onClick={onPaste} className="p-2 bg-gray-700 hover:bg-gray-600 rounded">
          <Clipboard size={24} />
        </button>
        <button onClick={onSave} className="p-2 bg-gray-700 hover:bg-gray-600 rounded">
          <Save size={24} />
        </button>
        <button onClick={onLoad} className="p-2 bg-gray-700 hover:bg-gray-600 rounded">
          <FolderOpen size={24} />
        </button>
        <button onClick={onUndo} className="p-2 bg-gray-700 hover:bg-gray-600 rounded">
          <Undo size={24} />
        </button>
        <button onClick={onRedo} className="p-2 bg-gray-700 hover:bg-gray-600 rounded">
          <Redo size={24} />
        </button>
        <button onClick={onSimulate} className="p-2 bg-gray-700 hover:bg-gray-600 rounded">
          <Play size={24} />
        </button>
        <button onClick={onCreateCustomComponent} className="p-2 bg-gray-700 hover:bg-gray-600 rounded">
          <Group size={24} />
        </button>
        <div className="relative">
          <button
            className="p-2 bg-gray-700 hover:bg-gray-600 rounded"
            onClick={() => setIsComponentMenuOpen(!isComponentMenuOpen)}
          >
            Components
          </button>
          {isComponentMenuOpen && (
            <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5">
              <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                <button
                  onClick={() => onAddComponent('AND')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  AND Gate
                </button>
                <button
                  onClick={() => onAddComponent('OR')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  OR Gate
                </button>
                <button
                  onClick={() => onAddComponent('NOT')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  NOT Gate
                </button>
                <button
                  onClick={() => onAddComponent('highConstant')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  High Constant
                </button>
                <button
                  onClick={() => onAddComponent('lowConstant')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Low Constant
                </button>
                <button
                  onClick={() => onAddComponent('lightBulb')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Light Bulb
                </button>
                <button
                  onClick={() => onAddComponent('7SegDisplay')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  7-Segment Display
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopToolbar;