import express from "express";
import cors from 'cors'
import { adminRouter } from "./Routes/AdminRoute.js";
import { chefRouter } from "./Routes/ChefRoute.js";
import { tasterRouter } from "./Routes/tasterRoute.js";
import { editorRouter } from "./Routes/EditorRoute.js";


const app = express()
app.use(cors({
    origin: ["http://localhost:3001"],
    methods: ['GET', 'POST','PUT', 'DELETE'],
    credentials: true
}))
app.use(express.json())
app.use('/auth', adminRouter)
app.use('/chef', chefRouter)
app.use('/taster', tasterRouter)
app.use('/editor', editorRouter)
app.use(express.static('Public'))

app.listen(3000, ()=>{
    console.log("Server is running")
})