import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";

const Quiz = () => {
    const backgroundMusic = useRef(new Audio('/background-music.mp3'));

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [timer, setTimer] = useState(30);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [isMuted, setIsMuted] = useState(false);

    // Örnek quiz soruları
    const questions = [
        {
            question: "JavaScript'te 'let' ve 'const' arasındaki fark nedir?",
            options: [
                "let yeniden atanabilir, const atanamazken",
                "const değişkenler her zaman null'dır",
                "let global scope'ta çalışır, const çalışmaz",
                "Hiçbir fark yoktur"
            ],
            correctAnswer: 0
        },
        {
            question: "React'ta 'state' ve 'props' arasındaki temel fark nedir?",
            options: [
                "State sadece class componentlerde kullanılır",
                "Props değiştirilebilir, state değiştirilemez",
                "State component içinde değiştirilebilir, props üst componentten gelir",
                "Hiçbir fark yoktur"
            ],
            correctAnswer: 2
        },
        {
            question: "HTML5'te yeni eklenen input tipleri hangileridir?",
            options: [
                "text, password, submit",
                "date, email, tel, number",
                "checkbox, radio, file",
                "button, reset, hidden"
            ],
            correctAnswer: 1
        },
        {
            question: "CSS'te 'flexbox' özelliği ne işe yarar?",
            options: [
                "Sadece metin hizalama için kullanılır",
                "Grid sistemini tamamen değiştirir",
                "Elementleri esnek bir şekilde düzenler ve hizalar",
                "Sadece resimleri konumlandırmak için kullanılır"
            ],
            correctAnswer: 2
        }
    ];

    useEffect(() => {
        // Müziği döngüye al
        backgroundMusic.current.loop = true;
        
        // Quiz başladığında müziği çal
        if (!showResult) {
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
    }, [showResult]);

    useEffect(() => {
        let interval = null;
        if (!showResult && timer > 0 && !showFeedback) {
            interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        } else if (timer === 0) {
            handleNextQuestion();
        }
        return () => clearInterval(interval);
    }, [timer, showResult, showFeedback]);

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
    }, []);

    // Ses kontrolü için bir toggle fonksiyonu
    const toggleMusic = () => {
        if (isMuted) {
            backgroundMusic.current.play();
        } else {
            backgroundMusic.current.pause();
        }
        setIsMuted(!isMuted);
    };

    if (showResult) {
        return (
            <main className="w-full h-screen flex self-center place-content-center place-items-center bg-gray-50">
                <div className="w-96 space-y-5 p-6 shadow-xl border-2 border-gray-200 rounded-2xl bg-white">
                    <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        
                        <h2 className="text-2xl font-bold text-gray-800">Quiz Tamamlandı!</h2>
                        
                        <div className="space-y-2">
                            <p className="text-3xl font-bold text-indigo-600">
                                {score} / {questions.length}
                            </p>
                            <p className="text-sm text-gray-600">
                                Başarı Oranı: {Math.round((score / questions.length) * 100)}%
                            </p>
                        </div>
                        
                        <div className="pt-4">
                            <button
                                onClick={restartQuiz}
                                className="w-full px-4 py-2 text-white font-medium rounded-lg bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl transition duration-300"
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
        <main className="w-full h-screen flex self-center place-content-center place-items-center bg-gray-50">
            <div className="w-full max-w-2xl space-y-5 p-6 shadow-xl border-2 border-gray-200 rounded-2xl bg-white mx-4">
                
                {/* Header */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 font-medium">
                            Soru {currentQuestionIndex + 1} / {questions.length}
                        </span>
                        <span className="text-sm text-indigo-600 font-bold">
                            {timer}s
                        </span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                            className="bg-indigo-600 h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${(timer / 30) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* Question */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-800 leading-relaxed">
                        {questions[currentQuestionIndex].question}
                    </h2>

                    {/* Options */}
                    <div className="space-y-3">
                        {questions[currentQuestionIndex].options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleAnswerClick(index)}
                                disabled={selectedAnswer !== null}
                                className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                                    selectedAnswer === null 
                                        ? 'border-gray-200 hover:border-indigo-400 hover:shadow-md bg-white text-gray-700'
                                        : selectedAnswer === index
                                            ? index === questions[currentQuestionIndex].correctAnswer
                                                ? 'border-green-500 bg-green-50 text-green-800'
                                                : 'border-red-500 bg-red-50 text-red-800'
                                            : index === questions[currentQuestionIndex].correctAnswer
                                                ? 'border-green-500 bg-green-50 text-green-800'
                                                : 'border-gray-200 bg-gray-50 text-gray-500'
                                }`}
                            >
                                <div className="flex items-center space-x-3">
                                    <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                                        selectedAnswer === null 
                                            ? 'border-gray-300 text-gray-500'
                                            : selectedAnswer === index
                                                ? index === questions[currentQuestionIndex].correctAnswer
                                                    ? 'border-green-500 bg-green-500 text-white'
                                                    : 'border-red-500 bg-red-500 text-white'
                                                : index === questions[currentQuestionIndex].correctAnswer
                                                    ? 'border-green-500 bg-green-500 text-white'
                                                    : 'border-gray-300 text-gray-400'
                                    }`}>
                                        {String.fromCharCode(65 + index)}
                                    </span>
                                    <span className="font-medium">{option}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Feedback */}
                {showFeedback && (
                    <div className={`p-4 rounded-lg border-2 ${
                        selectedAnswer === questions[currentQuestionIndex].correctAnswer
                            ? 'border-green-200 bg-green-50'
                            : 'border-red-200 bg-red-50'
                    }`}>
                        <div className="flex items-center space-x-2">
                            {selectedAnswer === questions[currentQuestionIndex].correctAnswer ? (
                                <>
                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-green-800 font-medium">Doğru cevap! 🎉</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-red-800 font-medium">Yanlış cevap! 😢</span>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* Ses Kontrol Butonu */}
                <div className="absolute top-30 right-30">
                    <button 
                        onClick={toggleMusic}
                        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                    >
                        {isMuted ? "🔇" : "🔊"}
                    </button>
                </div>
            </div>
        </main>
    );
};

export default Quiz;