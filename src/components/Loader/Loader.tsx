import React from 'react'
import { Box, Spinner, Heading } from '@chakra-ui/react'

type Props = {
  size?: string
  text?: string
  hideText?: boolean
}

const Loader = ({ size, text, hideText }: Props) => {
  return (
    <Box w="full" textAlign="center" px={6} py={12}>
      <Spinner my={3} size={size ?? 'xl'} />
      {!hideText && <Heading fontSize="xl">{text ?? 'Loading'}</Heading>}
    </Box>
  )
}

export default Loader
