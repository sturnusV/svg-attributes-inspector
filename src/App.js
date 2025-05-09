import React, { useState, useEffect } from 'react';
import SvgCanvas from './components/SvgCanvas';
import Toolbar from './components/Toolbar';
import PropertiesPanel from './components/PropertiesPanel';
import './App.css';

const App = () => {
  const [selectedElementId, setSelectedElementId] = useState(null);
  const [selectedElement, setSelectedElement] = useState(null);
  const [svgContent, setSvgContent] = useState('');
  const [elements, setElements] = useState([]);

  const handleSelectElement = (elementId = null) => {
    setSelectedElementId(elementId);
  };

  useEffect(() => {
    if (selectedElementId) {
      const element = elements.find(el => el.id === selectedElementId);
      setSelectedElement(element);
    }
  }, [selectedElementId, elements]);

  const handleElementsUpdate = (updatedElements) => {
    setElements(updatedElements);
  };

  const handleUploadSvg = (svgData) => {
      setSvgContent(svgData);
  };

  return (
    <div className="App">
      <Toolbar onUploadSvg={handleUploadSvg} />
      <SvgCanvas
        onSelectElement={handleSelectElement}
        svgContent={svgContent}
        onElementsUpdate={handleElementsUpdate}
        selectedElementId={selectedElementId}
        elements={elements}
        setElements={setElements}
      />
      <PropertiesPanel
        selectedElement={selectedElement}
      />
    </div>
  );
};

export default App;
