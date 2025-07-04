import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import authRoutes from './routes/auth.routes'
import elementRoutes from './routes/element.routes'
import placesRoutes from './routes/places.routes'
import elementExtrasRoutes from './routes/elementExtras.routes'
import photoRoutes from './routes/photo.routes'
import groupRoutes from './routes/group.routes'
import programRoutes from './routes/program.routes'


dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.use('/api', authRoutes)
app.use('/api', elementRoutes)
app.use('/api', elementExtrasRoutes)
app.use('/api', placesRoutes)
app.use('/api', photoRoutes)
app.use('/api', groupRoutes)
app.use('/api', programRoutes)


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
