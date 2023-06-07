import React from 'react'
import { Button as ChakraButton, ButtonProps, Flex, Box, Image } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

interface Props extends ButtonProps {
  justifyContent?: string
  variant?: 'outline' | 'link' | 'solid'
  icon?: string
  iconPosition?: 'left' | 'right'
  image?: string
  imageWidth?: string
  to?: string
  href?: string
}

const Button = ({
  bg,
  justifyContent,
  variant,
  colorScheme,
  children,
  icon,
  iconPosition,
  image,
  imageWidth,
  to,
  href,
  ...rest
}: Props) => {
  const navigate = useNavigate()
  const handleClick = e => {
    e.stopPropagation()
    if (href) {
      window.open(href, '_blank')
    }
    if (to) {
      navigate(to)
    }
  }

  const isOutline = variant === 'outline'
  const isLink = variant === 'link'

  const getBorderColor = () => {
    if (isOutline) {
      if (colorScheme) {
        return `${colorScheme}`
      }
      return 'purple.400'
    }
    return undefined
  }

  const getBackgroundColor = () => {
    if (bg) {
      return bg
    }
    return isOutline ? 'white' : undefined
  }

  const content = (
    <Flex alignItems="center">
      {icon && iconPosition === 'left' && <Box className={icon} mr={2} />}
      {image && <Image src={image} mr={3} w={imageWidth} />}
      <Box>{children}</Box>
      {icon && iconPosition !== 'left' && <Box className={icon} ml={2} />}
    </Flex>
  )

  if (isLink) {
    return (
      <ChakraButton
        bg="transparent"
        textColor={colorScheme ? `${colorScheme}.500` : 'black'}
        textAlign="center"
        fontWeight="normal"
        onClick={handleClick}
        p={0}
        _hover={{ bg: 'transparent', color: 'purple.500' }}
        {...rest}
      >
        {content}
      </ChakraButton>
    )
  }

  return (
    <ChakraButton
      colorScheme={colorScheme ?? 'purple'}
      textColor={isOutline ? 'black' : undefined}
      bg={getBackgroundColor()}
      borderColor={getBorderColor()}
      borderWidth={isOutline ? '1px' : undefined}
      borderRadius="lg"
      fontWeight="bold"
      justifyContent={justifyContent ?? 'center'}
      px={6}
      onClick={handleClick}
      {...rest}
    >
      {content}
    </ChakraButton>
  )
}

export default Button
