"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const axios_1 = __importDefault(require("axios"));
const router = (0, express_1.Router)();
router.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        message: 'SoundBX Server is running!'
    });
});
router.get('/network-test', async (req, res) => {
    try {
        const response = await axios_1.default.get('https://httpbin.org/ip');
        res.json({
            status: 'OK',
            message: 'Outbound networking works!'
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'ERROR',
            message: 'Outbound networking failed',
        });
    }
});
exports.default = router;
