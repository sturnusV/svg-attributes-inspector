import React from 'react';

const Toolbar = ({ onUploadSvg }) => {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = () => {
        onUploadSvg(reader.result); // Pass the SVG content to the parent component
      };
      reader.readAsText(file);
    } else {
      alert('Please upload a valid SVG file.');
    }
  };

  return (
    <div className="toolbar">
      <input
        type="file"
        accept=".svg"
        onChange={handleFileChange}
        
      />
    </div>
  );
};

export default Toolbar;
