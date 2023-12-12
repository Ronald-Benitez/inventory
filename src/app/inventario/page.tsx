"use client"

import { useState, useEffect } from "react"
import { Button, Select, SelectItem, Input } from "@nextui-org/react"
import toast, { Toaster } from "react-hot-toast"
import axios from "axios"
import { type Inventory, type Enterprises, type Types } from "@prisma/client"
import { IconArrowBadgeLeftFilled, IconArrowBadgeRightFilled } from "@tabler/icons-react";
import { useDebounce } from "@uidotdev/usehooks"

import InventoryTable from "@/components/inventory/inventory-table"
import InventoryModal from "@/components/inventory/inventory-modal"

export default function Inventory() {
    const [data, setData] = useState<Inventory[] | []>([])
    const [skip, setSkip] = useState(0)
    const [take, setTake] = useState(5)
    const [page, setPage] = useState(1)
    const [reload, setReload] = useState(false)
    const [enterprises, setEnterprises] = useState<Enterprises[] | []>([])
    const [types, setTypes] = useState<Types[] | []>([])
    const [filterColumn, setFilterColumn] = useState("")
    const [filterValue, setFilterValue] = useState("")
    const debouncedFilterValue = useDebounce(filterValue, 500)


    const loadDataTable = () => {
        const url = filterColumn === "" ? `/api/inventory/${skip}/${take}` : `/api/inventory/${skip}/${take}/${filterColumn}/${filterValue}`
        toast.remove()
        toast.loading("Cargando inventario...")
        axios.get(url).then((res) => {
            setData(res.data as Inventory[])
            toast.remove()
            if (res.data.length === 0) {
                toast.error("No hay datos para mostrar")

            }
        }).catch((err) => {
            const { message } = JSON.parse(err.request.message)
            toast.remove()
            toast.error(message)
            console.error(err)
        })
    }

    useEffect(() => {
        axios.get("/api/enterprises").then((res) => {
            setEnterprises(res.data as Enterprises[])
        }).catch((err) => {
            const { message } = JSON.parse(err.request.message)
            toast.error(message)
        })
        axios.get("/api/types").then((res) => {
            setTypes(res.data as Types[])
        }).catch((err) => {
            const { message } = JSON.parse(err.request.message)
            toast.error(message)
        })
    }, [])

    useEffect(() => {
        if (filterColumn === "") return
        loadDataTable()
    }, [debouncedFilterValue])

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

    const renderFilter = () => {
        switch (filterColumn) {
            case "name":
                return (
                    <Input
                        type="text"
                        onChange={(e) => setFilterValue(e.target.value)}
                        className="rounded-sm text-black p-1"
                        label="Nombre"
                        placeholder="Nombre"
                    />
                )
            case "enterpriseId":
                return (
                    <Select
                        onChange={(e) => setFilterValue(e.target.value)}
                        label="Empresa"
                        placeholder="Empresa"
                        className="min-w-[150px]"
                    >
                        {
                            enterprises.map((enterprise) => (
                                <SelectItem key={enterprise.id} value={enterprise.id} >
                                    {enterprise.name}
                                </SelectItem>
                            ))
                        }

                    </Select>
                )
            case "typeId":
                return (
                    <Select
                        onChange={(e) => setFilterValue(e.target.value)}
                        label="Tipo"
                        placeholder="Tipo"
                        className="min-w-[150px]"
                    >
                        {
                            types.map((type) => (
                                <SelectItem key={type.id} value={type.id} >
                                    {type.name}
                                </SelectItem>
                            ))
                        }

                    </Select>
                )
            default:
                return null
        }
    }

    return (
        <>
            <Toaster />
            <div className="flex flex-col items-center">

                <h1 className="text-4xl font-bold text-center my-2">Inventario</h1>
                <div className="flex justify-center my-2">
                    <InventoryModal reload={() => { setReload(!reload) }} data={null} types={types} enterprises={enterprises} />
                </div>
                <div className="flex justify-center my-2 items-center gap-3 px-2">
                    <Select
                        value={filterColumn}
                        onChange={(e) => {
                            setFilterColumn(e.target.value)
                            setFilterValue("")
                        }}
                        className="rounded-sm text-black p-1 min-w-[150px]"
                        label="Filtrar por..."
                    >
                        <SelectItem key={0} value="" className="text-black">Filtrar por...</SelectItem>
                        <SelectItem key={"name"} value="name" className="text-black">Nombre</SelectItem>
                        <SelectItem key={"enterpriseId"} value="enterpriseId" className="text-black">Empresa</SelectItem>
                        <SelectItem key={"typeId"} value="typeId" className="text-black">Tipo</SelectItem>
                    </Select>
                    {
                        renderFilter()
                    }
                </div>

                <div className="mt-5 rounded w-full lg:w-4/5 mb-4 px-2">
                    <InventoryTable reload={() => { setReload(!reload) }} data={data} types={types} enterprises={enterprises} />
                </div>

                <div className="flex justify-center my-2 items-center gap-3 px-2">
                    <Button
                        color="secondary"
                        onClick={() => handlePage(true)}
                        className="rounded-sm"
                        disabled={skip === 0}
                        size="sm"
                    >
                        <IconArrowBadgeLeftFilled />
                    </Button>
                    <p className=" text-center">Items</p>
                    <select
                        value={take}
                        onChange={(e) => setTake(Number(e.target.value))}
                        className="rounded-sm text-black p-1"
                    >
                        <option key={5} value={5} className="text-black" >5</option>
                        <option key={10} value={10} className="text-black">10</option>
                        <option key={25} value={25} className="text-black">25</option>
                        <option key={50} value={50} className="text-black">50</option>
                    </select>
                    <p className="text-center">Página {page}</p>
                    <Button
                        color="secondary"
                        onClick={() => handlePage(false)}
                        className="rounded-sm"
                        disabled={data.length < take}
                        size="sm"
                    >
                        <IconArrowBadgeRightFilled />
                    </Button>
                </div>
            </div>
        </>
    )

}