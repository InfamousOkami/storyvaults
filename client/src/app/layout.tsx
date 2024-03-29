import type { Metadata } from 'next'
import './globals.css'
import { ReduxProvider } from '../lib/redux/provider'
import Navbar from '@/components/navbar/navbar'
import React from 'react'
import { VaultI } from '@/typings'
import { VaultsProvider } from '@/lib/VaultProvider'
import { StoryProvider } from '@/lib/StoryProvider'

export const metadata: Metadata = {
  title: 'Story Vaults: Create Your Own Stories',
  description: 'Generated by create next app',
}

// TODO: create footer
// TODO: create layouts for all pages to change meta data, seo, and titles

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-200">
        <ReduxProvider>
          <StoryProvider>
            <VaultsProvider>
              <Navbar />
              <div className="m-auto w-full bg-white md:w-[90%]">
                {children}
              </div>
            </VaultsProvider>
          </StoryProvider>
        </ReduxProvider>
      </body>
    </html>
  )
}
