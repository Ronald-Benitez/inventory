"use client"

import { useState, useEffect } from "react"

import PublicNavbar from "@/components/navbar/public-navbar"
import LogedNavbar from "@/components/navbar/loged-navbar"
import { getCookies } from "@/services/cookies"

export default function Navbar() {
    const [token, setToken] = useState<string | undefined>(undefined)

    useEffect(() => {
        getCookies("token").then((res) => {
            setToken(res)
        })

    }, [])

    return (
        <>
            {token ? <LogedNavbar /> : <PublicNavbar />}
        </>
    )
}
