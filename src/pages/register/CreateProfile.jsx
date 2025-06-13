import { useState } from "react"
import { Navigate, useNavigate } from "react-router-dom"
import { useAuth } from "@/src/contexts/authContext/page";
import { createUser } from "@/src/controllers/UserRequest"

const ProfileSetup = () => {

    const navigate = useNavigate()

    const [username, setUsername] = useState('')
    const [selectedPredefinedPhoto, setSelectedPredefinedPhoto] = useState('')
    const [imagePreview, setImagePreview] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const { userLoggedIn, currentUser } = useAuth()

    // Önceden tanımlanmış profil fotoğrafları
    const predefinedPhotos = [
        {
            id: 1,
            src: "/profileImages/1.jpg",
            alt: "Hatsune Miku"
        },
        {
            id: 2,
            src: "/profileImages/2.jpg",
            alt: "Gojo Satoru"
        },
        {
            id: 3,
            src: "/profileImages/3.jpg",
            alt: "Kedy"
        },
        {
            id: 4,
            src: "/profileImages/4.jpg",
            alt: "Dog"
        },
        {
            id: 5,
            src: "/profileImages/5.jpg",
            alt: "Sunshine"
        },
        {
            id: 6,
            src: "/profileImages/6.jpg",
            alt: "Frieren"
        },
        {
            id: 7,
            src: "/profileImages/7.jpg",
            alt: "Basic Pink"
        },
        {
            id: 8,
            src: "/profileImages/8.jpg",
            alt: "Basic Blue"
        }
    ]

    const handlePredefinedPhotoSelect = (photo) => {
        setSelectedPredefinedPhoto(photo.id)
        setImagePreview(photo.src)
        setErrorMessage('')
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        
        if (!username.trim()) {
            setErrorMessage('Kullanıcı adı gereklidir')
            return
        }

        if (username.length < 3) {
            setErrorMessage('Kullanıcı adı en az 3 karakter olmalıdır')
            return
        }

        if(!isSubmitting) {
            setIsSubmitting(true)
            setErrorMessage('')
            
            try {
                const token = currentUser?.stsTokenManager?.accessToken
                console.log('Token:', token)
                
                if (!token) {
                    throw new Error('Kullanıcı oturumu bulunamadı')
                }

                // Profil fotoğrafı src'sini belirle
                let profilePhoto = selectedPredefinedPhoto || 0

                // createUser fonksiyonuna profil fotoğrafı src'sini de gönder
                await createUser(token, username, profilePhoto)
                
                navigate('/home')
                
            } catch (error) {
                console.error('Profil güncelleme hatası:', error)
                setErrorMessage(error.response?.data?.message || error.message || 'Profil güncellenirken bir hata oluştu')
            } finally {
                setIsSubmitting(false)
            }
        }
    }

    return (
        <>
            {!userLoggedIn && (<Navigate to={'/login'} replace={true} />)}

            <main className="w-full h-full flex self-center place-content-center place-items-center">
                <div className="w-120 space-y-5 p-4 shadow-xl border-2 border-[var(--border)] rounded-2xl ">
                    <form
                        onSubmit={onSubmit}
                        className="space-y-4"
                    >
                        {/* Profil Fotoğrafı */}
                        <div className="flex flex-col items-center space-y-3">
                            <label className="text-sm text-[var(--secondary-text)] font-bold">
                                Profil Fotoğrafı Seç
                            </label>
                            
                            {/* Önizleme */}
                            <div className="w-24 h-24 rounded-full border-2 border-dashed border-[var(--border)] flex items-center justify-center overflow-hidden bg-gray-50">
                                {imagePreview ? (
                                    <img 
                                        src={imagePreview} 
                                        alt="Profil önizleme"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="text-center">
                                        <svg className="w-8 h-8 text-gray-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        <span className="text-xs text-gray-400">Fotoğraf</span>
                                    </div>
                                )}
                            </div>

                            {/* Hazır Fotoğraflar */}
                            <div className="grid grid-cols-4 gap-2">
                                {predefinedPhotos.map((photo) => (
                                    <button
                                        key={photo.id}
                                        type="button"
                                        onClick={() => handlePredefinedPhotoSelect(photo)}
                                        className={`w-26 rounded-full border-2 overflow-hidden transition-all duration-200 ${
                                            selectedPredefinedPhoto === photo.src
                                                ? 'border-indigo-600 ring-2 ring-indigo-300 shadow-lg' 
                                                : 'border-gray-300 hover:border-indigo-400 hover:shadow-md'
                                        }`}
                                        disabled={isSubmitting}
                                    >
                                        <img 
                                            src={photo.src} 
                                            alt={photo.alt}
                                            className="w-16 h-16 object-cover rounded-full"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Kullanıcı Adı */}
                        <div>
                            <label className="text-sm text-[var(--secondary-text)] font-bold">
                                Kullanıcı Adı
                            </label>
                            <input
                                type="text"
                                required
                                value={username} 
                                onChange={(e) => { setUsername(e.target.value) }}
                                placeholder="Kullanıcı adınızı girin"
                                className="w-full mt-2 px-3 py-2 text-[var(--secondary-text)] bg-transparent outline-none border focus:border-[var(--secondary-border)] shadow-sm rounded-2xl transition duration-300"
                                disabled={isSubmitting}
                                minLength={3}
                                maxLength={20}
                            />
                            <p className="text-xs text-[var(--secondary-text)] opacity-60 mt-1">
                                3-20 karakter arası olmalıdır
                            </p>
                        </div>

                        {errorMessage && (
                            <span className='text-red-600 font-bold text-sm'>{errorMessage}</span>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full px-4 py-2 text-white font-medium rounded-lg ${isSubmitting ? 'bg-gray-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl transition duration-300'}`}
                        >
                            {isSubmitting ? 'Kaydediliyor...' : 'Profili Tamamla'}
                        </button>
                    </form>
                </div>
            </main>
        </>
    )
}

export default ProfileSetup