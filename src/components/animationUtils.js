export const ANCHOR_POINTS = [
    { label: 'Top Left', value: 'top-left', x: 0, y: 0 },
    { label: 'Top', value: 'top', x: 0.5, y: 0 },
    { label: 'Top Right', value: 'top-right', x: 1, y: 0 },
    { label: 'Middle Left', value: 'middle-left', x: 0, y: 0.5 },
    { label: 'Center', value: 'center', x: 0.5, y: 0.5 },
    { label: 'Middle Right', value: 'middle-right', x: 1, y: 0.5 },
    { label: 'Bottom Left', value: 'bottom-left', x: 0, y: 1 },
    { label: 'Bottom', value: 'bottom', x: 0.5, y: 1 },
    { label: 'Bottom Right', value: 'bottom-right', x: 1, y: 1 },
];

export const getBoundingBoxFromPath = (d) => {
    if (!d) return { minX: 0, minY: 0, maxX: 0, maxY: 0, width: 0, height: 0 };

    const commands = d.match(/-?\d*\.?\d+/g)?.map(Number) || [];
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    for (let i = 0; i < commands.length; i += 2) {
        const x = commands[i];
        const y = commands[i + 1];
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
    }

    if (minX === Infinity) {
        minX = minY = maxX = maxY = 0;
    }

    return {
        minX,
        minY,
        maxX,
        maxY,
        width: maxX - minX,
        height: maxY - minY,
    };
};