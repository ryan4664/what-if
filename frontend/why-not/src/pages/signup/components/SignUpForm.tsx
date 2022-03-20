
import { useFormik } from "formik";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Input,
  VStack
} from "@chakra-ui/react";
import { gql, useQuery } from '@apollo/client'

const REGISTER_MUTATION = gql`
  mutation Register($emailAddress: String!, $password: $String!) {
    register(emailAddress: $emailAdress, password: $password) {
      id
      text
    }
  }
`;


const SignupForm = () => {
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: ""
    },
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    }
  });

  return (
    <Box bg="white" p={6} rounded="md">
      <form onSubmit={formik.handleSubmit}>
        <VStack spacing={4} align="flex-start">
          <FormControl>
            <FormLabel htmlFor="email">Email Address</FormLabel>
            <Input
              id="email"
              name="email"
              type="email"
              variant="filled"
              onChange={formik.handleChange}
              value={formik.values.email}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input
              id="password"
              name="password"
              type="password"
              variant="filled"
              onChange={formik.handleChange}
              value={formik.values.password}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              variant="filled"
              onChange={formik.handleChange}
              value={formik.values.confirmPassword}
            />
          </FormControl>
          <Button type="submit" colorScheme="purple" isFullWidth>
            Login
          </Button>
        </VStack>
      </form>
    </Box>
  )
}

export default SignupForm
