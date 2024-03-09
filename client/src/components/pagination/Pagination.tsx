'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

function Pagination({ pageTotal }: { pageTotal: number }) {
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams.toString())

  const [currentPageNumber, setCurrentPageNumber] = useState(
    searchParams.has('page') ? searchParams.get('page') : '1'
  )

  const totalPages = Number(pageTotal)
  const currentPage = Number(currentPageNumber)

  const router = useRouter()
  const pathname = usePathname()

  const setPage = (page: string) => {
    params.set('page', page)
    router.push(pathname + '?' + params.toString())
  }

  const updatePageNumber = () => {
    setCurrentPageNumber(
      searchParams.has('page') ? searchParams.get('page') : '1'
    )
  }

  useEffect(() => {
    updatePageNumber()
  }, [searchParams])

  useEffect(() => {
    setPage(currentPageNumber!)
  }, [currentPageNumber])

  const handleClick = (e: any) => {
    e.preventDefault()
    setCurrentPageNumber(e.target.value)
    if (currentPageNumber) params.set('page', e.target.value)
    router.push(pathname + '?' + params.toString())
  }

  const handlePage = (direction: string) => {
    if (direction === 'prev' && currentPage > 1) {
      setCurrentPageNumber((currentPage - 1).toString())
    } else if (direction === 'next' && currentPage < totalPages) {
      setCurrentPageNumber((currentPage + 1).toString())
    }
  }

  const getNextTwoNumbers = (pageNum: number) => {
    let nums = []
    for (let i = pageNum; i < pageNum + 3; i++) {
      if (i !== pageNum) nums.push(i)
    }
    return nums
      .filter((num) => num <= pageTotal)
      .map((num) => (
        <button
          type="button"
          key={num}
          onClick={handleClick}
          value={num}
          className="cursor-pointer text-lg font-medium hover:text-blue-700"
        >
          {num}
        </button>
      ))
  }

  const getPrevTwoNumbers = (pageNum: number) => {
    let nums = []
    for (let i = pageNum; i > pageNum - 3; i = i - 1) {
      if (i !== pageNum) nums.push(i)
    }
    return nums
      .filter((num) => num >= 1)
      .sort()
      .map((num) => (
        <button
          type="button"
          key={num}
          onClick={handleClick}
          value={num}
          className="cursor-pointer text-lg font-medium hover:text-blue-700"
        >
          {num}
        </button>
      ))
  }

  return (
    <div className="mx-auto mb-5 w-[98%] pt-5 md:max-w-[600px]">
      <div className="flex items-center justify-center gap-2">
        {currentPage > 1 && (
          <button
            className="rounded-md bg-blue-400 px-3 py-1 text-white  hover:bg-blue-500  "
            onClick={() => handlePage('prev')}
          >
            Previous Page
          </button>
        )}
        {getPrevTwoNumbers(currentPage)}
        <p className="text-lg font-bold text-blue-600">{currentPage}</p>
        {getNextTwoNumbers(Number(currentPage))}

        {currentPage < totalPages && (
          <button
            className="rounded-md bg-blue-400 px-3 py-1 text-white  hover:bg-blue-500  "
            onClick={() => handlePage('next')}
          >
            Next Page
          </button>
        )}
      </div>
    </div>
  )
}

export default Pagination
