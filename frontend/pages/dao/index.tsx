import { Layout } from "@/components/Layout";
import { calculateTimeDifference } from "@/utils/calculateTimeDifference";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import flipper from "@/assets/logos/logo-1.svg";
import axios from "axios";
import Cookies from "universal-cookie";

interface Proposal {
    id: number;
    address: string;
    author: { name?: string; username?: string; address: string };
    title: string;
    description: string;
    pullRequest: string;
    options: { title: string; votes: string[] }[];
    open: boolean;
    totalVotes: number;
    executed: boolean;
    createdAt: Date;
}

const DAO = () => {
    const router = useRouter();

    const [proposals, setProposals] = useState<Proposal[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);

    const cookie = new Cookies();

    const getAllProposals = async () => {
        try {
            const proposals = await axios.get("https://flipper.inteliblockchain.co/v1/dao/getAll", {
                headers: {
                    Authorization: `Bearer ${cookie.get("token")}`,
                },
            });

            setProposals(proposals.data);
        } catch (err) {
            setError(true);
        }

        setLoading(false);
    };

    useEffect(() => {
        getAllProposals();
    }, []);

    return (
        <Layout title={"DAO"} navbar={true}>
            <div className="flex w-full justify-center">
                {/* Left */}
                <div className="hidden md:w-1/4 md:flex flex-col items-center border-l-[1px] border-[#bfbfbf] py-8">
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

                {/* DAO Feed */}
                <div className="w-full md:w-1/2 flex flex-col border-x-[1px] md:border-[#bfbfbf] min-h-screen h-full">
                    <div className="flex w-full justify-between px-4 py-8 items-center border-b border-grey-400">
                        <p className="text-2xl font-medium">Proposals</p>

                        <div className="flex">
                            <input type="text" placeholder="Search" className="border border-gray-400 rounded-l-lg p-2" />

                            <select className="border border-gray-400 rounded-r-lg p-2">
                                <option value="open">Open</option>
                                <option value="closed">Closed</option>
                                <option value="executed">Executed</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col w-full">
                        {
                            // Loading
                            loading && (
                                <div className="mt-4 flex flex-col items-center justify-center w-full h-full">
                                    <p className="text-xl font-medium">Loading...</p>
                                </div>
                            )
                        }

                        {
                            // Error
                            error && (
                                <div className="mt-4 flex flex-col items-center justify-center w-full h-full">
                                    <p className="text-xl font-medium">Error</p>
                                </div>
                            )
                        }

                        {
                            // No Proposals
                            !loading && !error && proposals.length === 0 && (
                                <div className="mt-4 flex flex-col items-center justify-center w-full h-full">
                                    <p className="text-xl font-medium">No Proposals</p>
                                </div>
                            )
                        }


                        {proposals
                            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                            .map((proposal: Proposal, index: number) => {
                                return (
                                    <div className="flex flex-col justify-between w-full mb-4" key={index}>
                                        <Link href={"/dao/" + proposal.id} className="border-b border-gray-400 flex flex-col py-4 w-full">
                                            <div className="flex flex-col justify-between w-full px-4 mb-4">
                                                <div className="flex">
                                                    <div className="ml-4 w-full">
                                                        <div className="flex justify-between w-full">
                                                            <Link href={"/profile/" + proposal.author.address} className="flex flex-col">
                                                                <div className="flex flex-col items-start mb-2">
                                                                    {proposal.author.name && <p className="text-lg font-semibold">{proposal.author.name}</p>}

                                                                    {proposal.author.username && <p className="text-gray-400">@{proposal.author.username}</p>}
                                                                </div>

                                                                <p className="text-gray-400">
                                                                    {proposal.author.address.trim().slice(0, 6)}...{proposal.author.address.trim().slice(-4)}
                                                                </p>
                                                            </Link>

                                                            <div className="flex flex-col items-end">
                                                                <p className="text-gray-400">
                                                                    {calculateTimeDifference(
                                                                        new Date(proposal.createdAt).toLocaleDateString("en-US", {
                                                                            year: "numeric",
                                                                            month: "long",
                                                                            day: "numeric",
                                                                        })
                                                                    )}
                                                                </p>

                                                                {proposal.open && !proposal.executed && (
                                                                    <div className="flex items-center justify-center bg-green-500 rounded-full h-8 w-24">
                                                                        <p className="text-white">Open</p>
                                                                    </div>
                                                                )}

                                                                {!proposal.open && proposal.executed && (
                                                                    <div className="flex items-center justify-center bg-fuchsia-500 rounded-full h-8 w-24">
                                                                        <p className="text-white">Executed</p>
                                                                    </div>
                                                                )}

                                                                {!proposal.open && !proposal.executed && (
                                                                    <div className="flex items-center justify-center bg-gray-500 rounded-full h-8 w-24">
                                                                        <p className="text-white">Abstained</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex justify-between w-full px-4 mt-2 mb-4">
                                                    <p className="text-xl font-semibold">{proposal.title}</p>

                                                    <div className="flex items-center">
                                                        <p className="text-gray-400 mr-2">{proposal.totalVotes} votes</p>
                                                        <p className="text-gray-400">{proposal.options.length} options</p>
                                                    </div>
                                                </div>

                                                {/* description */}
                                                <div className="flex flex-col justify-between w-full px-4">
                                                    <p className="text-xl font-semibold">Description</p>

                                                    <p className="text-gray-400 overflow-ellipsis">
                                                        {proposal.description.length > 50 ? proposal.description.slice(0, proposal.description.length / 2).trim() + "..." : proposal.description}
                                                    </p>
                                                </div>

                                                <div className="flex flex-col justify-between w-full px-4">
                                                    <div className="flex flex-col justify-between w-full mt-2">
                                                        <p className="text-xl font-semibold">Options</p>

                                                        {proposal.options.map((option, index) => {
                                                            const optionVotes = option.votes.length;
                                                            const percentage = (proposal.totalVotes / optionVotes) * 100;

                                                            return (
                                                                <div className="flex flex-col justify-between w-full" key={index}>
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
                                        </Link>
                                    </div>
                                );
                            })}

                    </div>
                </div>
            </div>
        </Layout >
    );
}

export default DAO;