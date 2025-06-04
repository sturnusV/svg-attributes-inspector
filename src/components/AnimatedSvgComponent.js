import React, { useEffect, useState } from 'react';

const AnimatedSvgComponent = React.forwardRef(({
    pathData = {},
    selectedPathIndex,
    translateAxis,
    currentOpacity = 1,
    rotation = 0,
    translation = 0,
    anchorPoint,
    animationMode = 'rotate',
    width = "100%",
    height = "100%",
    viewBox = "0 0 768 768",
    isPlaying,
    frequency,
    setCurrentRotation,
    setCurrentTranslation,
    setCurrentOpacity,
    setDirection,
    animationRef,
    rotationAngle,
    translateDistance,
    opacityRange,
    direction,
    animations = [],
    isPlayingAll,
}, ref) => {

    const [multiAnimations, setMultiAnimations] = useState(() => {
        const initial = {};
        animations.forEach(anim => {
            initial[anim.elementIndex] = {
                rotation: 0,
                translation: 0,
                opacity: 1,
                direction: 1,
            };
        });
        return initial;
    });

    useEffect(() => {
        if (!isPlaying && !isPlayingAll) return;

        let lastTime = performance.now();
        const animate = (currentTime) => {
            const deltaTime = currentTime - lastTime;
            lastTime = currentTime;

            // Calculate speed factor once per frame
            const frameSpeedFactor = 0.3 * (deltaTime / 16.67);

            // Handle single element animation
            if (isPlaying && selectedPathIndex !== null) {
                const speedFactor = frequency * (deltaTime / 16.67);

                if (animationMode === 'rotate') {
                    setCurrentRotation(prev => {
                        const newValue = prev + (direction * speedFactor);
                        if (rotationAngle >= 0) {
                            if (newValue >= rotationAngle || newValue <= 0) setDirection(-direction);
                            return Math.max(0, Math.min(rotationAngle, newValue));
                        } else {
                            if (newValue <= rotationAngle || newValue >= 0) setDirection(-direction);
                            return Math.min(0, Math.max(rotationAngle, newValue));
                        }
                    });
                }
                else if (animationMode === 'translate') {
                    setCurrentTranslation(prev => {
                        const newValue = prev + (direction * speedFactor);
                        if (translateDistance >= 0) {
                            if (newValue >= translateDistance || newValue <= 0) setDirection(-direction);
                            return Math.max(0, Math.min(translateDistance, newValue));
                        } else {
                            if (newValue <= translateDistance || newValue >= 0) setDirection(-direction);
                            return Math.min(0, Math.max(translateDistance, newValue));
                        }
                    });
                }
                else {
                    setCurrentOpacity(prev => {
                        const minOpacity = Math.max(0, 1 - opacityRange);
                        const newValue = prev + (direction * speedFactor * 0.15);
                        if (newValue >= 1 || newValue <= minOpacity) setDirection(-direction);
                        return Math.max(minOpacity, Math.min(1, newValue));
                    });
                }
            }

            // Handle multiple animations
            if (isPlayingAll && animations.length > 0) {
                setMultiAnimations(prev => {
                    const updated = { ...prev };

                    // Process all animations with the same deltaTime
                    animations.forEach(anim => {
                        const speedFactor = anim.frequency * frameSpeedFactor;
                        const currentAnim = updated[anim.elementIndex] || {
                            rotation: 0,
                            translation: 0,
                            opacity: 1,
                            direction: 1,
                        };

                        // Apply the same timing to all animations
                        if (anim.mode === 'rotate') {
                            currentAnim.rotation += currentAnim.direction * speedFactor;

                            if (anim.rotationAngle >= 0) {
                                if (currentAnim.rotation >= anim.rotationAngle || currentAnim.rotation <= 0) {
                                    currentAnim.direction *= -1;
                                }
                                currentAnim.rotation = Math.max(0, Math.min(anim.rotationAngle, currentAnim.rotation));
                            } else {
                                if (currentAnim.rotation <= anim.rotationAngle || currentAnim.rotation >= 0) {
                                    currentAnim.direction *= -1;
                                }
                                currentAnim.rotation = Math.min(0, Math.max(anim.rotationAngle, currentAnim.rotation));
                            }
                        }
                        else if (anim.mode === 'translate') {
                            currentAnim.translation += currentAnim.direction * speedFactor;

                            if (anim.translateDistance >= 0) {
                                if (currentAnim.translation >= anim.translateDistance || currentAnim.translation <= 0) {
                                    currentAnim.direction *= -1;
                                }
                                currentAnim.translation = Math.max(0, Math.min(anim.translateDistance, currentAnim.translation));
                            } else {
                                if (currentAnim.translation <= anim.translateDistance || currentAnim.translation >= 0) {
                                    currentAnim.direction *= -1;
                                }
                                currentAnim.translation = Math.min(0, Math.max(anim.translateDistance, currentAnim.translation));
                            }
                        }
                        else if (anim.mode === 'opacity') {
                            currentAnim.opacity += currentAnim.direction * speedFactor * 0.15;
                            const minOpacity = Math.max(0, 1 - anim.opacityRange);

                            if (currentAnim.opacity >= 1 || currentAnim.opacity <= minOpacity) {
                                currentAnim.direction *= -1;
                            }
                            currentAnim.opacity = Math.max(minOpacity, Math.min(1, currentAnim.opacity));
                        }

                        updated[anim.elementIndex] = currentAnim;
                    });

                    return updated;
                });
            }

            animationRef.current = requestAnimationFrame(animate);
        };

        // Reset all animations to their starting positions when starting
        if (isPlayingAll) {
            setMultiAnimations(prev => {
                const reset = {};
                animations.forEach(anim => {
                    reset[anim.elementIndex] = {
                        rotation: 0,
                        translation: 0,
                        opacity: 1,
                        direction: 1,
                    };
                });
                return reset;
            });
        }

        animationRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationRef.current);

    }, [isPlaying, rotationAngle, translateDistance, opacityRange, direction, frequency,
        animationMode, animations, selectedPathIndex, animationRef, isPlayingAll, setCurrentOpacity, setCurrentRotation, setCurrentTranslation, setDirection]);

    const getTransform = (index) => {
        // For multiple animations
        if (isPlayingAll) {
            const anim = animations.find(a => a.elementIndex === index);
            if (!anim) return '';

            const currentAnim = multiAnimations[index];
            if (!currentAnim) return '';

            // Use the anchorPointMA from the animation object
            const anchor = anim.anchorPointMA;

            if (anim.mode === 'rotate') {
                return `rotate(${currentAnim.rotation}, ${anchor.x}, ${anchor.y})`;
            }
            else if (anim.mode === 'translate') {
                switch (anim.translateAxis) {
                    case 'x': return `translate(${currentAnim.translation}, 0)`;
                    case 'y': return `translate(0, ${currentAnim.translation})`;
                    case 'xy': return `translate(${currentAnim.translation}, ${currentAnim.translation})`;
                    default: return `translate(${currentAnim.translation}, 0)`;
                }
            }
            return '';
        }

        // For single animation
        if (selectedPathIndex !== index || animationMode === 'opacity') return '';

        if (animationMode === 'rotate') {
            // For single animation, continue to use the 'anchorPoint' prop
            return `rotate(${rotation}, ${anchorPoint.x}, ${anchorPoint.y})`;
        }
        else {
            switch (translateAxis) {
                case 'x': return `translate(${translation}, 0)`;
                case 'y': return `translate(0, ${translation})`;
                case 'xy': return `translate(${translation}, ${translation})`;
                default: return `translate(${translation}, 0)`;
            }
        }
    };

    const getOpacity = (index) => {
        // For multiple animations
        if (isPlayingAll) {
            const anim = animations.find(a => a.elementIndex === index && a.mode === 'opacity');
            if (!anim) return pathData[`fillOpacity${index + 1}`] || '1';

            const currentAnim = multiAnimations[index];
            return currentAnim ? currentAnim.opacity : (pathData[`fillOpacity${index + 1}`] || '1');
        }

        // For single animation
        return (selectedPathIndex === index && animationMode === 'opacity') ?
            currentOpacity : (pathData[`fillOpacity${index + 1}`] || '1');
    };

    const renderPaths = () => {
        const paths = [];
        for (let i = 1; i <= 20; i++) {
            paths.push(
                <path
                    key={i}
                    fill={pathData[`fill${i}`] || 'none'}
                    d={pathData[`d${i}`] || ''}
                    fillOpacity={getOpacity(i - 1)}
                    fillRule={pathData[`fillRule${i}`] || 'nonzero'}
                    transform={getTransform(i - 1)}
                />
            );
        }
        return paths;
    };

    return (
        <div className="animated-svg-component-container">
            <svg
                ref={ref}
                xmlns="http://www.w3.org/2000/svg"
                width={width}
                height={height}
                viewBox={viewBox}
                preserveAspectRatio="xMidYMid meet"
                style={{
                    display: 'block',
                    margin: 'auto',
                    maxHeight: '70vh',
                }}
            >
                {renderPaths()}
            </svg>
        </div>
    );
});

export default AnimatedSvgComponent;