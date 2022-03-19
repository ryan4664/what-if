import { Box, Container, Flex } from "@chakra-ui/react"

const LoginPage = () => {
    return (
        <Flex justifyContent={'center'} alignItems={'center'} minH={'100vh'}>
            <Box bg='white' p={4} color='brand.700'>
                Login!
            </Box>
        </Flex>
    )
}

export default LoginPage
