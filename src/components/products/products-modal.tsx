"use client"

import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Input, useDisclosure, Textarea, Select, SelectItem, Switch } from '@nextui-org/react';
import { useState, useEffect } from 'react';
import { type Products, type Types, type Enterprises } from '@prisma/client';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { EditBtn } from '../ui';

interface ProductsModalProps {
    data: Products | null;
    reload: () => void;
    types: Types[] | [];
    enterprises: Enterprises[] | [];
}

export default function ProductsModal({ data, reload, types, enterprises }: ProductsModalProps) {
    const { isOpen, onClose, onOpen } = useDisclosure();
    const [name, setName] = useState('');
    const [description, setDescription] = useState("");
    const [typeId, setTypeId] = useState(0);
    const [enterpriseId, setEnterpriseId] = useState(0)
    const [price, setPrice] = useState(0)
    const [cost, setCost] = useState(0)
    const [available, setAvailable] = useState(true)

    useEffect(() => {
        if (data) {
            setName(data.name);
            setDescription(data.description)
            setTypeId(data.typeId)
            setEnterpriseId(data.enterpriseId)
            setCost(data.cost)
            setPrice(data.price)
            setAvailable(data.available)
        }
    }, [data]);

    const verifyFields = () => {
        if (name === '' || description === '' || typeId === 0 || enterpriseId === 0 || cost === 0 || price === 0) {
            toast.error('El nombre es requerido');
            return false;
        }
        return true;
    };

    const clear = () => {
        setName('');
        setDescription('')
        setCost(0)
        setPrice(0)
        setTypeId(0)
        setEnterpriseId(0)
    };

    const handleSave = () => {
        if (!verifyFields()) {
            return;
        }

        toast.loading('Guardando...');
        axios
            .post('/api/products', {
                name,
                description,
                price,
                typeId,
                enterpriseId,
                cost,
                available
            })
            .then((res) => {
                toast.remove();
                toast.success('Producto agregado exitosamente');
                clear();
                reload();
                onClose();
            })
            .catch((err) => {
                toast.remove();
                toast.error('Ocurrió un error al agregar el producto');
            });
    };

    const handleUpdate = () => {
        if (!verifyFields()) {
            return;
        }

        toast.loading('Guardando...');
        axios
            .put('/api/products', {
                id: data?.id,
                name,
                description,
                price,
                typeId,
                enterpriseId,
                cost,
                available
            })
            .then((res) => {
                toast.remove();
                toast.success('Producto actualizado exitosamente');
                onClose();
                reload();
            })
            .catch((err) => {
                toast.remove();
                toast.error("No se pudo actualizar el producto");
            });
    };

    return (
        <>
            <Toaster />
            {data ? (
                <EditBtn onClick={onOpen} />
            ) : (
                <Button onClick={onOpen} className="rounded-sm">
                    Agregar producto
                </Button>
            )}
            <Modal isOpen={isOpen} onClose={onClose} backdrop="blur" scrollBehavior='inside'>
                <ModalContent>
                    <ModalHeader>
                        <h2 className="text-black text-center w-full text-xl my-2">{data ? 'Editar producto' : 'Agregar producto'} </h2>
                    </ModalHeader>
                    <ModalBody>
                        <Input
                            label="Nombre"
                            placeholder="Nombre"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="my-2"
                        />
                        <Textarea
                            label="Descripción"
                            placeholder="Descripción"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="my-2"
                            rows={5}
                        />
                        <Input
                            label="Precio"
                            placeholder="Precio"
                            value={price.toString()}
                            onChange={(e) => setPrice(parseFloat(e.target.value))}
                            className="my-2"
                            type='number'
                        />
                        <Input
                            label="Costo"
                            placeholder="Costo"
                            value={cost.toString()}
                            onChange={(e) => setCost(parseFloat(e.target.value))}
                            className="my-2"
                            type='number'
                        />
                        <Select
                            label="Tipo"
                            onChange={(e) => setTypeId(parseInt(e.target.value))}
                            className="my-2"
                            placeholder='Tipo'
                            selectedKeys={[typeId.toString()]}
                        >
                            {
                                types?.map((item) => (
                                    <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                                ))
                            }
                        </Select>
                        <Select
                            label="Empresa"
                            onChange={(e) => setEnterpriseId(parseInt(e.target.value))}
                            className="my-2"
                            placeholder='Empresa'
                            selectedKeys={[enterpriseId.toString()]}
                        >
                            {
                                enterprises?.map((item) => (
                                    <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                                ))
                            }
                        </Select>
                        <Switch isSelected={available} onChange={(e)=> setAvailable(e.target.checked)}>
                            Disponible
                        </Switch>

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


