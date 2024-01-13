"use client"

import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, CardFooter, Button } from "@nextui-org/react";
import toast, { Toaster } from "react-hot-toast";

import { dateFromNow } from "@/utils/string"
import Confirm from "../utils/confirm";
import { OrderWithSales } from "@/interfaces/tables"
import { handleDelete, handleUpdate } from "@/utils/axiosHandler"
import { DeleteBtn } from "../ui";
import PayModal from "./pay-modal";

interface Props {
    data: OrderWithSales
    reload: () => void
}

export default function ({ data, reload }: Props) {
    const [confirmDelete, setConfirmDelete] = useState(false)
    const [elapsedTime, setElapsedTime] = useState(dateFromNow(data.updatedAt));
    const [received, setReceived] = useState(0)

    const handleCancel = () => {
        handleDelete(
            {
                id: data.id,
                onError: () => toast.error("Error al eliminar el pedido"),
                onSuccess: () => toast.success("Pedido eliminado con éxito"),
                onFinally: () => setConfirmDelete(false),
                url: "/api/orders",
                reload
            }
        )

    }

    const handleDeliver = () => {
        handleUpdate({
            id: data.id,
            data: {
                delivered: true
            },
            onError: () => toast.error("No se pudo actualizar la entrega"),
            onSuccess: () => toast.success("Entrega registrada correctamente"),
            url: "/api/orders",
            onFinally: () => setConfirmDelete(false),
            reload
        })
    }

    useEffect(() => {
        const intervalId = setInterval(() => {
            setElapsedTime(dateFromNow(data.updatedAt));
        }, 60000);

        return () => {
            clearInterval(intervalId);
        };
    }, [data.updatedAt]);

    return (
        <>
            <Card className="w-full lg:w-1/4 md:1/3">
                <CardHeader>
                    <div className="flex flex-col items-center justify-center w-full">
                        <small className="font-bold">{elapsedTime}</small>
                        <h1 className="text-center text-xl">{data.client}</h1>
                    </div>
                    <DeleteBtn onClick={() => setConfirmDelete(true)} />
                </CardHeader>
                <CardBody>
                    <div className="flex flex-col">
                        {
                            data.sales.length > 0 && data.sales.map((item) => (
                                <div className="flex flex-row items-center justify-between px-2">
                                    <small className="font-bold">( {item.quantity} )</small>
                                    <p>{item.name}</p>
                                    <small className="font-bold">( ${item.price * item.quantity} )</small>
                                </div>
                            ))
                        }
                        <div className="flex flex-row items-center justify-between mt-2 px-2">
                            <p className="font-bold">Total</p>
                            <p>${data.totalPrice}</p>
                        </div>
                    </div>
                </CardBody>
                <CardFooter>
                    <div className="flex items-center justify-center gap-2 w-full">
                        <Button onClick={handleDeliver} className="bg-slate-300">
                            Entregar
                        </Button>
                        <PayModal data={data} received={received} setReceived={setReceived} />
                    </div>
                </CardFooter>
            </Card>
            <Confirm
                msg={`Esta seguro que desa cancelar el pedido de ${data.client}`}
                onCancel={() => setConfirmDelete(false)}
                onConfirm={handleCancel}
                open={confirmDelete}
                title="Cancelar pedido"
            />
            <Toaster />
        </>
    )
}