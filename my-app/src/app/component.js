'use client'
import React, { useRef, useEffect, useState } from 'react';

export default function WhiteboardCanvas() {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentColor, setCurrentColor] = useState('black');
    const [lineWidth, setLineWidth] = useState(3);
    const [drawingActions, setDrawingActions] = useState([]);
    const [currentPath, setCurrentPath] = useState([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = 900;
        canvas.height = 500;
    }, []);

    useEffect(() => {
        const ctx = canvasRef.current.getContext('2d');
        reDrawPreviousData(ctx);
    }, [drawingActions]);

    const startDrawing = ({ nativeEvent }) => {
        const { offsetX, offsetY } = nativeEvent;
        setIsDrawing(true);
        setCurrentPath([{ x: offsetX, y: offsetY }]);
    };

    const draw = ({ nativeEvent }) => {
        if (!isDrawing) return;
        const { offsetX, offsetY } = nativeEvent;
        const newPath = [...currentPath, { x: offsetX, y: offsetY }];
        setCurrentPath(newPath);

        // Draw the current path
        const ctx = canvasRef.current.getContext('2d');
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.moveTo(currentPath[currentPath.length - 1].x, currentPath[currentPath.length - 1].y);
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
    };

    const endDrawing = () => {
        setIsDrawing(false);
        if (currentPath.length > 1) {
            setDrawingActions(prev => [...prev, { path: currentPath, color: currentColor, lineWidth }]);
        }
        setCurrentPath([]);
    };

    const undoDrawing = () => {
        setDrawingActions(prevActions => prevActions.slice(0, -1));
    };

    const clearDrawing = () => {
        setDrawingActions([]);
    };

    const reDrawPreviousData = (ctx) => {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        drawingActions.forEach(({ path, color, lineWidth }) => {
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = lineWidth;
            path.forEach((point, index) => {
                if (index === 0) {
                    ctx.moveTo(point.x, point.y);
                } else {
                    ctx.lineTo(point.x, point.y);
                }
            });
            ctx.stroke();
        });
    };

    return (
        <div className="whiteboard-container">
            <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={endDrawing}
                onMouseOut={endDrawing}
                style={{ border: '1px solid black' }}
            />
            <div className="controls">
                <input type="color" value={currentColor} onChange={e => setCurrentColor(e.target.value)} />
                <input type="range" min="1" max="10" value={lineWidth} onChange={e => setLineWidth(e.target.value)} />
                <button onClick={undoDrawing}>Undo</button>
                <button onClick={clearDrawing}>Clear</button>
            </div>
        </div>
    );
}
