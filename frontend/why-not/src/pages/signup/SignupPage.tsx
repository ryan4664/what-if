import { Box, Container, Flex } from "@chakra-ui/react"

import { useFormik } from "formik";
import SignupForm from "./components/SignUpForm";


const SignupPage = () => {


    return (
        <Flex justifyContent={'center'} alignItems={'center'} flex={1}>
            <SignupForm />
        </Flex>
    )
}

export default SignupPage
