import { Box, Container, Flex, Text } from "@chakra-ui/react"

const UnauthenticatedHeader = () => {


    return (
        <Flex background={'brand.700'} justifyContent={'center'} alignItems={'center'} minH={'10vh'}>
            <Text fontFamily={'Caveat'} color={'white'} fontSize={'3em'}>Why Not</Text>
        </Flex>
    )
}

export default UnauthenticatedHeader
