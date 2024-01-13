"use client"

import React from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, NavbarMenuToggle, NavbarMenu, NavbarMenuItem } from "@nextui-org/react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { IconHome, IconLogout } from "@tabler/icons-react";

export default function App() {
    const menuItems = [
        {
            name: (<p className="bg-white rounded p-1"><IconHome size={24} strokeWidth={1.5} color="black" /></p>),
            href: "/"
        },
        {
            name: "Dashboard",
            href: "/admin/dashboard"
        },
        {
            name: "Perfil",
            href: "/admin/perfil"
        },
        {
            name: "Inventario",
            href: "/admin/inventario"
        },
        {
            name: "Tipos",
            href: "/admin/tipos"
        },
        {
            name: "Categorias",
            href: "/admin/categorias"
        },
        {
            name: "Empresas",
            href: "/admin/empresas"
        },
        {
            name: "Productos",
            href: "/admin/productos"
        },
        {
            name: "Descuentos",
            href: "/admin/descuentos"
        },
        {
            name: "Pedidos",
            href: "/admin/pedidos"
        },
    ];

    const handleLogOut = () => {
        axios.delete("/api/auth").then((res) => {
            toast.success("Cierre de sesión exitoso")
            window.location.href = "/"
        }).catch((err) => {
            console.log(err)
            toast.error("Error al cerrar sesión")
        })
    }

    return (
        <>
            <Navbar disableAnimation isBordered className="bg-slate-900">
                <NavbarContent className="sm:hidden" justify="start">
                    <NavbarMenuToggle className="text-white" />
                </NavbarContent>

                <NavbarContent className="sm:hidden pr-3" justify="center">
                    <Link href="/">
                        <IconHome size={24} strokeWidth={1.5} color="white" />
                    </Link>
                </NavbarContent>

                <NavbarContent className="hidden sm:flex gap-4" justify="center">
                    {
                        menuItems.map((item, index) => (
                            <Link
                                href={item.href}
                                className="text-white"
                                key={index}
                            >
                                {item.name}
                            </Link>
                        ))
                    }
                </NavbarContent>

                <NavbarContent justify="end">
                    <NavbarItem>
                        <Button
                            size="sm"
                            onClick={handleLogOut}
                            className="bg-transparent border-none"
                        >
                            <IconLogout size={24} strokeWidth={1.5} color="white" />
                        </Button>
                    </NavbarItem>

                </NavbarContent>

                <NavbarMenu>
                    {
                        menuItems.map((item, index) => (
                            <NavbarMenuItem
                                key={index}
                            >
                                <Link
                                    href={item.href}
                                    className="text-black"
                                >
                                    {item.name}
                                </Link>
                            </NavbarMenuItem>
                        ))
                    }
                </NavbarMenu>
            </Navbar>
            <Toaster />
        </>
    );
}
