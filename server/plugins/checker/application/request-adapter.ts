import type {FastifyRequest} from 'fastify'
import type {DomainSource} from '../domain/types'
export interface DomainRawRequest {
    domain: string,
    source: string
}
export interface DomainRequest {
    domain: string,
    source: DomainSource[]
}
export const requestAdapter = (request: FastifyRequest): DomainRequest => {
    const {domain, source} = request.query as DomainRawRequest

    return {
        domain,
        source: source.split(',') as DomainSource[]
    }
}
