'use client'
import { useContext } from 'react'
import { VaultI } from '@/typings'
import Link from 'next/link'
import VaultItem from '../../vaults/VaultItem'
import { VaultContext } from '@/lib/VaultProvider'
import axios from 'axios'
import { useAppSelector } from '@/lib/redux/store'

function FollowedVaults() {
  const token = useAppSelector((state) => state.auth.token)

  const { vaults, SetVaults } = useContext(VaultContext)

  // TODO: Create 2 tabs 1 for followed vaults and the other for user owned vaultsv

  const removeVault = (vaultId: string) => {
    const newList = vaults.filter((vault: VaultI) => vault._id !== vaultId)

    SetVaults(newList)
  }

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
    <div className="flex justify-center">
      <div className="flex h-fit w-[450px] flex-col divide-y-2 border border-gray-800 bg-white">
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
        <div className=" flex flex-col divide-y divide-gray-300">
          {vaults.map((vault: VaultI) => (
            <div key={vault._id}>
              <VaultItem
                key={vault._id}
                imageHieght="h-40"
                imageWidth="w-32"
                vault={vault}
              />
              <button
                onClick={() => removeVault(vault._id)}
                className="w-full bg-red-500 text-white hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FollowedVaults
