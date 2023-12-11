"use client"

import { Table, TableHeader, TableBody, TableRow, TableCell, TableColumn, Tab, Button } from "@nextui-org/react"
import React from 'react'
import moment from "moment"
import "moment/locale/es"
import { type Inventory } from "@prisma/client"
import axios from "axios"
import toast, { Toaster } from "react-hot-toast"

import InventoryModal from "@/components/inventory/inventory-modal"
import Confirm from "../utils/confirm"
import { IconTrash } from "@tabler/icons-react"

interface InventoryTableProps {
    data: Inventory[] | []
    reload: () => void
}

export default function InventoryTable({ data, reload }: InventoryTableProps) {
    const [confirmDelete, setConfirmDelete] = React.useState(false)
    const [selected, setSelected] = React.useState<Inventory | null>(null)

    const firstUpperCase = (word: string) => {
        return word.charAt(0).toUpperCase() + word.slice(1)
    }

    const handleDelete = () => {
        axios.delete("/api/inventory", {
            data: {
                id: selected?.id
            }
        }).then((res) => {
            toast.success("Producto eliminado")
            setConfirmDelete(false)
            reload()
        }).catch((err) => {
            const { message } = JSON.parse(err.request.message)
            toast.error(message)
            setConfirmDelete(false)
        })
    }

    return (
        <>
            <Table aria-label="Inventario de productos">
                <TableHeader>
                    <TableColumn>Actualización</TableColumn>
                    <TableColumn>Nombre</TableColumn>
                    <TableColumn>Cantidad</TableColumn>
                    <TableColumn>Unidad</TableColumn>
                    <TableColumn>Precio</TableColumn>
                    <TableColumn>Precio unitario</TableColumn>
                    <TableColumn>Tipo</TableColumn>
                    <TableColumn>Acciones</TableColumn>
                </TableHeader>
                <TableBody items={data} >
                    {(item: Inventory) => (
                        <TableRow key={item.id}>
                            <TableCell className="text-black">{
                                firstUpperCase(moment(item.updatedAt).locale("es").fromNow())
                            }</TableCell>
                            <TableCell className="text-black">{item.name}</TableCell>
                            <TableCell className="text-black">{item.quantity}</TableCell>
                            <TableCell className="text-black">{item.unit}</TableCell>
                            <TableCell className="text-black">{item.price}</TableCell>
                            <TableCell className="text-black">{item.unitPrice}</TableCell>
                            <TableCell className="text-black">{item.type}</TableCell>
                            <TableCell className="text-black">
                                <div className="flex justify-center gap-2">
                                    <InventoryModal reload={reload} data={item} />
                                    <Button
                                        className="rounded-sm"
                                        onClick={() => {
                                            setSelected(item)
                                            setConfirmDelete(true)
                                        }}
                                        size="sm"
                                        color="danger"
                                    >
                                        <IconTrash size={20} strokeWidth={1.5} />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <Toaster />
            <Confirm
                open={confirmDelete}
                title="Eliminar producto"
                msg={`¿Estás seguro de eliminar el producto: ${selected?.name}?`}
                onConfirm={handleDelete}
                onCancel={() => setConfirmDelete(!confirmDelete)}
            />

        </>
    )
}