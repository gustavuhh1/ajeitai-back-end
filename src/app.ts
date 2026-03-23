import express from 'express';
import {router} from '@/routes';
import {ErrorHandler} from '@/middlewares/ErrorHandler';

export const app = express()

app.use(express.json())

app.use(router)

app.use(ErrorHandler)

// app.get('/', (request, response)=> {
//     return response.json({message: 'Olá mundo!'})
// })

