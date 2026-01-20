"use client"

import { useEffect } from "react"
import { useStore } from "@/store/use-store"

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { checkAuth } = useStore()

    useEffect(() => {
        checkAuth()
    }, []) // Run once on mount

    return <>{children}</>
}
