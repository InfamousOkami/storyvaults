'use client'

import { VaultContext } from '@/lib/VaultProvider'
import { useAppSelector } from '@/lib/redux/store'
import { VaultI } from '@/typings'
import axios from 'axios'
import React, { useContext, useState } from 'react'

function AddVaultButton({ storyId }: { storyId: string }) {
  const user = useAppSelector((state) => state.auth.user)
  const token = useAppSelector((state) => state.auth.token)
  const [active, setActive] = useState(false)

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

  const addToVault = async (vaultId: string) => {
    await axios.patch(
      `http://localhost:8080/api/v1/vault/stories/toggle/${vaultId}`,
      { storyId: storyId },
      {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      }
    )

    resetVaults()
  }

  return (
    <>
      <button
        className="rounded-md bg-blue-500 px-2 py-1 text-white hover:bg-blue-600"
        onClick={() => setActive(!active)}
      >
        Add To Vault
      </button>
      <div
        className={`scroller absolute right-0 flex h-fit max-h-96 w-52 flex-col divide-y divide-gray-200 overflow-y-scroll border border-gray-500 bg-white p-2 hover:bg-gray-100 ${active ? '' : 'hidden'}`}
      >
        {vaults
          .filter((v) => v.userId._id === user._id)
          .map((v: VaultI) => (
            <button
              className="flex justify-between text-start"
              key={v._id}
              onClick={() => addToVault(v._id)}
            >
              {v.name}{' '}
              {v.stories.includes(storyId) ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-check rounded-full bg-green-500 text-white"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M5 12l5 5l10 -10" />
                </svg>
              ) : (
                <></>
              )}
            </button>
          ))}
      </div>
    </>
  )
}

export default AddVaultButton
