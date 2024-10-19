import React from 'react';
import { ZoomIn, ZoomOut, Copy, Save, Clipboard } from 'lucide-react';

interface ToolbarProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onCopy: () => void;
  onPaste: () => void;
  onSave: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ onZoomIn, onZoomOut, onCopy, onPaste, onSave }) => {
  return (
    <div className="bg-gray-800 p-2 flex flex-col space-y-2">
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
    </div>
  );
};

export default Toolbar;