// @ts-nocheck
import Link from 'next/link';
import Image from 'next/image';
import { calculateTimeDifference } from '@/utils/calculateTimeDifference';

import message from '@/assets/icons/message-square.svg';
import thumbsUp from '@/assets/icons/thumbs-up.svg';
import thumbsDown from '@/assets/icons/thumbs-down.svg';
import thumbsUpActive from '@/assets/icons/thumbs-up-active.svg';
import thumbsDownActive from '@/assets/icons/thumbs-down-active.svg';
import dollarSign from '@/assets/icons/dollar-sign-white.svg';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toNumber } from 'ethers';
import donateAmount from '@/services/oracleConsumerService';
import { ethers } from "ethers";
import { motion } from "framer-motion"
import postService from '@/services/postService';
import { toast } from 'react-hot-toast';
import nftIcon from '@/assets/icons/nft.svg';

interface User {
    name: string;
    username: string;
    avatar: string;
    wallet: string;
}

interface Comment {
    name: string;
    username: string;
    avatar: string;
    wallet: string;
    comment: string;
}

interface Post {
    id: number;
    author: User;
    createdAt: string;
    description: string;
    type: string;
    image?: string;
    donation?: { currency: string, value: number, received: number, };
    pollChoices?: { choice: string; checked: boolean }[];
    likes: User[];
    dislikes: User[];
    comments: Comment[];
    isNFT: boolean;
}




export const Post: React.FC<Post> = ({
    id,
    isNFT,
    description,
    author,
    createdAt,
    type,
    image,
    donation,
    pollChoices,
    likes,
    likedByUser,
    qntLikes,
    qntDislikes,
    comments,
    reload,
    dislikedByUser,
    profile,
}) => {
    const router = useRouter()

    // handle de quando o usuário clica em doar no post
    const [donationpopup, setDonationPopup] = useState(false)
    const [donationValue, setDonationValue] = useState(0)
    const [provider, setProvider] = useState(null)
    const [NFTHover, setNFTHover] = useState(false)

    useEffect(() => {
        setProvider(new ethers.BrowserProvider(window.ethereum));
    }, [])

    const handlePostDonationButton = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation()
        setDonationPopup(true)
        console.log(author)
    }
    const handleDonation = async () => {
        if (donationValue <= 0) {
            toast.error("Value must be greater than 0")
            return
        }
        console.log(provider)
        const result = await donateAmount(provider, author.address, donationValue)
        if (result != "OK") {
            toast.error("Error donating! Try again later")
        } else {
            toast.success("Donation successful!")
            setDonationPopup(false)
        }
    }

    const like = async () => {
        try {
            await postService.likePost(id)
            toast.success("Post liked!")
            reload()
        } catch (error) {
            console.log(error)
            toast.error("Error liking post! Try again later")
        }
    }

    const dislike = async () => {
        try {
            await postService.dislikePost(id)
            toast.success("Post disliked!")
            reload()
        } catch (error) {
            console.log(error)
            toast.error("Error disliking post! Try again later")
        }
    }
        

    return (
        <div className="border-b border-gray-200 flex2 relative flex-col py-4">
            <div onClick={() => { router.push("/posts/" + id) }}>
                <div className="flex justify-between w-full px-4 mb-4">
                    <Link href={"/profile?id=" + author.id} className="flex">
                        <Image
                            src={author.imgUrl}
                            loader={() => author.imgUrl}
                            width={50}
                            height={50}
                            alt="avatar"
                            className="rounded-full"
                        />

                        <div className="ml-4">
                            <p className="font-semibold">
                                {author.name} <span className="text-gray-400">@{author.username}</span>
                            </p>
                            <p className="text-gray-400">
                                {author.address.trim().slice(0, 6)}...{author.address.trim().slice(-4)}
                            </p>
                        </div>
                    </Link>

                    <p className="text-gray-400">{calculateTimeDifference(createdAt)} ago</p>
                </div>

                <div className="text-start px-4 mb-4">
                    <p className="text-md">{description}</p>
                </div>

                {type === 'image' && (
                    <div className="flex justify-center px-4 mb-4 items-center w-full">
                        <Image src={image} width={500} height={200} className='w-full rounded-lg' alt="post image" />
                    </div>
                )}

                {type === 'donation' && (
                    <div className="flex flex-col mx-4 p-2 border border-gray-200">
                        <p className="text-md">Asking for:</p>
                        <div className="flex items-center">
                            <p className="text-md">donation<span className="ml-2">{donation?.value} {donation?.currency}</span></p>
                        </div>

                        <div className="flex items-center mt-4 border border-gray-200 w-full">
                            <div className={`
                                
                            `}>
                                <p className="text-md">{donation?.received} {donation?.currency}</p>
                            </div>
                        </div>
                    </div>
                )}

                {type === 'poll' && (
                    <div className="flex ml-4 px-4">
                        {pollChoices?.map((poll, index) => (
                            <div className="flex items-center mr-4" key={index}>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        className="mr-2"
                                        checked={poll.checked}
                                        onChange={() => { }}
                                    />
                                    <p>{poll.choice}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {
                !profile && (
                <div className='justify-between flex w-full'>
                    <div className='flex mt-4 w-auto px-4'>
                        <div className="flex mr-4">
                            {likedByUser ? <button onClick={() => {like()}}><Image src={thumbsUpActive} width={24} height={24} alt="icon" /></button> : <button onClick={() => {like()}}><Image src={thumbsUp} width={24} height={24} alt="icon" /></button>}
                            <p className='ml-2 text-[#757575]'>{qntLikes}</p>
                        </div>
                        <div className="flex mr-4">
                            {dislikedByUser ? <button onClick={() => {dislike()}}><Image src={thumbsDownActive} width={24} height={24} alt="icon" /></button> : <button onClick={() => {dislike()}}><Image src={thumbsDown} width={24} height={24} alt="icon" /></button>}
                            <p className='ml-2 text-[#757575]'>{qntDislikes}</p>
                        </div>
                        <div className="flex">
                            <button onClick={() => {router.push(`/posts/${id}`)}}><Image src={message} width={24} height={24} alt="icon" /></button>
                            <p className='ml-2 text-[#757575]'>{comments.length}</p>
                        </div>
                        <div onClick={(e) => handlePostDonationButton(e)} className="flex ml-2 rounded cursor-pointer bg-blue-400 transition-all hover:bg-green-300">
                            <Image src={dollarSign} width={20} height={20} alt="icon" />
                            <p className=' px-1 p-1 text-sm text-white'>{"Donate!"}</p>
                        </div>
                    </div>
                    {isNFT && <div className='mt-5 mr-4'>
                        <Image src={nftIcon} height={25}>
                        </Image>
                    </div> }
                </div>
                )
            }
            

            {donationpopup ? <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={e => e.stopPropagation()} className='bg-[rgba(124,180,180,0.9)] grid grid-cols-2 text-center items-center justify-center transition-all backdrop-blur-sm top-0 absolute w-full h-full'>
                    <div className='text-white font-bold text-sm absolute top-2 left-2 cursor-pointer' onClick={() => setDonationPopup(false)}>
                        <p>close</p>
                    </div>
                    <div>
                <p className='text-white text-xl font-bold'>You are donating:</p>
                <p className='font-bold text-lg'>{author.name}</p>
                <p className='text-gray-800 text-sm italic'>{author.address}</p>
                    </div>
                    <div>
                <p>{donation?.currency}</p>
                <div className='ml-4 inline-block text-xl'>
                    <input className='rounded w-1/4 mt-4' type="number" name="" id="" onChange={(e) => setDonationValue(Number(e.target.value))} min={100} />
                    {" $"}</div>
                <br />
                <button className='bg-white p-2 px-4 shadow-lg text-lg rounded mt-4 hover:bg-slate-200 transition-all' onClick={handleDonation}>Donate!</button>
                    </div>
            </motion.div>
                : null}
        </div>
    );
};
