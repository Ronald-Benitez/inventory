"use client"

import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Input, useDisclosure, Select, SelectItem } from '@nextui-org/react'
import { useState, useEffect, use } from 'react'
import { type Inventory } from '@prisma/client'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'
import { IconPencil } from '@tabler/icons-react'

interface InventoryModalProps {
    data: Inventory | null
    reload: () => void
}

function InventoryModal({ data, reload }: InventoryModalProps) {
    const { isOpen, onClose, onOpen } = useDisclosure()
    const [name, setName] = useState("")
    const [quantity, setQuantity] = useState(0)
    const [unit, setUnit] = useState("")
    const [price, setPrice] = useState(0)
    const [unitPrice, setUnitPrice] = useState(0)
    const [type, setType] = useState("")


    const calculateUnitPrice = () => {
        const unitPrice = (price / quantity).toFixed(2)
        setUnitPrice(parseFloat(unitPrice))
    }

    useEffect(() => {
        if (data) {
            setName(data.name)
            setQuantity(data.quantity)
            setUnit(data.unit)
            setPrice(data.price)
            setUnitPrice(data.unitPrice)
            setType(data.type)
        }
    }, [data])


    const verifyFields = () => {
        if (name === "" || quantity === 0 || unit === "" || price === 0 || unitPrice === 0 || type === "") {
            toast.error("Todos los campos son requeridos")
            return false
        }

        return true
    }

    const clear = () => {
        setName("")
        setQuantity(0)
        setUnit("")
        setPrice(0)
        setUnitPrice(0)
        setType("")
    }

    const handleSave = () => {
        if (!verifyFields()) {
            return
        }

        toast.loading("Guardando...")
        axios.post("/api/inventory", {
            name,
            quantity,
            unit,
            price,
            unitPrice,
            type
        }).then((res) => {
            toast.remove()
            toast.success("Producto agregado exitosamente")
            clear()
            reload()
            onClose()
        }).catch((err) => {
            const { message } = JSON.parse(err.request.message)
            toast.remove()
            toast.error(message)
        })
    }

    const handleUpdate = () => {
        if (!verifyFields()) {
            return
        }

        toast.loading("Guardando...")
        axios.put("/api/inventory", {
            id: data?.id,
            name,
            quantity,
            unit,
            price,
            unitPrice,
            type
        }).then((res) => {
            toast.remove()
            toast.success("Producto actualizado exitosamente")
            onClose()
            reload()
        }).catch((err) => {
            const { message } = JSON.parse(err.request.message)
            toast.remove()
            toast.error(message)
        })
    }

    useEffect(() => {
        calculateUnitPrice()
    }, [quantity, price])

    return (
        <>
            <Toaster />
            {
                data ?
                    <Button
                        onClick={onOpen}
                        color='warning'
                        className="rounded-sm"
                        size='sm'
                    >
                        <IconPencil size={20} strokeWidth={1.5} />
                    </Button>

                    :
                    <Button
                        onClick={onOpen}
                        className="rounded-sm"
                    >
                        Agregar producto
                    </Button>
            }
            <Modal isOpen={isOpen} onClose={onClose} backdrop='blur'>
                <ModalContent>
                    <ModalHeader>
                        <h2 className='text-black text-center w-full text-xl my-2'>{data ? "Editar producto" : "Agregar producto"} </h2>
                    </ModalHeader>
                    <ModalBody>
                        <Input
                            label="Nombre"
                            placeholder="Nombre"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="my-2"
                        />
                        <Input
                            label="Cantidad"
                            placeholder="Cantidad"
                            type="number"
                            value={quantity.toString()}
                            onChange={(e) => setQuantity(parseInt(e.target.value))}
                            className="my-2"
                        />
                        <Input
                            label="Unidad"
                            placeholder="Unidad"
                            value={unit}
                            onChange={(e) => setUnit(e.target.value)}
                            className="my-2"
                        />
                        <Input
                            label="Precio"
                            placeholder="Precio"
                            type="number"
                            value={price.toString()}
                            onChange={(e) => setPrice(parseInt(e.target.value))}
                            className="my-2"
                        />
                        <Input
                            label="Precio por unidad"
                            placeholder="Precio por unidad"
                            type="number"
                            value={unitPrice.toString()}
                            onChange={(e) => setUnitPrice(parseInt(e.target.value))}
                            className="my-2"
                        />
                        <Select
                            placeholder="Tipo"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="rounded-sm"
                            label="Tipo"
                            selectedKeys={[type]}
                        >
                            <SelectItem key="Salon" value="compra" className="text-black" >Salon de belleza</SelectItem>
                            <SelectItem key="Cafeteria" value="venta" className="text-black">Cafetería</SelectItem>
                        </Select>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            color="default"
                            onClick={onClose}
                            className="rounded-sm"
                        >
                            Cancelar
                        </Button>
                        {
                            data ?
                                <Button
                                    color="secondary"
                                    onClick={handleUpdate}
                                    className="rounded-sm"
                                >
                                    Guardar
                                </Button>
                                :
                                <Button
                                    color="secondary"
                                    onClick={handleSave}
                                    className="rounded-sm"
                                >
                                    Agregar
                                </Button>
                        }
                    </ModalFooter>
                </ModalContent>

            </Modal>
        </>
    )
}

export default InventoryModal