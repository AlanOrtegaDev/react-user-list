import { SortBy, User } from '../types/index.d'

interface Props {
  users: User[]
  showColors: boolean
  handleDelete: (email: string) => void
  handleChangeSort: (sort: SortBy) => void
}

const UserList = ({
  users,
  showColors,
  handleDelete,
  handleChangeSort,
}: Props) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Avatar</th>
          <th onClick={() => handleChangeSort(SortBy.NAME)}>Nombre</th>
          <th onClick={() => handleChangeSort(SortBy.LAST)}>Apellido</th>
          <th onClick={() => handleChangeSort(SortBy.COUNTRY)}>País</th>
          <th>Aciones</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr className={showColors ? 'active-colors' : ''} key={user.email}>
            <td>
              <img
                src={user.picture.medium}
                width={80}
                height={80}
                alt='User Avatar'
              />
            </td>
            <td>{user.name.first}</td>
            <td>{user.name.last}</td>
            <td>{user.location.country}</td>
            <td>
              <button onClick={() => handleDelete(user.email)}>Borrar</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default UserList
