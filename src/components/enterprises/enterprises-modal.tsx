"use client"

import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Input, useDisclosure } from '@nextui-org/react';
import { useState, useEffect } from 'react';
import { type Enterprises } from '@prisma/client';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

import { EditBtn } from "../ui"

interface TypesModalProps {
  data: Enterprises | null;
  reload: () => void;
}

function TypesModal({ data, reload }: TypesModalProps) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [name, setName] = useState('');

  useEffect(() => {
    if (data) {
      setName(data.name);
    }
  }, [data]);

  const verifyFields = () => {
    if (name === '') {
      toast.error('El nombre es requerido');
      return false;
    }
    return true;
  };

  const clear = () => {
    setName('');
  };

  const handleSave = () => {
    if (!verifyFields()) {
      return;
    }

    toast.loading('Guardando...');
    axios
      .post('/api/enterprises', {
        name,
      })
      .then((res) => {
        toast.remove();
        toast.success('Empresa agregado exitosamente');
        clear();
        reload();
        onClose();
      })
      .catch((err) => {
        toast.remove();
        toast.error('Ocurrió un error al agregar la empresa');
      });
  };

  const handleUpdate = () => {
    if (!verifyFields()) {
      return;
    }

    toast.loading('Guardando...');
    axios
      .put('/api/enterprises', {
        id: data?.id,
        name,
      })
      .then((res) => {
        toast.remove();
        toast.success('Empresa actualizado exitosamente');
        onClose();
        reload();
      })
      .catch((err) => {
        const { message } = JSON.parse(err.request.message);
        toast.remove();
        toast.error(message);
      });
  };

  return (
    <>
      <Toaster />
      {data ? (
        <EditBtn onClick={onOpen} />
      ) : (
        <Button onClick={onOpen} className="rounded-sm">
          Agregar empresa
        </Button>
      )}
      <Modal isOpen={isOpen} onClose={onClose} backdrop="blur">
        <ModalContent>
          <ModalHeader>
            <h2 className="text-black text-center w-full text-xl my-2">{data ? 'Editar empresa' : 'Agregar empresa'} </h2>
          </ModalHeader>
          <ModalBody>
            <Input
              label="Nombre"
              placeholder="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="my-2"
            />
          </ModalBody>
          <ModalFooter>
            <Button color="default" onClick={onClose} className="rounded-sm">
              Cancelar
            </Button>
            {data ? (
              <Button color="secondary" onClick={handleUpdate} className="rounded-sm">
                Guardar
              </Button>
            ) : (
              <Button color="secondary" onClick={handleSave} className="rounded-sm">
                Agregar
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default TypesModal;
