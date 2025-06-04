import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';

const Quiz = () => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [timer, setTimer] = useState(30);
    const [selectedAnswer, setSelectedAnswer] = useState(null);

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
        let interval = null;
        if (!showResult && timer > 0) {
            interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        } else if (timer === 0) {
            handleNextQuestion();
        }
        return () => clearInterval(interval);
    }, [timer, showResult]);

    const handleAnswerClick = (selectedIndex) => {
        setSelectedAnswer(selectedIndex);
        const isCorrect = selectedIndex === questions[currentQuestionIndex].correctAnswer;
        
        if (isCorrect) {
            setScore(score + 1);
            toast.success('Doğru cevap! 🎉');
        } else {
            toast.error('Yanlış cevap! 😢');
        }

        setTimeout(() => {
            handleNextQuestion();
        }, 1000);
    };

    const handleNextQuestion = () => {
        setSelectedAnswer(null);
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
    };

    if (showResult) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 p-4">
                <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
                    <h2 className="text-2xl font-bold text-center mb-6">Quiz Tamamlandı! 🎉</h2>
                    <p className="text-xl text-center mb-4">
                        Skorunuz: {score} / {questions.length}
                    </p>
                    <p className="text-center mb-6">
                        Başarı Oranı: {Math.round((score / questions.length) * 100)}%
                    </p>
                    <Button 
                        onClick={restartQuiz}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                        Tekrar Başla
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 p-4">
            <div className="bg-white rounded-lg shadow-xl p-8 max-w-3xl w-full">
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-semibold">
                            Soru {currentQuestionIndex + 1}/{questions.length}
                        </span>
                        <span className="text-lg font-semibold text-purple-600">
                            Süre: {timer}s
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                            className="bg-purple-600 h-2.5 rounded-full transition-all duration-1000"
                            style={{ width: `${(timer / 30) * 100}%` }}
                        ></div>
                    </div>
                </div>

                <h2 className="text-xl font-bold mb-6">
                    {questions[currentQuestionIndex].question}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {questions[currentQuestionIndex].options.map((option, index) => (
                        <Button
                            key={index}
                            onClick={() => handleAnswerClick(index)}
                            disabled={selectedAnswer !== null}
                            className={`h-24 text-lg p-4 transition-all duration-200 ${
                                selectedAnswer === null 
                                    ? 'hover:scale-105'
                                    : selectedAnswer === index
                                        ? index === questions[currentQuestionIndex].correctAnswer
                                            ? 'bg-green-500 hover:bg-green-600'
                                            : 'bg-red-500 hover:bg-red-600'
                                        : index === questions[currentQuestionIndex].correctAnswer
                                            ? 'bg-green-500 hover:bg-green-600'
                                            : ''
                            }`}
                        >
                            {option}
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Quiz;