import axios from 'axios';
import { StringLiteralLike } from 'typescript';
//require('dotenv').config();
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const API_URL = "https://flipper.inteliblockchain.co";
const API_URL1 = "https://flipper.inteliblockchain.co";


const userService = {
    auth: async (address: string, pass: string) => {

        const auth = await axios.post(`${API_URL}/v1/user/auth`, {
            address: address,
            password: pass
        })

        return auth
    },

    verify: async (address: string) => {
        const verify = await axios.get(`${API_URL}/v1/user/verify/${address}`)

        return verify
    },

    register: async (address: string, pass: string, name: string, email: string, userName: string, userContract: string) => {
        const register = await axios.post(`${API_URL}/v1/user/register`, {
            address: address,
            password: pass,
            name: name,
            email: email,
            username: userName,
            imgAddress: userContract
        })

        return register
    },

    getUser: async () => {

        const token = cookies.get('token')

        const user = await axios.get(`${API_URL}/v1/user`,
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        )

        return user
    },

    getUserById: async (id: string) => {
        const token = cookies.get('token')

        const user = await axios.get(`${API_URL}/v1/user/getById/${id}`,
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        )

        return user
    },

    updateUser: async (id: string, data: any) => {
        const token = cookies.get('token')

        const user = await axios.put(`${API_URL}/v1/user/update/${id}`, data,
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        )

        return user
    },

    follow: async (id: string) => {
        const token = cookies.get('token')

        const follow = await axios.get(`${API_URL}/v1/user/follow/${id}`,
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        )

        return follow
    },

    unfollow: async (id: string) => {
        const token = cookies.get('token')

        const follow = await axios.get(`${API_URL}/v1/user/unfollow/${id}`,
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        )

        return follow
    },
}

export default userService;