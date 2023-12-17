import type {FastifyInstance} from 'fastify'
import fastify from 'fastify'
import {useRouter} from './routes'
import fastifyStatic from '@fastify/static'
import cors from '@fastify/cors'
import path from 'path'

const startServer = async (host: string, port: number) => {
  const server: FastifyInstance = fastify()

  if (process.env.NODE_ENV === 'development') {
    await server.register(cors, {})
  }

  await useRouter(server)

  server.register(fastifyStatic, {
    root: path.join(__dirname, 'static'),
    // prefix: '/public/', // default '/'
  })

  console.log({host, port,})
  server.listen({host: host, port: port}, (err, address) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    console.log(`Environment: ${process.env.NODE_ENV ?? 'production'}`)
    console.log(`Server listening at ${address}`)
  })
}

if ('RENDER' in process.env) {
  void startServer('0.0.0.0', Number(process.env.PORT))
} else {
  void startServer('127.0.0.1', 8080)
}