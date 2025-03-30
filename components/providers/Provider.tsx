import React, { ReactNode } from 'react'
import { ThemeProvider } from './theme-provider'
import { ClerkProvider } from '@clerk/nextjs'

const Provider = ({children}:{children: ReactNode}) => {
  return (
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

  )
}

export default Provider