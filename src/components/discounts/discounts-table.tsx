"use client"

import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import Confirm from '../utils/confirm';
import { Table, Th, Td, Thead, Tbody, DeleteBtn } from "../ui";
import { normalizedText } from '@/utils/string';
import { handleDelete } from '@/utils/axiosHandler';
import DiscountsModal from "./discounts-modal"
import { DiscountsWitProduct } from '@/interfaces/tables';
import moment from 'moment';

import { showDiscount } from '@/utils/string';

interface Props {
    data: DiscountsWitProduct[] | [];
    reload: () => void;
}

export default function DiscountTable({ data, reload }: Props) {
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [selected, setSelected] = useState<DiscountsWitProduct | null>(null);
    console.log(data)

    const onConfirm = () => {
        handleDelete({
            id: selected?.id || 0,
            reload,
            url: "/api/discounts",
            onError: () => toast.error("Error al eliminar el descuento"),
            onSuccess: () => toast.success("Descuento eliminado"),
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
                                <Th>Nombre</Th>
                                <Th>Inicio</Th>
                                <Th>Fin</Th>
                                <Th>Precio base</Th>
                                <Th>Precio descuento</Th>
                                <Th>Acciones</Th>
                            </tr>
                        </Thead>
                        <Tbody>
                            {data.map((item: DiscountsWitProduct) => (
                                <tr key={item.id}>
                                    <Td>{normalizedText(item.products.name)}</Td>
                                    <Td>{moment.utc(item.startDate).format("DD/MM/YYYY")}</Td>
                                    <Td>{moment.utc(item.endDate).format("DD/MM/YYYY")}</Td>
                                    <Td>${item.products.price}</Td>
                                    <Td>{showDiscount(item.products.price, item.value)}</Td>
                                    <Td>
                                        <div className="flex justify-center space-x-2">
                                            <DiscountsModal reload={reload} />
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
                    title="Eliminar el descuento"
                    msg={`¿Estás seguro de eliminar el descuento al producto:?`}
                    onConfirm={onConfirm}
                    onCancel={() => setConfirmDelete(!confirmDelete)}
                />
            </div>
        </>
    );
}
