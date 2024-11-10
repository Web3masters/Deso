import Image, { StaticImageData } from "next/image"

import search from "@/assets/icons/search.svg"


interface Props {
    data: { user: string, userImage: string, action: string }[];
}



export const Happening = (
    // { data }: Props
) => {
    const data = [
        { user: "Pedro Baptista", userImage: "https://pbs.twimg.com/profile_images/1590968738358079488/IY9Gx6Ok_400x400.jpg", action: "was voted out of the platform." },
        { user: "Pedro Baptista", userImage: "https://pbs.twimg.com/profile_images/1590968738358079488/IY9Gx6Ok_400x400.jpg", action: "posted a new picture." },
        { user: "Elon Musk", userImage: "https://pbs.twimg.com/profile_images/1590968738358079488/IY9Gx6Ok_400x400.jpg", action: "posted a new picture." },
        { user: "Pedro Baptista", userImage: "https://pbs.twimg.com/profile_images/1590968738358079488/IY9Gx6Ok_400x400.jpg", action: "created a new poll." },
    ]

    return (
        <div className='hidden sm:w-1/4 sm:flex flex-col items-center absolute right-0 top-0 mt-16'>
            <div className="mt-4 w-5/6 mb-8">
                <div className="shadow-md flex h-auto px-2 rounded-lg w-full">
                    <Image src={search} width={16} alt="search" />
                    <input type="text" placeholder="Search" className="bg-transparent outline-none w-full px-4 py-2 text-lg placeholder:text-blue-400" />
                </div>
            </div>

            <div className="w-5/6 flex flex-col items-center">
                <p className="text-3xl font-semibold mb-4">What's happenning</p>

                <div className="w-full">
                    {data.map((d, i) => (
                        <div key={i} className="flex items-center mb-4 w-full">
                            <Image src={d.userImage} loader={() => d.userImage} width={48} height={48} alt="user" className="rounded-full" />

                            <p className="ml-2">
                                <span className="text-md font-semibold">{d.user}</span> {d.action}
                            </p>
                        </div>
                    ))}

                </div>
            </div>
        </div >
    )
}