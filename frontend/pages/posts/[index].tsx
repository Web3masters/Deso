// @ts-nocheck
import { Happening } from "@/components/Happening"
import { Layout } from "@/components/Layout"
import { Profile } from "@/components/Profile"
import Image from "next/image"
import { useRouter } from "next/router"
import { calculateTimeDifference } from '@/utils/calculateTimeDifference';

import message from '@/assets/icons/message-square.svg';
import thumbsUp from '@/assets/icons/thumbs-up.svg';
import thumbsUpActive from '@/assets/icons/thumbs-up-active.svg';
import thumbsDown from '@/assets/icons/thumbs-down.svg';
import thumbsDownActive from '@/assets/icons/thumbs-down-active.svg';
import postService from "@/services/postService"
import arrowLeft from "@/assets/icons/arrow-left.svg"
import Link from "next/link"
import { useEffect, useState } from "react"
import { AiOutlineSend } from "react-icons/ai"
import toast, { Toaster } from "react-hot-toast"
import axios from "axios"

import Cookies from 'universal-cookie';

const cookies = new Cookies();

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
    user: User;
    timestamp: string;
    post: string;
    type: string;
    image?: string;
    donationValue?: number;
    currency?: string;
    pollChoices?: { choice: string; checked: boolean }[];
    likes: User[];
    dislikes: User[];
    comments: Comment[];
}

export const getServerSideProps = async (context) => {
    const { index } = context.params;

    const getPost = async (id: string) => {
        console.log(id)
        const token = context.req.headers.cookie.split("=")[1].split(";")[0];

        const post = await axios.get(`https://flipper.inteliblockchain.co/v1/post/getById/${id}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })

        return post.data;

    }



    const data = await getPost(index);

    return {
        props: {
            data
        }
    }
}

const Post = ({ data }: { data: Post }) => {
    const router = useRouter()
    let index: string;

    const [currentPost, setCurrentPost] = useState<Post>(data)
    const [comment, setComment] = useState<string>("")

    // if (currentPost) {
    //     const {
    //         description,
    //         author,
    //         timestamp,
    //         type,
    //         image,
    //         donationValue,
    //         currency,
    //         pollChoices,
    //         likes,
    //         dislikes,
    //         comments,
    //         likedByUser,
    //     } = currentPost;
    // }

    // const fetchPost = async (postId: string) => {
    //     const post = await postService.getPost(postId)
    //     setCurrentPost(post.data)
    //     console.log(post.data)
    // }


    // useEffect(() => {
    //     fetchPost(router.query.index as string)
    // }, [])

    const postComment = async (e) => {
        e.preventDefault()
        if (comment.length == 0) return toast.error("Comment cannot be empty")
        try {
            setComment("")
            const response = await postService.postComment(currentPost.id, comment)
            toast.success("Comment posted")
            fetchPost(currentPost.id)
        } catch (err) {
            console.log(err)
            toast.error("Error posting comment")
        }
    }

    const like = async () => {
        try {
            await postService.likePost(currentPost.id)
            toast.success("Post liked!")
            fetchPost(currentPost.id)
        } catch (error) {
            console.log(error)
            toast.error("Error liking post! Try again later")
        }
    }

    const dislike = async () => {
        try {
            await postService.dislikePost(currentPost.id)
            toast.success("Post disliked!")
            fetchPost(currentPost.id)
        } catch (error) {
            console.log(error)
            toast.error("Error disliking post! Try again later")
        }
    }


    return (
        <Layout>
            <Toaster />
            <div className="flex w-full justify-center">

                <Profile />
                {
                    currentPost && (
                        // <div className="w-1/2 mx-auto flex flex-col border-x border-gray-200">
                        <div className="w-full md:w-1/2 flex flex-col border-x-[1px] md:border-[#bfbfbf] min-h-screen h-full">
                            <button onClick={() => router.back()} className="flex items-center hover:bg-gray-200 rounded-lg w-fit p-2 m-2">
                                <Image src={arrowLeft} width={16} height={16} alt="return" />
                                <p className="text-lg ml-2">Return</p>
                            </button>

                            <div className="border-b border-gray-200 flex flex-col p-4">
                                <div className="flex justify-between w-full mb-4">
                                    <Link href={"/profile?id=" + currentPost.author.id} className="flex">
                                        <Image
                                            src={currentPost.author.imgUrl}
                                            loader={() => currentPost.author.imgUrl}
                                            width={50}
                                            height={50}
                                            alt="avatar"
                                            className="rounded-full"
                                        />

                                        <div className="ml-4">
                                            <p className="font-semibold">
                                                {currentPost.author.name} <span className="text-gray-400">@{currentPost.author.username}</span>
                                            </p>
                                            <p className="text-gray-400">
                                                {currentPost.author.address.trim().slice(0, 6)}...{currentPost.author.address.trim().slice(-4)}
                                            </p>
                                        </div>
                                    </Link>

                                    <p className="text-gray-400">{calculateTimeDifference(currentPost.createdAt)} ago</p>
                                </div>

                                <div className="text-start mb-4">
                                    <p className="text-md">{currentPost.description}</p>
                                </div>

                                {
                                    currentPost.image &&
                                    <div className="flex justify-center mb-4 items-center w-full">
                                        <Image src={currentPost.image} width={500} height={200} className='w-full rounded-lg' alt="post image" />
                                    </div>
                                }


                                {/* {type === 'donation' && (
                                <div className="flex items-center ml-4">
                                    <p className="font-semibold">
                                        {donationValue} {currency}
                                    </p>
                                </div>
                            )}

                            {type === 'poll' && (
                                <div className="flex">
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
                            )} */}

                                <div className='flex w-full mt-4'>
                                    <div className="flex mr-4">
                                        <button onClick={() => { like() }}>{currentPost.likedByUser ? <Image src={thumbsUpActive} width={24} height={24} alt="icon" /> : <Image src={thumbsUp} width={24} height={24} alt="icon" />}</button>
                                        <p className='ml-2 text-[#757575]'>{currentPost.qntLikes}</p>
                                    </div>
                                    <div className="flex mr-4">
                                        <button onClick={() => { dislike() }}>{currentPost.dislikedByUser ? <Image src={thumbsDownActive} width={24} height={24} alt="icon" /> : <Image src={thumbsDown} width={24} height={24} alt="icon" />}</button>
                                        <p className='ml-2 text-[#757575]'>{currentPost.qntDislikes}</p>
                                    </div>
                                    <div className="flex">
                                        <Image src={message} width={24} height={24} alt="icon" />
                                        <p className='ml-2 text-[#757575]'>{currentPost.comments.length}</p>
                                    </div>
                                </div>

                                <div className="flex flex-col mt-4">
                                    <div className="flex items-center mb-4 px-4 justify-between">
                                        <p className="text-lg font-semibold">Comments</p>
                                        <div>
                                            {currentPost.comments.length > 0 && (
                                                <p className="text-gray-400 ml-2">{currentPost.comments.length} comments</p>
                                            )}
                                        </div>

                                        {currentPost.comments.length <= 0 && (
                                            <p className="text-gray-400 ml-2 px-2">No comments yet</p>
                                        )}
                                    </div>
                                    <form onSubmit={(e) => { postComment(e) }} className="mb-8 relative flex flex-row items-center">
                                        <input value={comment} onChange={event => setComment(event.target.value)} placeholder="Type a comment" className="w-full rounded-lg text-lg flex-wrap border-gray-200 border-2 focus:border-gray-200 p-2"></input><button onClick={(e) => { postComment(e) }} className="absolute right-2"><AiOutlineSend size={24} color="#60A5FA" /></button>
                                    </form>
                                    {currentPost.comments.map((comment, index) => (
                                        <div className="flex flex-col w-full items-center mb-4 border-b border-gray-200 px-4" key={index}>
                                            <div className="w-full justify-between flex">
                                                <Link href={"/user/" + comment.address} className="flex">
                                                    <Image
                                                        src={comment.author.imgUrl}
                                                        loader={() => comment.author.imgUrl}
                                                        width={50}
                                                        height={50}
                                                        alt="avatar"
                                                        className="rounded-full"
                                                    />

                                                    <div className="ml-4">
                                                        <p className="font-semibold">
                                                            {comment.name} <span className="text-gray-400">@{comment.author.username}</span>
                                                        </p>
                                                        <p className="text-gray-400">
                                                            {comment.author.address.trim().slice(0, 6)}...{comment.author.address.trim().slice(-4)}
                                                        </p>
                                                    </div>
                                                </Link>

                                                <p className="text-gray-400 ml-4">{calculateTimeDifference(comment.createdAt)} ago</p>
                                            </div>

                                            <p className="text-md w-full mt-6 mb-2 ml-2">{comment.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )
                }


                {/* <Happening /> */}
            </div>
        </Layout>
    )
}

export default Post