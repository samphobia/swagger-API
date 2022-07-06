const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const low = require("lowdb")
const swaggerUi = require("swagger-ui-express")
const swaggerJsDoc = require("swagger-jsdoc")
const usersRouter = require("./routes/users")

const PORT = process.env.PORT || 4000;

const FileSync = require("lowdb/adapters/FileSync")

const adapter = new FileSync("db.json")
const db = low(adapter)

db.defaults({ Users: [] }).write()

const options = {
   definition: {
      openapi: "3.0.0",
      info: {
         title: "API Documentation",
         version: "1.0.0",
         description: "User API documentation"
      },
      servers: [
         {
            url: "http://localhost:4000",
         }
      ],
   },
   apis: ["./routes/*.js"]
}

const specs = swaggerJsDoc(options)

const app = express()

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs))

app.db = db;

app.use(cors())
app.use(morgan("dev"))
app.use(express.json())

app.use("/users", usersRouter)

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))