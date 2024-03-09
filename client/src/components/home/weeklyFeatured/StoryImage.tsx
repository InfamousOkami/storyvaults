import Image from 'next/image'

function StoryImage({
  imageLink,
  username,
}: {
  imageLink: string
  username: string
}) {
  return (
    <div className="h-[140px] w-[105px] overflow-hidden rounded-md border border-gray-400">
      <Image
        height={5000}
        width={5000}
        placeholder="empty"
        priority={true}
        src={`http://localhost:8080/assets/${username}/${imageLink}`}
        alt={imageLink}
      />
    </div>
  )
}

export default StoryImage
