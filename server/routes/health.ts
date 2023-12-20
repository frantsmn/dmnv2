import type {FastifyInstance} from 'fastify'

export const useHealthRoute = (server: FastifyInstance) => {
  server.get('/health', async (request, reply) => {
    return 'ok'
  })
}
