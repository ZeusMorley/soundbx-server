"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const spotifyController_1 = require("../controllers/spotifyController");
const router = (0, express_1.Router)();
router.post('/token', spotifyController_1.SpotifyController.getAccessToken);
exports.default = router;
