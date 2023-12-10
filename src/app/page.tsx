"use client"


import { Button } from '@nextui-org/react'

import { getUsers } from '../../database/services/User'

export default function Home() {

  getUsers().then((res) => {
    console.log(res)
  })

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <div className="flex flex-col items-center justify-center">

          <h1 className="text-4xl font-bold text-center">Sistema de inventario</h1>
          <p className="text-center">Sistema de inventario</p>
          <div className="flex space-x-4">
            <Button color="primary" size="sm">Iniciar sesión</Button>
            <Button color="secondary" size="sm">Registrarse</Button>

          </div>
        </div>
      </div>
    </main>
  )

}
