import { Happening } from "@/components/Happening"
import { Layout } from "@/components/Layout"
import { Profile } from "@/components/Profile"
import Image from "next/image"
import { useRouter } from "next/router"

import arrowLeft from "@/assets/icons/arrow-left.svg"

const User = ({ wallet }: { wallet: string }) => {
    const router = useRouter()

    return (
        <Layout>
            <div className="flex w-full justify-center">
                <Profile />

                {/* <div className="w-1/2 mx-auto flex flex-col border-x border-gray-200 p-4"> */}
                <div className="w-full md:w-1/2 flex flex-col border-x-[1px] md:border-[#bfbfbf] min-h-screen h-full">
                    <button onClick={() => router.back()} className="flex items-center hover:bg-gray-200 rounded-lg w-fit p-2">
                        <Image src={arrowLeft} width={16} height={16} alt="return" />
                        <p className="text-lg ml-2">Return</p>
                    </button>

                    <h1 className="text-3xl font-semibold">User: {wallet}</h1>
                </div>

                {/* <Happening /> */}
            </div>
        </Layout>
    )
}

export default User