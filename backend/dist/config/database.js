"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CounterModel = void 0;
exports.connectDatabase = connectDatabase;
exports.getNextSequence = getNextSequence;
const dotenv_1 = require("dotenv");
const mongoose_1 = __importDefault(require("mongoose"));
(0, dotenv_1.config)();
const MONGODB_URI = process.env.MONGODB_URI;
async function connectDatabase() {
    try {
        await mongoose_1.default.connect(MONGODB_URI);
        console.log('MongoDB connected');
    }
    catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
}
const CounterSchema = new mongoose_1.default.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 100 }
});
exports.CounterModel = mongoose_1.default.model('Counter', CounterSchema);
async function getNextSequence(name) {
    try {
        const result = await exports.CounterModel.findByIdAndUpdate(name, { $inc: { seq: 1 } }, { new: true, upsert: true });
        return result?.seq || 100;
    }
    catch (err) {
        console.error('Error getting next sequence:', err);
        throw err;
    }
}
//# sourceMappingURL=database.js.map