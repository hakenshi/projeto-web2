import express from "express"
import type {Request, Response} from "express"
import db from "./prisma/db.ts";

const app = express()

const port = 3000

app.use(express.json())

app.set('view engine', 'ejs')

app.use(express.static('public'))

app.get('/question', (request: Request, response: Response) => {
    return response.render('question')
})

app.get(`/answer/:slug`, async (request: Request, response: Response) => {

    const pergunta = await db.pergunta.findFirst({
        where: {
            slug: request.params.slug
        },
        include: {
            resposta: true,
        }
    })

    return response.render('answer', {pergunta: pergunta})
})

app.delete(`/answer/:id`, async (request: Request, response: Response) => {

    const {id} = request.params

    const resposta = await db.resposta.delete({
        where: {
            id: parseInt(id),
        }
    })

    return response.json(resposta)

})

app.post(`/answer`, async (request: Request, response: Response) => {
    const {slug, resposta: respostaBody} = request.body

    const pergunta = await db.pergunta.findFirst({
        where: {
            slug: slug
        }
    })
    if(pergunta) {
        const resposta = await db.resposta.create({
            data:{
                perguntaId: pergunta.id,
                corpo: respostaBody
            }
        })
        return response.json(resposta)
    }
})

app.post('/save-question', async (request: Request, response: Response) => {
    try{
        const {titulo, descricao} = request.body

        const slug = titulo.toLowerCase().replace(/\s/g, '-').replace(/[^\w\-]+/g, '');

        const pergunta = await db.pergunta.create({
            data: {
                descricao: descricao,
                titulo: titulo,
                slug: slug,
            }
        })

        return response.json(pergunta)
    }
    catch (error) {
        return response.json(error)
    }
})

app.get('/', async (request: Request, response: Response) => {

    const perguntas = await db.pergunta.findMany()

    return response.render('index', {perguntas})
})


app.listen(port, (error?: Error) => {
    if (error) {
        console.log(error);
    }
    console.log(`server is running at: http://localhost:${port}`);
})

process.on("SIGINT", async () => {
    await db.$disconnect()

    process.exit(0)
}) 
