import React, { useState } from 'react';
import SvgCanvas from './components/SvgCanvas';
import Toolbar from './components/Toolbar';
import './App.css';

const App = () => {
  const [svgContent, setSvgContent] = useState('');
  const [elements, setElements] = useState([]);

  const handleElementsUpdate = (updatedElements) => {
    setElements(updatedElements);
  };

  const handleUploadSvg = (svgData) => {
      setSvgContent(svgData);
  };

  return (
    <div className="App">
      <h3 className="panel-heading">SVG Attributes Inspector</h3>
      <Toolbar onUploadSvg={handleUploadSvg} />
      <SvgCanvas
        svgContent={svgContent}
        onElementsUpdate={handleElementsUpdate}
        elements={elements}
        setElements={setElements}
      />
    </div>
  );
};

export default App;
