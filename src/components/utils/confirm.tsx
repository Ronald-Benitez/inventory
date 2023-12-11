"use client"

import { Modal, ModalBody, ModalContent, ModalHeader, ModalFooter, Button, useDisclosure } from "@nextui-org/react"

function Confirm(onConfirm: any, msg: string, title: string) {
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} className="w-1/2">
                <ModalContent>
                    <ModalHeader>{title}</ModalHeader>
                    <ModalBody>
                        {msg}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="default" onClick={onClose}>Cancelar</Button>
                        <Button color="success" onClick={onConfirm}>Confirmar</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default Confirm