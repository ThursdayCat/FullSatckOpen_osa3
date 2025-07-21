import { useState, useEffect } from 'react'
import axios from 'axios'
import peronService from './services/personService'
import personService from './services/personService'
import './index.css'

const Person = (props) => {
 // console.log(props)
  return (
    <div>
      <p>
        {props.person.name} {props.person.number}  
        <button onClick={props.handleDelete}>delete</button>
      </p>
    </div>
  )
}

const Filter = (props) => {
  return(
    <div>
      filter shown with <input value={props.search} onChange={props.handle}/>
    </div>
  )
}

const PersonForm = (props) => {
  return(
    <form onSubmit={props.submit}>
      <div>
        name: <input value={props.name} onChange={props.handlname}/>
      </div>
      <div>
        number: <input value={props.number} onChange={props.handlenumber}/>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Persons = ({persons, handleDelete}) => {
  return(
    <div>
      {persons.map(person =>
          <Person key = {person.name} person = {person} handleDelete={() => handleDelete(person)}/>
        )}
    </div>
  )
}

const Message = ({text, notificationType}) => {
  if (text === null) {
        return null
    }

  return (
    <div className = {notificationType}>
      {text}
    </div>
  )
}



const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')
  const [message, setMessage] = useState(null)
  const [notificationType, setNotificationType] = useState('')

  useEffect(() => {
    console.log('effect')
    personService
      .getAll()
        .then(initialPersons => {setPersons(initialPersons)
      })
  }, [])

  const AddName = (event) => {
    event.preventDefault()

    if (newName === ''){
      alert(`Type the name of the person to be added`)
    }

    else if (persons.find(({name}) => name === newName) === undefined){
      console.log('"add" clicked', newName)
      const nameObject = {
        name: newName,
        number: newNumber
      }
      personService
        .createNew(nameObject)
          .then(newPerson => {
            console.log(newPerson)
            setPersons(persons.concat(newPerson))
            setMessage(`Added ${newName}`)
            setNotificationType('message')
            setTimeout ( () => {
                setMessage(null)
                setNotificationType('')
              }, 3000
            )
          })
    }

    else {
      if (window.confirm(`${newName} is already added to your phonebook. Do you want to change the number?`)) {
        const person = persons.find(({name}) => name === newName)
        const id = person.id
        const changedPerson = { ...person, number: newNumber}

        personService
          .update(id, changedPerson)
            .then(updatedContact => {
              setPersons(persons.map(person => person.id !== id ? person : updatedContact))
              setMessage(`Updated ${newName}`)
              setNotificationType('message')
              setTimeout ( () => {
                  setMessage(null)
                  setNotificationType('')
                }, 3000
              )
            })
            .catch(error => {
              setMessage(`${newName} is deleted from server`)
              setNotificationType('error')
              setTimeout ( () => {
                  setMessage(null)
                  setNotificationType('')
                }, 4000
              )
              setPersons(persons.filter(p => p.id !== id))
            })
      }
    }
    setNewName('')
    setNewNumber('')
  }

  const HandleDelete = (props) => {
    if (window.confirm(`Do you want to delete ${props.name}`)) {
      peronService
        .deleteObject(props.id)
      console.log(props.name, 'is deleted')
      setPersons(persons.filter(p => p.id != props.id))
      setMessage(`Deleted ${props.name}`)
      setNotificationType('message')
      setTimeout ( () => {
          setMessage(null)
          setNotificationType('')
        }, 3000
      )
    }
    else {}
  }

  const HandleNameCange = (event) => {
   // console.log(event.target.value)
    setNewName(event.target.value)
  }

  const HandleNumberCange = (event) => {
    //console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const HandleSearch = (event) => {
    setSearch(event.target.value)
  }

  const contactsToShow = search === ''
  ? persons
  : persons.filter(person => person.name.toLowerCase().includes(search))

  return (
    <div>
      <h1>Phonebook</h1>
      <Filter search = {search} handle = {HandleSearch} />
      <h2>Add new contact</h2>
       <Message text = {message} notificationType={notificationType}/>
      <PersonForm submit = {AddName} number = {newNumber} name = {newName} handlname = {HandleNameCange} handlenumber = {HandleNumberCange}/>
      <h2>Numbers</h2>
      <Persons persons = {contactsToShow} handleDelete = {HandleDelete}/>
    </div>
  )

}

export default App
