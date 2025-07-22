const express = require('express')
const morgan = require('morgan')

morgan.token('content', getContent = (req) => {return JSON.stringify(req.body)})

const app = express()

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))
app.use(express.static('dist'))

let persons = [
    { 
      "name": "Arto Hella", 
      "number": "040-123456",
      "id": "1"
    },
    { 
      "name": "Ada Lovelace", 
      "number": "39-44-5323523",
      "id": "2"
    },
    { 
      "name": "Dan Abramov", 
      "number": "12-43-234345",
      "id": "3"
    },
    { 
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122",
      "id": "4"
    }
]

app.get('/api/persons',(req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {

  const id = req.params.id
  const name = persons.find(person => person.id === id)
  morgan.token()

  if (name) {
    res.json(name)
    console.log(name.name, 'found')
  }
  else {
    console.log('404 Not found')
    res.status(404).end()
  }
})

app.get('/info',(req, res) => {
  const dateNow = Date()
  res.send(`<p>Phonebook has info for ${persons.length} people.</p> 
            <p>${dateNow}</p>`)
})

app.post('/api/persons', (req, res) => {
  const person = req.body
  morgan.token()

  if (person.name === ''|| person.number === '') {
    res.status(400).send({ error: 'Name or number cant be empty. Please specify name and number'})
  }

  else if (persons.find(contact => contact.name === person.name)) {
    res.status(400).send({error: `Contact '${person.name}' already exists`})
  }

  else {
    const newPerson = {
    name: person.name,
    number: person.number,
    id: Math.floor(Math.random()*1000)
    }

    persons = persons.concat(newPerson)
    res.json(newPerson)
  }
})

app.delete('/api/persons/:id', (req, res) =>{
  const id = req.params.id
  const name = persons.find(person => person.id === id)
  if (name) {
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
  }
  else {
    res.status(404).end()
    console.log({error: `No person with id ${id} found`})
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})