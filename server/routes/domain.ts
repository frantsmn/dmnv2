import {useChecker} from '../plugins/checker'
import type {FastifyInstance} from 'fastify'

export const useDomainRoute = async (server: FastifyInstance) => {
    const {checkDomain} = await useChecker()

    server.get('/api/domain', async (request, reply) => {
        try {
            const response = await checkDomain(request)
            reply.send(response)
        } catch {
            reply.code(500).send('Internal Server Error')
        }
    })
}
