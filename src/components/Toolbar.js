import React, { useEffect, useState, useRef } from "react"; 
import WelcomeModal from "./WelcomeModal";

const Toolbar = ({ onUploadSvg, svgContent }) => {
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const fileInputRef = useRef(null); 

  useEffect(() => {
    if (!svgContent) {
      setShowWelcomeModal(true);
    }
  }, [svgContent]);

  const handleCloseWelcome = () => {
    setShowWelcomeModal(false);
    localStorage.setItem('hasDismissedWelcome', 'true');
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = () => {
        onUploadSvg(reader.result);
        handleCloseWelcome();
      };
      reader.readAsText(file);
    } else {
      alert('Please upload a valid SVG file.');
    }
  };

  const handleUploadButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleLoadSample = async () => {
    try {
      const response = await fetch(`${process.env.PUBLIC_URL}/9.svg`);
      if (!response.ok) throw new Error('Sample SVG not found');
      const svgContent = await response.text();
      onUploadSvg(svgContent);
      handleCloseWelcome();
    } catch (error) {
      console.error('Failed to load sample SVG:', error);
      alert('Failed to load sample SVG. Please try again.');
    }
  };

  return (
    <div className="toolbar">
      <input
        type="file"
        accept=".svg"
        onChange={handleFileChange}
        ref={fileInputRef} 
        style={{ display: 'none' }}
      />
      <button 
        onClick={handleUploadButtonClick} 
        className="toolbar-button"
      >
        Upload SVG
      </button>
      <button
        onClick={handleLoadSample}
        className="toolbar-button sample-button"
      >
        Load Sample
      </button>

      {showWelcomeModal && (
        <WelcomeModal
          onUpload={handleFileChange} 
          onUseSample={handleLoadSample}
          onClose={handleCloseWelcome}
        />
      )}
    </div>
  );
};

export default Toolbar;