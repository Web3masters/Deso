//@ts-nocheck
import { Layout } from "@/components/Layout"
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react"
import flipper from "@/assets/logos/logo-1.svg"
import Image from "next/image";
import axios from "axios";
import Cookies from "universal-cookie";

import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'


interface ProposalType {
    id: number,
    address: string,
    author: { name?: string, username?: string, address: string, },
    title: string,
    description: string,
    options: { title: string, votes: string[] }[],
    open: boolean,
    totalVotes: number,
    executed: boolean,
    createdAt: Date,
}


export const getServerSideProps: GetServerSideProps = async (context) => {
    const { id } = context.params;

    const cookies = context.req.headers.cookie;
    let token = cookies.split("=")[1].split(";")[0];

    // console.log("\n\n\n", id, "\n\n\n")
    // console.log("\n\n\n", token, "\n\n\n")

    const getProposal = async (id: string) => {
        const proposal = await axios.get("https://flipper.inteliblockchain.co/v1/dao/getById/" + id, {
            headers: {
                "Authorization": "Bearer " + token
            }
        });


        return proposal.data;
    }

    const data = await getProposal(id);

    return {
        props: {
            data
        }
    }
}

const Proposal = ({ data }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const router = useRouter();
    const [proposal, setProposal] = useState(data);

    return (
        <Layout title={"DAO"} navbar={true}>
            <div className="flex-1 flex max-w-full justify-center">

                {/* Left */}
                <div className='hidden md:w-1/4 md:flex flex-col items-center border-l-[1px] border-[#bfbfbf] py-8'>
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

                {proposal && (
                    <div className="w-full md:w-1/2 flex flex-col border-x-[1px] sm:border-[#bfbfbf] min-h-screen h-full">
                        {/* Show the proposal */}
                        <div className="flex flex-col w-full px-4 mt-4">
                            <p className="text-3xl font-medium">{proposal.title}</p>

                            <div className="flex flex-col mt-4 w-full">
                                <div className="flex justify-between items-center w-full">
                                    <div>
                                        <p className="text-sm text-gray-500">Proposed by</p>
                                        <Link href={`/profile/`} className="text-lg font-medium">
                                            {proposal.author.name ? proposal.author.name : proposal.author.username}
                                        </Link>
                                    </div>

                                    <div className="flex flex-col items-center">
                                        <p className="text-sm text-gray-500 mt-4">Created on</p>
                                        <p className="text-md font-medium">{
                                            new Date(proposal.createdAt).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })
                                        }</p>
                                    </div>
                                </div>

                                <div className="flex flex-col w-full mt-4">
                                    <p className="text-sm text-gray-500">Pull request</p>
                                    <Link href={!proposal.prLink.includes("https://") ? `https://${proposal.prLink}` : proposal.prLink} target="_blank" className="text-lg font-medium hover:underline">
                                        {!proposal.prLink.includes("https://") ? `https://${proposal.prLink}` : proposal.prLink}
                                    </Link>
                                </div>


                                <div className="flex justify-between items-center mt-4">
                                    <div className="flex flex-col">
                                        <p className="text-sm text-gray-500 mt-4">Status</p>

                                        <div className="flex items-center mt-2">
                                            <div className={`w-3 h-3 rounded-full ${proposal.open ? "bg-green-500" : "bg-red-500"}`}></div>
                                            <p className="text-lg font-medium ml-2">{proposal.open ? "Open" : "Closed"}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col">
                                        <p className="text-sm text-gray-500 mt-4">Total votes</p>
                                        <p className="text-lg font-medium ml-2">{proposal.totalVotes}</p>
                                    </div>
                                </div>

                                <div className="flex flex-col w-full">
                                    <textarea
                                        className="w-full h-40 border-2 border-gray-300 rounded-md p-2 mt-4"
                                        placeholder="Description"
                                        value={proposal.description}
                                        disabled
                                    />
                                </div>

                                {/* create a voting sections */}
                                <div className="flex flex-col w-full mt-4">
                                    <p className="text-lg font-medium">Voting</p>
                                    <p className="text-sm text-gray-500">Total votes: {proposal.totalVotes}</p>

                                    <div className="flex flex-col w-full mt-4">
                                        {proposal.options.map((option, index) => {
                                            const optionVotes = option.votes.length;
                                            const percentage = (proposal.totalVotes / optionVotes) * 100;

                                            return (
                                                <div className="flex flex-col justify-between w-full hover:scale-[102.5%] transition-all duration-200 ease-in-out cursor-pointer rounded-lg mt-4" key={index}>
                                                    <div className="flex justify-between items-center">
                                                        <p className="text-lg font-semibold">{option.title}</p>
                                                        <p className="text-gray-400">{optionVotes} votes</p>
                                                    </div>

                                                    <div className="w-full bg-gray-200 rounded-lg">
                                                        <div
                                                            className={`h-full max-w-full rounded-lg p-2 ${optionVotes === Math.max(...proposal.options.map((option) => option.votes.length)) ? "bg-gray-600" : "bg-gray-300"
                                                                }`}
                                                            style={{
                                                                width: `${percentage}%`,
                                                            }}
                                                        >
                                                            <p className="text-white">{percentage || 0}%</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                )
                }
            </div>
        </Layout >
    )
}

export default Proposal