'use client'

import axios from 'axios'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Pagination from '../../pagination/Pagination'
import { VaultI } from '@/typings'
import SimpleVaultCard from '../../card/vaultCards/SimpleVaultCard'

function AllVaults() {
  const [vaults, setVaults] = useState([])
  const [pageTotal, setPageTotal] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

  const searchParams = useSearchParams()

  const getVaults = async (params: any) => {
    const vaults = await axios.get(`http://localhost:8080/api/v1/vault`, {
      params: Object.fromEntries(params),
    })

    setPageTotal(vaults.data.pagination.pages)
    setVaults(vaults.data.data)
    setIsLoading(false)
  }

  useEffect(() => {
    getVaults(searchParams)
  }, [searchParams])

  return (
    <>
      <div className="mx-auto flex w-[98%] flex-col gap-2 py-2 md:flex-row md:flex-wrap md:justify-center">
        {vaults.length === 0 && (
          <p className="w-full text-3xl font-bold text-gray-800">
            No Vaults for: {searchParams.get('keywords')}
          </p>
        )}
        <div className="flex w-full flex-wrap gap-1">
          {vaults.map((vault: VaultI) => (
            <SimpleVaultCard key={vault._id} vault={vault} />
          ))}
        </div>
      </div>
      <Pagination pageTotal={pageTotal} />
    </>
  )
}

export default AllVaults
