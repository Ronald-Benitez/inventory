"use client"

import React from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, NavbarMenuToggle, NavbarMenu, NavbarMenuItem } from "@nextui-org/react";
import { IconHome, IconLogout2 } from "@tabler/icons-react";



export default function App() {
    const menuItems = [
        {
            name: "Inicio",
            href: "/"
        },
    ]

    return (
        <Navbar disableAnimation isBordered className="bg-slate-900">
            <NavbarContent className="sm:hidden" justify="start">
                <NavbarMenuToggle />
            </NavbarContent>

            <NavbarContent className="sm:hidden pr-3" justify="center">
                <Link href="/" className="text-black bg-white text-xl p-1 rounded">
                    <IconHome size={24} strokeWidth={1.5} color="black" />
                </Link>
            </NavbarContent>

            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                <Link href="/" className="text-black bg-white text-xl p-1 rounded">
                    <IconHome size={24} strokeWidth={1.5} color="black" />
                </Link>
            </NavbarContent>

            <NavbarContent justify="end">
                <NavbarItem >
                    <Link href="/login">
                        <IconLogout2 size={24} strokeWidth={1.5} color="white" />
                    </Link>
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
                                className="text-white"
                            >
                                {item.name}
                            </Link>
                        </NavbarMenuItem>
                    ))
                }
            </NavbarMenu>
        </Navbar>
    );
}
