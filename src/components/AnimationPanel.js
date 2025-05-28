import { ANCHOR_POINTS } from './animationUtils';

const AnimationPanel = ({
    selectedElementData,
    selectedPathIndex,
    animationMode,
    setAnimationMode,
    isPlaying,
    setIsPlaying,
    setDirection,
    rotationAngle,
    setRotationAngle,
    currentRotation,
    setCurrentRotation,
    translateDistance,
    setTranslateDistance,
    setCurrentTranslation,
    translateAxis,
    setTranslateAxis,
    opacityRange,
    setOpacityRange,
    currentOpacity,
    setCurrentOpacity,
    frequency,
    setFrequency,
    selectedAnchor,
    setSelectedAnchor,
    anchorPoint,
}) => {

    const handleModeChange = (mode) => {
        setAnimationMode(mode);
        setCurrentRotation(0);
        setCurrentTranslation(0);
        setCurrentOpacity(1);
        setDirection(1);
    };

    const handleFrequencyChange = (e) => {
        setFrequency(Math.max(0.1, Math.min(10, Number(e.target.value))));
    };

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    const handleStop = () => {
        setIsPlaying(false);
        setCurrentRotation(0);
        setCurrentTranslation(0);
        setCurrentOpacity(1);  
        setDirection(1);
    };

    const handleRotationChange = (e) => {
        let value = Number(e.target.value);
        value = Math.max(-360, Math.min(360, value));
        setRotationAngle(value);

        if (value < 0) {
            setDirection(-1);
            setCurrentRotation(0);
        } else {
            setDirection(1);
            setCurrentRotation(0);
        }
    };

    return (
         <div className="animation-panel">
            <div className="panel-header">
                <div className="mode-selector">
                    <label>
                        Animation Mode for <span className="path-value"> {selectedPathIndex !== null ? `Element ${selectedPathIndex + 1} ${selectedElementData.tagName}` : 'None'} </span> 
                    </label>
                    <div className="mode-buttons">
                        <button
                            onClick={() => handleModeChange('rotate')}
                            className={`mode-button ${animationMode === 'rotate' ? 'active' : ''}`}
                        >
                            Rotate
                        </button>
                        <button
                            onClick={() => handleModeChange('translate')}
                            className={`mode-button ${animationMode === 'translate' ? 'active' : ''}`}
                        >
                            Translate
                        </button>
                        <button
                            onClick={() => handleModeChange('opacity')}
                            className={`mode-button ${animationMode === 'opacity' ? 'active' : ''}`}
                        >
                            Opacity
                        </button>
                    </div>
                </div>
            </div>

            <div className="animation-controls">
                {animationMode === 'rotate' && (
                    <div className="rotate-controls">
                        <div className="control-group">
                            <label>Anchor Point: </label>
                            <select
                                value={selectedAnchor}
                                onChange={(e) => setSelectedAnchor(e.target.value)}
                                disabled={selectedPathIndex === null}
                                className="anchor-select"
                            >
                                {ANCHOR_POINTS.map(anchor => (
                                    <option key={anchor.value} value={anchor.value}>
                                        {anchor.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="control-group">
                            <label>Rotation Angle in Degrees: </label>
                            <input
                                type="number"
                                min="-360"
                                max="360"
                                step="1"
                                value={rotationAngle}
                                onChange={handleRotationChange}
                                disabled={selectedPathIndex === null}
                                className="angle-input"
                            />
                        </div>
                        <div className="control-group">
                            <label>Current Rotation: </label>
                            <span className="rotation-value">{currentRotation.toFixed(1)}°</span>
                        </div>
                    </div>
                )}

                {animationMode === 'translate' && (
                    <div className="translate-controls">
                        <div className="control-group">
                            <label>Translate Axis: </label>
                            <select
                                value={translateAxis}
                                onChange={(e) => setTranslateAxis(e.target.value)}
                                disabled={selectedPathIndex === null}
                                className="axis-select"
                            >
                                <option value="x">X Axis</option>
                                <option value="y">Y Axis</option>
                                <option value="xy">Diagonal</option>
                            </select>
                        </div>
                        <div className="control-group">
                            <label>
                                Translate Distance: <span className="slider-value">{translateDistance}px</span>
                            </label>
                            <div className="control-group">
                                <input
                                    type="number"
                                    min="-100"
                                    max="100"
                                    step="1"
                                    value={translateDistance}
                                    onChange={(e) => setTranslateDistance(Number(e.target.value))}
                                    disabled={selectedPathIndex === null}
                                    className="angle-input"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {animationMode === 'opacity' && (
                    <div className="opacity-controls">
                        <div className="control-group">
                            <label>
                                Opacity Range: <span className="slider-value">{opacityRange.toFixed(2)}</span>
                            </label>
                            <div className="control-group">
                                <input
                                    type="number"
                                    min="0"
                                    max="1"
                                    step="0.05"
                                    value={opacityRange}
                                    onChange={(e) => setOpacityRange(Number(e.target.value))}
                                    disabled={selectedPathIndex === null}
                                    className="angle-input"
                                />
                            </div>
                            <div className="opacity-visualizer">
                                <div 
                                    className="opacity-level"
                                    style={{
                                        width: `${currentOpacity * 100}%`,
                                        opacity: currentOpacity
                                    }} 
                                />
                            </div>
                        </div>
                    </div>
                )}

                <div className="control-group">
                    <label>
                        Frequency: <span className="slider-value">{frequency}x</span>
                    </label>
                    <div className="control-group">
                        <input
                            type="number"
                            min="0.1"
                            max="10"
                            step="0.1"
                            value={frequency}
                            onChange={handleFrequencyChange}
                            disabled={selectedPathIndex === null}
                            className="angle-input"
                        />
                    </div>
                </div>

                <div className="playback-controls">
                    <button
                        onClick={handlePlayPause}
                        disabled={selectedPathIndex === null}
                        className={`play-button ${isPlaying ? 'pause' : 'play'}`}
                    >
                        {isPlaying ? 'Pause' : 'Play'}
                    </button>
                    <button
                        onClick={handleStop}
                        disabled={selectedPathIndex === null}
                        className="stop-button"
                    >
                        Stop
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AnimationPanel;