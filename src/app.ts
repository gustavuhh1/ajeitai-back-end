import express from 'express';
import {router} from '@/routes'

export const app = express()

app.use(express.json())

app.use(router)

// app.get('/', (request, response)=> {
//     return response.json({message: 'Olá mundo!'})
// })

