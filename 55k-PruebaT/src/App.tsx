import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { type User } from './types.d'
import { UsersList } from './components/UsersList'

function App() {
  const [users, setUsers] = useState<User[]>([])
  const [showColors, setShowColors] = useState(false)
  const [sortBtyCountry, setSortByCountry] = useState(false)
  const [filterCountry, setFilterCountry] = useState<string | null>(null)

  const originalUsers = useRef<User[]>([])

  const toggleSortByCountry = () => {
    setSortByCountry(prevState => !prevState)
  }

  const toggleColors = () => {
    setShowColors(!showColors)
  }

  const handleReset = () => {
    setUsers(originalUsers.current)
  }

  const handleDelete = (email : string) => {
    const filteredUsers = users.filter((user) => user.email !== email)
    setUsers(filteredUsers)
  } 

  useEffect(() => {
    fetch(`https://randomuser.me/api/?results=100`)
      .then(res => res.json())
      .then(res => {
        setUsers(res.results)
        originalUsers.current = res.results
      })
      .catch(err => {
        console.error(err)
      })
  },[])

  const filteredUsers = useMemo(() => {
    console.log('filteredUsers')
      return filterCountry !== null && filterCountry.length > 0
      ? users.filter((user => {
        return user.location.country.toLowerCase().includes(filterCountry.toLowerCase())
      }))
      : users
  }, [users, filterCountry])

    const sortedUsers = useMemo(() => {
      console.log('sortUsers')
  
      return sortBtyCountry
      ? filteredUsers.toSorted(
        (a, b) => a.location.country.localeCompare(b.location.country)
      )
      : filteredUsers
    }, [filteredUsers, sortBtyCountry])

  return (
    <div className='App'>
      <h1>Practica</h1>
      <header>
        <button onClick={toggleColors} >
          Colorear files
        </button>
        <button onClick={toggleSortByCountry} >
          {sortBtyCountry ? 'No ordenar por pais': 'Ordenar por Pais'}
        </button>
        <button onClick={handleReset} >
          Resetear los usuarios
        </button>

        <input placeholder='Filtrar por Pais' onChange={(e) => {
          setFilterCountry(e.target.value)
        }} />
      </header>
      <main>
       <UsersList deleteUser={handleDelete} showColors={showColors} users={sortedUsers} /> 
      </main>
    </div>
  )
}

export default App
