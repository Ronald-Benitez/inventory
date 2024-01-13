"use client"

import { useState, useEffect } from "react"
import { Button, Select, SelectItem, Input } from "@nextui-org/react"
import toast, { Toaster } from "react-hot-toast"
import axios from "axios"
import { type Enterprises, type Types } from "@prisma/client"
import { IconArrowBadgeLeftFilled, IconArrowBadgeRightFilled } from "@tabler/icons-react";
import { useDebounce } from "@uidotdev/usehooks"

import ProductsTable from "@/components/products/products-table"
import ProductsModal from "@/components/products/products-modal"
import { ProductsCompleteInfo } from "@/interfaces/tables"

export default function Products() {
    const [data, setData] = useState<ProductsCompleteInfo[] | []>([])
    const [skip, setSkip] = useState(0)
    const [take, setTake] = useState(5)
    const [page, setPage] = useState(1)
    const [reload, setReload] = useState(false)
    const [enterprises, setEnterprises] = useState<Enterprises[] | []>([])
    const [types, setTypes] = useState<Types[] | []>([])
    const [filterColumn, setFilterColumn] = useState("")
    const [filterValue, setFilterValue] = useState("")
    const [orderBy, setOrderBy] = useState("")
    const [order, setOrder] = useState("desc")
    const debouncedFilterValue = useDebounce(filterValue, 500)


    const getUrl = () => {
        const orderC = orderBy !== "" ? `${orderBy}:${order}` : ""
        if (orderBy === "" && filterColumn === "") return `/api/products/${skip}/${take}`
        if (orderBy !== "" && filterColumn === "") return `/api/products/${skip}/${take}/${orderC}`
        if (orderBy === "" && filterColumn !== "") return `/api/products/${skip}/${take}/${filterColumn}/${filterValue}`
        return `/api/products/${skip}/${take}/${filterColumn}/${filterValue}/${orderC}`
    }

    const loadDataTable = () => {
        const url = getUrl()
        toast.remove()
        toast.loading("Cargando productos...")
        axios.get(url).then((res) => {
            setData(res.data as ProductsCompleteInfo[])
            console.log(res.data)
            toast.remove()
            if (res.data.length === 0) {
                toast.error("No hay datos para mostrar")

            }
        }).catch((err) => {
            toast.remove()
            toast.error("No se pudieron cargar los productos")  
        })
    }

    useEffect(() => {
        axios.get("/api/enterprises").then((res) => {
            setEnterprises(res.data as Enterprises[])
        }).catch((err) => {
            toast.error("No se pudo cargar las empresas")
        })
        axios.get("/api/types").then((res) => {
            setTypes(res.data as Types[])
        }).catch((err) => {
            toast.error("No se pudo cargar los tipos")
        })
    }, [])

    useEffect(() => {
        if (filterColumn === "") return
        loadDataTable()
    }, [debouncedFilterValue])

    useEffect(() => {
        loadDataTable()
    }, [skip, take, reload, orderBy, order])

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

                <h1 className="text-4xl font-bold text-center my-2">Productos</h1>
                <div className="flex justify-center my-2">
                    <ProductsModal reload={() => { setReload(!reload) }} data={null} types={types} enterprises={enterprises} />
                </div>
                <div className="w-2/3">
                    <div className="flex gap-2 overflow-auto">
                        <Select
                            value={orderBy}
                            onChange={(e) => setOrderBy(e.target.value)}
                            className="rounded-sm text-black p-1 min-w-[150px]"
                            label="Ordenar por..."
                        >
                            <SelectItem key={"name"} value="name" className="text-black">Nombre</SelectItem>
                            <SelectItem key={"quantity"} value="quantity" className="text-black">Cantidad</SelectItem>
                            <SelectItem key={"unit"} value="unit" className="text-black">Unidad</SelectItem>
                            <SelectItem key={"price"} value="price" className="text-black">Precio</SelectItem>
                            <SelectItem key={"unitPrice"} value="unitPrice" className="text-black">Precio unitario</SelectItem>
                            <SelectItem key={"typeId"} value="typeId" className="text-black">Tipo</SelectItem>
                            <SelectItem key={"enterpriseId"} value="enterpriseId" className="text-black">Empresa</SelectItem>
                        </Select>
                        <Select
                            value={order}
                            onChange={(e) => setOrder(e.target.value)}
                            className="rounded-sm text-black p-1 min-w-[150px]"
                            label="Orden"
                            defaultSelectedKeys={["desc"]}
                        >
                            <SelectItem key={"asc"} value="asc" className="text-black">Ascendente</SelectItem>
                            <SelectItem key={"desc"} value="desc" className="text-black">Descendente</SelectItem>
                        </Select>
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
                </div>

                <div className="mt-5 rounded w-full lg:w-4/5 mb-4 px-2">
                    <ProductsTable reload={() => { setReload(!reload) }} data={data} types={types} enterprises={enterprises} />
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