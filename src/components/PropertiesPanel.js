import React, { useState } from 'react';

const PropertiesPanel = ({ selectedElement, selectedTime }) => {
  const [deltaChanges, setDeltaChanges] = useState({
    x: 0,
    y: 0,
    fill: '#000000',
    opacity: 1,
    rotation: 0,
  });

  if (!selectedElement) return null;

  const handleDeltaChange = (attribute, value) => {
    setDeltaChanges((prev) => ({
      ...prev,
      [attribute]: value,
    }));
  };

  const handleColorInputChange = (e) => {
    const value = e.target.value;
    setDeltaChanges((prev) => ({
      ...prev,
      fill: value,
    }));
  };

  return (
    <div className="properties-panel">
      <h3>Properties</h3>
      <div className="properties-grid">
        <div className="current-attributes">
          <div>
            <strong>Selected Element:</strong> {selectedElement.id}
          </div>
          <div>
            <strong>Selected Time:</strong> {selectedTime}s
          </div>
          <div>
            <strong>Current Attributes</strong>
          </div>
          <label>
            X: {selectedElement.attributes.x || 0}
          </label>
          <label>
            Y: {selectedElement.attributes.y || 0}
          </label>
          <label>
            Color: {selectedElement.attributes.fill || '#000000'}
          </label>
          <label>
            Opacity: {selectedElement.attributes.opacity || 1}
          </label>
          <label>
            Rotation: {selectedElement.attributes.rotation || 0}
          </label>
        </div>
        <div className="delta-attributes">
        <div>
            <strong>Delta Changes</strong>
          </div>
          <label>
            X:
            <input
              type="number"
              value={deltaChanges.x}
              onChange={(e) => handleDeltaChange('x', parseFloat(e.target.value))}
            />
          </label>
          <label>
            Y:
            <input
              type="number"
              value={deltaChanges.y}
              onChange={(e) => handleDeltaChange('y', parseFloat(e.target.value))}
            />
          </label>
          <label>
            Color:
            <input
              type="color"
              value={deltaChanges.fill}
              onChange={(e) => handleDeltaChange('fill', e.target.value)}
            />
            <input
              type="text"
              value={deltaChanges.fill}
              onChange={handleColorInputChange}
              placeholder="#000000"
            />
          </label>
          <label>
            Opacity:
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={deltaChanges.opacity}
              onChange={(e) => handleDeltaChange('opacity', parseFloat(e.target.value))}
            />
          </label>
          <label>
            Rotation:
            <input
              type="number"
              value={deltaChanges.rotation}
              onChange={(e) => handleDeltaChange('rotation', parseFloat(e.target.value))}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default PropertiesPanel;
