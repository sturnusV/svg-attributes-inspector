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

    // Check if SVG contains only path elements!
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

  const handleExport = (svgContent, animations) => {
    // 1. Parse the SVG content to extract paths and their attributes
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
    const paths = svgDoc.querySelectorAll('path');
    
    // 2. Generate the React Native component code
    let componentCode = generateComponentCode(paths, animations);
    
    // 3. Create a downloadable file
    downloadFile('AnimatedComponent.js', componentCode);
};

const generateComponentCode = (paths, animations) => {
    // Generate imports
    let code = `import React, { useEffect, useState } from 'react';\n`;
    code += `import { View, StyleSheet, Dimensions } from 'react-native';\n`;
    code += `import Svg, { Path, G } from 'react-native-svg';\n`;
    code += `import Animated, { useSharedValue, useAnimatedProps, withRepeat, withTiming } from 'react-native-reanimated';\n\n`;
    
    code += `const { width, height } = Dimensions.get('window');\n\n`;
    
    // Add bounding box helper function
    code += `const getBoundingBoxFromPath = (d) => {\n`;
    code += `  const commands = d.match(/-?\\d*\\.?\\d+/g).map(Number);\n`;
    code += `  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;\n\n`;
    code += `  for (let i = 0; i < commands.length; i += 2) {\n`;
    code += `    const x = commands[i];\n`;
    code += `    const y = commands[i + 1];\n`;
    code += `    if (x < minX) minX = x;\n`;
    code += `    if (y < minY) minY = y;\n`;
    code += `    if (x > maxX) maxX = x;\n`;
    code += `    if (y > maxY) maxY = y;\n`;
    code += `  }\n\n`;
    code += `  return {\n`;
    code += `    minX,\n`;
    code += `    minY,\n`;
    code += `    maxX,\n`;
    code += `    maxY,\n`;
    code += `    width: maxX - minX,\n`;
    code += `    height: maxY - minY,\n`;
    code += `  };\n`;
    code += `};\n\n`;
    
    code += `const AnimatedPath = Animated.createAnimatedComponent(Path);\n`;
    code += `const AnimatedG = Animated.createAnimatedComponent(G);\n\n`;
    
    // Start component definition
    code += `const AnimatedSVGComponent = () => {\n`;
    
    // Generate shared values for each animation
    animations.forEach((anim, index) => {
        code += `  const animation${index + 1} = useSharedValue(${getInitialValue(anim.mode)});\n`;
    });
    code += `\n`;

    // Generate path data constants
    paths.forEach((path, index) => {
        const d = path.getAttribute('d');
        const fill = path.getAttribute('fill') || '#000000';
        const fillOpacity = path.getAttribute('fill-opacity') || '1';
        const fillRule = path.getAttribute('fill-rule') || 'nonzero';
        
        code += `  const pathD${index + 1} = "${d}";\n`;
        code += `  const path${index + 1}Fill = "${fill}";\n`;
        code += `  const path${index + 1}FillOpacity = "${fillOpacity}";\n`;
        code += `  const path${index + 1}FillRule = "${fillRule}";\n\n`;
    });

    // Generate animated props using the pre-calculated bounding boxes and anchor points
    animations.forEach((anim, index) => {
        code += `  // Animation for element ${anim.elementIndex + 1} (${anim.elementType})\n`;
        code += `  const animatedProps${index + 1} = useAnimatedProps(() => {\n`;
        code += generateAnimatedPropsCode(anim, index);
        code += `  });\n\n`;
    });

    // Generate animation effects
    animations.forEach((anim, index) => {
        code += generateAnimationEffectCode(anim, index);
    });
    
    // Generate JSX return
    code += `  return (\n`;
    code += `    <View style={styles.container}>\n`;
    code += `      <Svg width={256} height={256} viewBox="-128 -128 1024 1024">\n`;
    
    paths.forEach((path, index) => {
        const animIndex = animations.findIndex(a => a.elementIndex === index);
        const fill = path.getAttribute('fill') || '#000000';
        const fillOpacity = path.getAttribute('fill-opacity') || '1';
        const fillRule = path.getAttribute('fill-rule') || 'nonzero';
        
        if (animIndex >= 0) {
            code += `          <AnimatedPath d={pathD${index + 1}} animatedProps={animatedProps${animIndex + 1}} fill="${fill}" fill-opacity="${fillOpacity}" fill-rule="${fillRule}" />\n`;
        } else {
            code += `          <AnimatedPath d={pathD${index + 1}} fill="${fill}" fill-opacity="${fillOpacity}" fill-rule="${fillRule}" />\n`;
        }
    });
    
    code += `      </Svg>\n`;
    code += `    </View>\n`;
    code += `  );\n`;
    code += `};\n\n`;
    
    // Add styles
    code += `const styles = StyleSheet.create({\n`;
    code += `  container: {\n`;
    code += `    flex: 1,\n`;
    code += `    justifyContent: 'center',\n`;
    code += `    alignItems: 'center',\n`;
    code += `  },\n`;
    code += `});\n\n`;
    
    code += `export default AnimatedSVGComponent;\n`;
    
    return code;
};

const getInitialValue = (mode) => {
    switch(mode) {
        case 'rotate': return '0';
        case 'scale': return '1';
        case 'translate': return '0';
        case 'opacity': return '1';
        default: return '0';
    }
};

const generateAnimatedPropsCode = (animation, index) => {
    let code = '';
    const animationVar = `animation${index + 1}`;
    
    switch(animation.mode) {
        case 'rotate':
            // Use the pre-calculated anchor point from animation data
            if (animation.anchorPointMA) {
                // Use manual anchor point if specified
                code = `    return {\n`;
                code += `      transform: [\n`;
                code += `        { translateX: ${animation.anchorPointMA.x} },\n`;
                code += `        { translateY: ${animation.anchorPointMA.y} },\n`;
                code += `        { rotate: \`\${${animationVar}.value}deg\` },\n`;
                code += `        { translateX: -${animation.anchorPointMA.x} },\n`;
                code += `        { translateY: -${animation.anchorPointMA.y} },\n`;
                code += `      ],\n`;
                code += `    };\n`;
            } else {
                // Fallback to standard anchor points
                const bbox = animation.boundingBox;
                code = `    // Using standard anchor point: ${animation.anchorPoint}\n`;
                code += `    const bbox = ${JSON.stringify(bbox)};\n`;
                code += `    let anchorX, anchorY;\n\n`;
                
                code += `    switch('${animation.anchorPoint}') {\n`;
                code += `      case 'top-left':\n`;
                code += `        anchorX = bbox.minX;\n`;
                code += `        anchorY = bbox.minY;\n`;
                code += `        break;\n`;
                code += `      case 'top':\n`;
                code += `        anchorX = (bbox.minX + bbox.maxX) / 2;\n`;
                code += `        anchorY = bbox.minY;\n`;
                code += `        break;\n`;
                code += `      case 'top-right':\n`;
                code += `        anchorX = bbox.maxX;\n`;
                code += `        anchorY = bbox.minY;\n`;
                code += `        break;\n`;
                code += `      case 'left':\n`;
                code += `        anchorX = bbox.minX;\n`;
                code += `        anchorY = (bbox.minY + bbox.maxY) / 2;\n`;
                code += `        break;\n`;
                code += `      case 'center':\n`;
                code += `        anchorX = (bbox.minX + bbox.maxX) / 2;\n`;
                code += `        anchorY = (bbox.minY + bbox.maxY) / 2;\n`;
                code += `        break;\n`;
                code += `      case 'right':\n`;
                code += `        anchorX = bbox.maxX;\n`;
                code += `        anchorY = (bbox.minY + bbox.maxY) / 2;\n`;
                code += `        break;\n`;
                code += `      case 'bottom-left':\n`;
                code += `        anchorX = bbox.minX;\n`;
                code += `        anchorY = bbox.maxY;\n`;
                code += `        break;\n`;
                code += `      case 'bottom':\n`;
                code += `        anchorX = (bbox.minX + bbox.maxX) / 2;\n`;
                code += `        anchorY = bbox.maxY;\n`;
                code += `        break;\n`;
                code += `      case 'bottom-right':\n`;
                code += `        anchorX = bbox.maxX;\n`;
                code += `        anchorY = bbox.maxY;\n`;
                code += `        break;\n`;
                code += `    }\n\n`;
                
                code += `    return {\n`;
                code += `      transform: [\n`;
                code += `        { translateX: anchorX },\n`;
                code += `        { translateY: anchorY },\n`;
                code += `        { rotate: \`\${${animationVar}.value}deg\` },\n`;
                code += `        { translateX: -anchorX },\n`;
                code += `        { translateY: -anchorY },\n`;
                code += `      ],\n`;
                code += `    };\n`;
            }
            break;
            
        case 'translate':
            if (animation.translateAxis === 'x') {
                code = `    return {\n`;
                code += `      transform: [\n`;
                code += `        { translateX: ${animationVar}.value },\n`;
                code += `      ],\n`;
                code += `    };\n`;
            } else {
                code = `    return {\n`;
                code += `      transform: [\n`;
                code += `        { translateY: ${animationVar}.value },\n`;
                code += `      ],\n`;
                code += `    };\n`;
            }
            break;
            
        case 'scale':
            const bbox = animation.boundingBox;
            code = `    const centerX = ${(bbox.minX + bbox.maxX) / 2};\n`;
            code += `    const centerY = ${(bbox.minY + bbox.maxY) / 2};\n\n`;
            code += `    return {\n`;
            code += `      transform: [\n`;
            code += `        { translateX: centerX },\n`;
            code += `        { translateY: centerY },\n`;
            code += `        { scale: ${animationVar}.value },\n`;
            code += `        { translateX: -centerX },\n`;
            code += `        { translateY: -centerY },\n`;
            code += `      ],\n`;
            code += `    };\n`;
            break;
            
        case 'opacity':
            code = `    return {\n`;
            code += `      opacity: ${animationVar}.value,\n`;
            code += `    };\n`;
            break;
            
        default:
            code = `    return {};\n`;
    }
    
    return code;
};

const generateAnimationEffectCode = (animation, index) => {
    let code = `  useEffect(() => {\n`;
    code += `    animation${index + 1}.value = withRepeat(\n`;
    code += `      withTiming(${getAnimationTargetValue(animation)}, { duration: ${1000*animation.frequency} }),\n`;
    code += `      -1,\n`;
    code += `      true\n`;
    code += `    );\n`;
    code += `  }, []);\n\n`;
    return code;
};

const getAnimationTargetValue = (animation) => {
    switch(animation.mode) {
        case 'rotate': return animation.rotationAngle;
        case 'translate': return animation.translateDistance;
        case 'scale': return animation.scaleTo;
        case 'opacity': return animation.opacityRange;
        default: return '0';
    }
};

const downloadFile = (filename, text) => {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
};

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
              svgContent={svgContent}
              animations={animations}
              handleExport={handleExport}
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