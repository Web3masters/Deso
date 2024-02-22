// @ts-nocheck
import Image from "next/image"
import { Layout } from "@/components/Layout"
import metamask from '@/assets/icons/metamask.svg'
import Link from "next/link"
import earth from "@/assets/images/earth.jpg"
import logo from "@/assets/logos/logo-2.svg"
import { ethers } from "ethers"
import Cookies from "universal-cookie"
import { verifyConnectToMetamask } from "@/utils/verifyConnectToMetamask"
import { useEffect, useState } from "react"
import userService from "@/services/userService"
import { useRouter } from 'next/navigation';
import toast, { Toaster } from "react-hot-toast"
import { motion } from "framer-motion"
import { signupContainerVariant } from "@/animations"


const SignUp = () => {

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        }
    }, [])

    const [ address, setAddress ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ email, setEmail ] = useState("")
    const [ name, setName ] = useState("")

    const router = useRouter();

    const cookie = new Cookies()

    async function Subscribe() {
        try {
            const response = await userService.register(address, password, name, email, username)
            toast.success("User created successfully")
            try {
                const response = await userService.auth(address, password)
                cookie.set("token", response.data.access_token)
                setTimeout(() => {
                    router.push("/")
                }, 2000)
            } catch (err) {
                console.log(err)
                toast.error("Invalid credentials")
            }
        } catch (err) {
            console.log(err)
            toast.error("Invalid infos")
        }
    }  
    
    useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        setAddress(urlParams.get('address'))
    }, [])

    return (
        <>
        <Toaster />
        <div className="absolute -z-10 top-0 shadow-xl left-0">
            <Image alt="background" src={earth}></Image>
        </div>
        <div className="flex font-pulp flex-col text-center items-center h-auto w-auto justify-center">
            <div className=" mt-10">
                <Image alt="logo" height={120} src={logo}/>
            </div>
            <motion.div variants={signupContainerVariant} initial="start" animate="end" className="bg-white w-1/4 items-center rounded mt-16">
                <p className="text-xl mt-4">Address</p>
                <input className="border-2 border-blue-400 rounded-lg w-2/3 px-4 placeholder:text-blue-400 focus:border-blue-500 py-2" disabled value={address} type="text" placeholder="0x000000000..." />
                
            <div>
                <p className="text-xl mt-3 mt">Email</p>
                <input onChange={event => setEmail(event.target.value)} className="border-2 border-blue-400 rounded-lg w-2/3 px-4 placeholder:text-blue-400 focus:border-blue-500 py-2" type="text" placeholder="email@email.com" />
            </div>

            <div>
                <p className="text-xl mt-3">Name</p>
                <input onChange={event => setName(event.target.value)} className="border-2 border-blue-400 rounded-lg w-2/3 px-4 placeholder:text-blue-400 focus:border-blue-500 py-2" type="text" placeholder="Full Name" />
            </div>

            <div>
                <p className="text-xl mt mt-3">Password</p>
                <input onChange={event => setPassword(event.target.value)} className="border-2 border-blue-400 rounded-lg w-2/3 px-4 py-2 placeholder:text-blue-400 focus:border-blue-500" type="password" placeholder="********" />
            </div>

            <button onClick={() => {Subscribe()}} className="bg-blue-400 text-white font-semibold text-xl rounded-lg mb-6 mx-auto px-4 py-3 justify-center flex items-center p-2 mt-8 w-2/3">
                SignUp
            </button>
        </motion.div>
            </div>
    </>
)
}

export default SignUp