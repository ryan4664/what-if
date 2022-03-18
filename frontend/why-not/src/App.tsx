import { gql, useQuery } from '@apollo/client'
import './App.css'
import { ChakraProvider } from '@chakra-ui/react'

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

  return (
    <ChakraProvider>
      <header className="App-header">
        <p>Why the fuck not!</p>
      </header>
    </ChakraProvider>
  )
}

export default App
