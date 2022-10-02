import { Box, Container, Flex } from "@chakra-ui/react"

import { useFormik } from "formik";
import LoginForm from "./components/LoginForm";


const LoginPage = () => {


    return (
        <Flex justifyContent={'center'} alignItems={'center'} flex={1}>
            <LoginForm />
        </Flex>
    )
}

export default LoginPage
