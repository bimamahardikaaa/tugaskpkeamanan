import express from 'express'
import { PrismaClient } from '@prisma/client'
import bodyParser from 'body-parser'
import { fileURLToPath } from 'url'
import path from 'path'
import NodeRSA from 'node-rsa'
import atob from 'atob'
import cookieParser from "cookie-parser"

const prisma = new PrismaClient()
const app = express()

const jsonParser = bodyParser.json()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set('views', path.join(__dirname, 'views'))
app.set("view engine", "ejs")
app.use(cookieParser());

app.get('/keys', async(req,res) => {
  const key = new NodeRSA({b: 512});
  const result = {
    "public": key.exportKey("public"),
    "private": key.exportKey("private")
  }
  res.json(result)
})

app.get('/', async(req, res) => {
  res.render('index')
})

app.get('/add', async(req, res) => {
  res.render('add')
})

app.get('/members', async (req, res) => {
  const key_private = new NodeRSA(atob(req.cookies.private),'pkcs1-private');
  let members = await prisma.member.findMany()
  members = members.map(item => {
    let temp = {}
    try {      
      temp = {
        "id" : item.id,
        "name" : key_private.decrypt(item.name, "utf-8"),
        "encrypted_name" : item.name,
        "fakultas" : key_private.decrypt(item.fakultas, "utf-8"),
        "encrypted_fakultas" : item.fakultas,
        "age": key_private.decrypt(item.age, "utf-8"),
        "encrypted_age" : item.age,

      }
    } catch (error) {
      temp = {
        "id" : item.id,
        "name" : "you dont have access",
        "encrypted_name" : item.name,
        "fakultas" : "you dont have access",
        "encrypted_fakultas" : item.fakultas,
        "age": "you dont have access",
        "encrypted_age" : item.age,
      }
    }
    return item = temp
})
  res.json(members)
})

app.post('/members', jsonParser, async (req, res) => {
  const key_public = new NodeRSA(atob(req.cookies.public),'pkcs8-public');
  let result = {
    "name": key_public.encrypt(req.body.name, "base64"),
    "fakultas": key_public.encrypt(req.body.fakultas, "base64"),
    "age": key_public.encrypt(req.body.age, "base64"),
  }
  try{
    const post = await prisma.member.create({
      data:result,
    })
    res.json(result)
  }catch(error){
    result = {"error": error}
    res.json(result)
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
