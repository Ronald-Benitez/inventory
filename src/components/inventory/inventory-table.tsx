"use client"

import { Table, TableHeader, TableBody, TableRow, TableCell, TableColumn, Tab } from "@nextui-org/react"
import React from 'react'
import moment from "moment"
import "moment/locale/es"
import { type Inventory } from "@prisma/client"


export default function InventoryTable({ data }: { data: Inventory[] | [] }) {

    const firstUpperCase = (word: string) => {
        return word.charAt(0).toUpperCase() + word.slice(1)
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
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </>
    )
}