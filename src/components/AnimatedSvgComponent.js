import React, { useEffect } from 'react';

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
    direction
}, ref) => {

    useEffect(() => {
        if (!isPlaying) return;

        let lastTime = performance.now();
        const animate = (currentTime) => {
            const deltaTime = currentTime - lastTime;
            lastTime = currentTime;
            const speedFactor = frequency * 0.3 * (deltaTime / 16.67);

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

                    if (newValue >= 1 || newValue <= minOpacity) {
                        setDirection(-direction);
                    }
                    return Math.max(minOpacity, Math.min(1, newValue));
                });
            }

            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationRef.current);
    }, [isPlaying, rotationAngle, translateDistance, opacityRange, direction, frequency, animationMode, animationRef, setCurrentOpacity, setCurrentRotation, setCurrentTranslation, setDirection ]);

    const getTransform = (index) => {
        if (selectedPathIndex !== index || animationMode === 'opacity') return '';

        if (animationMode === 'rotate') {
            return `rotate(${rotation}, ${anchorPoint.x}, ${anchorPoint.y})`;
        }
        else { 
            switch (translateAxis) {
                case 'x':
                    return `translate(${translation}, 0)`;
                case 'y':
                    return `translate(0, ${translation})`;
                case 'xy':
                    return `translate(${translation}, ${translation})`;
                default:
                    return `translate(${translation}, 0)`;
            }
        }
    };

    const getOpacity = (index) => {
        return (selectedPathIndex === index && animationMode === 'opacity')
            ? currentOpacity
            : (pathData[`fillOpacity${index + 1}`] || '1');
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