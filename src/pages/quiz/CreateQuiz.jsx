import React, { useState } from 'react';
import { Plus, Trash2, Save, Eye, EyeOff } from 'lucide-react';

const QuizCreator = () => {
  const [quiz, setQuiz] = useState({
    quizid: '',
    creatorid: '',
    quizName: '',
    quizCategory: '',
    isPrivate: false,
    questions: []
  });

  const [errors, setErrors] = useState({});

  // Yeni soru ekleme
  const addQuestion = () => {
    const newQuestion = {
      question: '',
      img: '',
      answers: [
        { answer: '', img: '', isCorrect: false },
        { answer: '', img: '', isCorrect: false }
      ]
    };
    
    setQuiz(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
  };

  // Soru silme
  const removeQuestion = (questionIndex) => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions.filter((_, index) => index !== questionIndex)
    }));
  };

  // Soru güncelleme
  const updateQuestion = (questionIndex, field, value) => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions.map((q, index) => 
        index === questionIndex ? { ...q, [field]: value } : q
      )
    }));
  };

  // Cevap ekleme
  const addAnswer = (questionIndex) => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions.map((q, index) => 
        index === questionIndex 
          ? { ...q, answers: [...q.answers, { answer: '', img: '', isCorrect: false }] }
          : q
      )
    }));
  };

  // Cevap silme
  const removeAnswer = (questionIndex, answerIndex) => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions.map((q, index) => 
        index === questionIndex 
          ? { ...q, answers: q.answers.filter((_, aIndex) => aIndex !== answerIndex) }
          : q
      )
    }));
  };

  // Cevap güncelleme
  const updateAnswer = (questionIndex, answerIndex, field, value) => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions.map((q, qIndex) => 
        qIndex === questionIndex 
          ? {
              ...q,
              answers: q.answers.map((a, aIndex) => 
                aIndex === answerIndex ? { ...a, [field]: value } : a
              )
            }
          : q
      )
    }));
  };

  // Doğru cevap seçme (sadece bir tane olabilir)
  const setCorrectAnswer = (questionIndex, answerIndex) => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions.map((q, qIndex) => 
        qIndex === questionIndex 
          ? {
              ...q,
              answers: q.answers.map((a, aIndex) => 
                ({ ...a, isCorrect: aIndex === answerIndex })
              )
            }
          : q
      )
    }));
  };

  // Form validasyonu
  const validateForm = () => {
    const newErrors = {};

    if (!quiz.quizName || quiz.quizName.length < 2 || quiz.quizName.length > 50) {
      newErrors.quizName = 'Quiz adı 2-50 karakter arasında olmalıdır';
    }

    if (!quiz.quizCategory || quiz.quizCategory.length < 2 || quiz.quizCategory.length > 50) {
      newErrors.quizCategory = 'Kategori 2-50 karakter arasında olmalıdır';
    }

    if (!quiz.creatorid) {
      newErrors.creatorid = 'Oluşturan ID gereklidir';
    }

    if (quiz.questions.length === 0) {
      newErrors.questions = 'En az bir soru eklemelisiniz';
    }

    quiz.questions.forEach((q, qIndex) => {
      if (!q.question || q.question.length < 2) {
        newErrors[`question_${qIndex}`] = 'Soru metni en az 2 karakter olmalıdır';
      }

      if (q.answers.length < 2) {
        newErrors[`answers_${qIndex}`] = 'En az 2 cevap seçeneği olmalıdır';
      }

      const hasCorrectAnswer = q.answers.some(a => a.isCorrect);
      if (!hasCorrectAnswer) {
        newErrors[`correct_${qIndex}`] = 'Bir doğru cevap seçmelisiniz';
      }

      q.answers.forEach((a, aIndex) => {
        if (!a.answer || a.answer.length < 1) {
          newErrors[`answer_${qIndex}_${aIndex}`] = 'Cevap boş olamaz';
        }
      });
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Quiz kaydetme
  const saveQuiz = async () => {
    if (validateForm()) {
      const quizData = {
        ...quiz,
        quizid: quiz.quizid || `quiz_${Date.now()}`, // otomatik ID oluştur
      };
      
      try {
        const response = await fetch('/api/quizzes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(quizData)
        });

        const result = await response.json();

        if (result.success) {
          alert('Quiz başarıyla oluşturuldu!');
          console.log('Kaydedilen quiz:', result.data);
          
          // Formu temizle
          setQuiz({
            quizid: '',
            creatorid: '',
            quizName: '',
            quizCategory: '',
            isPrivate: false,
            questions: []
          });
          setErrors({});
        } else {
          alert('Quiz oluşturulurken hata oluştu: ' + result.message);
        }
      } catch (error) {
        console.error('API çağrısı hatası:', error);
        alert('Quiz oluşturulurken hata oluştu. Lütfen tekrar deneyin.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            🎯 Yeni Quiz Oluştur
          </h1>

          {/* Quiz Temel Bilgileri */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Quiz Bilgileri</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quiz Adı *
                </label>
                <input
                  type="text"
                  value={quiz.quizName}
                  onChange={(e) => setQuiz(prev => ({ ...prev, quizName: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="Quiz adını girin..."
                  maxLength={50}
                />
                {errors.quizName && <p className="text-red-500 text-sm mt-1">{errors.quizName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori *
                </label>
                <input
                  type="text"
                  value={quiz.quizCategory}
                  onChange={(e) => setQuiz(prev => ({ ...prev, quizCategory: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="Kategori girin..."
                  maxLength={50}
                />
                {errors.quizCategory && <p className="text-red-500 text-sm mt-1">{errors.quizCategory}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Oluşturan ID *
                </label>
                <input
                  type="text"
                  value={quiz.creatorid}
                  onChange={(e) => setQuiz(prev => ({ ...prev, creatorid: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="Kullanıcı ID'nizi girin..."
                />
                {errors.creatorid && <p className="text-red-500 text-sm mt-1">{errors.creatorid}</p>}
              </div>

              <div className="flex items-center">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={quiz.isPrivate}
                    onChange={(e) => setQuiz(prev => ({ ...prev, isPrivate: e.target.checked }))}
                    className="sr-only"
                  />
                  <div className="relative">
                    <div className={`w-12 h-6 rounded-full transition-colors ${quiz.isPrivate ? 'bg-blue-500' : 'bg-gray-300'}`}>
                      <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${quiz.isPrivate ? 'translate-x-6' : 'translate-x-0'}`}></div>
                    </div>
                  </div>
                  <span className="ml-3 text-sm font-medium text-gray-700 flex items-center">
                    {quiz.isPrivate ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
                    {quiz.isPrivate ? 'Özel Quiz' : 'Herkese Açık'}
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Sorular */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-700">
                Sorular ({quiz.questions.length})
              </h2>
              <button
                onClick={addQuestion}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Soru Ekle
              </button>
            </div>

            {errors.questions && <p className="text-red-500 text-sm mb-4">{errors.questions}</p>}

            {quiz.questions.map((question, qIndex) => (
              <div key={qIndex} className="bg-gray-50 rounded-xl p-6 mb-6 border-l-4 border-blue-500">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium text-gray-800">
                    Soru {qIndex + 1}
                  </h3>
                  <button
                    onClick={() => removeQuestion(qIndex)}
                    className="text-red-500 hover:text-red-700 p-1 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Soru Metni *
                  </label>
                  <textarea
                    value={question.question}
                    onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    rows={3}
                    placeholder="Sorunuzu yazın..."
                    maxLength={1024}
                  />
                  {errors[`question_${qIndex}`] && (
                    <p className="text-red-500 text-sm mt-1">{errors[`question_${qIndex}`]}</p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Soru Görseli (URL)
                  </label>
                  <input
                    type="url"
                    value={question.img}
                    onChange={(e) => updateQuestion(qIndex, 'img', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                {/* Cevaplar */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Cevap Seçenekleri *
                    </label>
                    <button
                      onClick={() => addAnswer(qIndex)}
                      className=" hover:text-blue-700 text-sm flex items-center transition-colors text-gray-900"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Cevap Ekle
                    </button>
                  </div>

                  {errors[`answers_${qIndex}`] && (
                    <p className="text-red-500 text-sm mb-2">{errors[`answers_${qIndex}`]}</p>
                  )}
                  {errors[`correct_${qIndex}`] && (
                    <p className="text-red-500 text-sm mb-2">{errors[`correct_${qIndex}`]}</p>
                  )}

                  {question.answers.map((answer, aIndex) => (
                    <div key={aIndex} className="bg-white rounded-lg p-4 mb-3 border">
                      <div className="flex items-start gap-3">
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <input
                              type="text"
                              value={answer.answer}
                              onChange={(e) => updateAnswer(qIndex, aIndex, 'answer', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                              placeholder={`Cevap ${aIndex + 1}`}
                              maxLength={1024}
                            />
                            {errors[`answer_${qIndex}_${aIndex}`] && (
                              <p className="text-red-500 text-xs mt-1">{errors[`answer_${qIndex}_${aIndex}`]}</p>
                            )}
                          </div>
                          <input
                            type="url"
                            value={answer.img}
                            onChange={(e) => updateAnswer(qIndex, aIndex, 'img', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                            placeholder="Cevap görseli (URL)"
                          />
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setCorrectAnswer(qIndex, aIndex)}
                            className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                              answer.isCorrect 
                                ? 'bg-green-500 text-white' 
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            {answer.isCorrect ? '✓ Doğru' : 'Doğru?'}
                          </button>
                          
                          {question.answers.length > 2 && (
                            <button
                              onClick={() => removeAnswer(qIndex, aIndex)}
                              className="text-red-500 hover:text-red-700 p-1 rounded transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Kaydet Butonu */}
          <div className="text-center">
            <button
              onClick={saveQuiz}
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold flex items-center mx-auto transition-colors"
            >
              <Save className="w-5 h-5 mr-2" />
              Quiz'i Kaydet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizCreator;