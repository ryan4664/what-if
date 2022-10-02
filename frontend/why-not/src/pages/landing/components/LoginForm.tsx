
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

const LoginForm = () => {
    const formik = useFormik({
        initialValues: {
          email: "",
          password: ""
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
            <Button type="submit" colorScheme="purple" isFullWidth>
              Login
            </Button>
          </VStack>
        </form>
      </Box>
    )
}

export default LoginForm
