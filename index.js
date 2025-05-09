import express from 'express'
import dotenv from 'dotenv'
import fs from "fs"
import path from 'path'
import { fileURLToPath } from 'url'

import professorsRoutes from "./routes/professores.routes.js"
import instituicoesRoutes from "./routes/instituicoes.routes.js"
import turmasRoutes from "./routes/turmas.routes.js"
import alunosRoutes from "./routes/alunos.routes.js"

dotenv.config();

const app = express();
app.use(express.json());

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)



// Rotas
app.use("/api/v1/professores", professorsRoutes)
app.use("/api/v1/instituicoes", instituicoesRoutes)
app.use("/api/v1/turmas", turmasRoutes)
app.use("/api/v1/alunos", alunosRoutes)

app.get('/', (req, res) => {
  res.send('API funcionando com import/export!');
})

app.get('/api-docs', (req, res) => {
  const swaggerPath = path.join(__dirname, '/swagger/swagger.json');
  console.log('Caminho do arquivo Swagger:', swaggerPath); // Adicione esta linha
  fs.readFile(swaggerPath, 'utf8', (err, data) => {
      if (err) {
          console.error('Erro ao ler o arquivo Swagger:', err); // Adicione esta linha
          return res.status(500).send('Erro ao carregar o Swagger');
      }
      res.setHeader('Content-Type', 'application/json');
      res.send(data);
  });
});

/*const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
})*/

export default app
