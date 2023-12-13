import type {FastifyInstance} from 'fastify'
import fastify from 'fastify'
import {useRouter} from './routes'
import fastifyStatic from '@fastify/static'
import cors from '@fastify/cors'
import path from 'path'

const port: number = Number(process.env.PORT) || 3000 as number
const host: string = ("RENDER" in process.env) ? `0.0.0.0` : `localhost` as string

(async () => {
    const server: FastifyInstance = fastify()

    if (process.env.NODE_ENV === 'development') {
        await server.register(cors, {})
    }

    await useRouter(server)

    server.register(fastifyStatic, {
        root: path.join(__dirname, 'static'),
        // prefix: '/public/', // default '/'
    })

    server.listen({host: host, port: port}, (err, address) => {
        if (err) {
            console.error(err)
            process.exit(1)
        }
        console.log(`Environment: ${process.env.NODE_ENV ?? 'production'}`)
        console.log(`Server listening at ${address}`)
    })
})()
