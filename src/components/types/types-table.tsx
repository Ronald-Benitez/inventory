"use client"

import { Button } from '@nextui-org/react';
import { useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { IconTrash } from '@tabler/icons-react';
import { Types } from '@prisma/client';

import Confirm from '../utils/confirm';
import TypesModal from './types-modal';

interface TypesTableProps {
  data: Types[] | [];
  reload: () => void;
}

export default function TypesTable({ data, reload }: TypesTableProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selected, setSelected] = useState<Types | null>(null);

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
      <div className="min-w-full flex justify-center">
        <div className="mb-8 overflow-auto">
          <table className="min-w-full divide-y divide-gray-200 border border-slate-300">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((item: Types) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-black">{item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-black">
                    <div className="flex justify-center space-x-2">
                      <TypesModal data={item} reload={reload} />
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
          title="Eliminar tipo"
          msg={`¿Estás seguro de eliminar el tipo: ${selected?.name}?`}
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(!confirmDelete)}
        />
      </div>
    </>
  );
}
