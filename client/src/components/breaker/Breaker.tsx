function Breaker({ type }: { type: string }) {
  return (
    <>
      {type === "under" ? (
        <div className="bg-gray-700 h-[1px] w-[99%] m-auto" />
      ) : (
        <div className="bg-gray-700 h-[1px] w-[6px] my-auto" />
      )}
    </>
  );
}

export default Breaker;
