import React from 'react'
import { Button } from 'components'
import { useClipboard, useToast } from '@chakra-ui/react'

interface Props {
  value: string
  children: any
}

const BackButton = ({ value, children }: Props) => {
  const { onCopy } = useClipboard(value)
  const toast = useToast()

  const handleCopyClick = () => {
    onCopy()
    toast({
      title: 'Copied',
      status: 'success',
    })
  }

  return (
    <Button
      variant="link"
      color="gray.500"
      icon="fas fa-copy"
      iconPosition="right"
      onClick={handleCopyClick}
    >
      {children}
    </Button>
  )
}

export default BackButton
