import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/src/contexts/authContext/page'
import { doSignOut } from '@/src/config/auth'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

const Header = () => {
    const navigate = useNavigate()
    const { userLoggedIn } = useAuth()
    
    return (
        <nav className='flex flex-row gap-x-4 w-full z-20 fixed top-0 left-0 h-14 border-b place-content-between items-center bg-[#333446] px-4'>
            <div className='flex flex-row gap-x-4 items-center'>
                {
                    userLoggedIn
                        ?
                        <>

                            <div 
                                onClick={() => { doSignOut().then(() => { navigate('/login') }) }} 
                                className='px-4 py-2 text-sm font-medium text-white hover:scale-105 hover:shadow-md transition-all duration-200 hover:!text-white cursor-pointer'
                            >
                                Çıkış Yap
                            </div>
                        </>
                        :
                        <>
                            <Link 
                                to="/" 
                                className='px-4 py-2 text-sm font-medium text-white hover:scale-105 hover:shadow-md transition-all duration-200 hover:!text-white'
                            >
                                <img src='logo.png' alt='logo' className='h-6 w-6 justify-between'/>
                            </Link>
                            <Link 
                                to="/login" 
                                className='px-4 py-2 text-sm font-medium text-white hover:scale-105 hover:shadow-md transition-all duration-200 hover:!text-white'
                            >
                                Giriş Yap
                            </Link>
                            <Link 
                                to="/register" 
                                className='px-4 py-2 text-sm font-medium text-white hover:scale-105 hover:shadow-md transition-all duration-200 hover:!text-white'
                            >
                                Kayıt Ol
                            </Link> 
                        </>
                }
            </div>
            
            {/* Sağ taraftaki avatar butonu */}
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