//@ts-nocheck
import React, { useState, useEffect } from 'react';
import { useEthereum, useConnect, useAuthCore } from '@particle-network/auth-core-modal';
import { Avalanche } from '@particle-network/chains';
import { AAWrapProvider, SendTransactionMode, SmartAccount } from '@particle-network/aa';
import { ethers } from 'ethers';
import { useRouter } from "next/router";
import toast, { Toaster } from "react-hot-toast";
import Cookies from "universal-cookie";
import userService from "@/services/userService";
import { verifyConnectToMetamask } from "@/utils/verifyConnectToMetamask";
import { motion } from "framer-motion";
import { loginBgVariant, loginButtonVariant, loginSloganVariant } from "@/animations";

import Image from "next/image";
import metamask from '@/assets/icons/metamask.svg';
import earth from "@/assets/images/earth.jpg";
import logo from "@/assets/logos/logo-2.svg";

const LoginTwo = () => {
    const { provider } = useEthereum();
    const { connect, disconnect } = useConnect();
    const { userInfo } = useAuthCore();
    const { ethereum } = window;

    const smartAccount = new SmartAccount(provider, {
        projectId: process.env.REACT_APP_PROJECT_ID,
        clientKey: process.env.REACT_APP_CLIENT_KEY,
        appId: process.env.REACT_APP_APP_ID,
        aaOptions: {
            simple: [{ chainId: Avalanche.id, version: '1.0.0' }]
        }
    });

    const customProvider = new ethers.providers.Web3Provider(new AAWrapProvider(smartAccount, SendTransactionMode.Gasless), "any");
    const [balance, setBalance] = useState(null);

    useEffect(() => {
        if (userInfo) {
            fetchBalance();
        }
    }, [userInfo, smartAccount, customProvider]);

    const fetchBalance = async () => {
        const address = await smartAccount.getAddress();
        const balanceResponse = await customProvider.getBalance(address);
        setBalance(ethers.utils.formatEther(balanceResponse));
    };

    const router = useRouter();
    const [isConnected, setIsConnected] = useState(false);
    const [address, setAddress] = useState("");
    const [password, setPassword] = useState("");

    const cookie = new Cookies();

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        verify();
        return () => {
            document.body.style.overflow = 'unset';
        }
    }, []);

    const connectHandler = async () => {
        if (ethereum) {
            try {
                const res = await ethereum.request({
                    method: "eth_requestAccounts",
                });
                try {
                    const response = await userService.verify(res[0]);
                    console.log(response);
                    if (response.data === "User not found") {
                        toast.error("User not found, redirecting to signup");
                        setTimeout(() => {
                            router.push(`/signup?address=${res[0]}`);
                        }, 2000);
                    } else {
                        setAddress(res[0]);
                        setIsConnected(true);
                    }
                } catch (err) {
                    router.push("/signup");
                }
            } catch (err) {
                console.error(err);
                window.alert("There was a problem connecting to MetaMask");
            }
        } else {
            window.alert("Install MetaMask");
        }
    };

    async function verify() {
        const teste = await verifyConnectToMetamask();
        console.log(teste[0]);
        if (teste[0] != null) {
            setAddress(teste[0]);
            try {
                const response = await userService.verify(teste[0]);
                console.log(response);
                if (response.data === "User not found") {
                    toast.error("User not found, redirecting to signup");
                    setTimeout(() => {
                        router.push(`/signup?address=${teste[0]}`);
                    }, 2000);
                } else {
                    setIsConnected(true);
                    return;
                }
            } catch (err) {
                router.push(`/signup?address=${teste[0]}`);
            }
        }
    }

    async function Auth() {
        try {
            const response = await userService.auth(address, password);
            cookie.set("token", response.data.access_token);
            router.push("/");
        } catch (err) {
            console.log(err);
            toast.error("Invalid credentials");
        }
    }

    const executeUserOp = async () => {
        const signer = customProvider.getSigner();
        const tx = {
            to: "0x000000000000000000000000000000000000dEaD",
            value: ethers.utils.parseEther("0.0001"),
        };
        const txResponse = await signer.sendTransaction(tx);
        const txReceipt = await txResponse.wait();
        notification.success({
            message: 'Transaction Successful',
            description: (
                <div>
                    Transaction Hash: <a href={`https://snowtrace.io/tx/${txReceipt.transactionHash}`} target="_blank" rel="noopener noreferrer">{txReceipt.transactionHash}</a>
                </div>
            )
        });
    };

    const executeBatchUserOp = async () => {
        const tx = {
            tx: [{
                to: "0x000000000000000000000000000000000000dEaD",
                value: ethers.utils.parseEther("0.0001"),
            },
            {
                to: "0x000000000000000000000000000000000000dEaD",
                value: ethers.utils.parseEther("0.0001"),
            }]
        };
        const txResponse = await smartAccount.sendTransaction(tx);
        notification.success({
            message: 'Transaction Successful',
            description: (
                <div>
                    Transaction Hash: <a href={`https://snowtrace.io/tx/${txResponse}`} target="_blank" rel="noopener noreferrer">{txResponse}</a>
                </div>
            )
        });
    };

    const handleLogin = async (authType) => {
        if (!userInfo) {
            await connect({
                socialType: authType,
                chain: Avalanche,
            });
        }
    };

    return (
        <div>
            <Toaster toastOptions={{
                className: 'font-pulp',
            }} />
            <motion.div variants={loginBgVariant} initial="start" animate="end" className="absolute -z-10 top-0 left-0">
                <Image alt="background" src={earth}></Image>
            </motion.div>
            <div className="absolute bg-black -z-20 h-full w-full top-0 left-0">
            </div>
            <div className="flex flex-col text-center items-center h-auto w-auto justify-center">
                <div className=" mt-10">
                    <Image alt="logo" height={120} src={logo} />
                </div>
                {!isConnected ? (
                    <div>
                        <motion.h1 variants={loginSloganVariant} initial="start" animate="end" className="mt-16 font-pulp text-white mb-16 font-semibold text-3xl">
                            The world at YOUR hands
                        </motion.h1>
                        <motion.button variants={loginButtonVariant} initial="start" animate="end" onClick={connectHandler} className="mb-10 font-pulp bg-blue-400 text-white shadow-xl font-semibold text-3xl rounded-lg px-4 py-2 justify-center flex items-center">
                            <Image src={metamask} width={46} alt="login" className="mr-2 translate-y-1" />Connect to Metamask
                        </motion.button>
                    </div>

                ) : (
                    <div className="font-pulp bg-white w-1/4 items-center rounded mt-16">
                        <h1 className="mt-4 text-4xl mb-4">Welcome back!</h1>
                        <p className="text-xl mt-4">Password</p>
                        <input className="border-2 border-blue-400 rounded-lg w-2/3 px-4 placeholder:text-blue-400 focus:border-blue-500 py-2" onChange={event => setPassword(event.target.value)} type="password" placeholder="Your password" />

                        <button onClick={() => { Auth() }} className="bg-blue-400 text-white font-semibold text-xl rounded-lg mb-6 mx-auto px-4 py-3 justify-center flex items-center p-2 mt-8 w-2/3">
                            Log in!
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default LoginTwo;
