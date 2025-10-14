//import dotenv express cors
// Loads .env file contents into process.env
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const router=require('./routing/router')
require('./db/connection')


//create server
const bookstoreServer=express()
//enable cors protocol in server app
bookstoreServer.use(cors())
bookstoreServer.use(express.json()) //parse json
bookstoreServer.use(router)

//create port
const PORT=3000

//Run server port
bookstoreServer.listen(PORT,()=>{
    console.log(`BookStore server started at PORT: ${PORT},and waiting for client request!!!`);
    
})

//Resolving http request
bookstoreServer.get('/',(req,res)=>{
    res.status(200).send(`<h1 style="color:blue"> Bookstore server started...and waiting for client requests!!! </h1>`)
})
