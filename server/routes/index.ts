import type {FastifyInstance} from 'fastify'
import {useHealthRoute} from './health'
import {useDomainRoute} from './domain'

export const useRouter = async (server: FastifyInstance) => {
    useHealthRoute(server)
    await useDomainRoute(server)
}
