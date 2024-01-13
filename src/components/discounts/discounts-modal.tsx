"use client"

import { useState, useEffect } from "react"
import { Modal, ModalContent, ModalBody, ModalFooter, useDisclosure, Input, Button, ModalHeader, Select, SelectItem, Switch } from "@nextui-org/react"
import { type Products } from "@prisma/client"
import axios from "axios"
import toast, { Toaster } from "react-hot-toast"
import { useDebounce } from "@uidotdev/usehooks"
import moment from "moment"
import "moment/locale/es"

import { Table, Thead, Td, Tbody, Th, DeleteBtn } from "../ui"
import { calculateDiscountToSave } from "@/utils/numbers"

interface Props {
    reload: () => void
}

export default function DiscountsModal({ reload }: Props) {
    const [products, setProducts] = useState<Products[] | []>([])
    const [discountsProducts, setDiscountsProducts] = useState<Products[] | []>([])
    const [startDate, setStartDate] = useState(moment().format("yyyy-MM-DD"))
    const [endDate, setEndDate] = useState(moment().format("yyyy-MM-DD"))
    const [search, setSearch] = useState("")
    const [discount, setDiscount] = useState(0)
    const [manualDiscount, setManualDiscount] = useState(0)
    const [isManual, setIsmanual] = useState(false)
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

    const handleAddProduct = (item: Products) => {
        const existIndex = discountsProducts.findIndex((i) => i.name === item.name);

        if (existIndex !== -1) {
            toast.error("Este producto ya se ha registrado con el descuento")
        } else {
            setDiscountsProducts((prevOrderProducts) => [
                ...prevOrderProducts,
                item
            ]);
        }
    };

    const calculateDiscount = (value: number) => {
        return isManual ? calculateManualDiscount(value) : calculatePercentDiscont(value)
    }

    const calculatePercentDiscont = (value: number) => {
        if (discount === 0) return value
        const discountFixed = 1 - (discount / 100)
        const result = value * discountFixed
        return parseFloat(result.toFixed(2))
    }

    const calculateManualDiscount = (value: number) => {
        if (manualDiscount === 0) return value
        const result = value - manualDiscount
        return result < 0 ? 0 : parseFloat(result.toFixed(2))
    }

    const handleDiscountChange = (value: number) => {
        if (isManual) return setManualDiscount(value)
        if (value > 100) return toast.error("El descuento no puede ser mayor a 100%")
        if (value < 0) return toast.error("El descuento no puede ser negativo")

        setDiscount(value)
    }

    const handleDelete = (item: Products) => {
        const existIndex = discountsProducts.findIndex((i) => i.name === item.name);

        if (existIndex !== -1) {
            const updatedProducts = [...discountsProducts];
            updatedProducts.splice(existIndex, 1);
            setDiscountsProducts(updatedProducts);
        }
    };

    const renderOrderProducts = () => {
        return discountsProducts.length > 0 ? (
            <>
                <h1 className="font-bold mb-2">Productos</h1>
                <div className=" w-full  overflow-auto">
                    <Table>
                        <Thead>
                            <tr>
                                <Th>Nombre</Th>
                                <Th>Precio</Th>
                                <Th>Precio con descuento</Th>
                                <Th></Th>
                            </tr>
                        </Thead>
                        <Tbody>
                            {
                                discountsProducts.map((item: Products) => (
                                    <>
                                        <tr>
                                            <Td className="text-center truncate-20 px-6 py-4 ">{item.name}</Td>
                                            <Td>${item.price}</Td>
                                            <Td>${calculateDiscount(item.price)}</Td>
                                            <Td>
                                                <DeleteBtn
                                                    onClick={() => handleDelete(item)}
                                                />
                                            </Td>
                                        </tr>
                                    </>
                                ))
                            }
                        </Tbody>
                    </Table>
                </div>
            </>
        ) : (<p>Aún no se han registrado productos</p>)
    }

    const onCancel = () => {
        setSearch("")
        setProducts([])
        onClose()
        setDiscount(0)
        setManualDiscount(0)
        setDiscountsProducts([])
    }

    const voidData = () => {
        if (discountsProducts.length === 0) return toast.error("Debe ingresar productos")
        if (startDate === "") return toast.error("Debe registrar la fecha de inicio")
        if (endDate === "") return toast.error("Debe registrar la fecha de finalización")
        if (discount === 0 && manualDiscount === 0) return toast.error("Debe registrar el descuento")

        return false
    }

    useEffect(() => {
        const diff = moment(endDate, "yyyy-mm-DD").diff(moment(startDate, "yyyy-mm-DD"))
        if (diff < 0) {
            toast.error("La fecha final dede ser el mismo día o mayor que el de inicio")
            setEndDate(startDate)
        }
    }, [startDate, endDate])

    const handleSave = () => {

        if (!voidData()) {
            const sDate = new Date(startDate)
            const eDate = new Date(endDate)
            console.log(sDate, startDate)

            const data = discountsProducts.map((item) => (
                {
                    value: calculateDiscountToSave(isManual, item.price, isManual ? manualDiscount : discount),
                    startDate: sDate,
                    endDate: eDate,
                    productsId: item.id
                }
            ))
            toast.loading("Registrandon descuentos...")
            axios.post("/api/discounts", data).then((res) => {
                toast.remove()
                toast.success("Descuentos registrados con éxito")
                reload()
                onCancel()
            }).catch((err) => {
                toast.remove()
                toast.error("Error al registrar los descuentos")
            })

        }
    }

    return (
        <>
            <div>
                <Button onClick={() => onOpen()}>
                    Ingresar descuento
                </Button>
                <Modal onClose={() => onClose()} isOpen={isOpen} scrollBehavior="inside" backdrop="blur">
                    <ModalContent>
                        <ModalHeader>
                            <h1 className="text-center text-2xl w-full">
                                Registrar un nuevo descuento
                            </h1>
                        </ModalHeader>
                        <ModalBody>
                            <div className="flex gap-1 flex-row">
                                <Input
                                    value={startDate}
                                    type="date"
                                    onChange={(e) => setStartDate(e.target.value)}
                                    label="Inicio del descuento"
                                />
                                <Input
                                    value={endDate}
                                    type="date"
                                    onChange={(e) => setEndDate(e.target.value)}
                                    label="Fin del descuento"
                                />
                            </div>
                            <div className="flex gap-2 flex-wrap mt-2">
                                {
                                    isManual ? (
                                        <Input
                                            value={manualDiscount.toString()}
                                            type="number"
                                            onChange={(e) => handleDiscountChange(parseFloat(e.target.value))}
                                            label="Valor de descuento"
                                            placeholder="Ingrese el valor de descuento"
                                            startContent="$"
                                        />
                                    )
                                        :
                                        (
                                            <Input
                                                value={discount.toString()}
                                                type="number"
                                                onChange={(e) => handleDiscountChange(parseFloat(e.target.value))}
                                                label="Porcentaje de descuento"
                                                placeholder="Ingrese el porcentaje de descuento"
                                                endContent="%"
                                            />
                                        )
                                }
                                <Switch
                                    onChange={e => setIsmanual(e.target.checked)}
                                >
                                    {isManual ? ("Cambiar descuento a porcentaje") : ("Cambiar descuento a manual")}
                                </Switch>

                            </div>
                            <div>
                                <Input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    label="Buscar producto"
                                    placeholder="Buscar producto"
                                    className="my-2"
                                />
                                {products.length > 0 ? (
                                    <Select
                                        onChange={(e) => handleAddProduct(products[Number(e.target.value)])}
                                        label="Productos encontrados"
                                    >
                                        {
                                            products.map((item: Products, index) => (
                                                <SelectItem key={index} value={index}>{item.name}</SelectItem>
                                            ))
                                        }
                                    </Select>
                                ) : (
                                    <p className="text-center">No se encontraron productos</p>
                                )}
                                <div className="flex flex-col items-center justify-center mt-4 border-t border-black">
                                    {
                                        renderOrderProducts()
                                    }
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