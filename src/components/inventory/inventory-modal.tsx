"use client"

import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Input, useDisclosure, Select, SelectItem } from '@nextui-org/react'
import { useState, useEffect, use } from 'react'
import { type Inventory, type Types, type Enterprises } from '@prisma/client'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'
import { IconPencil } from '@tabler/icons-react'
import { EditBtn } from '../ui'

interface InventoryModalProps {
    data: Inventory | null
    reload: () => void
    types: Types[] | []
    enterprises: Enterprises[] | []
}

function InventoryModal({ data, reload, types, enterprises }: InventoryModalProps) {
    const { isOpen, onClose, onOpen } = useDisclosure()
    const [name, setName] = useState("")
    const [quantity, setQuantity] = useState(0)
    const [unit, setUnit] = useState("")
    const [price, setPrice] = useState(0)
    const [unitPrice, setUnitPrice] = useState(0)
    const [type, setType] = useState(0)
    const [enterprise, setEnterprise] = useState(0)


    const calculateUnitPrice = () => {
        const unitPrice = (price / quantity).toFixed(4)
        setUnitPrice(parseFloat(unitPrice))
    }

    useEffect(() => {
        if (data) {
            setName(data.name)
            setQuantity(data.quantity)
            setUnit(data.unit)
            setPrice(data.price)
            setUnitPrice(data.unitPrice)
            setType(data.typeId)
            setEnterprise(data.enterpriseId)
        }
    }, [data])


    const verifyFields = () => {
        if (name === "" || quantity === 0 || unit === "" || price === 0 || unitPrice === 0 || !type || !enterprise) {
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
        setType(0)
        setEnterprise(0)
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
            typeId: type,
            enterpriseId: enterprise
        }).then((res) => {
            toast.remove()
            toast.success("Producto agregado exitosamente")
            clear()
            reload()
            onClose()
        }).catch((err) => {
            toast.remove()
            toast.error("Ocurrió un error al agregar el producto")
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
            typeId: type,
            enterpriseId: enterprise
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
                    <EditBtn onClick={onOpen} />
                    :
                    <Button
                        onClick={onOpen}
                        className="rounded-sm"
                    >
                        Agregar producto
                    </Button>
            }
            <Modal isOpen={isOpen} onClose={onClose} backdrop='blur' scrollBehavior='inside' >
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
                            onChange={(e) => setQuantity(parseFloat(e.target.value))}
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
                            onChange={(e) => setPrice(parseFloat(e.target.value))}
                            className="my-2"
                        />
                        <Input
                            label="Precio por unidad"
                            placeholder="Precio por unidad"
                            type="number"
                            value={unitPrice.toString()}
                            onChange={(e) => setUnitPrice(parseFloat(e.target.value))}
                            className="my-2"
                        />
                        <Select
                            placeholder="Seleccione un tipo"
                            value={type}
                            onChange={(e) => setType(Number(e.target.value))}
                            className="my-2"
                            defaultSelectedKeys={[type.toString()]}
                            label="Tipo"
                        >
                            {
                                types?.map((item) => (
                                    <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                                ))
                            }
                        </Select>
                        <Select
                            placeholder="Seleccione una empresa"
                            value={enterprise}
                            onChange={(e) => setEnterprise(Number(e.target.value))}
                            className="my-2"
                            defaultSelectedKeys={[enterprise.toString()]}
                            label="Empresa"
                        >
                            {
                                enterprises?.map((item) => (
                                    <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                                ))
                            }
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