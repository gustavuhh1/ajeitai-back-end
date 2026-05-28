import swaggerJSDoc from 'swagger-jsdoc';

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
                url: "http://localhost:3333",
                description: 'Backend Ajeitai em desenvolvimento',
            },
            {
                url: "https://ajeitai-api-production.up.railway.app",
                description: 'Backend Ajeitai em produção no railway',
            }
        ],
    },
    apis: ['./src/docs/*.yml'],
};

export const swaggerSpec = swaggerJSDoc(options);