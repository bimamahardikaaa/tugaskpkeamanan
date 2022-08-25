import express from 'express'
import { PrismaClient } from '@prisma/client'
import bodyParser from 'body-parser'

const prisma = new PrismaClient()
const app = express()

const jsonParser = bodyParser.json()


app.get('/members', async (req, res) => {
  const members = await prisma.member.findMany()
  res.json(members)
})

app.post('/members', jsonParser, async (req, res) => {
  // const name = req.body.name
  // const age = req.body.age
  // const fakultas = req.body.fakultas
  let result = {}
  try{
    const post = await prisma.member.create({
      data:req.body,
    })
    console.log(post)
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
