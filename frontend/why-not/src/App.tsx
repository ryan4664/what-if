import { gql, useQuery } from '@apollo/client'
import './App.css'
import { ChakraProvider, Container, extendTheme } from '@chakra-ui/react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link
} from "react-router-dom";
import LoginPage from "./pages/login/Login";

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

  const colors = {
    brand: {
      900: '#1a365d',
      800: '#153e75',
      700: '#7d24e2',
    },
  }

  const theme = extendTheme({ colors })

  return (
    <Router>
      <ChakraProvider theme={theme}>
        <Container minW="100vw" minH="100vh" bgColor="brand.700">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </Container>
      </ChakraProvider>
    </Router>
  )
}

export default App
