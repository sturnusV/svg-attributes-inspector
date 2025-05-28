import React, { useState } from 'react';

const SvgElementDetails = ({ selectedElementData, selectedElementIndex, onClose }) => {
  const [copiedKey, setCopiedKey] = useState(null);

  if (!selectedElementData || !selectedElementData.attributes) return null;

  const handleCopy = (value) => {
    navigator.clipboard.writeText(value);
    setCopiedKey(value);
    setTimeout(() => setCopiedKey(null), 1000);
  };

  const sortedAttributes = Object.entries(selectedElementData.attributes)
    .sort(([a], [b]) => a.localeCompare(b));

  return (
    <div className="element-details-modal">
      <div className="modal-header">
        <h3 className="modal-title">SVG Element Details</h3>
        <button onClick={onClose} className="modal-close-button">
          &times;
        </button>
      </div>
      
      <div className="element-info">
        <div className="element-info-row">
          <span className="info-label">Element Type: </span>
          <span className="info-value tag">{selectedElementData.tagName}</span>
        </div>
        {selectedElementIndex !== null && (
          <div className="element-info-row">
            <span className="info-label">Index:</span>
            <span className="info-value">{selectedElementIndex}</span>
          </div>
        )}
      </div>

      <div className="attributes-section">
        <h4 className="attributes-title">Attributes</h4>
        <table className="attributes-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {sortedAttributes.map(([key, value]) => (
              <tr key={key} className="attribute-row">
                <td className="attribute-name">{key}</td>
                <td className="attribute-value">
                  <div className="value-container">
                    <span className="value-text">
                      {String(value).length > 30 ? 
                       `${String(value).substring(0, 30)}...` : 
                       String(value)}
                    </span>
                    {String(value).length > 10 && (
                      <button
                        onClick={() => handleCopy(value)}
                        className={`copy-button ${copiedKey === value ? 'copied' : ''}`}
                      >
                        {copiedKey === value ? '✓ Copied!' : 'Copy'}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SvgElementDetails;