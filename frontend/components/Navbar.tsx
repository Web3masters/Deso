import { Inter } from "next/font/google"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import logo from "@/assets/logos/logo-1.svg"
import profile from "@/assets/images/profile-icon.png"
import settings from "@/assets/icons/settings.svg"
import logout from "@/assets/icons/logout.svg"
import { use, useState, useEffect } from "react"
import Cookies from "universal-cookie"
import userService from "@/services/userService"

const inter = Inter({
    subsets: ['latin'],
})

export const Navbar = ({ links }: {
    links: { name: string, href: string }[]
}) => {

    const cookie = new Cookies();

    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [user, setUser] = useState<any>();

    const toggleOptions = () => {
        setOpen(!open);
    }

    const logOut = () => {
        cookie.remove("token");
        router.push("/login");
    }

    const getUser = async () => {
        try {
            const response = await userService.getUser();
            console.log(response);
            setUser(response.data);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getUser()
    }, [])

    return (
        <div className={`shadow-lg absolute w-full z-50 top-0 left-0 h-fit items-center justify-between ${inter.className} flex items-center justify-between`}>
            {/* <div className=""> */}
            <div className="flex p-4">
                <Link href="/" className="text-2xl font-semibold"><Image src={logo} height={30} alt="" /></Link>

                <div className="hidden sm:flex items-center ml-8">
                    {links.map((link, i) => (
                        <Link key={i} href={link.href} className={
                        `text-lg cursor-pointer ${i != 0 && "ml-8"} ${router.pathname == link.href ? "text-blue-400 font-bold" : "font-normal"}`
                        }>{link.name}</Link>
                    ))}
                </div>
            </div>

            <button className="flex items-center h-auto p-4" onClick={toggleOptions}>
                {user && <p className="text-[#757575] mr-2">{user.address.substring(0, 6)}...{user.address.substring(user.address.length - 4, user.address.length)}</p>}
                {user && <img src={user.imgUrl} width={32} height={32} alt="profile" className="rounded-full" />}
            </button>

            {open && (
                <div className="absolute bg-white fill-white shadow-md right-0 translate-y-[5.5rem] z-10">
                    <Link href={"/profile"} className="flex items-center px-6 py-4 bg-white hover:bg-slate-100 border-b border-gray-200">
                        <img src={user.imgUrl} width={24} height={24} alt="profile" className="mr-2 rounded-full" />
                        <p className="text-[#757575] mr-2">Profile</p>
                    </Link>

                    {/* <Link href={"/settings"} className="flex items-center px-6 py-4 bg-white hover:bg-slate-100 border-b border-gray-200">
                        <Image src={settings} width={24} height={24} alt="profile" className="mr-2 rounded-full" />
                        <p className="text-[#757575] mr-2">Settings</p>
                    </Link> */}

                    <button onClick={() => { logOut() }} className="flex items-center px-5 py-4 bg-white hover:bg-slate-100">
                        <Image src={logout} width={24} height={24} alt="profile" className="mr-2 rounded-full" />
                        <p className="text-[#757575] mr-2">Logout</p>
                    </button>
                </div>
            )}
            {/* </div> */}
        </div>
    )
}