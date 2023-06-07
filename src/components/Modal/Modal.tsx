import React from 'react'
import {
  Modal as ChakraModal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react'

interface Props {
  isOpen: boolean
  children: any
  onClose: () => void
}

const Modal = ({ isOpen, children, onClose }: Props) => {
  return (
    <ChakraModal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody py={12}>{children}</ModalBody>
      </ModalContent>
    </ChakraModal>
  )
}

export default Modal
