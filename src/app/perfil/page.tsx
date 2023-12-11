"use client"

import { useState, useEffect } from "react"
import { getDecodedCookies } from "../services/cookies"
import { Input, Button, Card, CardBody, CardFooter, CardHeader } from "@nextui-org/react"
import toast, { Toaster } from "react-hot-toast"
import axios from "axios"

export default function Profile() {
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [passwordConfirmation, setPasswordConfirmation] = useState("")
    const [id, setId] = useState("")
    const [newUser, setNewUser] = useState(false)

    useEffect(() => {
        getDecodedCookies("token").then((res) => {
            if (res) {
                const parsedToken = JSON.parse(res)
                setId(parsedToken.id)
                setName(parsedToken.name)
            }
        }).catch((err) => {
            console.log(err)
        })

    }, [])

    const handleUpdate = async () => {
        if (name === "" || password === "" || passwordConfirmation === "") {
            toast.error("Todos los campos son requeridos")
            return
        }

        if (password !== passwordConfirmation) {
            toast.error("Las contraseñas no coinciden")
            return
        }

        toast.loading("Actualizando perfil...")
        axios.put("/api/auth", {
            name,
            password,
            id
        }).then((res) => {
            toast.remove()
            toast.success("Perfil actualizado exitosamente")
        }).catch((err) => {
            const { message } = JSON.parse(err.request.response)
            toast.remove()
            toast.error(message)
        })
    }

    const handleCreate = async () => {
        if (name === "" || password === "" || passwordConfirmation === "") {
            toast.error("Todos los campos son requeridos")
            return
        }

        if (password !== passwordConfirmation) {
            toast.error("Las contraseñas no coinciden")
            return
        }

        toast.loading("Creando usuario...")
        axios.post("/api/users", {
            name,
            password
        }).then((res) => {
            toast.remove()
            toast.success("Usuario creado exitosamente")
        }).catch((err) => {
            const { message } = JSON.parse(err.request.response)
            toast.remove()
            toast.error(message)
        })
    }



    return (
        <>
            <div className="flex min-h-screen items-center justify-center flex-col">
                <div className="flex justify-center my-2">
                    <Button
                        color="secondary"
                        onClick={() => setNewUser(!newUser)}
                        className="rounded-sm"
                    >
                        {
                            newUser ? "Actualizar perfil" : "Crear usuario"
                        }
                    </Button>
                </div>
                <Card className="w-full max-w-sm">
                    <CardHeader className="flex justify-center my-2">
                        {
                            newUser ? <h4 className="text-center text-2xl ">Crear usuario</h4> : <h4 className="text-center text-2xl ">Actualizar perfil</h4>
                        }
                    </CardHeader>
                    <CardBody>
                        <Input
                            label="Usuario"
                            placeholder="Usuario"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="my-2"
                        />
                        <Input
                            label="Contraseña"
                            placeholder="Contraseña"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="my-2"
                        />
                        <Input
                            label="Confirmar contraseña"
                            placeholder="Confirmar contraseña"
                            type="password"
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                            className="my-2"
                        />
                    </CardBody>
                    <CardFooter className="flex justify-center my-2">
                        {
                            newUser ? <Button
                                color="secondary"
                                onClick={handleCreate}
                                className="rounded-sm"
                            >
                                Crear usuario
                            </Button> : <Button
                                color="secondary"
                                onClick={handleUpdate}
                                className="rounded-sm"
                            >
                                Actualizar perfil
                            </Button>
                        }
                    </CardFooter>
                </Card>
            </div>
            <Toaster />
        </>
    )

}
