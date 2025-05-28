import React, { useState, useEffect } from 'react';

const SvgCanvas = ({ svgContent, onPathDataUpdate, onSelectPath, selectedPathIndex }) => {
  const [selectedElementIndex, setSelectedElementIndex] = useState(null);
  const [selectedElementData, setSelectedElementData] = useState({});
  const [viewBox, setViewBox] = useState('0 0 768 768');
  const [parseError, setParseError] = useState(null);
  const [parsedSvg, setParsedSvg] = useState('');

  useEffect(() => {
    if (svgContent && svgContent !== parsedSvg) {
      try {
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
        const vb = svgDoc.documentElement.getAttribute('viewBox');
        if (vb) setViewBox(vb);

        const pathElements = Array.from(svgDoc.querySelectorAll('path')).slice(0, 20);
        const paths = pathElements.map(path => ({
          d: path.getAttribute('d') || '',
          fill: path.getAttribute('fill') || 'none',
          fillOpacity: path.getAttribute('fill-opacity') || '1',
          fillRule: path.getAttribute('fill-rule') || 'nonzero',
        }));

        onPathDataUpdate(paths);
        setParsedSvg(svgContent);
        setParseError(null);
      } catch (error) {
        console.error("SVG parsing error:", error);
        setParseError(error.message);
      }
    }
  }, [svgContent, parsedSvg, onPathDataUpdate]);

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

    const standardAttributes = [
      'fill', 'd', 'fillOpacity', 'fillRule',
      'stroke', 'strokeWidth', 'transform',
      'x', 'y', 'width', 'height',
      'cx', 'cy', 'r',
      'rx', 'ry',
      'x1', 'y1', 'x2', 'y2',
      'points'
    ];

    standardAttributes.forEach(attr => {
      if (attributes[attr] && !displayAttributes[attr]) {
        displayAttributes[attr] = attributes[attr];
      }
    });

    setSelectedElementIndex(index);
    setSelectedElementData({ tagName, attributes: displayAttributes });

    if (typeof onSelectPath === 'function') {
      onSelectPath(index, tagName, displayAttributes);
    }
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
    </div>
  );
};

export default SvgCanvas;
