import React, { useEffect, useRef, forwardRef } from 'react';

const Canvas = forwardRef(({ drawingTool }, ref) => {
    const canvasRef = useRef(null);
    const isDrawing = useRef(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Set large canvas size
        canvas.width = 2000;
        canvas.height = 1500;

        // Set display size to fill container
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.cursor = drawingTool.tool === 'eraser' ? 'crosshair' : 'default';

        // Set up drawing event listeners
        const handleMouseDown = (e) => {
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            
            const x = (e.clientX - rect.left) * scaleX;
            const y = (e.clientY - rect.top) * scaleY;
            
            isDrawing.current = true;
            drawingTool.startDrawing(x, y);
        };

        const handleMouseMove = (e) => {
            if (!isDrawing.current) return;

            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            
            const x = (e.clientX - rect.left) * scaleX;
            const y = (e.clientY - rect.top) * scaleY;

            const ctx = canvas.getContext('2d');
            drawingTool.draw(ctx, x, y);
        };

        const handleMouseUp = () => {
            isDrawing.current = false;
            drawingTool.stopDrawing();
        };

        // Touch events for mobile
        const handleTouchStart = (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            
            const x = (touch.clientX - rect.left) * scaleX;
            const y = (touch.clientY - rect.top) * scaleY;
            
            isDrawing.current = true;
            drawingTool.startDrawing(x, y);
        };

        const handleTouchMove = (e) => {
            e.preventDefault();
            if (!isDrawing.current) return;

            const touch = e.touches[0];
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            
            const x = (touch.clientX - rect.left) * scaleX;
            const y = (touch.clientY - rect.top) * scaleY;

            const ctx = canvas.getContext('2d');
            drawingTool.draw(ctx, x, y);
        };

        const handleTouchEnd = () => {
            isDrawing.current = false;
            drawingTool.stopDrawing();
        };

        // Add event listeners
        canvas.addEventListener('mousedown', handleMouseDown);
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseup', handleMouseUp);
        canvas.addEventListener('mouseout', handleMouseUp);

        canvas.addEventListener('touchstart', handleTouchStart);
        canvas.addEventListener('touchmove', handleTouchMove);
        canvas.addEventListener('touchend', handleTouchEnd);

        // Forward ref
        if (ref) {
            ref.current = canvas;
        }

        // Cleanup
        return () => {
            canvas.removeEventListener('mousedown', handleMouseDown);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseup', handleMouseUp);
            canvas.removeEventListener('mouseout', handleMouseUp);
            canvas.removeEventListener('touchstart', handleTouchStart);
            canvas.removeEventListener('touchmove', handleTouchMove);
            canvas.removeEventListener('touchend', handleTouchEnd);
        };
    }, [drawingTool, ref]);

    return (
        <div className="canvas-container">
            <canvas
                ref={canvasRef}
                className="drawing-canvas"
                style={{
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    background: 'white',
                    cursor: drawingTool.tool === 'eraser' ? 'crosshair' : 'default'
                }}
            />
        </div>
    );
});

Canvas.displayName = 'Canvas';

export default Canvas;