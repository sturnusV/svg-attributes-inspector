import React, { useState, useEffect } from 'react';

const SvgCanvas = ({ svgContent }) => {
  const [selectedElementIndex, setSelectedElementIndex] = useState(null);
  const [selectedElementData, setSelectedElementData] = useState({});
  const [viewBox, setViewBox] = useState('0 0 768 768');
  const [copiedKey, setCopiedKey] = useState(null);
  const [parseError, setParseError] = useState(null);

  useEffect(() => {
      if (svgContent) {
        try {
          const parser = new DOMParser();
          const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
          const vb = svgDoc.documentElement.getAttribute('viewBox');
          if (vb) setViewBox(vb);
          setParseError(null);
        } catch (error) {
          console.error("SVG parsing error:", error);
          setParseError(error.message);
        }
      }
    }, [svgContent]);

  const parseSvgContent = (svgContent, handleElementClick, selectedElementIndex) => {
    try {
      const cleanedSvgContent = svgContent
          .replace(/<\?xml.*?\?>/, '')
          .replace(/<!DOCTYPE.*?>/, '');

        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(cleanedSvgContent, 'image/svg+xml');
        
        const elementsToParse = ['path', 'rect', 'circle', 'ellipse', 'line', 'polygon', 'polyline'];
        const svgElements = elementsToParse.flatMap(tag => Array.from(svgDoc.querySelectorAll(tag)));

        return svgElements.map((el, index) => {
          const tagName = el.tagName;
          const props = {};

          for (let attr of el.attributes) {
            const camelCaseAttr = attr.name.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
            
            if (camelCaseAttr === 'style') {
              const styleObj = {};
              attr.value.split(';').forEach(declaration => {
                const [property, value] = declaration.split(':');
                if (property && value) {
                  const camelCaseProp = property.trim().replace(/-([a-z])/g, (g) => g[1].toUpperCase());
                  styleObj[camelCaseProp] = value.trim();
                }
              });
              props.style = styleObj;
            } else {
              props[camelCaseAttr] = attr.value;
            }
          }

          return React.createElement(tagName, {
            key: index,
            ...props,
            onClick: () => handleElementClick(index, tagName, props),
            className: `svg-element ${selectedElementIndex === index ? 'selected' : ''}`
          });
        });
      } catch (error) {
        console.error("SVG element parsing error:", error);
        setParseError("Failed to parse SVG elements");
        return null;
      }
    };

  const handleElementClick = (index, tagName, attributes) => {
    const displayAttributes = { ...attributes };
    
    if (displayAttributes.style) {
      Object.entries(displayAttributes.style).forEach(([key, value]) => {
        displayAttributes[`style.${key}`] = value;
      });
      delete displayAttributes.style;
    }
    
    setSelectedElementIndex(index);
    setSelectedElementData({ tagName, attributes: displayAttributes });
  };

  const renderSvgContent = () => {
    try {
      if (!svgContent) return null;
      
      const elements = parseSvgContent(svgContent, handleElementClick, selectedElementIndex);
      if (!elements) return null;

      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
          viewBox={viewBox}
        >
          {elements}
        </svg>
      );
    } catch (error) {
      console.error("SVG rendering error:", error);
      return <div className="error-message">Could not display this SVG file</div>;
    }
  };

  return (
    <div className="svg-canvas-container">
      <div className="svg-canvas">
        {parseError && (
          <div className="error-message">
            <strong>SVG Error:</strong> {parseError}
            <br />
            <small>Please check the SVG file and try again.</small>
          </div>
        )}
        {renderSvgContent()}
      </div>

      {selectedElementIndex !== null && (
        <div className="attributes-panel">
            <h3 className="panel-heading">SVG Attributes</h3>
            <table>
              <tbody>
                <tr>
                  <td><strong>index</strong></td>
                  <td>{selectedElementIndex}</td>
                </tr>
                <tr>
                  <td><strong>element</strong></td>
                  <td>{selectedElementData.tagName}</td>
                </tr>
                {Object.entries(selectedElementData.attributes).map(([key, value]) => {
                  const isLong = key === 'd' && value.length > 10;
                  const displayValue = isLong ? `${value.slice(0, 10)}...` : value;

                  const handleCopy = () => {
                    navigator.clipboard.writeText(value);
                    setCopiedKey(key);
                    setTimeout(() => setCopiedKey(null), 1000);
                  };

                  return (
                    <tr key={key}>
                      <td><strong>{key}</strong></td>
                      <td style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                        <span style={{ wordBreak: 'break-word' }}>{displayValue}</span>
                        {isLong && (
                          <div style={{ position: 'relative', width: '60px', height: '24px', margin: '10px' }}>
                            {copiedKey === key ? (
                              <span
                                style={{
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  width: '100%',
                                  height: '100%',
                                  fontSize: '0.75em',
                                  color: 'green',
                                  textAlign: 'center',
                                  lineHeight: '24px',
                                  background: 'transparent',
                                }}
                              >
                                Copied!
                              </span>
                            ) : (
                              <button
                                onClick={handleCopy}
                                style={{
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  width: '100%',
                                  height: '100%',
                                  fontSize: '0.8em',
                                  padding: 0,
                                }}
                              >
                                Copy
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}


              </tbody>
            </table>
        </div>
      )}
    </div>
  );
};

export default SvgCanvas;
