import express from 'express'
import { PrismaClient } from '@prisma/client'
import bodyParser from 'body-parser'
import { fileURLToPath } from 'url'
import path from 'path'
import NodeRSA from 'node-rsa'
import atob from 'atob'
import cookieParser from "cookie-parser"

// Set prisma and express
const prisma = new PrismaClient()
const app = express()

// express akan menggunakan json body parser agar bisa membaca payload json
const jsonParser = bodyParser.json()
// cookie parser adalah cara express memparsing cookie dari header
app.use(cookieParser())

// set up view folder agar express dapat membaca routing ke ejs atau jquery
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set('views', path.join(__dirname, 'views'))
app.set("view engine", "ejs")

// endpoint untuk generate new cookies
app.get('/keys', async(req,res) => {
  const key = new NodeRSA({b: 512});
  const result = {
    "public": key.exportKey("public"),
    "private": key.exportKey("private")
  }
  res.json(result)
})

// endpoint untuk redirect ke view list anggota
app.get('/', async(req, res) => {
  res.render('index')
})

// endpoint untuk redirect ke view add anggota
app.get('/add', async(req, res) => {
  res.render('add')
})

// endpoint untuk mendapatkan list anggota
app.get('/members', async (req, res) => {
  // membaca key private dari cookie
  const key_private = new NodeRSA(atob(req.cookies.private),'pkcs1-private');
  // mendapatkan data raw dari database
  let members = await prisma.member.findMany()
  // membuat schema baru untuk data yang akan ditampilkan
  members = members.map(item => {
    let temp = {}
    // mencoba mendecode enkripsi jika tidak bisa maka data akan dikeluakan seadanya
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

// endpoint untuk membuat data anggota baru
app.post('/members', jsonParser, async (req, res) => {
  // Mendapatkan data public key dari header cookies
  const key_public = new NodeRSA(atob(req.cookies.public),'pkcs8-public');
  // mengenkripsi schema dengan public key yang telah di provide
  let result = {
    "name": key_public.encrypt(req.body.name, "base64"),
    "fakultas": key_public.encrypt(req.body.fakultas, "base64"),
    "age": key_public.encrypt(req.body.age, "base64"),
  }
  // mencoba membuat data di database jika gagal maka error message akan keluar
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

const server = app.listen(3000)
