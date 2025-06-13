import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/src/contexts/authContext/page'
import { doSignOut } from '@/src/config/auth'
import { BiLogOut, BiHome, BiLogIn } from "react-icons/bi";
import { FaHatWizard } from "react-icons/fa6";
import { getUser } from '@/src/controllers/UserRequest'

const Header = () => {
    const { userLoggedIn, currentUser } = useAuth()
    const [userData, setUserData] = useState(() => {
        const savedUserData = localStorage.getItem('userData');
        return savedUserData ? JSON.parse(savedUserData) : null;
    });
    const [showProfile, setShowProfile] = useState(false);
    const profileRef = useRef();
    const token = currentUser?.stsTokenManager?.accessToken

    useEffect(() => {
        const fetchUser = async () => {
        try {
            const response = await getUser(token);
            console.log("araba",response)
            if (response.data.success) { 
                setUserData(response.data)
                localStorage.setItem('userData', JSON.stringify(response.data));
            }
        } catch (error) {
            console.error('Kullanıcı bilgisi yüklenirken hata:', error);
            setUserName('Kullanıcı');
        }
        };

        if (token) {
        fetchUser();
        }
    }, [token]);

    // Popup dışında tıklanınca kapansın
    useEffect(() => {
        function handleClickOutside(event) {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setShowProfile(false);
            }
        }
        if (showProfile) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showProfile]);
    
    return (
        <nav className='flex flex-row gap-x-4 w-full z-20 fixed top-0 left-0 h-14 place-content-between items-center bg-linear-to-l from-[var(--background)] to-[var(--secondary-bg)] px-4'>

            <div className='flex flex-row gap-x-4 items-center'>
                    <Link 
                        to="/" 
                        className='px-4 py-2 text-sm font-medium border-2 border-[var(--secondary-border)] rounded-full hover:scale-105 hover:shadow-md transition-all duration-200'
                    >
                        <img src="logo.png" alt="logo" className="h-6 w-6" />
                    </Link>
                    {
                    userLoggedIn
                        ?
                        <>
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
                <div style={{ position: 'relative' }}>
                    <button
                    style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        borderRadius: '50%'
                    }}
                    onClick={() => setShowProfile((prev) => !prev)}
                    >
                    <div style={{
                        width: '3rem',
                        height: '3rem',
                        borderRadius: '50%',
                        border: '3px solid var(--secondary-bg)',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'var(--background)'
                    }}>
                        <img 
                        src={`/profileImages/${userData?.data.img}.jpg`}
                        alt="Profile"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                        }}
                        />
                        <div style={{
                        display: 'none',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        color: 'var(--text)'
                        }}>
                        CN
                        </div>
                    </div>
                    </button>
                    
                    {showProfile && (
                    <div
                        ref={profileRef}
                        style={{
                        position: 'absolute',
                        right: 0,
                        top: '110%',
                        marginTop: '0.5rem',
                        width: '16rem',
                        backgroundColor: 'var(--secondary-bg)',
                        borderRadius: '1.5rem',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        border: '2px solid var(--border)',
                        padding: '2rem',
                        zIndex: 50,
                        textAlign: 'center'
                        }}
                    >
                        <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '1rem'
                        }}>
                        {/* Profile Image */}
                        <div style={{
                            width: '4rem',
                            height: '4rem',
                            borderRadius: '50%',
                            border: '2px solid var(--border)',
                            overflow: 'hidden',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'var(--background)'
                        }}>
                            <img 
                            src={`/profileImages/${userData?.data.img}.jpg`}
                            alt="Profile"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                            }}
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                            }}
                            />
                            <div style={{
                            display: 'none',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.125rem',
                            fontWeight: 'bold',
                            color: 'var(--text)'
                            }}>
                            CN
                            </div>
                        </div>
                        
                        {/* Username */}
                        <span style={{
                            fontWeight: 'bold',
                            fontSize: '1.125rem',
                            color: 'var(--secondary-text)',
                            fontFamily: 'cursive'
                        }}>
                            {userData?.data.username}
                        </span>
                        
                        {/* User Info & Logout */}
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                            width: '100%'
                        }}>
                            <div style={{
                            padding: '0.75rem',
                            backgroundColor: 'var(--background)',
                            borderRadius: '0.75rem',
                            border: '1px solid var(--border)'
                            }}>
                            <span style={{
                                fontWeight: 'bold',
                                fontSize: '0.8rem',
                                color: 'var(--secondary-text)',
                                fontFamily: 'cursive'
                            }}>
                                Kayıt Tarihi: {new Date(userData?.data.createdAt).toLocaleDateString()}
                            </span>
                            </div>
                            
                            {/* Logout Button */}
                            <button
                            onClick={(e) => {
                                const confirmed = window.confirm("Çıkış yapmak istediğinize emin misiniz?");
                                if (!confirmed) {
                                    e.preventDefault();
                                    return;
                                }
                                doSignOut();
                            }} 
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem',
                                backgroundColor: '#ef4444',
                                color: 'white',
                                fontWeight: '600',
                                fontSize: '0.875rem',
                                borderRadius: '0.75rem',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                boxShadow: '0 4px 12px -2px rgba(239, 68, 68, 0.3)'
                            }}
                            onMouseOver={(e) => {
                                e.target.style.backgroundColor = '#dc2626';
                                e.target.style.boxShadow = '0 8px 20px -2px rgba(239, 68, 68, 0.4)';
                                e.target.style.transform = 'translateY(-2px)';
                            }}
                            onMouseOut={(e) => {
                                e.target.style.backgroundColor = '#ef4444';
                                e.target.style.boxShadow = '0 4px 12px -2px rgba(239, 68, 68, 0.3)';
                                e.target.style.transform = 'translateY(0)';
                            }}
                            >
                            Çıkış Yap
                            </button>
                        </div>
                        </div>
                    </div>
                    )}
                </div>
                )}
        </nav>
    )
}

export default Header;