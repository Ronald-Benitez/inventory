"use client"

import { useEffect, useState } from "react"
import toast, { Toaster } from "react-hot-toast"
import axios from "axios"

import OrdersModal from "@/components/orders/orders-modal"
import OrdersCard from "@/components/orders/orders-card"
import { OrderWithSales } from "@/interfaces/tables"


export default function Pedidos() {
    const [orders, setOrders] = useState<OrderWithSales[] | []>([])
    const [reloadData, setReloadData] = useState(false)

    useEffect(() => {
        loadData()
    }, [reloadData])

    const loadData = () => {
        axios.get("/api/orders/0/10/delivered/false").then((res) => {
            setOrders(res.data)
        }).catch((err) => {
            console.log(err)
            toast.error("Ocurrio un error al cargar los pedidos")
        })
    }

    return (
        <>
            <div className="flex min-h-screen items-center mt-2 flex-col">
                <h1 className="text-4xl font-bold text-center my-2">Pedidos</h1>
                <OrdersModal reload={() => setReloadData(!reloadData)} />
                <div className="w-full p-4 flex justify-center gap-2">
                    {
                        orders.length > 0 ? orders.map((item) => (
                            <OrdersCard data={item} reload={() => setReloadData(!reloadData)} />
                        )) : (
                            <p>No hay pedidos en espera</p>
                        )
                    }
                </div>
            </div >
            <Toaster />
        </>
    )
}