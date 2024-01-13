import React from 'react';
import toast, { Toaster } from "react-hot-toast";
import { type Types, type Enterprises } from "@prisma/client"

import InventoryModal from "@/components/inventory/inventory-modal";
import Confirm from "../utils/confirm";
import { dateFromNow, normalizedText } from "@/utils/string";
import { Table, Th, Td, Thead, Tbody, DeleteBtn } from "../ui";
import { handleDelete } from '@/utils/axiosHandler';
import { inventoryWithTypeAndEnterprise } from "@/interfaces/tables"

interface InventoryTableProps {
    data: inventoryWithTypeAndEnterprise[] | [];
    reload: () => void;
    types: Types[] | [],
    enterprises: Enterprises[] | []
}

export default function InventoryTable({ data, reload, types, enterprises }: InventoryTableProps) {
    const [confirmDelete, setConfirmDelete] = React.useState(false);
    const [selected, setSelected] = React.useState<inventoryWithTypeAndEnterprise | null>(null);

    const onConfirm = () => {
        handleDelete({
            id: selected?.id || 0,
            reload,
            url: "/api/inventory",
            onSuccess: () => toast.success("Producto eliminado"),
            onError: () => toast.error("Error al eliminar el prducto"),
            onFinally: () => setConfirmDelete(false)
        })
    }

    return (
        <>
            <div className="min-w-full flex justify-center">
                <div className="mb-8 overflow-auto">
                    <Table>
                        <Thead>
                            <tr>
                                <Th>Actualización</Th>
                                <Th>Nombre </Th>
                                <Th>Cantidad</Th>
                                <Th>Unidad</Th>
                                <Th>Precio</Th>
                                <Th>Precio unitario </Th>
                                <Th>Tipo</Th>
                                <Th>Empresa</Th>
                                <Th>Acciones</Th>
                            </tr>
                        </Thead>
                        <Tbody>
                            {data.map((item: inventoryWithTypeAndEnterprise) => (
                                <tr key={item.id} className="border-t">
                                    <Td>{dateFromNow(item.updatedAt)}</Td>
                                    <Td>{normalizedText(item.name)}</Td>
                                    <Td>{item.quantity}</Td>
                                    <Td>{item.unit}</Td>
                                    <Td>${item.price}</Td>
                                    <Td>${item.unitPrice}</Td>
                                    <Td>{item.type.name}</Td>
                                    <Td>{item.enterprise.name}</Td>
                                    <Td>
                                        <div className="flex justify-center space-x-2">
                                            <InventoryModal reload={reload} data={item} types={types} enterprises={enterprises} />
                                            <DeleteBtn
                                                onClick={() => {
                                                    setSelected(item);
                                                    setConfirmDelete(true);
                                                }}
                                            />
                                        </div>
                                    </Td>
                                </tr>
                            ))}
                        </Tbody>
                    </Table>
                </div>

                <Toaster />
                <Confirm
                    open={confirmDelete}
                    title="Eliminar producto"
                    msg={`¿Estás seguro de eliminar el producto: ${selected?.name}?`}
                    onConfirm={onConfirm}
                    onCancel={() => setConfirmDelete(!confirmDelete)}
                />
            </div >
        </>
    );
}
