"use client"

import { useState, useEffect } from "react"
import { Input, Button, Card, CardBody, CardFooter, CardHeader } from "@nextui-org/react"
import toast, { Toaster } from "react-hot-toast"
import axios from "axios"


export default function Login() {
    const [name, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleLogin = async () => {
        if (name === "" || password === "") {
            toast.error("Todos los campos son requeridos")
            return
        }

        toast.loading("Iniciando sesión...")

        axios.post("/api/auth", {
            name,
            password
        }).then((res) => {
            toast.success("Inicio de sesión exitoso")
            window.location.href = "/dashboard"
        }).catch((err) => {
            const { message } = JSON.parse(err.request.response)
            toast.error(message)
        })


    }

    return (
        <>
            <Toaster />
            <div className="flex min-h-screen items-center justify-center p-24">
                <Card className="w-full max-w-sm">
                    <CardHeader className="flex justify-center my-2">
                        <h4 className="text-center text-2xl ">Iniciar sesión</h4>
                    </CardHeader>
                    <CardBody>
                        <Input
                            label="Usuario"
                            placeholder="Usuario"
                            value={name}
                            onChange={(e) => setEmail(e.target.value)}
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
                    </CardBody>
                    <CardFooter className="flex justify-center my-2">
                        <Button
                            color="secondary"
                            onClick={handleLogin}
                            className="rounded-sm"
                        >
                            Iniciar sesión
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </>
    )
}