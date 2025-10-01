"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const dotenv_1 = __importDefault(require("dotenv"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
dotenv_1.default.config();
const port = Number(process.env.PORT);
const swaggerRouter = express_1.default.Router();
const options = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "mini e-commerce API",
            version: "1.0.0",
            description: "mini e-commerce API documentation with swagger"
        },
        servers: [
            {
                url: `http://localhost:${port}`,
                description: "Development server"
            }
        ],
        components: {
            securitySchemes: {
                Bearer: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description: "API KEY authorization for protected API end points"
                },
                ApiKeyAuth: {
                    type: "apikey",
                    in: "header",
                    name: "x-api-key",
                    description: "API KEY authorization for protected API end points"
                }
            }
        }
    },
    apis: ["./src/routes/*.ts"]
};
const swaggerSpecifications = (0, swagger_jsdoc_1.default)(options);
require("swagger-model-validator")(swaggerSpecifications);
swaggerRouter.get("/json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpecifications);
});
swaggerRouter.use("/", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpecifications));
exports.default = swaggerRouter;
