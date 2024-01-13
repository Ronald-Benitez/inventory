import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Confirm from '../utils/confirm';
import { Table, Th, Td, Thead, Tbody, DeleteBtn } from '../ui';
import { handleDelete } from '@/utils/axiosHandler';

interface TableWithActionsProps<T> {
    data: T[];
    reload: () => void;
    columns: {
        label: string;
        key: keyof T;
        present: ((value: any) => string) | string;
    }[];
    actions: {
        delete: {
            url: string;
            onSuccess: () => void;
            onError: () => void;
        };
    };
}


function TableWithActions<T>({ data, reload, columns, actions }: TableWithActionsProps<T>) {
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [selected, setSelected] = useState<T | null>(null);

    const onConfirm = () => {
        handleDelete({
            id: (selected as any)?.id || 0,
            reload,
            url: actions.delete.url,
            onError: () => {
                toast.error('Error al eliminar el elemento');
                actions.delete.onError();
            },
            onSuccess: () => {
                toast.success('Elemento eliminado exitosamente');
                actions.delete.onSuccess();
            },
            onFinally: () => setConfirmDelete(false),
        });
    };

    return (
        <>
            <div className="min-w-full flex justify-center">
                <div className="mb-8 overflow-auto">
                    <Table>
                        <Thead>
                            <tr>
                                {columns.map((column) => (
                                    <Th key={column.label}>{column.label}</Th>
                                ))}
                                <Th>Acciones</Th>
                            </tr>
                        </Thead>
                        <Tbody>
                            {data && data.length > 0 && data.map((item) => (
                                <tr key={(item as any).id}>
                                    {columns.map((column) => (
                                        <Td key={column.label}>
                                            {typeof column.present === 'function'
                                                ? column.present(item[column.key])
                                                : (item[column.key] as React.ReactNode)}

                                        </Td>
                                    ))}
                                    <Td>
                                        <div className="flex justify-center space-x-2">
                                            {/* Add your custom action components here */}
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
                    title="Eliminar el elemento"
                    msg={`¿Estás seguro de eliminar el elemento?`}
                    onConfirm={onConfirm}
                    onCancel={() => setConfirmDelete(!confirmDelete)}
                />
            </div>
        </>
    );
}

export default TableWithActions;
