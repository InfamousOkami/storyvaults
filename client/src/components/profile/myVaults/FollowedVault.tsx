'use client'
import { useContext, useState } from 'react'
import { VaultI } from '@/typings'
import Link from 'next/link'
import VaultItem from '../../vaults/VaultItem'
import { VaultContext } from '@/lib/VaultProvider'
import axios from 'axios'
import { useAppSelector } from '@/lib/redux/store'
import { useRouter } from 'next/navigation'

function FollowedVaults() {
  const token = useAppSelector((state) => state.auth.token)
  const user = useAppSelector((state) => state.auth.user)

  const [tab, setTab] = useState('myVaults')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const router = useRouter()

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

  const removeVault = async (vaultId: string) => {
    await axios.patch(
      `http://localhost:8080/api/v1/vault/follow/${vaultId}`,
      {},
      {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      }
    )

    const newList = vaults.filter((vault: VaultI) => vault._id !== vaultId)

    SetVaults(newList)
  }

  const deleteVault = async (vaultId: string) => {
    await axios.delete(`http://localhost:8080/api/v1/vault/delete/${vaultId}`, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    })

    setConfirmDelete(false)
    resetVaults()
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-center gap-2 py-2">
        <button
          className="rounded-md bg-blue-500 px-2 py-1 text-white hover:bg-blue-600"
          onClick={() => setTab('myVaults')}
        >
          My Vaults
        </button>
        <button
          className="rounded-md bg-blue-500 px-2 py-1 text-white hover:bg-blue-600"
          onClick={() => setTab('followedVaults')}
        >
          Followed Vaults
        </button>
      </div>
      <div className="mb-2 flex h-fit w-[450px] flex-col divide-y-2 border border-gray-800 bg-white">
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
        <div className=" flex flex-col divide-y divide-gray-300">
          {tab === 'myVaults' && (
            <>
              {vaults
                .filter((v) => v.userId._id === user._id)
                .map((vault: VaultI) => (
                  <div key={vault._id}>
                    <VaultItem
                      key={vault._id}
                      imageHieght="h-40"
                      imageWidth="w-32"
                      vault={vault}
                    />
                    <div className="flex w-full">
                      <button
                        onClick={() =>
                          router.push(`/vault/${vault._id}/update`)
                        }
                        className="w-full bg-blue-500 text-white hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setConfirmDelete(true)}
                        className="w-full bg-red-500 text-white hover:bg-red-600"
                      >
                        Delete
                      </button>
                      {confirmDelete && (
                        <div className="fixed bottom-0 left-0 right-0 top-0 flex flex-col items-center justify-center gap-3 bg-black bg-opacity-75 text-white">
                          <p>Do you want to delete this vault?</p>
                          <div className="flex gap-3">
                            <button
                              className="w-56 bg-red-500 hover:bg-red-600"
                              onClick={() => deleteVault(vault._id)}
                            >
                              Yes
                            </button>
                            <button
                              className="w-56 bg-blue-500 hover:bg-blue-600"
                              onClick={() => setConfirmDelete(false)}
                            >
                              No
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </>
          )}
          {tab === 'followedVaults' && (
            <>
              {vaults
                .filter((v) => v.userId._id !== user._id)
                .map((vault: VaultI) => (
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
                    <button
                      onClick={() => removeVault(vault._id)}
                      className="w-full bg-red-500 text-white hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ))}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default FollowedVaults
