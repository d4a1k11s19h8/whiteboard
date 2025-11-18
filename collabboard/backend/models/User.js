const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // NEW: Boards the user owns
    ownedBoards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Whiteboard' }],

    // NEW: Boards the user saved
    savedBoards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Whiteboard' }],

    createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
