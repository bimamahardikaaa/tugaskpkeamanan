import express from 'express'
import { PrismaClient } from '@prisma/client'
import bodyParser from 'body-parser'
import { fileURLToPath } from 'url';
import path from 'path'

const prisma = new PrismaClient()
const app = express()

const jsonParser = bodyParser.json()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set('views', path.join(__dirname, 'views'))
app.set("view engine", "ejs")

app.get('/', async(req, res) => {
  res.render('index')
})

app.get('/add', async(req, res) => {
  res.render('add')
})

app.get('/members', async (req, res) => {
  const members = await prisma.member.findMany()
  res.json(members)
})

app.post('/members', jsonParser, async (req, res) => {
  let result = {}
  try{
    const post = await prisma.member.create({
      data:req.body,
    })
    result = req.body
    res.json(result)
  }catch(error){
    result = {"error": error}
  }
})

app.get('/members/:id', async (req, res) => {
  const { id } = req.params
  const post = await prisma.member.findUnique({
    where: { id: Number(id) },
  })
  res.json(post)
})

const server = app.listen(3000)
