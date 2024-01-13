"use client"

import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Input, useDisclosure } from '@nextui-org/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { type Categories } from '@prisma/client';

import { EditBtn } from '../ui';
import SelectEnterprise from '../enterprises/select-enterprise';

interface Props {
    data: Categories | null;
    reload: () => void;
}

function TypesModal({ data, reload }: Props) {
    const { isOpen, onClose, onOpen } = useDisclosure();
    const [name, setName] = useState('');
    const [enterpriseId, setEnterpriseId] = useState<number>(0);

    useEffect(() => {
        if (data) {
            setName(data.name);
            setEnterpriseId(data.enterpriseId)
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
        setEnterpriseId(0)
    };

    const handleSave = () => {
        if (!verifyFields()) {
            return;
        }

        toast.loading('Guardando...');
        axios
            .post('/api/categories', {
                name,
                enterpriseId
            })
            .then((res) => {
                toast.remove();
                toast.success('Categoria agregada exitosamente');
                clear();
                reload();
                onClose();
            })
            .catch((err) => {
                toast.remove();
                toast.error('Ocurrió un error al agregar la categoria');
            });
    };

    const handleUpdate = () => {
        if (!verifyFields()) {
            return;
        }

        toast.loading('Guardando...');
        axios
            .put('/api/types', {
                id: data?.id,
                name,
            })
            .then((res) => {
                toast.remove();
                toast.success('Tipo actualizado exitosamente');
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
                    Agregar categoria
                </Button>
            )}
            <Modal isOpen={isOpen} onClose={onClose} backdrop="blur">
                <ModalContent>
                    <ModalHeader>
                        <h2 className="text-black text-center w-full text-xl my-2">{data ? 'Editar categoria' : 'Agregar categoria'} </h2>
                    </ModalHeader>
                    <ModalBody>
                        <Input
                            label="Nombre"
                            placeholder="Nombre"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="my-2"
                        />
                        <SelectEnterprise enterpriseId={enterpriseId} setEnterpriseId={setEnterpriseId} />
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
