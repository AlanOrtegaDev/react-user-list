import './styles/app.css'
import { useEffect, useMemo, useRef, useState } from 'react'
import { APIResult, SortBy, User } from './types/index.d'
import UserList from './components/UserList'

function App() {
  const [users, setUsers] = useState<User[]>([])
  const [showColors, setShowColors] = useState(false)
  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE)
  const initialUsers = useRef<User[]>([])
  const [filterCountry, setFilterCountry] = useState<string | null>(null)

  useEffect(() => {
    fetch('https://randomuser.me/api/?results=100')
      .then(async (res) => await res.json())
      .then((res: APIResult) => {
        setUsers(res.results)
        initialUsers.current = res.results
      })
      .catch((err) => console.error(err))
  }, [])

  const toggleRowColors = () => {
    setShowColors(!showColors)
  }

  const toggleSortByCountry = () => {
    const newSortingValue =
      sorting === SortBy.NONE ? SortBy.COUNTRY : SortBy.NONE
    setSorting(newSortingValue)
  }

  const filteredUsers = useMemo(() => {
    return filterCountry !== null && filterCountry.length > 0
      ? users.filter((user) => {
          return user.location.country
            .toLowerCase()
            .includes(filterCountry.toLowerCase())
        })
      : users
  }, [filterCountry, users])

  const sortedUsers = useMemo(() => {
    if (sorting === SortBy.NONE) return filteredUsers

    const compareProperties: Record<string, (user: User) => string> = {
      [SortBy.COUNTRY]: (user) => user.location.country,
      [SortBy.NAME]: (user) => user.name.first,
      [SortBy.LAST]: (user) => user.name.last,
    }

    return filteredUsers.toSorted((a, b) => {
      const extractProperty = compareProperties[sorting]
      return extractProperty(a).localeCompare(extractProperty(b))
    })
  }, [filteredUsers, sorting])

  const handleDelete = (email: string) => {
    const filteredUsers = users.filter((user) => user.email !== email)
    setUsers(filteredUsers)
  }

  const handleResetUsers = () => {
    setUsers(initialUsers.current)
  }

  const handleChangeSort = (sort: SortBy) => {
    setSorting(sort)
  }

  return (
    <main>
      <h1>Lista de usuarios</h1>

      <section>
        <nav>
          <button onClick={toggleRowColors}>Colorear filas</button>
          <button onClick={toggleSortByCountry}>
            {sorting === SortBy.COUNTRY
              ? 'No ordenar por país'
              : 'Ordenar por país'}
          </button>
          <button onClick={handleResetUsers}>Restaurar estado inicial</button>
          <input
            type='text'
            placeholder='Buscar por país...'
            name='search'
            onChange={(e) => {
              setFilterCountry(e.target.value)
            }}
          />
        </nav>

        <UserList
          users={sortedUsers}
          showColors={showColors}
          handleDelete={handleDelete}
          handleChangeSort={handleChangeSort}
        />
      </section>
    </main>
  )
}

export default App
