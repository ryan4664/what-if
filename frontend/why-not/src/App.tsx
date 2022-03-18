import { gql, useQuery } from '@apollo/client'
import './App.css'
import { ChakraProvider } from '@chakra-ui/react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link
} from "react-router-dom";

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
    <Router>
    <ChakraProvider>
      <header className="App-header">
        <p>Why the fuck not!</p>
      </header>
      <Routes >
          <Route path="/about">
            {/* <About /> */}
          </Route>
          <Route path="/users">
            {/* <Users /> */}
          </Route>
          <Route path="/">
            {/* <Home /> */}
          </Route>
        </Routes >
    </ChakraProvider>
    </Router>
  )
}

export default App
