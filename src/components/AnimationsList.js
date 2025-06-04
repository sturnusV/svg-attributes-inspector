import React from 'react';

const AnimationsList = ({ svgContent, animations, onRemoveAnimation, onPlayAnimation, isPlayingAll, handleStopAll, handlePlayAllAnimations, handleExport }) => {
    
    const generateExportCode = () => {
        handleExport(svgContent, animations);
    };
    

    return (
        <div className="animations-list">
            <div className="global-controls">
                <button
                    onClick={handlePlayAllAnimations}
                    disabled={animations.length === 0}
                    className={`play-all-button ${isPlayingAll ? 'active' : ''}`}
                >
                    {isPlayingAll ? 'Playing All' : 'Play All Animations'}
                </button>
                <button
                    onClick={handleStopAll}
                    disabled={!isPlayingAll}
                    className="stop-all-button"
                >
                    Stop All
                </button>
                <button
                    onClick={generateExportCode}
                    disabled={animations.length === 0}
                    className="export-button"
                >
                    Export as React Native Component
                </button>
            </div>
            {animations.length === 0 ? (
                <p>No animations recorded yet</p>
            ) : (
                <ul className="animations-tags-list">
                    {animations.map((animation, index) => (
                        <li key={index} className="animation-item">
                            <div className="animation-tags-wrapper">
                                <span className="animation-tag element-name">
                                    Element {animation.elementIndex + 1} ({animation.elementType})
                                </span>
                                <span className="animation-tag animation-mode">Mode: {animation.mode}</span>
                                {animation.mode === 'rotate' && (
                                    <>
                                        <span className="animation-tag">Angle: {animation.rotationAngle}°</span>
                                        <span className="animation-tag">Anchor: {animation.anchorPoint}</span>
                                    </>
                                )}
                                {animation.mode === 'translate' && (
                                    <>
                                        <span className="animation-tag">Axis: {animation.translateAxis}</span>
                                        <span className="animation-tag">Distance: {animation.translateDistance}px</span>
                                    </>
                                )}
                                {animation.mode === 'opacity' && (
                                    <span className="animation-tag">Range: {animation.opacityRange.toFixed(2)}</span>
                                )}
                                <span className="animation-tag">Frequency: {animation.frequency}x</span>
                            </div>
                            <div className="animation-actions">
                                <button
                                    onClick={() => onPlayAnimation(index)}
                                    className="play-animation-button"
                                >
                                    Play
                                </button>
                                <button
                                    onClick={() => onRemoveAnimation(index)}
                                    className="remove-animation-button"
                                >
                                    Remove
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AnimationsList;