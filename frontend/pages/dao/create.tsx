// @ts-nocheck
import { Layout } from "@/components/Layout"
import Link from "next/link";
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import flipper from "@/assets/logos/logo-1.svg"
import Image from "next/image";
import { useForm } from "react-hook-form";
import axios from "axios";
import Cookies from "universal-cookie";
import { toast } from "react-hot-toast";
import userService from "@/services/userService";

interface Proposal {
    id: number,
    address: string,
    proposer: { name?: string, username?: string, address: string, },
    title: string,
    description: string,
    options: { title: string, votes: string[] }[],
    open: boolean,
    totalVotes: number,
    executed: boolean,
    createdAt: Date,
}

const DAO = () => {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const cookie = new Cookies();

    const [user, setUser] = useState<any>();

    const getUser = async () => {
        try {
            const response = await userService.getUser();
            console.log(response);
            setUser(response.data);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getUser()
        console.log(user)
    }, [])

    const onSubmit = async (data: {
        title: string,
        url: string,
        description: string,
    }) => {
        const {
            title,
            url,
            description
        } = data

        const randomAddress /*0x604E42A7bc0a9eA8EBE70d8Ff66d74440df2b201*/ = "0x" + Math.floor(Math.random() * 10 ** 40).toString(16);

        // let user = await userService.getUser();

        try {
            await axios.post('https://flipper.inteliblockchain.co/v1/dao/create', {
                address: randomAddress,
                authorId: user.id, // "300f6b13-1bf9-46a1-81a2-0e151ea2c758",
                title,
                description,
                prLink: url,
                options: [{ title: "Yes", votes: [] }, { title: "No", votes: [], }, { title: "Abstain", votes: [] }],
                open: true,
                totalVotes: 0,
                executed: false,
            }, {
                headers: {
                    "Authorization": `Bearer ${cookie.get("token")}`,
                }
            })
                .then((response) => {
                    console.log(response);
                    toast.success("Proposal created successfully!");
                    router.push("/dao");
                })
                .catch((err) => {
                    console.log(err);
                    toast.error("Something went wrong!");
                })
        } catch (err) {
            console.log(err);
            toast.error("Something went wrong!");
        }
    }

    return (
        <Layout title={"DAO"} navbar={true}>
            <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex max-w-full justify-center">

                {/* Left */}
                <div className='hidden sm:w-1/4 sm:flex flex-col items-center border-l-[1px] border-[#bfbfbf] py-8'>
                    <div className="w-1/3 border-2 border-gray-300 rounded-full h-auto flex items-center justify-center py-12 px-2">
                        <Image src={flipper} alt="Flipper" />
                    </div>

                    <div className="flex flex-col items-center w-full px-4 mt-4">
                        <p className="text-2xl font-medium">Flipper DAO</p>

                        <div className="flex flex-col mt-4">
                            <Link href="/dao" className="text-blue-500 hover:underline">
                                {router.pathname === "/dao" ? "|" : ""} Proposals
                            </Link>

                            <Link href="/dao/create" className="text-blue-500 hover:underline">
                                {router.pathname === "/dao/create" ? "|" : ""} Create Proposal
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Create proposal */}
                <div className="w-full sm:w-1/2 flex flex-col border-x-[1px] md:border-[#bfbfbf] min-h-screen h-full">
                    <div className="flex flex-col items-center py-8 px-4">
                        <p className="text-2xl font-medium">Create Proposal</p>

                        <div className="flex flex-col items-center w-full mt-4">
                            <div className="flex flex-col w-full">
                                <label className="text-sm font-medium">Title</label>
                                <input type="text" className="border-2 border-gray-300 rounded-md px-2 py-1 mt-2" placeholder="Proposal title" {...register("title", { required: true })} />
                                {errors.title && <span className="text-red-500 text-sm">This field is required</span>}

                                <label className="text-sm font-medium mt-4">Pull request URL</label>
                                <input type="text" className="border-2 border-gray-300 rounded-md px-2 py-1 mt-2" placeholder="https://github.com/flipper-dao/flipper/pull/1"
                                    {...register("url", { required: true })} />
                                {errors.url && <span className="text-red-500 text-sm">This field is required</span>}

                                <label className="text-sm font-medium mt-4">Description</label>
                                <textarea className="border-2 border-gray-300 rounded-md px-2 py-1 mt-2" placeholder="Proposal description" rows={6} {...register("description", { required: true })} />
                                {errors.description && <span className="text-red-500 text-sm">This field is required</span>}

                                <div className="flex flex-col w-full mt-4 items-end">
                                    <button type="submit" className="bg-blue-500 text-white rounded-md px-4 py-2 mt-4">Create</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </Layout>
    )
}

export default DAO