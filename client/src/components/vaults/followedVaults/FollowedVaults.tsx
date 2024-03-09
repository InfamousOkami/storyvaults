'use client'
import { useContext } from 'react'
import { VaultI } from '@/typings'
import Link from 'next/link'
import VaultItem from '../VaultItem'
import { VaultContext } from '@/lib/VaultProvider'
import axios from 'axios'
import { useAppSelector } from '@/lib/redux/store'

function FollowedVaults() {
  const token = useAppSelector((state) => state.auth.token)

  const { vaults, SetVaults } = useContext(VaultContext)

  const resetVaults = async () => {
    const vaults = await axios.get(
      `http://localhost:8080/api/v1/vault/user/followed`,
      {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      }
    )

    SetVaults(vaults.data.data)
  }

  return (
    <>
      <div className=" absolute right-0 top-11 flex h-fit max-h-96 w-96 flex-col divide-y-2 border border-gray-800 bg-white">
        <div className="flex items-center divide-x divide-gray-300">
          <Link
            href={'/vault/new-vault'}
            className="w-full bg-blue-500 py-1 text-center font-semibold text-white hover:bg-blue-600"
          >
            Create New Vault
          </Link>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon icon-tabler icon-tabler-refresh cursor-pointer bg-blue-500 text-white hover:bg-blue-600"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            onClick={resetVaults}
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" />
            <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
          </svg>
        </div>
        {vaults.length === 0 && (
          <p className="w-full text-3xl font-bold text-gray-800">No Vaults</p>
        )}
        <div className="scroller flex flex-col divide-y divide-gray-300 overflow-y-scroll">
          {vaults.map((vault: VaultI) => (
            <VaultItem
              key={vault._id}
              imageHieght="h-28"
              imageWidth="w-20"
              vault={vault}
            />
          ))}
        </div>
      </div>
    </>
  )
}

export default FollowedVaults
