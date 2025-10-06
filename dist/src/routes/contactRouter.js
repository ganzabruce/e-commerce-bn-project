"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const contactController_1 = require("../controllers/contactController");
const contactRouter = express_1.default.Router();
contactRouter.post("/save", contactController_1.createContact);
const contactController_2 = require("../controllers/contactController");
const contactController_3 = require("../controllers/contactController");
contactRouter.post("/auth/request", contactController_2.requestPasswordReset);
contactRouter.post("/auth/reset", contactController_2.resetPasswordWithOtp);
contactRouter.post("/register", contactController_3.registerUser);
exports.default = contactRouter;
