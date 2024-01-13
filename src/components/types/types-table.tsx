"use client"

import { Button } from '@nextui-org/react';
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { IconTrash } from '@tabler/icons-react';
import { Types } from '@prisma/client';

import Confirm from '../utils/confirm';
import TypesModal from './types-modal';
import { Table, Tbody, Thead, Td, Th, DeleteBtn } from '../ui';
import { handleDelete } from '@/utils/axiosHandler';

interface TypesTableProps {
  data: Types[] | [];
  reload: () => void;
}

export default function TypesTable({ data, reload }: TypesTableProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selected, setSelected] = useState<Types | null>(null);

  const onConfirm = () => {
    handleDelete({
      id: selected?.id || 0,
      onSuccess: () => toast.success('Tipo eliminado'),
      onError: () => toast.error("Error al eliminar el tipo"),
      onFinally: () => setConfirmDelete(false),
      reload,
      url: "/api/types"
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
              {data.map((item: Types) => (
                <tr key={item.id}>
                  <Td>{item.name}</Td>
                  <Td>
                    <div className="flex justify-center space-x-2">
                      <TypesModal data={item} reload={reload} />
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
          title="Eliminar tipo"
          msg={`¿Estás seguro de eliminar el tipo: ${selected?.name}?`}
          onConfirm={onConfirm}
          onCancel={() => setConfirmDelete(!confirmDelete)}
        />
      </div>
    </>
  );
}
