function Breaker({ type }: { type: string }) {
  return (
    <>
      {type === 'under' ? (
        <div className="m-auto h-[1px] w-[99%] bg-gray-700" />
      ) : (
        <div className="text-gray-700">-</div>
      )}
    </>
  )
}

export default Breaker
