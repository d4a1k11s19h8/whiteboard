export class WhiteboardManager {
    constructor() {
        this.rooms = new Map();
        this.currentRoom = null;
        this.users = new Set();
    }

    createRoom(roomName) {
        const roomId = this.generateRoomCode();
        const room = {
            id: roomId,
            name: roomName,
            users: new Set(),
            drawings: [],
            createdAt: new Date()
        };
        
        this.rooms.set(roomId, room);
        this.currentRoom = roomId;
        return roomId;
    }

    joinRoom(roomId, username) {
        if (!this.rooms.has(roomId)) {
            throw new Error('Room not found');
        }

        const room = this.rooms.get(roomId);
        room.users.add(username);
        this.currentRoom = roomId;
        this.users.add(username);

        this.onUserJoined?.(username, roomId);
        return room;
    }

    leaveRoom(username, roomId) {
        const room = this.rooms.get(roomId);
        if (room) {
            room.users.delete(username);
            this.onUserLeft?.(username, roomId);
        }
    }

    addDrawing(drawingData) {
        if (!this.currentRoom) return;

        const room = this.rooms.get(this.currentRoom);
        if (room) {
            room.drawings.push({
                ...drawingData,
                timestamp: new Date(),
                id: Math.random().toString(36).substr(2, 9)
            });
            
            this.onDrawingAdded?.(drawingData, this.currentRoom);
        }
    }

    exportAsPNG(canvas) {
        return canvas.toDataURL('image/png');
    }

    exportAsPDF(canvas) {
        // This would integrate with a PDF library
        console.log('Exporting as PDF - would integrate with jsPDF');
        return canvas.toDataURL('image/jpeg');
    }

    generateRoomCode() {
        const adjectives = ['swift', 'quick', 'smart', 'bold', 'clear', 'sharp'];
        const nouns = ['star', 'moon', 'sun', 'wave', 'tree', 'cloud'];
        const number = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        
        const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
        const noun = nouns[Math.floor(Math.random() * nouns.length)];
        
        return `${adjective}-${noun}-${number}`;
    }

    // Callbacks for real-time communication
    setOnUserJoined(callback) {
        this.onUserJoined = callback;
    }

    setOnUserLeft(callback) {
        this.onUserLeft = callback;
    }

    setOnDrawingAdded(callback) {
        this.onDrawingAdded = callback;
    }

    getRoomUsers(roomId) {
        const room = this.rooms.get(roomId);
        return room ? Array.from(room.users) : [];
    }

    getRoomDrawings(roomId) {
        const room = this.rooms.get(roomId);
        return room ? room.drawings : [];
    }
}