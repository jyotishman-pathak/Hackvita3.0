"use client"
import React, { ReactNode } from 'react'
import { ThemeProvider } from './theme-provider'
import { ClerkProvider } from '@clerk/nextjs'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const Provider = ({children}:{children: ReactNode}) => {

  const queryClient = new QueryClient({})
  return (
    <QueryClientProvider client={queryClient}>
    <ClerkProvider>

 
    <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
          </ClerkProvider>
</QueryClientProvider>
  )
}

export default Provider