import express from 'express'
import dotenv from 'dotenv'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import serverless from 'serverless-http'

import professorsRoutes from "./routes/professores.routes.js"
import instituicoesRoutes from "./routes/instituicoes.routes.js"
import turmasRoutes from "./routes/turmas.routes.js"
import alunosRoutes from "./routes/alunos.routes.js"

dotenv.config();

const app = express();
app.use(express.json());

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sistema educacional',
      version: '1.0.0',
      description: 'Documentação automática da API Express.',
    },
    servers: [
      {
        url: `https://api-sistema-educacional.vercel.app/api`, 
      },
    ],
    components: {
      schemas: {
        Professor: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              format: 'int64',
              description: 'ID do professor.',
              readOnly: true,
            },
            name: {
              type: 'string',
              description: 'Nome do professor.',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email do professor.',
            },
            password: {
              type: 'string',
              description: 'Senha do professor (normalmente não retornada em GETs).',
            },
          },
        }, 
        Instituição: {
          type: 'object', 
          properties: {
            id: {
              type: 'integer',
              format: 'int64',
              description: 'ID da instituição.',
              readOnly: true,
            },
            name: {
              type: 'string',
              description: 'Nome da instituição.',
            },
            cnpj: {
              type: 'string',
              description: 'Cnpj da instituição.',
            },
            cep: {
              type: 'string',
              description: 'Cep da instituição.',
            },
            address_number: {
              type: 'string',
              description: 'Número de endereço da instituição.',
            },
            id_professor: {
              type: 'integer',
              format: 'int64',
              description: 'ID referenciando o professor que cadastrou a instituição.',
            },
          },
        }, 
        
        Erro: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Mensagem de erro.',
            },
          },
        },
      },
    },
  },
  apis: [
    './routes/professores.routes.js', 
    './routes/instituicoes.routes.js', 
    './routes/turmas.routes.js', 
    './routes/alunos.routes.js', 
    './app.js'
  ], 
};

const swaggerSpec = swaggerJSDoc(options)
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', (req, res) => {
  res.send(
    swaggerUi.generateHTML(swaggerSpec, {
      explorer: true,
      swaggerOptions: {
        url: '/api-docs/swagger.json',
      },
    })
  );
});
app.get('/api-docs/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// Rotas
app.use("/api/v1/professores", professorsRoutes)
app.use("/api/v1/instituicoes", instituicoesRoutes)
app.use("/api/v1/turmas", turmasRoutes)
app.use("/api/v1/alunos", alunosRoutes)

app.get('/', (req, res) => {
  res.send('API funcionando com import/export!');
})

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Servidor rodando na porta ${PORT}`);
// });

export default app
