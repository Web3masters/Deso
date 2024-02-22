// @ts-nocheck
import Image from 'next/image';
import { useForm, useFieldArray, set } from 'react-hook-form';
import { useState, useRef, ChangeEvent, useEffect } from 'react';
import { Post } from '@/components/Post';
import toast, { Toaster } from 'react-hot-toast';
import picture from '@/assets/images/profile-icon.png';
import imageIcon from '@/assets/icons/image.svg';
import send from '@/assets/icons/send.svg';
import poll from '@/assets/icons/poll.svg';
import dollar from '@/assets/icons/dollar-sign.svg';
import postService from '@/services/postService';
import axios from 'axios';
import { useRouter } from 'next/router';
import userService from '@/services/userService';

interface Post {
    id: number;
    author: User;
    timestamp: string;
    description: string;
    type: string;
    image?: string;
    donation?: { currency: string, value: number, received: number, };
    pollChoices?: { choice: string; checked: boolean }[];
}
interface User {
    name: string;
    username: string;
    avatar: string;
    wallet: string;
}

interface Data {
    post: string | null;
    isPoll: boolean;
    pollChoices?: { choice: string }[];
    day?: string;
    hour?: string;
    minute?: string;
    currency?: string;
    donationValue?: string;
}

export const Feed = () => {
    const { register, handleSubmit, formState: { errors }, control, reset, watch } = useForm();

    const [postsData, setPostsData] = useState<Post[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'pollChoices',
    });

    const [isPoll, setIsPoll] = useState(false);
    const [image, setPostImage] = useState<string | null>(null);
    const [isDonation, setIsDonation] = useState(false);
    const [user, setUser] = useState<any>();
    const [imageToSendToIpfs, setImageToSendToIpfs] = useState<any>();
    const [userWantNftModal, setUserWantNftModal] = useState<boolean>(false);
    const [userWantNft, setUserWantNft] = useState<boolean>(false);

    const router = useRouter();

    const getPosts = async () => {
        try {
            const posts = await postService.getAll();
            setPostsData(posts)
            setLoading(false);
        } catch (err) {
            setError(true);
            setLoading(false);
        }

    };

    const getUser = async () => {
        try {
            const response = await userService.getUser();
            setUser(response.data);
        } catch (err) {
            setTimeout(() => {
                router.push('/login')
            }, 500)
            toast.error('Error getting posts, please log in!');
        }
    }

    useEffect(() => {
        getUser();
        getPosts();
    }, []);


    const onSubmit = async (data: Data) => {

        setUserWantNftModal

        const { post }: { post: any } = data;

        const postData = {
            post,
            type: image ? 'image' : 'post',
            ...(image && { image }),
            timestamp: new Date().toISOString(),
            userWantNft: userWantNft,
        };


        try {
            let toastID: string = ""
            if (userWantNft) toastID = toast.loading('Your NFT is being generated...')

            const response = await postService.create(postData.post, postData.userWantNft);
            toast.remove(toastID)
            toast.success('Post created successfully!');
            if (userWantNft) toast.success('Your NFT was sent to your wallet!')

            getPosts();
        } catch (error) {
            toast.error('Error creating post, try again later!');
        }

        setPostImage(null);
        setIsPoll(false);
        setIsDonation(false);
        reset();
    };

    const handleButtonClick = () => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setImageToSendToIpfs(file);

        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setPostImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const inputRef = useRef<HTMLInputElement>(null);

    return (
        // <div className="absolute w-3/4 right-0 flex flex-col items-center border-x-[1px] border-[#bfbfbf] h-full mx-auto">
        <div className="w-full md:w-1/2 flex flex-col border-x-[1px] md:border-[#bfbfbf] min-h-screen h-full">
            <Toaster />
            <div className="flex w-full p-4 items-center border-b border-gray-200">
                {user && <img src={user.imgUrl} width={48} height={48} alt="profile" className="rounded-full h-12 mr-2" />}
                <form className="w-full flex flex-col" onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col items-center mb-2 border border-gray-200 rounded-lg">
                        <textarea
                            className="w-full rounded-lg text-lg flex-wrap focus:border focus:border-gray-200 p-2"
                            placeholder="What do you want to share?"
                            {...register('post', {
                                required: /* make it required if it's a poll or donation */ isPoll || isDonation ? 'Post is required' : false,
                            })}
                            onChange={(e) => {
                                e.target.style.height = 'auto';
                                e.target.style.height = e.target.scrollHeight + 'px';
                            }}
                            style={{
                                resize: 'none',
                                overflow: 'hidden',
                                minHeight: '50px',
                                maxHeight: '100px',
                            }}
                        />

                        {image && (
                            <div className="w-full flex flex-col border border-gray-200 p-2 rounded-lg mt-2">
                                <div className="flex justify-between">
                                    <p className="text-gray-400">Image</p>

                                    <button
                                        className="flex text-red-600 p-2 text-center rounded-md items-center justify-center hover:bg-gray-200"
                                        type="button"
                                        onClick={() => setPostImage(null)}
                                    >
                                        Remove
                                    </button>
                                </div>

                                <div className="flex justify-between">
                                    {/* show the image responsively with Image */}
                                    <Image src={image} width={500} height={200} alt="post image" />
                                </div>
                            </div>
                        )}

                    </div>
                    {errors.post && <p className="text-red-600">Post is required</p>}

                    <div className="flex justify-between">
                        <div className="flex">
                            <button
                                className="mr-2"
                                disabled={isPoll || isDonation}
                            >
                                <Image
                                    src={imageIcon}
                                    width={24}
                                    alt="image"
                                    style={{
                                        filter: isPoll || isDonation ? 'grayscale(100%)' : 'none',
                                    }}
                                />
                            </button>
                        </div>
                        <div className='mt-3 flex items-center'>
                            <input type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded" name="nft" id="nft" onChange={(e) => setUserWantNft(e.target.checked)} />
                            <label htmlFor="nft" className='ml-1'>Create NFT for this post?</label>
                        </div>

                        <button
                            className="flex bg-blue-400 text-white px-4 py-2 rounded-full text-lg items-center justify-center"
                            type="submit"
                        >
                            {image ? 'Submit Post with Image' : "Submit Post"} <Image src={send} width={24} alt="submit" />
                        </button>
                    </div>
                </form>
                <input
                    type="file"
                    accept="image/*"
                    ref={inputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                />
            </div>

            <div className="flex flex-col w-full">
                {loading && (
                    <div className="flex flex-col items-center justify-center w-full h-full mt-8">
                        <p className="text-2xl text-gray-400" style={{
                            animation: 'typing 1s steps(10) infinite',
                        }}>Loading...</p>
                    </div>
                )}

                {error && (
                    <div className="flex flex-col items-center justify-center w-full h-full mt-8">
                        <p className="text-2xl text-gray-400">No posts yet</p>
                    </div>
                )}

                {postsData.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                ).map((post: any) => (
                    <Post key={post.id} reload={getPosts} {...post} />
                ))}
            </div>
        </div>
    );
}

export default Feed;
