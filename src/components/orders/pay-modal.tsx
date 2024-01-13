"use client"

import React, { useState, useEffect } from "react"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Button, useDisclosure } from "@nextui-org/react";
import { Orders } from "@prisma/client";
import toast, { Toaster } from "react-hot-toast";
import { handleUpdate } from "@/utils/axiosHandler";

interface Props {
    received: number
    setReceived: React.Dispatch<React.SetStateAction<number>>
    data: Orders
}

export default function PayModal({ received, data, setReceived }: Props) {
    const { isOpen, onClose, onOpen } = useDisclosure()
    const [delivered, setDelivered] = useState(0.0)

    useEffect(() => {
        let value = received - data.totalPrice
        value = value >= 0 ? value : 0
        setDelivered(parseFloat(value.toFixed(2)))
    }, [received])

    const handlePay = () => {
        if (received < data.totalPrice) return toast.error("Lo recibido no puede ser menor al total")
    }

    return (
        <>
            <Button onClick={() => onOpen()}>
                Pagar
            </Button>
            <Modal backdrop="blur" scrollBehavior="inside" isOpen={isOpen} onClose={onClose}  >
                <ModalContent>
                    <ModalHeader>
                        <div className="w-full">
                            <p className="text-center text-xl">
                                Cuenta del cliente " {data.client} "
                            </p>
                        </div>
                    </ModalHeader>
                    <ModalBody>
                        <div className="w-full flex flex-col gap-2">
                            <p>
                                <b>Total: </b> ${data.totalPrice}
                            </p>
                            <Input
                                onChange={(e) => setReceived(parseFloat(e.target.value))}
                                label="Recibido"
                                placeholder="Recibido"
                                startContent="$"
                                type="number"
                            />
                            <p>
                                <b>Cambio: </b> ${delivered}
                            </p>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <div className="w-full flex justify-center flex-row gap-2">
                            <Button
                                onClick={() => onClose()}
                            >
                                Cancelar
                            </Button>
                            <Button
                                onClick={handlePay}
                                color="secondary"
                            >
                                Registrar pago
                            </Button>

                        </div>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Toaster />
        </>
    )

}