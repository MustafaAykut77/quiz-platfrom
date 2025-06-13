import { useState, useEffect, useRef, use } from 'react';
import { useParams } from 'react-router-dom';
import { getGame } from '@/src/controllers/GameRequest';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io(import.meta.env.VITE_SERVER_URL, {
autoConnect: false
});

const Quiz = () => {
    const { code } = useParams();
    const navigate = useNavigate();
    const backgroundMusic = useRef(new Audio('/background-music.mp3'));

    const [isGameExists, setIsGameExists] = useState(false);
    const [username, setUsername] = useState('');
    const [isGameWaiting, setIsGameWaiting] = useState(false);
    const [isGameStarted, setIsGameStarted] = useState(false);

    const [playerList, setPlayerList] = useState([]);
    const [quiz, setQuiz] = useState(null);
    const [answerSent, setAnswerSent] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isCorrect, setIsCorrect] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [timer, setTimer] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [quizData, setQuizData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [usernameInput, setUsernameInput] = useState(''); // yeni state

    // API isteği ile code kontrolü
    useEffect(() => {
        const checkGame = async () => {
            try {
                const response = await getGame(code);
                if (response.success == false) {
                    navigate('/');
                }
            } catch (err) {
                navigate('/');
            }
        };
        checkGame();
        setIsGameExists(true);
    }, []);

    useEffect(() => {
        console.log('Player listesi güncellendi:', playerList);
    }, [playerList]);
    
    // Socket bağlantısı ve join_game işlemi
    useEffect(() => {
        if (!isGameExists && !username) return;

        socket.connect();
        socket.emit('join_game', code, username);

        socket.on('join_return', (data) => {
            console.log('Oyun katılım durumu:', data);
            if (data.success) {
                setIsGameWaiting(true);
                setPlayerList(data.players.data);
                console.log(`${data.username} oyuna katıldı.`);
                socket.off('join_return');
            }
        });

        return () => {
            socket.off('join_return');
            socket.disconnect();
        };
    }, [username]);

    // Kullanıcı oyuna girdiğinde socket üzerinden bildirim gönderme
    useEffect(() => {
        if (!isGameWaiting) return;

        socket.on('user_entered', (user) => {
            setPlayerList(prevPlayers => [...prevPlayers, user]);
        });

        socket.on('start_game', () => {
            console.log('Oyun başlatılıyor...');
            setIsGameStarted(true);
            socket.off('user_entered');
            socket.off('start_game');
        });
        return () => {
            socket.off('user_entered');
            socket.off('start_game');
        };
    }, [isGameWaiting]);

    // Oyun başladığında gerekli işlemleri yapma
    useEffect(() => {
        if (!isGameStarted) return;

        socket.on('question', (data) => {
            console.log('Yeni soru alındı:', data);
            setQuiz(data);
            setShowFeedback(false)
            setIsCorrect(false)
            setIsGameWaiting(false)
            setSelectedAnswer(null);
        });

        socket.on('answer_return', (data) => {
            console.log(data)
            setPlayerList(data.players.data)
            setIsCorrect(data.success)
            playSound(data.success)
            setShowFeedback(true);
        })
        return () => {
            socket.off('question');
        }
    }, [isGameStarted]);

    useEffect(() => {
        // Müziği döngüye al
        backgroundMusic.current.loop = true;
        
        // Quiz başladığında müziği çal
        if (!showResult && quiz) {
            backgroundMusic.current.play().catch(error => {
                console.log("Müzik çalma hatası:", error);
            });
        }

        // Quiz bittiğinde müziği durdur
        if (showResult) {
            backgroundMusic.current.pause();
            backgroundMusic.current.currentTime = 0;
        }

        // Component unmount olduğunda müziği temizle
        return () => {
            backgroundMusic.current.pause();
            backgroundMusic.current.currentTime = 0;
        };
    }, [showResult, quiz]);

    useEffect(() => {
        if (quiz && quiz.time) {
            // Her soru için kalan süreyi hesapla
            const remaining = Math.floor((quiz.time - Date.now()) / 1000);
            setTimer(remaining)
        }
        // eslint-disable-next-line
    }, [quiz]);

    // Timer'ı her saniye güncelle
    useEffect(() => {
        if (!quiz || showResult || showFeedback) return;

        const interval = setInterval(() => {
            if (quiz && quiz.time) {
                const remaining = Math.floor((quiz.time - Date.now()) / 1000);
                setTimer(remaining)

                if (remaining <= 0) {
                    clearInterval(interval);
                }
            }
        }, 1000);

        return () => clearInterval(interval);
        // eslint-disable-next-line
    }, [quiz, showResult, showFeedback]);

    // Ses çalma fonksiyonu
    const playSound = (isCorrect) => {
        const audio = new Audio(isCorrect ? '/correct.mp3' : '/wrong.mp3');
        audio.play().catch(error => {
            console.log("Ses çalma hatası:", error);
        });
    };

    const handleAnswerClick = (selectedIndex) => {
        if (!answerSent) setSelectedAnswer(selectedIndex);
    };

    // Onayla butonuna basınca cevabı gönder
    const handleConfirmAnswer = () => {
        if (selectedAnswer !== null && !answerSent) {
            socket.emit('answer', username, selectedAnswer);
            setAnswerSent(true);
        }
    };

    // Yeni soru geldiğinde sıfırla
    useEffect(() => {
        setSelectedAnswer(null);
        setAnswerSent(false);
    }, [quiz]);

    const restartQuiz = () => {
        setCurrentQuestionIndex(0);
        setScore(0);
        setShowResult(false);
        setTimer(0);
        setSelectedAnswer(null);
        setShowFeedback(false);
    };

    useEffect(() => {
        // Arkaplan müziğinin sesini ayarla (0.0 ile 1.0 arası)
        backgroundMusic.current.volume = 0.3;
    }, [isGameExists]);

    // Ses kontrolü için bir toggle fonksiyonu
    const toggleMusic = () => {
        if (isMuted) {
            backgroundMusic.current.play();
        } else {
            backgroundMusic.current.pause();
        }
        setIsMuted(!isMuted);
    };

    // 1. Önce kullanıcı adı ekranı
    if (!username) {
        return (
            <main style={{
                width: '100%',
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'var(--background)',
                fontFamily: 'cursive'
            }}>
                <div style={{
                    background: 'var(--secondary-bg)',
                    padding: '2rem',
                    borderRadius: '1rem',
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                    border: '2px solid var(--border)',
                    minWidth: '320px'
                }}>
                    <h2 style={{
                        color: 'var(--secondary-text)',
                        fontSize: '1.25rem',
                        marginBottom: '1rem',
                        textAlign: 'center'
                    }}>
                        Kullanıcı Adı Giriniz
                    </h2>
                    <form
                        onSubmit={e => {
                            e.preventDefault();
                            if (usernameInput.trim()) setUsername(usernameInput.trim());
                        }}
                        style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                    >
                        <input
                            type="text"
                            value={usernameInput}
                            onChange={e => setUsernameInput(e.target.value)}
                            placeholder="Kullanıcı adınız"
                            style={{
                                padding: '0.75rem 1rem',
                                borderRadius: '0.5rem',
                                border: '1px solid var(--border)',
                                fontSize: '1rem',
                                outline: 'none'
                            }}
                            maxLength={20}
                            autoFocus
                        />
                        <button
                            type="submit"
                            style={{
                                padding: '0.75rem 1rem',
                                backgroundColor: 'var(--text)',
                                color: 'var(--secondary-bg)',
                                border: 'none',
                                borderRadius: '0.5rem',
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            disabled={!usernameInput.trim()}
                        >
                            Katıl
                        </button>
                    </form>
                </div>
            </main>
        );
    }

    if (isGameWaiting) {
        return (
            <main style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'var(--background)',
                fontFamily: 'cursive',
            }}>
                <div style={{
                    width: '100%',
                    maxWidth: '48rem',
                    padding: '1.5rem',
                    backgroundColor: 'var(--secondary-bg)',
                    borderRadius: '1rem',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    border: '2px solid var(--border)',
                    animation: 'fadeIn 0.5s ease-out'
                }}>
                    {/* Header Bölümü */}
                    <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                        <h2 style={{
                            fontSize: '1.75rem',
                            fontWeight: 'bold',
                            color: 'var(--secondary-text)',
                            marginBottom: '0.75rem'
                        }}>
                            Oyuncular Bekleniyor...
                        </h2>
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '0.5rem 1rem',
                            backgroundColor: 'var(--background)',
                            borderRadius: '0.75rem',
                            border: '1px solid var(--border)'
                        }}>
                            <span style={{
                                color: 'var(--text)',
                                fontSize: '1rem'
                            }}>
                                Oyun Kodu: <strong>{code}</strong>
                            </span>
                        </div>
                    </div>

                    {/* Oyuncu Listesi */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '1rem',
                        maxHeight: '400px',
                        overflowY: 'auto',
                        padding: '1rem',
                        backgroundColor: 'var(--background)',
                        borderRadius: '0.75rem',
                        border: '1px solid var(--border)'
                    }}>
                        {[...playerList].reverse().map((player, index) => (
                            <div key={index} style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                padding: '1rem',
                                backgroundColor: 'var(--secondary-bg)',
                                borderRadius: '0.75rem',
                                border: '1px solid var(--border)',
                                animation: 'slideIn 0.3s ease-out',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                cursor: 'default'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}>
                                <div style={{
                                    width: '3rem',
                                    height: '3rem',
                                    backgroundColor: `hsl(${index * 137.5}, 70%, 65%)`,
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    fontSize: '1.5rem',
                                    marginBottom: '0.5rem',
                                    border: '2px solid white',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                }}>
                                    {player.playerName[0]}
                                </div>
                                <div style={{
                                    textAlign: 'center',
                                    width: '100%'
                                }}>
                                    <h3 style={{
                                        color: 'var(--secondary-text)',
                                        fontSize: '0.875rem',
                                        fontWeight: '600',
                                        marginBottom: '0.25rem',
                                        wordBreak: 'break-word'
                                    }}>
                                        {player.playerName}
                                    </h3>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Oyuncu Sayısı */}
                    {playerList.length > 0 && (
                        <div style={{
                            marginTop: '1.5rem',
                            textAlign: 'center',
                            padding: '0.75rem',
                            backgroundColor: 'var(--background)',
                            borderRadius: '0.75rem',
                            border: '1px solid var(--border)',
                            color: 'var(--text)',
                            fontSize: '0.875rem',
                            fontWeight: '500'
                        }}>
                            {playerList.length} oyuncu bekleme odasında
                        </div>
                    )}

                    <style>{`
                        @keyframes slideIn {
                            from {
                                opacity: 0;
                                transform: translateY(10px);
                            }
                            to {
                                opacity: 1;
                                transform: translateY(0);
                            }
                        }
                        @keyframes fadeIn {
                            from {
                                opacity: 0;
                            }
                            to {
                                opacity: 1;
                            }
                        }
                    `}</style>
                </div>
            </main>
        );
    }

    // 2. Quiz yükleniyorsa loading göster
    if (loading) {
        return (
            <main style={{
                width: '100%',
                height: 'calc(100vh - 3.5rem)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'var(--background)',
                fontFamily: 'cursive'
            }}>
                <div style={{
                    textAlign: 'center',
                    color: 'var(--secondary-text)'
                }}>
                    <div style={{
                        width: '3rem',
                        height: '3rem',
                        border: '4px solid var(--border)',
                        borderTop: '4px solid var(--text)',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 1rem auto'
                    }}></div>
                    <p>Quiz yükleniyor...</p>
                </div>
            </main>
        );
    }

    // 3. Quiz verisi yoksa veya hata varsa hata göster
    if (error || !quiz) {
        return (
            <main style={{
                width: '100%',
                height: 'calc(100vh - 3.5rem)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'var(--background)',
                fontFamily: 'cursive'
            }}>
                <div style={{
                    textAlign: 'center',
                    color: 'var(--secondary-text)',
                    padding: '2rem'
                }}>
                    <div style={{
                        fontSize: '3rem',
                        marginBottom: '1rem'
                    }}>😞</div>
                    <h2 style={{
                        fontSize: '1.5rem',
                        marginBottom: '1rem'
                    }}>Quiz Yüklenemedi</h2>
                    <p>{error || 'Quiz verileri bulunamadı'}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        style={{
                            marginTop: '1rem',
                            padding: '0.5rem 1rem',
                            backgroundColor: 'var(--text)',
                            color: 'var(--secondary-bg)',
                            border: 'none',
                            borderRadius: '0.5rem',
                            cursor: 'pointer'
                        }}
                    >
                        Yeniden Dene
                    </button>
                </div>
            </main>
        );
    }

    // Quiz sorularının mevcut olup olmadığını kontrol et
    if (quiz?.totalQuestions === 0) {
        return (
            <main style={{
                width: '100%',
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'var(--background)',
                fontFamily: 'cursive'
            }}>
                <div style={{
                    textAlign: 'center',
                    color: 'var(--secondary-text)'
                }}>
                    <p>Bu quiz'de henüz soru bulunmamaktadır.</p>
                </div>
            </main>
        );
    }

    if(showFeedback){
        return(
            <main style={{
                width: '100%',
                height: 'calc(100vh + 11rem)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'var(--background)',
                fontFamily: 'cursive',
                padding: '2rem'
            }}>
                <div style={{
                    width: '100%',
                    maxWidth: '48rem',
                    padding: '2rem',
                    backgroundColor: 'var(--secondary-bg)',
                    borderRadius: '1rem',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    border: '2px solid var(--border)',
                    animation: 'slideUp 0.5s ease-out'
                }}>
                    {/* Header */}
                    <div style={{ textAlign: 'center', marginTop: '1rem', marginBottom: '1rem'}}>
                        <h2 style={{
                            fontSize: '2rem',
                            fontWeight: 'bold',
                            color: 'var(--secondary-text)',
                            marginBottom: '0.5rem'
                        }}>
                            🏆 Skor Tablosu
                        </h2>
                        <p style={{
                            color: 'var(--text)',
                            fontSize: '1rem'
                        }}>
                            Soru {quiz?.questionCount} / {quiz?.totalQuestions} tamamlandı
                        </p>

                        {quiz?.questionCount < quiz?.totalQuestions ? (
                            <div style={{
                                color: 'var(--text)',
                                fontSize: '0.875rem',
                                fontStyle: 'italic'
                            }}>
                                Sonraki soru otomatik olarak gelecek...
                            </div>
                        ) : (
                            <div style={{
                                padding: '1rem',
                                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                borderRadius: '0.75rem',
                                border: '1px solid #10b981',
                                color: '#10b981',
                                fontWeight: '600'
                            }}>
                                🎉 Quiz tamamlandı!
                            </div>
                        )}

                    </div>

                    {/* Oyuncu Listesi - Puana Göre Sıralı */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem',
                        maxHeight: '400px',
                        overflowY: 'auto',
                        padding: '1rem',
                        backgroundColor: 'var(--background)',
                        borderRadius: '0.75rem',
                        border: '1px solid var(--border)'
                    }}>
                        {[...playerList]
                            .sort((a, b) => (b.playerScore || 0) - (a.playerScore || 0)) // Puana göre azalan sıralama
                            .map((player, index) => {
                                const isCurrentUser = player.playerName === username;
                                const position = index + 1;
                                
                                // Pozisyon renklerini belirle
                                let positionColor = 'var(--text)';
                                let positionBg = 'var(--background)';
                                
                                if (position === 1) {
                                    positionColor = '#FFD700';
                                    positionBg = 'rgba(255, 215, 0, 0.1)';
                                } else if (position === 2) {
                                    positionColor = '#C0C0C0';
                                    positionBg = 'rgba(192, 192, 192, 0.1)';
                                } else if (position === 3) {
                                    positionColor = '#CD7F32';
                                    positionBg = 'rgba(205, 127, 50, 0.1)';
                                }

                                return (
                                    <div key={index} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '1rem',
                                        backgroundColor: isCurrentUser ? 'rgba(59, 130, 246, 0.1)' : 'var(--secondary-bg)',
                                        borderRadius: '0.75rem',
                                        border: isCurrentUser ? '2px solid #3b82f6' : '1px solid var(--border)',
                                        animation: `slideInDelay 0.3s ease-out ${index * 0.1}s both`,
                                        transition: 'transform 0.2s, box-shadow 0.2s'
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.transform = 'translateX(4px)';
                                        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.transform = 'translateX(0)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}>
                                        
                                        {/* Pozisyon Numarası */}
                                        <div style={{
                                            width: '2.5rem',
                                            height: '2.5rem',
                                            backgroundColor: positionBg,
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginRight: '1rem',
                                            border: `2px solid ${positionColor}`,
                                            fontSize: '1rem',
                                            fontWeight: 'bold',
                                            color: positionColor
                                        }}>
                                            {position === 1 ? '🥇' : position === 2 ? '🥈' : position === 3 ? '🥉' : position}
                                        </div>

                                        {/* Oyuncu Avatar */}
                                        <div style={{
                                            width: '3rem',
                                            height: '3rem',
                                            backgroundColor: `hsl(${player.playerName.charCodeAt(0) * 7}, 70%, 65%)`,
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontWeight: 'bold',
                                            fontSize: '1.25rem',
                                            marginRight: '1rem',
                                            border: '2px solid white',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                        }}>
                                            {player.playerName.charAt(0).toUpperCase()}
                                        </div>

                                        {/* Oyuncu Bilgileri */}
                                        <div style={{ flex: 1 }}>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                marginBottom: '0.25rem'
                                            }}>
                                                <h3 style={{
                                                    color: isCurrentUser ? '#3b82f6' : 'var(--secondary-text)',
                                                    fontSize: '1rem',
                                                    fontWeight: '600',
                                                    margin: 0
                                                }}>
                                                    {player.playerName}
                                                </h3>
                                                {isCurrentUser && (
                                                    <span style={{
                                                        fontSize: '0.75rem',
                                                        backgroundColor: '#3b82f6',
                                                        color: 'white',
                                                        padding: '0.125rem 0.5rem',
                                                        borderRadius: '9999px',
                                                        fontWeight: '500'
                                                    }}>
                                                        SİZ
                                                    </span>
                                                )}
                                            </div>
                                            <div style={{
                                                color: 'var(--text)',
                                                fontSize: '0.875rem'
                                            }}>
                                                {player.playerScore || 0} puan
                                            </div>
                                        </div>

                                        {/* Puan Badge */}
                                        <div style={{
                                            backgroundColor: position <= 3 ? positionBg : 'var(--background)',
                                            color: position <= 3 ? positionColor : 'var(--text)',
                                            padding: '0.5rem 1rem',
                                            borderRadius: '0.5rem',
                                            fontWeight: 'bold',
                                            fontSize: '1.125rem',
                                            border: `1px solid ${position <= 3 ? positionColor : 'var(--border)'}`
                                        }}>
                                            {player.playerScore || 0}
                                        </div>
                                    </div>
                                );
                            })}
                    </div>

                    {showFeedback && (
                        <div style={{
                            marginTop: '1.5rem',
                            padding: '1rem',
                            borderRadius: '0.5rem',
                            border: '2px solid',
                            borderColor: isCorrect ? '#10b981' : '#ef4444',
                            backgroundColor: isCorrect ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            marginBottom: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            {isCorrect ? (
                                <>
                                    <svg style={{ width: '1.25rem', height: '1.25rem', color: '#10b981' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span style={{ color: '#10b981', fontWeight: '500' }}>Doğru bildin! 🎉</span>
                                </>
                            ) : (
                                <>
                                    <svg style={{ width: '1.25rem', height: '1.25rem', color: '#ef4444' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    <span style={{ color: '#ef4444', fontWeight: '500' }}>Yanlış bildin!</span>
                                </>
                            )}
                        </div>
                    )}

                    {/* Progress Bar */}
                    <div style={{
                        marginTop: '1.5rem',
                        padding: '1rem',
                        backgroundColor: 'var(--background)',
                        borderRadius: '0.75rem',
                        border: '1px solid var(--border)'
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '0.5rem'
                        }}>
                            <span style={{
                                color: 'var(--text)',
                                fontSize: '0.875rem',
                                fontWeight: '500'
                            }}>
                                Quiz İlerlemesi
                            </span>
                            <span style={{
                                color: 'var(--text)',
                                fontSize: '0.875rem',
                                fontWeight: 'bold'
                            }}>
                                {Math.round(((quiz?.questionCount) / quiz?.totalQuestions) * 100)}%
                            </span>
                        </div>
                        <div style={{
                            width: '100%',
                            backgroundColor: 'var(--secondary-bg)',
                            borderRadius: '9999px',
                            height: '0.5rem',
                            border: '1px solid var(--border)',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                backgroundColor: '#10b981',
                                height: '100%',
                                borderRadius: '9999px',
                                transition: 'width 0.5s ease-out',
                                width: `${((quiz?.questionCount) / quiz?.totalQuestions) * 100}%`
                            }}></div>
                        </div>
                    </div>

                    {/* Sonraki Soru Butonu veya Bitiş Mesajı */}
                    <div style={{
                        marginTop: '1.5rem',
                        textAlign: 'center'
                    }}>
                    </div>

                    {/* CSS Animasyonları */}
                    <style>{`
                        @keyframes slideUp {
                            from {
                                opacity: 0;
                                transform: translateY(20px);
                            }
                            to {
                                opacity: 1;
                                transform: translateY(0);
                            }
                        }
                        
                        @keyframes slideInDelay {
                            from {
                                opacity: 0;
                                transform: translateX(-20px);
                            }
                            to {
                                opacity: 1;
                                transform: translateX(0);
                            }
                        }
                    `}</style>
                </div>
            </main>
        )
    }

    if(isGameStarted){
        return (
            <main style={{
                width: '100%',
                height: 'calc(100vh - 3.5rem)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'var(--background)',
                fontFamily: 'cursive',
                position: 'relative'
            }}>
                <div style={{
                    width: '100%',
                    maxWidth: '42rem',
                    padding: '1.5rem',
                    backgroundColor: 'var(--secondary-bg)',
                    borderRadius: '1rem',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    border: `2px solid var(--border)`,
                    margin: '0 1rem'
                }}>

                    {/* Progress Header */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '1rem'
                        }}>
                            <span style={{
                                fontSize: '0.875rem',
                                color: 'var(--text)',
                                fontWeight: '500'
                            }}>
                                Soru {quiz?.questionCount} / {quiz?.totalQuestions}
                            </span>
                            <span style={{
                                fontSize: '0.875rem',
                                color: 'var(--text)',
                                fontWeight: 'bold'
                            }}>
                                {timer}s
                            </span>
                        </div>
                        
                        {/* Progress Bar */}
                        <div style={{
                            width: '100%',
                            backgroundColor: 'var(--background)',
                            borderRadius: '9999px',
                            height: '0.5rem',
                            border: `1px solid var(--border)`
                        }}>
                            <div style={{
                                backgroundColor: 'var(--text)',
                                height: '100%',
                                borderRadius: '9999px',
                                transition: 'all 1s',
                                width: `${(timer / 30) * 100}%`
                            }}></div>
                        </div>

                                        
                        {/* Soru Metni */}
                        <h2 style={{
                            fontSize: '1.25rem',
                            fontWeight: 'bold',
                            color: 'var(--secondary-text)',
                            lineHeight: '1.6',
                            marginBottom: '1.5rem'
                        }}>
                            {quiz?.question}
                        </h2>
                    </div>
                    
                    {/* Question */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {quiz?.answers.map((option, index) => {
                            // Option'ın string mi obje mi olduğunu kontrol et
                            const optionText = typeof option === 'string' ? option : option.answer;
                            const optionImg = typeof option === 'object' ? option.img : null;
                            
                            let buttonStyle = {
                                width: '100%',
                                padding: '1rem',
                                textAlign: 'left',
                                borderRadius: '0.5rem',
                                border: '2px solid',
                                transition: 'all 0.2s',
                                cursor: selectedAnswer !== null ? 'default' : 'pointer',
                                backgroundColor: 'var(--background)',
                                color: 'var(--secondary-text)'
                            };

                            let circleStyle = {
                                width: '1.5rem',
                                height: '1.5rem',
                                borderRadius: '50%',
                                border: '2px solid',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.75rem',
                                fontWeight: 'bold'
                            };

                            if (selectedAnswer === null) {
                                buttonStyle.borderColor = 'var(--border)';
                                circleStyle.borderColor = 'var(--border)';
                                circleStyle.color = 'var(--text)';
                            } else if (selectedAnswer === index) {
                                buttonStyle.borderColor = '#3b82f6'; // Mavi vurgulu kenarlık
                                buttonStyle.backgroundColor = 'rgba(59, 130, 246, 0.08)'; // Hafif mavi arka plan
                                buttonStyle.color = '#3b82f6';
                                circleStyle.borderColor = '#3b82f6';
                                circleStyle.backgroundColor = '#3b82f6';
                                circleStyle.color = 'white';
                            } else {
                                buttonStyle.borderColor = 'var(--border)';
                                buttonStyle.backgroundColor = 'var(--secondary-bg)';
                                buttonStyle.color = 'var(--text)';
                                circleStyle.borderColor = 'var(--border)';
                                circleStyle.color = 'var(--text)';
                            }

                            return (
                                <button
                                    key={index}
                                    onClick={() => handleAnswerClick(index)}    
                                    style={buttonStyle}
                                    onMouseOver={(e) => {
                                        if (selectedAnswer === null) {
                                            e.target.style.borderColor = 'var(--text)';
                                            e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                                        }
                                    }}
                                    onMouseOut={(e) => {
                                        if (selectedAnswer === null) {
                                            e.target.style.borderColor = 'var(--border)';
                                            e.target.style.boxShadow = 'none';
                                        }
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <span style={circleStyle}>
                                            {String.fromCharCode(65 + index)}
                                        </span>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <span style={{ fontWeight: '500' }}>{optionText}</span>
                                            {optionImg && (
                                                <img 
                                                    src={optionImg} 
                                                    alt={`Seçenek ${String.fromCharCode(65 + index)}`}
                                                    style={{
                                                        maxWidth: '100px',
                                                        maxHeight: '60px',
                                                        borderRadius: '0.25rem',
                                                        objectFit: 'contain'
                                                    }}
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                    }}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </button>
                            );
                        })}

                        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                            <button
                                onClick={handleConfirmAnswer}
                                disabled={selectedAnswer === null || answerSent}
                                style={{
                                    padding: '0.75rem 2rem',
                                    fontSize: '1rem',
                                    fontWeight: 'bold',
                                    borderRadius: '0.5rem',
                                    backgroundColor: selectedAnswer !== null && !answerSent ? '#3b82f6' : '#d1d5db',
                                    color: selectedAnswer !== null && !answerSent ? 'white' : '#6b7280',
                                    border: 'none',
                                    cursor: selectedAnswer !== null && !answerSent ? 'pointer' : 'not-allowed',
                                    transition: 'all 0.2s'
                                }}
                            >
                                Onayla
                            </button>
                        </div>
                    </div>            

                    {/* Feedback */}
                    {showFeedback && (
                        <div style={{
                            padding: '1rem',
                            borderRadius: '0.5rem',
                            border: '2px solid',
                            borderColor: selectedAnswer === '#ef4444',
                            backgroundColor: selectedAnswer === 'rgba(16, 185, 129, 0.1)' ,
                            marginBottom: '1rem'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <>
                                    <svg style={{ width: '1.25rem', height: '1.25rem', color: '#10b981' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span style={{ color: '#10b981', fontWeight: '500' }}>Cevap! 🎉</span>
                                </>
                            </div>
                        </div>
                    )}
                </div>

                {/* Ses Kontrol Butonu */}
                <button 
                    onClick={toggleMusic}
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        padding: '0.5rem',
                        borderRadius: '50%',
                        backgroundColor: 'var(--secondary-bg)',
                        border: `1px solid var(--border)`,
                        cursor: 'pointer',
                        fontSize: '1.25rem',
                        transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => {
                        e.target.style.backgroundColor = 'var(--background)';
                    }}
                    onMouseOut={(e) => {
                        e.target.style.backgroundColor = 'var(--secondary-bg)';
                    }}
                >
                    {isMuted ? "🔇" : "🔊"}
                </button>

                {/* CSS animation için style tag */}
                <style>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </main>
        );
    };

    if (showResult) {
        return (
            <main style={{
                width: '100%',
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'var(--background)',
                fontFamily: 'cursive'
            }}>
                <div style={{
                    width: '24rem',
                    padding: '1.5rem',
                    backgroundColor: 'var(--secondary-bg)',
                    borderRadius: '1rem',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    border: `2px solid var(--border)`
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{
                            width: '4rem',
                            height: '4rem',
                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1rem auto',
                            border: '2px solid #10b981'
                        }}>
                            <svg style={{ width: '2rem', height: '2rem', color: '#10b981' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        
                        <h2 style={{
                            fontSize: '2rem',
                            fontWeight: 'bold',
                            color: 'var(--secondary-text)',
                            marginBottom: '0.5rem'
                        }}>
                            Quiz Tamamlandı!
                        </h2>
    
                        <div style={{ marginBottom: '1.5rem' }}>
                            <p style={{
                                fontSize: '3rem',
                                fontWeight: 'bold',
                                color: 'var(--text)',
                                marginBottom: '0.5rem'
                            }}>
                                {score} / {quiz?.totalQuestions}
                            </p>
                            <p style={{
                                fontSize: '0.875rem',
                                color: 'var(--text)'
                            }}>
                                Başarı Oranı: {Math.round((score / quiz?.totalQuestions) * 100)}%
                            </p>
                        </div>
                        
                        <div style={{ paddingTop: '1rem' }}>
                            <button
                                onClick={restartQuiz}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem',
                                    backgroundColor: 'var(--text)',
                                    color: 'var(--secondary-bg)',
                                    fontWeight: '500',
                                    borderRadius: '0.5rem',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '1rem',
                                    transition: 'all 0.3s',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }}
                                onMouseOver={(e) => {
                                    e.target.style.backgroundColor = 'var(--secondary-text)';
                                    e.target.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.backgroundColor = 'var(--text)';
                                    e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                                }}
                            >
                                Tekrar Başla
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        );
    }
}

export default Quiz;