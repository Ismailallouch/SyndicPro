  import express from 'express'
  import path, { dirname } from 'path'
  import { fileURLToPath } from 'url'
  import * as dotenv from 'dotenv';
  dotenv.config();
  import authRoutes from './routes/authRoutes.js'
  import coproRoutes from './routes/coproRoutes.js'
  import lotsRoutes from './routes/lotsRoutes.js'
  import chargesRoutes from './routes/chargesRoutes.js'
  import maintenanceRoutes from './routes/maintenanceRoutes.js'
  import eventRoutes from './routes/eventRoutes.js'
  import authMiddleware from './middleware/authMiddleware.js'
  import cors from 'cors'

  const app = express()
  const PORT = process.env.PORT || 7000 

  const __filename = fileURLToPath(import.meta.url)
  const __dirname = dirname(__filename)

  // Configuration CORS spécifique
  const corsOptions = {
    origin: 'http://127.0.0.1:7000', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }

  // Middleware
  app.use(cors(corsOptions)) 
  app.use(express.json())
  app.use(express.static(path.join(__dirname, '../public')))

  // Routes
  app.use('/auth', authRoutes)
  app.use('/copro', coproRoutes)
  app.use('/lots', lotsRoutes) 
  app.use('/charges', chargesRoutes)
  app.use('/maintenance', maintenanceRoutes)
  app.use('/events', eventRoutes)

  // Gestion des erreurs CORS
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:7000')
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    next()
  })

  app.listen(PORT, () => {
    console.log(`Server started on: ${PORT}`)
  })