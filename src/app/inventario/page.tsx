"use client"

import { useState, useEffect } from "react"
import { Input, Button, Card, CardBody, CardFooter, CardHeader, Select, SelectItem } from "@nextui-org/react"
import toast, { Toaster } from "react-hot-toast"
import axios from "axios"
import { type Inventory } from "@prisma/client"
import { IconArrowBadgeLeftFilled, IconArrowBadgeRightFilled } from "@tabler/icons-react";

import InventoryTable from "@/components/inventory/inventory-table"
import InventoryModal from "@/components/inventory/inventory-modal"

export default function Inventory() {
    const [data, setData] = useState<Inventory[] | []>([])
    const [skip, setSkip] = useState(0)
    const [take, setTake] = useState(5)
    const [page, setPage] = useState(1)
    const [reload, setReload] = useState(false)

    const loadDataTable = () => {
        toast.remove()
        toast.loading("Cargando inventario...")
        axios.get(`/api/inventory/${skip}/${take}`).then((res) => {
            setData(res.data as Inventory[])
            toast.remove()
            if (res.data.length === 0) {
                toast.error("No hay datos para mostrar")

            }
        }).catch((err) => {
            const { message } = JSON.parse(err.request.message)
            toast.remove()
            toast.error(message)
        })
    }

    useEffect(() => {
        loadDataTable()
    }, [skip, take, reload])

    const handlePage = (flag: boolean) => {
        if (flag) {
            setSkip(skip - take)
            setPage(page - 1)
            return
        }
        setSkip(skip + take)
        setPage(page + 1)
    }

    return (
        <>
            <Toaster />
            <main className="flex min-h-screen flex-col items-center justify-between p-24">
                <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex flex-col">

                    <h1 className="text-4xl font-bold text-center my-2">Inventario</h1>
                    <div className="flex justify-center my-2">
                        <InventoryModal reload={() => { setReload(!reload) }} data={null} />
                    </div>
                    <InventoryTable data={data} reload={() => setReload(!reload)} />
                    <div className="flex justify-center my-2 w-full items-center gap-3">
                        <Button
                            color="secondary"
                            onClick={() => handlePage(true)}
                            className="rounded-sm"
                            disabled={skip === 0}
                        >
                            <IconArrowBadgeLeftFilled />
                        </Button>
                        <Select
                            placeholder="Items por página"
                            value={take}
                            onChange={(e) => setTake(Number(e.target.value))}
                            className="rounded-sm"
                        >
                            <SelectItem key={5} value={5} className="text-black" >5</SelectItem>
                            <SelectItem key={10} value={10} className="text-black">10</SelectItem>
                            <SelectItem key={25} value={25} className="text-black">25</SelectItem>
                            <SelectItem key={50} value={50} className="text-black">50</SelectItem>
                        </Select>
                        <p className="text-white text-center">Página {page}</p>
                        <Button
                            color="secondary"
                            onClick={() => handlePage(false)}
                            className="rounded-sm"
                            disabled={data.length < take}
                        >
                            <IconArrowBadgeRightFilled />
                        </Button>
                    </div>

                </div>
            </main>
        </>
    )

}