'use client'

import { useParams } from 'next/navigation'
import DetailedVaultCard from '../card/vaultCards/DetailedVaultCard'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { VaultI } from '@/typings'
import LoadingPulse from '../loading/LoadingSpinner'
import VaultStories from './VaultStories'

function VaultPage() {
  const params = useParams()

  const [vault, setVault] = useState<VaultI | null>(null)
  const [stories, setStories] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const getVault = async (vaultId: string) => {
    const vault = await axios.get(
      `http://localhost:8080/api/v1/vault/${vaultId}`
    )

    setVault(vault.data.data)
    setIsLoading(false)
  }

  useEffect(() => {
    getVault(params.id as string)
  }, [params.id])

  if (isLoading) return <LoadingPulse />

  return (
    <div className="w-full">
      <DetailedVaultCard vault={vault!} />
      <VaultStories vaultStories={vault?.stories} />
    </div>
  )
}

export default VaultPage
