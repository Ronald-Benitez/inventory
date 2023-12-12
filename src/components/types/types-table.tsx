"use client"

import { Button, Table, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Input, useDisclosure } from '@nextui-org/react';
import { useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { IconTrash } from '@tabler/icons-react';
import Confirm from '../utils/confirm';
import { Types } from '@prisma/client';

interface TypesTableProps {
  data: Types[] | [];
  reload: () => void;
}

export default function TypesTable({ data, reload }: TypesTableProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selected, setSelected] = useState<Types | null>(null);
  const { isOpen, onClose, onOpen } = useDisclosure();

  const handleDelete = () => {
    axios
      .delete('/api/types', {
        data: {
          id: selected?.id,
        },
      })
      .then((res) => {
        toast.success('Tipo eliminado');
        setConfirmDelete(false);
        reload();
      })
      .catch((err) => {
        const { message } = JSON.parse(err.request.message);
        toast.error(message);
        setConfirmDelete(false);
        console.error(err);
      });
  };

  return (
    <>
      <div className="min-w-full">
        <div className="mb-8 overflow-auto">
          <Table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item: Types) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>
                    <div className="flex justify-center space-x-2">
                      {/* Add your modal or update logic here */}
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
          </Table>
        </div>

        <Toaster />
        <Confirm
          open={confirmDelete}
          title="Eliminar tipo"
          msg={`¿Estás seguro de eliminar el tipo: ${selected?.name}?`}
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(!confirmDelete)}
        />
      </div>
    </>
  );
}
