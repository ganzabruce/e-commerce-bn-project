import express, {Request,Response} from "express"
import swaggerJSDoc from "swagger-jsdoc"
import dotenv from "dotenv"
import swaggerUi from "swagger-ui-express"
dotenv.config()
const port = Number(process.env.PORT)

const swaggerRouter = express.Router()

const options: swaggerJSDoc.Options = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info:{
            title: "mini e-commerce API",
            version: "1.0.0",
            description: "mini e-commerce API documentation with swagger"
        },
        servers:[
            {
                url:`http://localhost:${port}` ,
                description: "Development server"
            }
        ],
        components: {
            securitySchemes:{
                Bearer: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description: "API KEY authorization for protected API end points"
                },
                ApiKeyAuth: {
                    type:"apikey",
                    in: "header",
                    name: "x-api-key",
                    description: "API KEY authorization for protected API end points"
                }
            }
        }
    },
    apis:["./src/routes/*.ts"] 
}

const swaggerSpecifications = swaggerJSDoc(options)
require("swagger-model-validator")(swaggerSpecifications)

swaggerRouter.get("/json",(req:Request,res:Response)=>{
    res.setHeader("Content-Type","application/json")
    res.send(swaggerSpecifications)
})

swaggerRouter.use("/", swaggerUi.serve,swaggerUi.setup(swaggerSpecifications))

export default swaggerRouter