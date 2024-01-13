"use client"

import { useState, useEffect } from "react"
import { Modal, ModalContent, ModalBody, ModalFooter, useDisclosure, Input, Button, ModalHeader } from "@nextui-org/react"
import { type Products, type Orders } from "@prisma/client"
import axios from "axios"
import toast, { Toaster } from "react-hot-toast"
import { useDebounce } from "@uidotdev/usehooks"

import { Table, Thead, Td, Tbody, Th, DeleteBtn } from "../ui"
import { OrderProducts, OrderSave } from "@/interfaces/tables"

interface Props {
    reload: () => void
}

export default function OrdersModal({ reload }: Props) {
    const [products, setProducts] = useState<Products[] | []>([])
    const [orderProducts, setOrderProducts] = useState<OrderProducts[] | []>([])
    const [search, setSearch] = useState("")
    const [totals, setTotals] = useState({
        totalPrice: 0,
        totalProducts: 0,
        totalCost: 0
    })
    const [client, setClient] = useState("")
    const { isOpen, onOpen, onClose } = useDisclosure()
    const debouncedSearch = useDebounce(search, 200)

    useEffect(() => {
        loadProducts()
    }, [debouncedSearch])

    const loadProducts = () => {
        if (search === "") {
            setProducts([])
            return
        }
        const url = `/api/products/0/10/name/${search}`
        axios.get(url).then((res) => {
            setProducts(res.data as Products[])
        }).catch(err => {
            toast.error("Error al cargar los productos")
        })
    }

    const handleOrderProductsAdd = (item: Products) => {
        const existIndex = orderProducts.findIndex((i) => i.name === item.name);

        if (existIndex !== -1) {
            const updatedProducts = [...orderProducts];
            updatedProducts[existIndex].quantity += 1;
            setOrderProducts(updatedProducts);
        } else {
            setOrderProducts((prevOrderProducts) => [
                ...prevOrderProducts,
                {
                    cost: item.cost,
                    price: item.price,
                    name: item.name,
                    quantity: 1
                },
            ]);
        }

        handleTotal(item.price, true, item.cost);
    };

    const handleDelete = (item: OrderProducts) => {
        const existIndex = orderProducts.findIndex((i) => i.name === item.name);

        if (existIndex !== -1) {
            const updatedProducts = [...orderProducts];
            updatedProducts[existIndex].quantity -= 1;

            if (updatedProducts[existIndex].quantity === 0) {
                updatedProducts.splice(existIndex, 1);
            }

            setOrderProducts(updatedProducts);
            handleTotal(item.price, false, item.cost);
        }
    };

    const handleTotal = (price: number, add: boolean, cost: number) => {
        setTotals((prevTotals) => ({
            totalPrice: add ? prevTotals.totalPrice + price : prevTotals.totalPrice - price,
            totalProducts: add ? prevTotals.totalProducts + 1 : prevTotals.totalProducts - 1,
            totalCost: add ? prevTotals.totalCost + cost : prevTotals.totalCost - cost
        }));
    };

    const renderOrderPRoducts = () => {
        return orderProducts.length > 0 ? (
            <>
                <h1 className="font-bold mb-2">Productos del pedido</h1>
                <div className=" w-full  overflow-auto">
                    <Table>
                        <Thead>
                            <tr>
                                <Th>#</Th>
                                <Th>Nombre</Th>
                                <Th>Unitario</Th>
                                <Th>Total</Th>
                                <Th></Th>
                            </tr>
                        </Thead>
                        <Tbody>
                            {
                                orderProducts.map((item: OrderProducts) => (
                                    <>
                                        <tr>
                                            <Td>{item.quantity}</Td>
                                            <Td className="text-center truncate-20 px-6 py-4 ">{item.name}</Td>
                                            <Td>${item.price}</Td>
                                            <Td>${item.price * item.quantity}</Td>
                                            <Td>
                                                <DeleteBtn
                                                    onClick={() => handleDelete(item)}
                                                />
                                            </Td>
                                        </tr>
                                    </>
                                ))
                            }
                            <tr>
                                <Td className="text-center font-bold">
                                    {totals.totalProducts}
                                </Td>
                                <Td className="text-center font-bold">Total</Td>
                                <Td></Td>
                                <Td className="text-center font-bold">
                                    ${totals.totalPrice}
                                </Td>

                            </tr>
                        </Tbody>
                    </Table>
                </div>
            </>
        ) : (<p>Aún no se han registrado productos al pedido</p>)
    }

    const onCancel = () => {
        setSearch("")
        setProducts([])
        setOrderProducts([])
        setTotals({
            totalCost: 0,
            totalPrice: 0,
            totalProducts: 0
        })
        setClient("")
        onClose()
    }

    const voidData = () => {
        if (orderProducts.length === 0) return toast.error("Debe ingresar productos")
        if (client === "") return toast.error("Debe ingresar datos del cliente")
        return false
    }

    const handleSave = () => {
        if (!voidData()) {
            const data: OrderSave = {
                orderData: {
                    client,
                    totalCost: totals.totalCost,
                    totalPrice: totals.totalPrice
                },
                salesData: orderProducts
            }

            toast.loading("Registrandon orden...")
            axios.post("/api/orders", data).then((res) => {
                toast.remove()
                toast.success("Orden registrada con éxito")
                reload()
                onCancel()
            }).catch((err) => {
                toast.remove()
                toast.error("Error al registrar la orden")
            })

        }
    }

    return (
        <>
            <div>
                <Button onClick={() => onOpen()}>
                    Ingresar pedido
                </Button>
                <Modal onClose={() => onClose()} isOpen={isOpen} scrollBehavior="inside" backdrop="blur">
                    <ModalContent>
                        <ModalHeader>
                            <h1 className="text-center text-2xl w-full">
                                Registrar un nuevo pedido
                            </h1>
                        </ModalHeader>
                        <ModalBody>
                            <div>
                                <Input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    label="Buscar producto"
                                    placeholder="Buscar producto"
                                    className="my-2"
                                />
                                <div className="flex items-center justify-center mt-4 border-t border-black">
                                    <div className="flex justify-center items-center flex-col w-full p-2">
                                        <h1 className="font-bold">Resultado de la busqueda</h1>
                                        <div className="p-2 flex gap-1">
                                            {
                                                products.length > 0 ? products.map((item: Products) => (
                                                    <>
                                                        <Button
                                                            className="rounded-sm"
                                                            title="Agregar producto"
                                                            onClick={() => handleOrderProductsAdd(item)}
                                                        >
                                                            {item.name}
                                                        </Button>
                                                    </>
                                                )) : (<p>No hay productos</p>)
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center justify-center mt-4 border-t border-black">
                                    {
                                        renderOrderPRoducts()
                                    }
                                </div>
                                <div className="flex flex-col items-center justify-center mt-4 border-t border-black">
                                    <Input
                                        label="Cliente"
                                        placeholder="Cliente"
                                        onChange={(e) => setClient(e.target.value)}
                                        className="mt-2"
                                    />
                                </div>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <div className="flex flex-row justify-center items-center w-full gap-2">
                                <Button onClick={onCancel}>
                                    Cancelar
                                </Button>
                                <Button color="secondary" onClick={handleSave}>
                                    Registrar
                                </Button>
                            </div>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </div>
            <Toaster />
        </>
    )

}