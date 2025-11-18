import React, { useState, useEffect } from 'react';
import './Toolbar.css';

const Toolbar = ({ drawingTool, onClear, onExport, onUndo, onRedo, onSave, canUndo, canRedo }) => {
    const [currentTool, setCurrentTool] = useState(drawingTool.tool);
    const [currentColor, setCurrentColor] = useState(drawingTool.color);
    const [currentBrushSize, setCurrentBrushSize] = useState(drawingTool.brushSize);

    // Update state when drawingTool properties change
    useEffect(() => {
        const updateTool = (tool) => setCurrentTool(tool);
        const updateColor = (color) => setCurrentColor(color);
        const updateBrushSize = (size) => setCurrentBrushSize(size);

        drawingTool.setOnToolChange(updateTool);
        drawingTool.setOnColorChange(updateColor);
        drawingTool.setOnBrushSizeChange(updateBrushSize);

        return () => {
            // Cleanup callbacks
            drawingTool.setOnToolChange(null);
            drawingTool.setOnColorChange(null);
            drawingTool.setOnBrushSizeChange(null);
        };
    }, [drawingTool]);

    const tools = [
        { id: 'pen', label: 'Pen', icon: '✏️' },
        { id: 'eraser', label: 'Eraser', icon: '🧹' }
    ];

    const colors = [
        '#000000', '#ef4444', '#f59e0b', '#10b981', 
        '#3b82f6', '#8b5cf6', '#ec4899', '#6b7280'
    ];

    const brushSizes = [1, 3, 5, 8, 12];

    const handleToolChange = (tool) => {
        drawingTool.setTool(tool);
        setCurrentTool(tool);
    };

    const handleColorChange = (color) => {
        drawingTool.setColor(color);
        setCurrentColor(color);
    };

    const handleBrushSizeChange = (size) => {
        drawingTool.setBrushSize(size);
        setCurrentBrushSize(size);
    };

    return (
        <div className="toolbar">
            <h3>Tools</h3>
            
            <div className="tool-group">
                <label className="tool-label">Select Tool</label>
                <div className="tools-grid">
                    {tools.map(tool => (
                        <button
                            key={tool.id}
                            className={`tool-btn ${currentTool === tool.id ? 'active' : ''}`}
                            onClick={() => handleToolChange(tool.id)}
                            title={tool.label}
                        >
                            <span className="tool-icon">{tool.icon}</span>
                            {tool.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="tool-group">
                <label className="tool-label">Color</label>
                <div className="colors-grid">
                    {colors.map(color => (
                        <button
                            key={color}
                            className={`color-btn ${currentColor === color ? 'active' : ''}`}
                            style={{ backgroundColor: color }}
                            onClick={() => handleColorChange(color)}
                            title={color}
                        >
                            {currentColor === color && (
                                <span className="color-check">✓</span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <div className="tool-group">
                <label className="tool-label">Brush Size</label>
                <div className="brush-sizes">
                    {brushSizes.map(size => (
                        <button
                            key={size}
                            className={`brush-btn ${currentBrushSize === size ? 'active' : ''}`}
                            onClick={() => handleBrushSizeChange(size)}
                        >
                            <div 
                                className="brush-preview"
                                style={{ 
                                    width: Math.max(8, size * 2), 
                                    height: Math.max(8, size * 2),
                                    backgroundColor: currentColor 
                                }}
                            />
                            <span>{size}px</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="tool-group">
                <label className="tool-label">History</label>
                <div className="history-buttons">
                    <button 
                        className={`btn btn-secondary history-btn ${!canUndo ? 'disabled' : ''}`}
                        onClick={onUndo}
                        disabled={!canUndo}
                    >
                        ↩️ Undo
                    </button>
                    <button 
                        className={`btn btn-secondary history-btn ${!canRedo ? 'disabled' : ''}`}
                        onClick={onRedo}
                        disabled={!canRedo}
                    >
                        ↪️ Redo
                    </button>
                </div>
            </div>

            <div className="tool-group">
                <label className="tool-label">Actions</label>
                <div className="action-buttons">
                    <button 
                        className="btn btn-secondary action-btn"
                        onClick={onClear}
                    >
                        🗑️ Clear Board
                    </button>
                    
                    <button 
                        className="btn btn-primary action-btn"
                        onClick={onSave}
                    >
                        💾 Save Board
                    </button>
                    
                    <button 
                        className="btn btn-primary action-btn"
                        onClick={() => onExport('png')}
                    >
                        📤 Export PNG
                    </button>
                    
                    <button 
                        className="btn btn-primary action-btn"
                        onClick={() => onExport('jpg')}
                    >
                        📤 Export JPG
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Toolbar;