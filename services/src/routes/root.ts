import { type FastifyPluginAsync } from 'fastify'

const root: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {
  fastify.get('/', async function (request, _reply) {
    console.log('%c...req', 'color:gold',   request?.awsLambda?.event);
    
    const message = fastify.someSupport();

    return { message }
  })
}

export default root
