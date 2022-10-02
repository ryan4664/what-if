import { gql, useQuery } from '@apollo/client'
import './App.css'

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      emailAddress
      currentLevel
      currentExperience
      timeShards
      heros {
        id
        multiverse
        name
        attributeName
        totalHealth
        currentHealth
        speach
        currentExperience
        currentLevel
      }
    }
  }
`

function App() {
  const { loading, error, data } = useQuery(GET_USERS)

  console.log(loading)
  console.log(error)
  console.log(data)

  return (
    <div className="App">
      <header className="App-header">
        <p>why not</p>
      </header>
    </div>
  )
}

export default App
