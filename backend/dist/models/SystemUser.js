"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const database_1 = require("@/config/database");
const SystemUserSchema = new mongoose_1.Schema({
    userId: {
        type: Number,
        unique: true
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    birthDate: {
        type: String,
        required: true
    },
    mobileNumber: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        required: true,
        enum: ['seller', 'customer'],
        default: 'customer'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});
SystemUserSchema.pre('save', async function (next) {
    if (this.isNew && !this.userId) {
        try {
            this.userId = await (0, database_1.getNextSequence)('system_user_id');
        }
        catch (error) {
            return next(error);
        }
    }
    next();
});
SystemUserSchema.methods.getFullName = function () {
    return `${this.firstName} ${this.lastName}`;
};
SystemUserSchema.statics.findByEmail = function (email) {
    return this.findOne({ email: email.toLowerCase() });
};
SystemUserSchema.statics.findByUserId = function (userId) {
    return this.findOne({ userId });
};
SystemUserSchema.statics.validateRegistrationData = function (userData) {
    const { firstName, lastName, email, birthDate, mobileNumber, role } = userData;
    const missing = [];
    if (!firstName || firstName.trim() === '')
        missing.push('firstName');
    if (!lastName || lastName.trim() === '')
        missing.push('lastName');
    if (!email || email.trim() === '')
        missing.push('email');
    if (!birthDate)
        missing.push('birthDate');
    if (!mobileNumber || mobileNumber.trim() === '')
        missing.push('mobileNumber');
    if (!role || !['seller', 'customer'].includes(role))
        missing.push('role');
    return {
        isValid: missing.length === 0,
        missing
    };
};
SystemUserSchema.statics.validateLoginData = function (userData) {
    const { email, password } = userData;
    const missing = [];
    if (!email || email.trim() === '')
        missing.push('email');
    if (!password || password.trim() === '')
        missing.push('password');
    return {
        isValid: missing.length === 0,
        missing
    };
};
const SystemUserModel = mongoose_1.default.model('SystemUser', SystemUserSchema, 'System_Users');
exports.default = SystemUserModel;
//# sourceMappingURL=SystemUser.js.map