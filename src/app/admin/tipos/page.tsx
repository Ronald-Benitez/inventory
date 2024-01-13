"use client"

import { useState, useEffect } from "react"
import { Button } from "@nextui-org/react"
import toast, { Toaster } from "react-hot-toast"
import axios from "axios"
import { type Types } from "@prisma/client"
import { IconArrowBadgeLeftFilled, IconArrowBadgeRightFilled } from "@tabler/icons-react";

import TypesModal from "@/components/types/types-modal"
import TypesTable from "@/components/types/types-table"

export default function Inventory() {
    const [data, setData] = useState<Types[] | []>([])
    const [skip, setSkip] = useState(0)
    const [take, setTake] = useState(5)
    const [page, setPage] = useState(1)
    const [reload, setReload] = useState(false)


    const loadDataTable = () => {
        toast.remove()
        toast.loading("Cargando tipos...")
        axios.get(`/api/types/${skip}/${take}`).then((res) => {
            setData(res.data as Types[])
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
            <div className="flex flex-col items-center">

                <h1 className="text-4xl font-bold text-center my-2">Tipos</h1>
                <div className="flex justify-center my-2">
                    <TypesModal reload={() => { setReload(!reload) }} data={null}/>
                </div>

                <div className="mt-5 rounded w-full lg:w-4/5 mb-4 px-2">
                    <TypesTable reload={() => { setReload(!reload) }} data={data}  />
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