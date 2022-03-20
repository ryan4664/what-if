import { gql, useQuery } from '@apollo/client'
import './App.css'
import { Box, ChakraProvider, Container, extendTheme, Flex } from '@chakra-ui/react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link
} from "react-router-dom";
import LoginPage from "./pages/login/Login";
import UnauthenticatedHeader from "./components/UnauthenticatedHeader";

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
      900: '#20106A',
      800: '#301C80',
      700: '#472C9F',
      600: '#6140BE',
      500: '#7F58DE',
      400: '#A280EB',
      300: '#BB9CF5',
      200: '#D6BEFB',
      100: '#F3D4FF',
    },
    fonts: {
      body: 'Caveat'
    }
  }

  const theme = extendTheme({ colors })

  return (
    <Router>
      <ChakraProvider theme={theme}>
        <Flex flexDir={'column'} m={0} p={0} minW="100vw" minH="100vh" bgColor="brand.500">
          <UnauthenticatedHeader />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </Flex>
      </ChakraProvider>
    </Router>
  )
}

export default App
