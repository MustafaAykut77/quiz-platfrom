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

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [timer, setTimer] = useState(30);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [quizData, setQuizData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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

    // Socket bağlantısı ve setUsername işlemi
    useEffect(() => {
        if (!isGameExists) return;

        socket.connect();
        socket.on('connect', () => {
            console.log('Socket bağlantısı başarılı:', socket.id);
            socket.emit('join_game', code);
        });

        socket.on('user_joined', () => {
            console.log('Kullanıcı katıldı.');
            // Name elde etme ui elementini entegre et
            setUsername("Sliman");
            socket.off('user_joined');
        });

        return () => {
            socket.off('connect');
            socket.off('user_joined');
            socket.disconnect();
        };
    }, [isGameExists]);

    // Socket üzerinden kullanıcı adını belirleme
    useEffect(() => {
        if (!username) return;
        socket.emit('set_username', username);

        socket.on('username_set', (name) => {
            console.log('Kullanıcı adı ayarlandı:', name);
            // Bekleme ekranı gelecek burada bi süre bekleyebilir.
            setIsGameWaiting(true);
            socket.off('username_set');
        });

        return () => {
            socket.off('username_set');
        };
    }, [username]);

    // Kullanıcı oyuna girdiğinde socket üzerinden bildirim gönderme
    useEffect(() => {
        if (!isGameWaiting) return;

        socket.on('user_entered', (username) => {
            console.log(`${username} oyuna girdi.`);
            // Burada kullanıcı arayüzüne bildirim ekleyebilirsiniz
        });

        socket.on('start_game', () => {
            console.log('Oyun başlatılıyor...');
            // Oyun başladığında gerekli işlemleri yapabilirsiniz
            setIsGameStarted(true);
        });

    }, [isGameWaiting]);

    // Oyun başladığında gerekli işlemleri yapma
    useEffect(() => {
        if (!isGameStarted) return;

        // Oyun socketleri

    }, [isGameStarted]);

    // // Quiz verilerini çekme
    // useEffect(() => {
    //     const fetchQuizData = async () => {
    //         try {
    //             setLoading(true);
    //             const response = await getQuiz(quizId); // QuizCode yerine quizId kullan
                
    //             if (response && response.success) {
    //                 setQuizData(response.data);
    //                 console.log('Quiz verileri:', response.data);
    //             } else {
    //                 setError('Quiz verileri alınamadı');
    //                 console.error('Quiz fetch hatası:', response);
    //             }
    //         } catch (err) {
    //             setError('Quiz yüklenirken hata oluştu');
    //             console.error('Quiz fetch hatası:', err);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     if (quizId) { // quizId varsa fetch işlemini başlat
    //         fetchQuizData();
    //     }
    // }, [quizId]); // dependency array'e quizId ekle

    // Quiz soruları - API'den gelen verileri uygun formata çevirme
    const questions = quizData?.questions?.map(q => ({
        question: q.question,
        options: q.answers?.map(a => a.answer) || [],
        correctAnswer: q.answers?.findIndex(a => a.isCorrect) || 0,
        image: q.img || null
    })) || [];

    useEffect(() => {
        // Müziği döngüye al
        backgroundMusic.current.loop = true;
        
        // Quiz başladığında müziği çal
        if (!showResult && quizData) {
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
    }, [showResult, quizData]);

    useEffect(() => {
        let interval = null;
        if (!showResult && timer > 0 && !showFeedback && questions.length > 0) {
            interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        } else if (timer === 0 && questions.length > 0) {
            handleNextQuestion();
        }
        return () => clearInterval(interval);
    }, [timer, showResult, showFeedback, questions.length]);

    // Ses çalma fonksiyonu
    const playSound = (isCorrect) => {
        const audio = new Audio(isCorrect ? '/correct.mp3' : '/wrong.mp3');
        audio.play().catch(error => {
            console.log("Ses çalma hatası:", error);
        });
    };

    const handleAnswerClick = (selectedIndex) => {
        setSelectedAnswer(selectedIndex);
        setShowFeedback(true);
        
        const isCorrect = selectedIndex === questions[currentQuestionIndex].correctAnswer;
        
        // Doğru/yanlış sesini çal
        playSound(isCorrect);
        
        if (isCorrect) {
            setScore(score + 1);
        }

        setTimeout(() => {
            handleNextQuestion();
        }, 2000);
    };

    const handleNextQuestion = () => {
        setSelectedAnswer(null);
        setShowFeedback(false);
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setTimer(30);
        } else {
            setShowResult(true);
        }
    };

    const restartQuiz = () => {
        setCurrentQuestionIndex(0);
        setScore(0);
        setShowResult(false);
        setTimer(30);
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

    // Loading durumu
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

    // Error durumu
    if (error || !quizData) {
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
    if (questions.length === 0) {
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
                            {quizData.quizName} Tamamlandı!
                        </h2>

                        <p style={{
                            fontSize: '1rem',
                            color: 'var(--text)',
                            marginBottom: '1.5rem'
                        }}>
                            Kategori: {quizData.quizCategory}
                        </p>
                        
                        <div style={{ marginBottom: '1.5rem' }}>
                            <p style={{
                                fontSize: '3rem',
                                fontWeight: 'bold',
                                color: 'var(--text)',
                                marginBottom: '0.5rem'
                            }}>
                                {score} / {questions.length}
                            </p>
                            <p style={{
                                fontSize: '0.875rem',
                                color: 'var(--text)'
                            }}>
                                Başarı Oranı: {Math.round((score / questions.length) * 100)}%
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
                
                {/* Header - Quiz adı ve kategori bilgisi */}
                <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
                    <h1 style={{
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        color: 'var(--secondary-text)',
                        marginBottom: '0.25rem'
                    }}>
                        {quizData.quizName}
                    </h1>
                    <p style={{
                        fontSize: '0.875rem',
                        color: 'var(--text)'
                    }}>
                        Kategori: {quizData.quizCategory}
                    </p>
                </div>

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
                            Soru {currentQuestionIndex + 1} / {questions.length}
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
                </div>

                {/* Question */}
                <div style={{ marginBottom: '2rem' }}>
                    {/* Soru görseli varsa göster */}
                    {questions[currentQuestionIndex].image && (
                        <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
                            <img 
                                src={questions[currentQuestionIndex].image} 
                                alt="Soru görseli"
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '200px',
                                    borderRadius: '0.5rem',
                                    objectFit: 'contain'
                                }}
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                }}
                            />
                        </div>
                    )}

                    <h2 style={{
                        fontSize: '1.25rem',
                        fontWeight: 'bold',
                        color: 'var(--secondary-text)',
                        lineHeight: '1.6',
                        marginBottom: '1.5rem'
                    }}>
                        {questions[currentQuestionIndex].question}
                    </h2>

                    {/* Options */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {questions[currentQuestionIndex].options.map((option, index) => {
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
                                if (index === questions[currentQuestionIndex].correctAnswer) {
                                    buttonStyle.borderColor = '#10b981';
                                    buttonStyle.backgroundColor = 'rgba(16, 185, 129, 0.1)';
                                    buttonStyle.color = '#10b981';
                                    circleStyle.borderColor = '#10b981';
                                    circleStyle.backgroundColor = '#10b981';
                                    circleStyle.color = 'white';
                                } else {
                                    buttonStyle.borderColor = '#ef4444';
                                    buttonStyle.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                                    buttonStyle.color = '#ef4444';
                                    circleStyle.borderColor = '#ef4444';
                                    circleStyle.backgroundColor = '#ef4444';
                                    circleStyle.color = 'white';
                                }
                            } else if (index === questions[currentQuestionIndex].correctAnswer) {
                                buttonStyle.borderColor = '#10b981';
                                buttonStyle.backgroundColor = 'rgba(16, 185, 129, 0.1)';
                                buttonStyle.color = '#10b981';
                                circleStyle.borderColor = '#10b981';
                                circleStyle.backgroundColor = '#10b981';
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
                                    disabled={selectedAnswer !== null}
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
                                        <span style={{ fontWeight: '500' }}>{option}</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Feedback */}
                {showFeedback && (
                    <div style={{
                        padding: '1rem',
                        borderRadius: '0.5rem',
                        border: '2px solid',
                        borderColor: selectedAnswer === questions[currentQuestionIndex].correctAnswer ? '#10b981' : '#ef4444',
                        backgroundColor: selectedAnswer === questions[currentQuestionIndex].correctAnswer 
                            ? 'rgba(16, 185, 129, 0.1)' 
                            : 'rgba(239, 68, 68, 0.1)',
                        marginBottom: '1rem'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {selectedAnswer === questions[currentQuestionIndex].correctAnswer ? (
                                <>
                                    <svg style={{ width: '1.25rem', height: '1.25rem', color: '#10b981' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span style={{ color: '#10b981', fontWeight: '500' }}>Doğru cevap! 🎉</span>
                                </>
                            ) : (
                                <>
                                    <svg style={{ width: '1.25rem', height: '1.25rem', color: '#ef4444' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span style={{ color: '#ef4444', fontWeight: '500' }}>Yanlış cevap! 😢</span>
                                </>
                            )}
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

export default Quiz;
