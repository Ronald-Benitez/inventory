"use client"

import { Modal, ModalBody, ModalContent, ModalHeader, ModalFooter, Button, useDisclosure } from "@nextui-org/react"
import { useEffect } from "react"

interface ConfirmProps {
    onConfirm: () => void
    msg: string
    title: string
    open: boolean
    onCancel: () => void
}

function Confirm({ onConfirm, msg, title, open, onCancel }: ConfirmProps) {
    const { isOpen, onOpen, onClose } = useDisclosure()

    useEffect(() => {
        if (open) {
            onOpen()
        }
    }, [open])

    const cancel = () => {
        onClose()
        onCancel()
    }

    const confirm = () => {
        onConfirm()
        onClose()
    }

    return (
        <>
            <Modal isOpen={isOpen} onClose={cancel} className="w-1/2" backdrop="blur">
                <ModalContent>
                    <ModalHeader>
                        <p className="text-black">
                            {title}
                        </p>
                    </ModalHeader>
                    <ModalBody>
                        <p className="text-black">
                            {msg}
                        </p>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="default" onClick={cancel}>Cancelar</Button>
                        <Button color="success" onClick={confirm}>Confirmar</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default Confirm