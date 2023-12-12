"use client"

import React from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, NavbarMenuToggle, NavbarMenu, NavbarMenuItem } from "@nextui-org/react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { IconHome, IconLogout } from "@tabler/icons-react";

export default function App() {
    const menuItems = [
        {
            name: "Inicio",
            href: "/"
        },
        {
            name: "Dashboard",
            href: "/dashboard"
        },
        {
            name: "Perfil",
            href: "/perfil"
        },
        {
            name: "Inventario",
            href: "/inventario"
        },
        {
            name: "Tipos",
            href: "/tipos"
        },
        {
            name: "Empresas",
            href: "/empresas"
        }
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
                    <Link href="/" className="text-black bg-white text-xl p-1 rounded">
                        <IconHome size={24} strokeWidth={1.5} color="black" />
                    </Link>
                    <Link href="/dashboard" className="text-white">
                        Dashboard
                    </Link>
                    <Link href="/perfil" className="text-white">
                        Perfil
                    </Link>
                    <Link href="/inventario" className="text-white">
                        Inventario
                    </Link>
                    <Link href="/tipos" className="text-white">
                        Tipos
                    </Link>
                    <Link href="/empresas" className="text-white">
                        Empresas
                    </Link>

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
