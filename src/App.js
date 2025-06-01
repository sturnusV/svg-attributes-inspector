import { useState, useRef, useEffect } from 'react';
import SvgCanvas from './components/SvgCanvas';
import SvgElementDetails from './components/SvgElementDetails';
import Toolbar from './components/Toolbar';
import AnimationPanel from './components/AnimationPanel';
import AnimatedSvgComponent from './components/AnimatedSvgComponent';
import AnimationsList from './components/AnimationsList';
import { ANCHOR_POINTS, getBoundingBoxFromPath } from './components/animationUtils';
import './App.css';

const App = () => {
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [animations, setAnimations] = useState([]);

  // SVG Content State
  const [svgContent, setSvgContent] = useState('');
  const [pathData, setPathData] = useState({});
  const [selectedPathIndex, setSelectedPathIndex] = useState(null);
  const [selectedElementData, setSelectedElementData] = useState(null);
  const [showElementDetails, setShowElementDetails] = useState(false);
  const [isValidForAnimation, setIsValidForAnimation] = useState(true);

  // Animation state
  const [animationMode, setAnimationMode] = useState('rotate');
  const [isPlaying, setIsPlaying] = useState(false);
  const [direction, setDirection] = useState(1);
  const animationRef = useRef(null);

  // Rotation parameters
  const [rotationAngle, setRotationAngle] = useState(20);
  const [currentRotation, setCurrentRotation] = useState(0);

  // Translation parameters
  const [translateDistance, setTranslateDistance] = useState(20);
  const [currentTranslation, setCurrentTranslation] = useState(0);
  const [translateAxis, setTranslateAxis] = useState('x');

  // Opacity parameters
  const [opacityRange, setOpacityRange] = useState(0.5);
  const [currentOpacity, setCurrentOpacity] = useState(1);

  // Frequency
  const [frequency, setFrequency] = useState(1);

  // Anchor point
  const [selectedAnchor, setSelectedAnchor] = useState('center');
  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });
  const [boundingBox, setBoundingBox] = useState({ minX: 0, minY: 0, width: 0, height: 0 });

  const handlePlayAnimation = (index) => {
    handleStopAll(); 
    const animation = animations[index];

    setSelectedPathIndex(animation.elementIndex);
    setAnimationMode(animation.mode);
    setFrequency(animation.frequency);
    setCurrentRotation(0);
    setCurrentTranslation(0);
    setCurrentOpacity(1);
    setDirection(1);

    if (animation.mode === 'rotate') {
      setRotationAngle(animation.rotationAngle);
      setSelectedAnchor(animation.anchorPoint);
    } else if (animation.mode === 'translate') {
      setTranslateAxis(animation.translateAxis);
      setTranslateDistance(animation.translateDistance);
    } else if (animation.mode === 'opacity') {
      setOpacityRange(animation.opacityRange);
    }

    setTimeout(() => {
      setIsPlaying(true);
      setIsPlayingAll(false); 
    }, 50);
  };

  const handlePlayAllAnimations = () => {
    setIsPlaying(false); 
    setIsPlayingAll(true);
  };

  const handleStopAll = () => {
    setIsPlaying(false);
    setIsPlayingAll(false);
    setCurrentRotation(0);
    setCurrentTranslation(0);
    setCurrentOpacity(1);
    setDirection(1);
  };


  const handleRecordAnimation = (animationData) => {
    // Check if this element already has a recording
    const existingIndex = animations.findIndex(
      anim => anim.elementIndex === animationData.elementIndex
    );

    if (existingIndex >= 0) {
      // Replace existing animation
      const updated = [...animations];
      updated[existingIndex] = animationData;
      setAnimations(updated);
    } else {
      // Add new animation
      setAnimations([...animations, animationData]);
    }
  };

  const handleRemoveAnimation = (index) => {
    setAnimations(animations.filter((_, i) => i !== index));
    handleStopAll();
  };

  // Calculate anchor point whenever path data or selected anchor changes
  useEffect(() => {
    if (selectedPathIndex === null || selectedPathIndex >= 20) {
      setAnchorPoint({ x: 0, y: 0 });
      return;
    }

    const pathKey = `d${selectedPathIndex + 1}`;
    if (!pathData[pathKey]) {
      setAnchorPoint({ x: 0, y: 0 });
      return;
    }

    const bbox = getBoundingBoxFromPath(pathData[pathKey]);
    setBoundingBox(bbox);

    const anchorConfig = ANCHOR_POINTS.find(a => a.value === selectedAnchor);
    const newAnchorPoint = {
      x: bbox.minX + (bbox.width * anchorConfig.x),
      y: bbox.minY + (bbox.height * anchorConfig.y)
    };

    setAnchorPoint(newAnchorPoint);
  }, [selectedPathIndex, pathData, selectedAnchor]);

  const handleUploadSvg = (svgData) => {
    setSvgContent(svgData);
    setSelectedPathIndex(null);
    setSelectedElementData(null);

    // Check if SVG contains only path elements
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgData, 'image/svg+xml');
    const nonPathElements = Array.from(svgDoc.querySelectorAll('*')).filter(
      el => !['svg', 'path', 'title', 'desc', 'defs'].includes(el.tagName.toLowerCase())
    );
    setIsValidForAnimation(nonPathElements.length === 0);
  };

  const handlePathDataUpdate = (paths) => {
    const numberedPathData = {};
    paths.forEach((path, index) => {
      if (index >= 20) return;
      const num = index + 1;
      numberedPathData[`fill${num}`] = path.fill || 'none';
      numberedPathData[`d${num}`] = path.d || '';
      numberedPathData[`fillOpacity${num}`] = path.fillOpacity || '1';
      numberedPathData[`fillRule${num}`] = path.fillRule || 'nonzero';
    });
    setPathData(numberedPathData);
  };

  const handleElementSelect = (index, tagName, attributes) => {
    setSelectedPathIndex(index);
    const displayAttributes = { ...attributes };

    if (displayAttributes.style) {
      Object.entries(displayAttributes.style).forEach(([key, value]) => {
        displayAttributes[`style.${key}`] = value;
      });
      delete displayAttributes.style;
    }

    setSelectedElementData({ tagName, attributes: displayAttributes });
  };

  const toggleElementDetails = () => {
    setShowElementDetails(!showElementDetails);
  };

      console.log("Animations anchor", anchorPoint);
      const anchorPointMA =anchorPoint;

  return (
    <div className="App">
      <Toolbar onUploadSvg={handleUploadSvg} svgContent={svgContent} />
      <div className="app-container">
        <div className="left-column">
          <div className="svg-viewer">
            <h3 className="panel-heading">Select SVG Element Here:</h3>
            <SvgCanvas
              svgContent={svgContent}
              onPathDataUpdate={handlePathDataUpdate}
              onSelectPath={handleElementSelect}
              selectedPathIndex={selectedPathIndex}
            />
            {selectedElementData && (
              <div className="details-button-container">
                <button
                  onClick={toggleElementDetails}
                  className="details-button"
                  disabled={!selectedElementData}
                >
                  {showElementDetails ? 'Hide Details' : (
                    selectedPathIndex !== null
                      ? `Show Details of element ${selectedPathIndex + 1} - ${selectedElementData.tagName}`
                      : `Show Details of ${selectedElementData.tagName} element`
                  )}
                </button>
              </div>
            )}
          </div>
          <br></br>
          <br></br>
          <div className="animation-controls">
            <h3 className="panel-heading">Individual Animation Controls</h3>
            {isValidForAnimation ? (
              <AnimationPanel
                anchorPointMA={anchorPointMA}
                onRecordAnimation={handleRecordAnimation}
                recordedAnimations={animations}
                pathData={pathData}
                selectedElementData={selectedElementData}
                selectedPathIndex={selectedPathIndex}
                setSelectedPathIndex={setSelectedPathIndex}
                animationMode={animationMode}
                setAnimationMode={setAnimationMode}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
                direction={direction}
                setDirection={setDirection}
                animationRef={animationRef}
                rotationAngle={rotationAngle}
                setRotationAngle={setRotationAngle}
                currentRotation={currentRotation}
                setCurrentRotation={setCurrentRotation}
                translateDistance={translateDistance}
                setTranslateDistance={setTranslateDistance}
                currentTranslation={currentTranslation}
                setCurrentTranslation={setCurrentTranslation}
                translateAxis={translateAxis}
                setTranslateAxis={setTranslateAxis}
                opacityRange={opacityRange}
                setOpacityRange={setOpacityRange}
                currentOpacity={currentOpacity}
                setCurrentOpacity={setCurrentOpacity}
                frequency={frequency}
                setFrequency={setFrequency}
                selectedAnchor={selectedAnchor}
                setSelectedAnchor={setSelectedAnchor}
                anchorPoint={anchorPoint}
                boundingBox={boundingBox}
              />
            ) : (
              <div className="animation-disabled-message">
                <p>Animation controls disabled for this SVG type</p>
              </div>
            )}
          </div>
        </div>

        <div className="right-column">
          <div className='animated-svg-container' >
            <h3 className="panel-heading">Animation Preview</h3>
            {isValidForAnimation ? (
              <AnimatedSvgComponent
                boundingBox={boundingBox}
                animations={isPlayingAll ? animations : []} 
                isPlayingAll={isPlayingAll}
                svgContent={svgContent}
                pathData={pathData}
                selectedPathIndex={selectedPathIndex}
                translateAxis={translateAxis}
                currentOpacity={currentOpacity}
                rotation={currentRotation}
                translation={currentTranslation}
                animationMode={animationMode}
                isPlaying={isPlaying}
                frequency={frequency}
                setCurrentRotation={setCurrentRotation}
                setCurrentTranslation={setCurrentTranslation}
                setCurrentOpacity={setCurrentOpacity}
                setDirection={setDirection}
                animationRef={animationRef}
                rotationAngle={rotationAngle}
                translateDistance={translateDistance}
                opacityRange={opacityRange}
                direction={direction}
                selectedAnchor={selectedAnchor}
                anchorPoint={anchorPoint}
              />
            ) : (
              <div className="animation-disabled-message">
                <p>Animation controls disabled for this SVG type</p>
              </div>
            )}
          </div>
          <div className='animations-list-container'>
            <h3 className="panel-heading">Recorded Animations</h3>
            <AnimationsList
              animations={animations}
              onRemoveAnimation={handleRemoveAnimation}
              onPlayAnimation={handlePlayAnimation}
              isPlayingAll={isPlayingAll}
              handleStopAll={handleStopAll}
              handlePlayAllAnimations={handlePlayAllAnimations}
            />
          </div>
        </div>
        {showElementDetails && selectedElementData && (
          <div className="modal-overlay">
            <div className="modal-content">
              <SvgElementDetails
                selectedElementData={selectedElementData}
                selectedElementIndex={selectedElementData.tagName === 'path' ? selectedPathIndex : null}
                onClose={toggleElementDetails}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;