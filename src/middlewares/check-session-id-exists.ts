import { FastifyReply, FastifyRequest } from "fastify"

export async function checkSessionIdExists(request: FastifyRequest, reply: FastifyReply) {
    // eslint-disable-next-line
    const { sessionId } = request.cookies

        if(!sessionId) {
            return reply.status(401).send({
                error: 'Unauthorized.'
            })
        }
}