import axios from 'axios';
import { getAccountPath } from 'ethers';
//require('dotenv').config();
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const API_URL = "https://flipper.inteliblockchain.co";
const API_URL1 = "https://flipper.inteliblockchain.co";


const postService = {
    create: async (description: string, createNFT: boolean) => {
        const token = cookies.get('token')

        const create = await axios.post(`${API_URL}/v1/post/create`, {
            description: description,
            ipfsLink: "teste",
            createNft: createNFT
        }, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })

        return create
    },

    getAll: async () => {
        const token = cookies.get('token')

        const data = await axios.get(`${API_URL}/v1/post/getAll`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })

        return data.data
    },

    getPost: async (postID: string) => {
        const token = cookies.get('token')

        const data = await axios.get(`${API_URL}/v1/post/getById/${postID}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })

        return data
    },

    likePost: async (postID: string) => {
        const token = cookies.get('token')

        const data = await axios.get(`${API_URL}/v1/post/like/${postID}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })

        return data
    },

    dislikePost: async (postID: string) => {
        const token = cookies.get('token')

        const data = await axios.get(`${API_URL}/v1/post/dislike/${postID}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })

        return data
    },

    postComment: async (postID: string, comment: string) => {
        const token = cookies.get('token')

        const data = await axios.post(`${API_URL}/v1/post/createComment`, {
            idPost: postID,
            text: comment
        }, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
    }
}

export default postService;