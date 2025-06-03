import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/src/contexts/authContext/page'
import { doSignOut } from '@/src/config/auth'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { BiLogOut, BiHome, BiLogIn } from "react-icons/bi";
import { FaHatWizard } from "react-icons/fa6";

const Header = () => {
    const navigate = useNavigate()
    const { userLoggedIn } = useAuth()
    
    return (
        <nav className='flex flex-row gap-x-4 w-full z-20 fixed top-0 left-0 h-14 place-content-between items-center bg-linear-to-l from-[var(--background)] to-[var(--secondary-bg)] px-4'>
            <div className='flex flex-row gap-x-4 items-center'>
                {
                    userLoggedIn
                        ?
                        <>
                            <Link 
                                to="/" 
                                className='px-4 py-2 text-sm font-medium border-2 border-[var(--secondary-border)] rounded-full hover:scale-105 hover:shadow-md transition-all duration-200'
                            >
                                <img src='logo.png' alt='logo' className='h-6 w-6'/>
                            </Link>
                            <Link 
                                to="/home" 
                                className='flex items-center gap-2 px-4 py-2 text-sm font-medium border-2 border-[var(--secondary-border)] rounded hover:scale-105 hover:shadow-md transition-all duration-200 cursor-pointer'
                            >
                                <BiHome />Ana Sayfa
                                
                            </Link>
                            <Link 
                                to="/"
                                onClick={(e) => {
                                    const confirmed = window.confirm("Çıkış yapmak istediğinize emin misiniz?");
                                    if (!confirmed) {
                                        e.preventDefault();
                                        return;
                                    }
                                    doSignOut();
                                }} 
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium border-2 border-[var(--secondary-border)] rounded hover:scale-105 hover:shadow-md transition-all duration-200 cursor-pointer"
                            >
                                <BiLogOut /> Çıkış Yap
                            </Link>

                        </>
                        :
                        <>
                            <Link 
                                to="/" 
                                className='px-4 py-2 text-sm font-medium border-2 border-[var(--secondary-border)] rounded-full hover:scale-105 hover:shadow-md transition-all duration-200'
                            >
                                <img src='logo.png' alt='logo' className='h-6 w-6'/>
                            </Link>
                            <Link 
                                to="/login" 
                                className='flex items-center gap-2 px-4 py-2 text-sm font-medium border-2 border-[var(--secondary-border)] rounded hover:scale-105 hover:shadow-md transition-all duration-200 cursor-pointer'
                            >
                                <BiLogIn />Giriş Yap
                            </Link>
                            <Link 
                                to="/register" 
                                className='flex items-center gap-2 px-4 py-2 text-sm font-medium border-2 border-[var(--secondary-border)] rounded hover:scale-105 hover:shadow-md transition-all duration-200 cursor-pointer'
                            >
                                <FaHatWizard/ > Kayıt Ol
                            </Link> 
                        </>
                }
            </div>
            
            {userLoggedIn && (
                <Button variant="destructive" className="text-amber-100 h-10 w-10 p-0" type="button">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </Button>
            )}
        </nav>
    )
}

export default Header;