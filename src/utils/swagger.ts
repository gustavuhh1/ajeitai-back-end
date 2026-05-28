import swaggerJSDoc from 'swagger-jsdoc';
import { env } from '@/env';

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Documentação Ajeitaí Backend',
            version: '1.0.0',
            description: 'Documentação das rotas do backend do Ajeitai.',
        },
        servers: [
            {
                url: env.BASE_URL,
                description: 'Backend Ajeitai',
            },
        ],
    },
    apis: ['./src/docs/*.yml'],
};

export const swaggerSpec = swaggerJSDoc(options);