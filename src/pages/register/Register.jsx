import React, { useState } from "react"
import { Navigate, Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/src/contexts/authContext/page";
import { doCreateUserWithEmailAndPassword } from "@/src/config/auth"

const Register = () => {

    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setconfirmPassword] = useState('')
    const [isRegistering, setIsRegistering] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const { userLoggedIn } = useAuth()

    const onSubmit = async (e) => {
        e.preventDefault()
        if(!isRegistering) {
            setIsRegistering(true)
            await doCreateUserWithEmailAndPassword(email, password)
        }
    }

    return (
        <>
            {userLoggedIn && (<Navigate to={'/createprofile'} replace={true} />)}

            <main className="w-full h-full flex self-center place-content-center place-items-center">
                <div className="w-96 space-y-5 p-4 shadow-xl border-2 border-[var(--border)] rounded-2xl ">
                    <div className="text-center mb-6">
                        <div className="mt-2">
                            <h3 className="text-[var(--secondary-text)] text-xl font-semibold sm:text-2xl">Yeni Hesap Oluştur</h3>
                        </div>
                    </div>
                    <form
                        onSubmit={onSubmit}
                        className="space-y-4"
                    >
                        <div>
                            <label className="text-sm text-[var(--secondary-text)] font-bold">
                                Email
                            </label>
                            <input
                                type="email"
                                autoComplete='email'
                                required
                                value={email} onChange={(e) => { setEmail(e.target.value) }}
                                className="w-full mt-2 px-3 py-2 text-[var(--secondary-text)] bg-transparent outline-none border focus:border-[var(--secondary-border)] shadow-sm rounded-2xl transition duration-300"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-[var(--secondary-text)] font-bold">
                                Şifre
                            </label>
                            <input
                                disabled={isRegistering}
                                type="password"
                                autoComplete='new-password'
                                required
                                value={password} onChange={(e) => { setPassword(e.target.value) }}
                                className="w-full mt-2 px-3 py-2 text-[var(--secondary-text)] bg-transparent outline-none border focus:border-[var(--secondary-border)] shadow-sm rounded-2xl transition duration-300"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-[var(--secondary-text)] font-bold">
                                Tekrar Şifre
                            </label>
                            <input
                                disabled={isRegistering}
                                type="password"
                                autoComplete='off'
                                required
                                value={confirmPassword} onChange={(e) => { setconfirmPassword(e.target.value) }}
                                className="w-full mt-2 px-3 py-2 text-[var(--secondary-text)] bg-transparent outline-none border focus:border-[var(--secondary-border)] shadow-sm rounded-2xl transition duration-300"
                            />
                        </div>

                        {errorMessage && (
                            <span className='text-red-600 font-bold'>{errorMessage}</span>
                        )}

                        <button
                            type="submit"
                            disabled={isRegistering}
                            className={`w-full px-4 py-2 text-white font-medium rounded-lg ${isRegistering ? 'bg-gray-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl transition duration-300'}`}
                        >
                            {isRegistering ? 'Kaydolunuyor...' : 'Kaydol'}
                        </button>
                        <div className="text-sm text-center text-[var(--secondary-text)]">
                            Zaten hesabın var mı? {'   '}
                            <Link to={'/login'} className="text-center text-sm hover:underline font-bold">Giriş Yap</Link>
                        </div>
                    </form>
                </div>
            </main>
        </>
    )
}

export default Register