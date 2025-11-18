export class DrawingTool {
    constructor() {
        this.tool = 'pen';
        this.color = '#000000';
        this.brushSize = 3;
        this.isDrawing = false;
        this.lastX = 0;
        this.lastY = 0;
        this.points = [];
        
        // Initialize callbacks
        this.onToolChange = null;
        this.onColorChange = null;
        this.onBrushSizeChange = null;
        this.onDraw = null;
        this.onDrawStart = null;
        this.onDrawEnd = null;
    }

    setTool(tool) {
        this.tool = tool;
        // Trigger callback if set
        if (this.onToolChange) {
            this.onToolChange(tool);
        }
    }

    setColor(color) {
        this.color = color;
        // Trigger callback if set
        if (this.onColorChange) {
            this.onColorChange(color);
        }
    }

    setBrushSize(size) {
        this.brushSize = size;
        // Trigger callback if set
        if (this.onBrushSizeChange) {
            this.onBrushSizeChange(size);
        }
    }

    startDrawing(x, y) {
        // Only start drawing if not in text mode
        if (this.tool !== 'text') {
            this.isDrawing = true;
            this.lastX = x;
            this.lastY = y;
            this.points = [[x, y]];
            
            if (this.onDrawStart) {
                this.onDrawStart();
            }
        }
    }

    draw(ctx, currentX, currentY) {
        // Only draw if not in text mode and actually drawing
        if (!this.isDrawing || this.tool === 'text') return;

        // Save current state
        ctx.save();
        
        ctx.strokeStyle = this.tool === 'eraser' ? '#FFFFFF' : this.color;
        ctx.lineWidth = this.brushSize;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.globalCompositeOperation = this.tool === 'eraser' ? 'destination-out' : 'source-over';

        // Draw locally
        ctx.beginPath();
        ctx.moveTo(this.lastX, this.lastY);
        ctx.lineTo(currentX, currentY);
        ctx.stroke();

        // Store points for remote sync
        this.points.push([currentX, currentY]);

        // Limit points array to prevent memory issues
        if (this.points.length > 50) {
            this.points = this.points.slice(-25);
        }

        this.lastX = currentX;
        this.lastY = currentY;

        // Emit drawing data for real-time sync
        if (this.points.length >= 2) {
            if (this.onDraw) {
                this.onDraw({
                    tool: this.tool,
                    color: this.color,
                    brushSize: this.brushSize,
                    points: this.points,
                    timestamp: Date.now()
                });
            }
        }

        // Restore state
        ctx.restore();
    }

    stopDrawing() {
        this.isDrawing = false;
        this.points = [];
        if (this.onDrawEnd) {
            this.onDrawEnd();
        }
    }

    // Callbacks for component communication
    setOnToolChange(callback) {
        this.onToolChange = callback;
    }

    setOnColorChange(callback) {
        this.onColorChange = callback;
    }

    setOnBrushSizeChange(callback) {
        this.onBrushSizeChange = callback;
    }

    setOnDraw(callback) {
        this.onDraw = callback;
    }

    setOnDrawStart(callback) {
        this.onDrawStart = callback;
    }

    setOnDrawEnd(callback) {
        this.onDrawEnd = callback;
    }
}