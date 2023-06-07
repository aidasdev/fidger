import React from 'react'
import { Container as ChakraContainer, ContainerProps } from '@chakra-ui/react'

const Container = ({ children, ...rest }: ContainerProps) => {
  return (
    <ChakraContainer maxW="1200px" mt={6} {...rest}>
      {children}
    </ChakraContainer>
  )
}

export default Container
