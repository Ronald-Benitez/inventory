import { Button } from "@nextui-org/react";
import React from 'react';
import moment from "moment";
import "moment/locale/es";
import { type Enterprises, type Types, type Inventory } from "@prisma/client";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

import InventoryModal from "@/components/inventory/inventory-modal";
import Confirm from "../utils/confirm";
import { IconTrash } from "@tabler/icons-react";

interface InventoryTableProps {
    data: Inventory[] | [];
    reload: () => void;
    types: Types[] | [];
    enterprises: Enterprises[] | [];
}

export default function InventoryTable({ data, reload, types, enterprises }: InventoryTableProps) {
    const [confirmDelete, setConfirmDelete] = React.useState(false);
    const [selected, setSelected] = React.useState<Inventory | null>(null);

    const firstUpperCase = (word: string) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    };

    const handleDelete = () => {
        axios.delete("/api/inventory", {
            data: {
                id: selected?.id
            }
        }).then((res) => {
            toast.success("Producto eliminado");
            setConfirmDelete(false);
            reload();
        }).catch((err) => {
            const { message } = JSON.parse(err.request.message);
            toast.error(message);
            setConfirmDelete(false);
            console.log(err);
        });
    };

    return (
        <>
            <div className="min-w-full flex justify-center">
                <div className="mb-8 overflow-auto">
                    <table className="min-w-full divide-y divide-gray-200 border border-slate-300">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actualización
                                </th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nombre
                                </th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Cantidad
                                </th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Unidad
                                </th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Precio
                                </th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Precio unitario
                                </th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tipo
                                </th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Empresa
                                </th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Acciones
                                </th>

                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 border">
                            {data.map((item: Inventory) => (
                                <tr key={item.id} className="border-t">
                                    <td className="px-6 py-4 whitespace-nowrap text-black">
                                        {firstUpperCase(moment(item.updatedAt).locale("es").fromNow())}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-black">{item.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-black">{item.quantity}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-black">{item.unit}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-black">{item.price}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-black">{item.unitPrice}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-black">
                                        {types.find((type) => type.id === item.typeId)?.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-black">
                                        {enterprises.find((enterprise) => enterprise.id === item.enterpriseId)?.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-black">
                                        <div className="flex justify-center space-x-2">
                                            <InventoryModal reload={reload} data={item} types={types} enterprises={enterprises} />
                                            <Button
                                                className="rounded-sm bg-red-500 text-white px-2 py-1"
                                                onClick={() => {
                                                    setSelected(item);
                                                    setConfirmDelete(true);
                                                }}
                                                size="sm"
                                            >
                                                <IconTrash size={20} strokeWidth={1.5} />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <Toaster />
                <Confirm
                    open={confirmDelete}
                    title="Eliminar producto"
                    msg={`¿Estás seguro de eliminar el producto: ${selected?.name}?`}
                    onConfirm={handleDelete}
                    onCancel={() => setConfirmDelete(!confirmDelete)}
                />
            </div>
        </>
    );
}
