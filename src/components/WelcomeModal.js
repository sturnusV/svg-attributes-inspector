import React from 'react';

const WelcomeModal = ({ onUpload, onUseSample, onClose }) => {
  return (
    <div className="welcome-modal-overlay">
      <div className="welcome-modal">
        <div className="welcome-modal-header">
          <h2>Welcome to SVG Animator!</h2>
          <button onClick={onClose} className="close-button">
            &times;
          </button>
        </div>
        <div className="welcome-modal-content">
          <p>Get started by either uploading your own SVG file or using our sample:</p>
          
          <div className="welcome-options">
            <label htmlFor="svg-upload" className="welcome-option upload-option">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
              <span>Upload SVG File</span>
              <input
                type="file"
                id="svg-upload"
                accept=".svg"
                onChange={onUpload}
                style={{ display: 'none' }}
              />
            </label>
            
            <button onClick={onUseSample} className="welcome-option sample-option">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
              <span>Use Sample SVG</span>
            </button>
          </div>
          
          <p className="welcome-note">
            Note: Currently we only support SVG files containing path elements for animation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;