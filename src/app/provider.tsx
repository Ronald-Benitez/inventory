"use client"

import { NextUIProvider } from '@nextui-org/react'
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

export function Provider({ children }: { children: React.ReactNode }) {
    return (
        <>
            <ProgressBar color='#fff'
                height='4px'
                shallowRouting
            />
            <NextUIProvider>
                {children}
            </NextUIProvider>
        </>
    )
}