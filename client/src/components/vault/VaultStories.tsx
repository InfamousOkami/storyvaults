import React, { useState } from 'react'
import VaultStory from './VaultStory'

function VaultStories({ vaultStories }: { vaultStories: any }) {
  console.log(vaultStories)
  return (
    <div className="flex w-full flex-wrap gap-1 p-1">
      {vaultStories.map((storyId: string) => (
        <VaultStory key={storyId} storyId={storyId} />
      ))}
    </div>
  )
}

export default VaultStories
