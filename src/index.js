import dotenv from "dotenv"
dotenv.config();
import connectDB from "./db/index.js"



connectDB();






// import express from "express"
// const app = express()

// ;(async () => {
//     try{
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         app.on("error", () => {
//             console.log("ERRR: ", error)
//             throw error
//         })

//         app.listen(process.env.PORT, ()=>{
//             console.log(`Aplication is listening on ${process.env.PORT}`)
//         })
//     }catch(error){
//         console.log("ERROR: ", error)
//         throw error
//     }
// })()