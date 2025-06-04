import { ANCHOR_POINTS } from './animationUtils';
import React from 'react';

const AnimationPanel = ({
    anchorPointMA,
    boundingBox,
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
    onRecordAnimation,
    recordedAnimations,
}) => {
    console.log("Panel anchor", anchorPointMA);

    const handleModeChange = (mode) => {
        setAnimationMode(mode);
        setCurrentRotation(0);
        setCurrentTranslation(0);
        setCurrentOpacity(1);
        setDirection(1);
    };

    const handleNumberInputChange = (setter, currentValue, step, min, max, direction, decimalPlaces = 0) => {
        let newValue = currentValue + (step * direction);
        if (decimalPlaces > 0) {
            newValue = parseFloat(newValue.toFixed(decimalPlaces));
        }
        setter(Math.max(min, Math.min(max, newValue)));
    };
    // -----------------------------------------------------------

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
        // Allow typing negative numbers, validation happens on blur/input end
        // But for setting direction for animation, we still check.
        if (isNaN(value)) value = 0; // Handle empty input gracefully

        setRotationAngle(value);

        // Update direction based on the typed value
        if (value < 0) {
            setDirection(-1);
        } else {
            setDirection(1);
        }
    };

    const handleTranslateDistanceChange = (e) => {
        let value = Number(e.target.value);
        if (isNaN(value)) value = 0;
        setTranslateDistance(Math.max(-100, Math.min(100, value)));
    };

    const handleOpacityRangeChange = (e) => {
        let value = Number(e.target.value);
        if (isNaN(value)) value = 0;
        // Clamp value between 0 and 1, and ensure two decimal places
        setOpacityRange(parseFloat(Math.max(0, Math.min(1, value)).toFixed(2)));
    };

    const handleFrequencyChange = (e) => {
        let value = Number(e.target.value);
        if (isNaN(value)) value = 0.1; // Default if typed empty
        setFrequency(parseFloat(Math.max(0.1, Math.min(10, value)).toFixed(1))); // toFixed for 1 decimal place
    };


    const handleRecord = () => {
        if (selectedPathIndex === null) return;

        const animationData = {
            elementIndex: selectedPathIndex,
            elementType: selectedElementData.tagName,
            mode: animationMode,
            frequency,
            boundingBox,
            anchorPoint,
            anchorPointMA,
        };

        if (animationMode === 'rotate') {
            animationData.rotationAngle = rotationAngle;
            animationData.anchorPoint = selectedAnchor;
        } else if (animationMode === 'translate') {
            animationData.translateAxis = translateAxis;
            animationData.translateDistance = translateDistance;
        } else if (animationMode === 'opacity') {
            animationData.opacityRange = opacityRange;
        }

        onRecordAnimation(animationData);
    };

    const hasRecording = recordedAnimations.some(
        anim => anim.elementIndex === selectedPathIndex
    );

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
                            <div className="input-with-buttons">
                                <button
                                    onClick={() => handleNumberInputChange(setRotationAngle, rotationAngle, 1, -360, 360, -1)}
                                    disabled={selectedPathIndex === null}
                                    className="spinner-button"
                                >
                                    -
                                </button>
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
                                <button
                                    onClick={() => handleNumberInputChange(setRotationAngle, rotationAngle, 1, -360, 360, 1)}
                                    disabled={selectedPathIndex === null}
                                    className="spinner-button"
                                >
                                    +
                                </button>
                            </div>
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
                            </select>
                        </div>
                        <div className="control-group">
                            <label>
                                Translate Distance: <span className="slider-value">{translateDistance}px</span>
                            </label>
                            <div className="input-with-buttons">
                                <button
                                    onClick={() => handleNumberInputChange(setTranslateDistance, translateDistance, 1, -100, 100, -1)}
                                    disabled={selectedPathIndex === null}
                                    className="spinner-button"
                                >
                                    -
                                </button>
                                <input
                                    type="number"
                                    min="-100"
                                    max="100"
                                    step="1"
                                    value={translateDistance}
                                    onChange={handleTranslateDistanceChange} 
                                    disabled={selectedPathIndex === null}
                                    className="angle-input"
                                />
                                <button
                                    onClick={() => handleNumberInputChange(setTranslateDistance, translateDistance, 1, -100, 100, 1)}
                                    disabled={selectedPathIndex === null}
                                    className="spinner-button"
                                >
                                    +
                                </button>
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
                            <div className="input-with-buttons">
                                <button
                                    onClick={() => handleNumberInputChange(setOpacityRange, opacityRange, 0.05, 0, 1, -1, 2)} 
                                    disabled={selectedPathIndex === null}
                                    className="spinner-button"
                                >
                                    -
                                </button>
                                <input
                                    type="number"
                                    min="0"
                                    max="1"
                                    step="0.05"
                                    value={opacityRange}
                                    onChange={handleOpacityRangeChange} 
                                    disabled={selectedPathIndex === null}
                                    className="angle-input"
                                />
                                <button
                                    onClick={() => handleNumberInputChange(setOpacityRange, opacityRange, 0.05, 0, 1, 1, 2)} 
                                    disabled={selectedPathIndex === null}
                                    className="spinner-button"
                                >
                                    +
                                </button>
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
                        Frequency: <span className="slider-value">{frequency.toFixed(1)}x</span> 
                    </label>
                    <div className="input-with-buttons">
                        <button
                            onClick={() => handleNumberInputChange(setFrequency, frequency, 0.1, 0.1, 10, -1, 1)} 
                            disabled={selectedPathIndex === null}
                            className="spinner-button"
                        >
                            -
                        </button>
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
                        <button
                            onClick={() => handleNumberInputChange(setFrequency, frequency, 0.1, 0.1, 10, 1, 1)} 
                            disabled={selectedPathIndex === null}
                            className="spinner-button"
                        >
                            +
                        </button>
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
                    <button
                        onClick={handleRecord}
                        disabled={selectedPathIndex === null || hasRecording}
                        className="record-button"
                        title={hasRecording ? "This element already has a recorded animation" : "Record animation"}
                    >
                        Record
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AnimationPanel;