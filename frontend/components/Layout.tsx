import { Inter } from "next/font/google"
import Head from "next/head"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { Navbar } from "@/Navbar"

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
})

interface Props {
    title?: string
    navbar?: boolean
    navbarLinks?: { name: string, href: string }[]
    children: React.ReactNode
}

const navbarLinks = [
    { name: "Home", href: "/" },
    { name: "DAO", href: "/dao" },
    { name: "Profile", href: "/profile" },
];

export const Layout = ({ navbar = true, title, children }: Props) => {
    useEffect(() => {
        console.log("Welcome to Flipper!")
console.log(`
 ____ __    __ ____  ____   ____ ____
||    ||    || ||  \\ ||  \\ ||    ||  \\
||==  ||    || ||_// ||_// ||==  ||_//
||    ||__| || ||    ||    ||___ || \\
                                    `);
    }, [])

    return <>
        <Head>
            <title>
                {title ? `${title} | Flipper` : "Flipper"}
            </title>
            <link rel="icon" href="/favicon.ico" />
        </Head>

        {navbar && <Navbar links={navbarLinks} />}

        <div className={`flex z-0 flex-1 min-w-max w-full min-h-screen h-full bg-[#fff] ${inter.className} font-sans ${navbar ? "pt-[4rem]" : ""}`}>
            {children}
        </div>
    </>
}   