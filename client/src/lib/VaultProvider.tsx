'use client'

import { VaultI } from '@/typings'
import React, { useEffect } from 'react'

export const VaultContext = React.createContext<{
  vaults: VaultI[]
  SetVaults: (vaults: VaultI[]) => void
}>({
  vaults: [],
  SetVaults: (vaults: VaultI[]) => {},
})

export const VaultsProvider = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const [vaults, setVaults] = React.useState<VaultI[]>(() => {
    // Initialize with stored value or empty array if no value exists
    const storedVaults = localStorage.getItem('vaults')
    return storedVaults ? JSON.parse(storedVaults) : []
  })

  useEffect(() => {
    // Save vaults to localStorage whenever it changes
    localStorage.setItem('vaults', JSON.stringify(vaults))
  }, [vaults])

  const SetVaults = (vaults: VaultI[]) => {
    setVaults(vaults)
  }

  return (
    <VaultContext.Provider value={{ vaults, SetVaults }}>
      {children}
    </VaultContext.Provider>
  )
}
