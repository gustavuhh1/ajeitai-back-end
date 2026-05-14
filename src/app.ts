import express from 'express';
import {router} from '@/routes';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './utils/swagger';

export const app = express()

app.use(express.json())

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use(router)

// app.get('/', (request, response)=> {
//     return response.json({message: 'Olá mundo!'})
// })

