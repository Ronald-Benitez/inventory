"use client"

import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { type Enterprises } from '@prisma/client';

import Confirm from '../utils/confirm';
import EnterprisesModal from './enterprises-modal';
import { Table, Th, Td, Thead, Tbody, DeleteBtn } from "../ui";
import { normalizedText } from '@/utils/string';
import { handleDelete } from '@/utils/axiosHandler';

interface TypesTableProps {
    data: Enterprises[] | [];
    reload: () => void;
}

export default function TypesTable({ data, reload }: TypesTableProps) {
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [selected, setSelected] = useState<Enterprises | null>(null);

    const onConfirm = () => {
        handleDelete({
            id: selected?.id || 0,
            reload,
            url: "/api/enterprises",
            onError: () => toast.error("Error al eliminar la empresa"),
            onSuccess: () => toast.success("Empresa eliminada"),
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
                                <Th>Acciones</Th>
                            </tr>
                        </Thead>
                        <Tbody>
                            {data.map((item: Enterprises) => (
                                <tr key={item.id}>
                                    <Td>{normalizedText(item.name)}</Td>
                                    <Td>
                                        <div className="flex justify-center space-x-2">
                                            <EnterprisesModal data={item} reload={reload} />
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
                    title="Eliminar empresa"
                    msg={`¿Estás seguro de eliminar la empresa: ${selected?.name}?`}
                    onConfirm={onConfirm}
                    onCancel={() => setConfirmDelete(!confirmDelete)}
                />
            </div>
        </>
    );
}
