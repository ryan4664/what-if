import { Box, Container, Flex, Text } from "@chakra-ui/react"

import { useFormik } from "formik";
import LoginForm from "./components/LoginForm";


const LandingPage = () => {


    return (
        <Flex justifyContent={'center'} alignItems={'center'} flexDirection={'column'} flex={1}>
            <Text fontFamily={'Caveat'} color={'white'} fontSize={'10em'}>Why-Not</Text>
            <Text fontFamily={'Caveat'} color={'white'} fontSize={'2em'}>A multiverse in the browser.</Text>
        </Flex>
    )
}

export default LandingPage
