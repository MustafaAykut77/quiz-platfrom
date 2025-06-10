import React, { useState } from 'react';
import { Plus, Trash2, Save, Eye, EyeOff } from 'lucide-react';
import { useAuth } from "@/src/contexts/authContext/page";
import { createQuiz, getQuiz, getAllQuizzes } from '@/src/controllers/QuizRequest';

const QuizCreator = () => {

  const { currentUser } = useAuth()

  const [quiz, setQuiz] = useState({
    quizName: '',
    quizCategory: '',
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
      };
      
      try {
        const result = await createQuiz(quizData);

        if (result.success) {
          alert('Quiz başarıyla oluşturuldu!');
          console.log('Kaydedilen quiz:', result.data);
          
          // Formu temizle
          setQuiz({
            quizName: '',
            quizCategory: '',
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
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: 'var(--background)',
      color: 'var(--secondary-text)',
      fontFamily: 'cursive'
    }}>
      <div className="max-w-4xl mx-auto p-4">
        <div style={{
          backgroundColor: 'var(--secondary-bg)',
          borderRadius: '1rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          padding: '2rem',
          border: `1px solid var(--border)`
        }}>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: 'var(--secondary-text)',
            marginBottom: '2rem',
            textAlign: 'center'
          }}>
            🎯 Yeni Quiz Oluştur
          </h1>

          {/* Quiz Temel Bilgileri */}
          <div style={{
            backgroundColor: 'var(--background)',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            marginBottom: '2rem',
            border: `1px solid var(--border)`
          }}>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: 'var(--secondary-text)',
              marginBottom: '1rem'
            }}>
              Quiz Bilgileri
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: 'var(--text)',
                  marginBottom: '0.5rem'
                }}>
                  Quiz Adı *
                </label>
                <input
                  type="text"
                  value={quiz.quizName}
                  onChange={(e) => setQuiz(prev => ({ ...prev, quizName: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '0.5rem 1rem',
                    border: `1px solid var(--border)`,
                    borderRadius: '0.5rem',
                    backgroundColor: 'var(--secondary-bg)',
                    color: 'var(--secondary-text)',
                    outline: 'none'
                  }}
                  placeholder="Quiz adını girin..."
                  maxLength={50}
                />
                {errors.quizName && <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>{errors.quizName}</p>}
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: 'var(--text)',
                  marginBottom: '0.5rem'
                }}>
                  Kategori *
                </label>
                <input
                  type="text"
                  value={quiz.quizCategory}
                  onChange={(e) => setQuiz(prev => ({ ...prev, quizCategory: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '0.5rem 1rem',
                    border: `1px solid var(--border)`,
                    borderRadius: '0.5rem',
                    backgroundColor: 'var(--secondary-bg)',
                    color: 'var(--secondary-text)',
                    outline: 'none'
                  }}
                  placeholder="Kategori girin..."
                  maxLength={50}
                />
                {errors.quizCategory && <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>{errors.quizCategory}</p>}
              </div>
            </div>
          </div>

          {/* Sorular */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: 'var(--secondary-text)'
              }}>
                Sorular ({quiz.questions.length})
              </h2>
              <button
                onClick={addQuestion}
                style={{
                  backgroundColor: 'var(--text)',
                  color: 'var(--secondary-bg)',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  fontWeight: '500',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = 'var(--secondary-text)'}
                onMouseOut={(e) => e.target.style.backgroundColor = 'var(--text)'}
              >
                <Plus className="w-4 h-4 mr-2" />
                Soru Ekle
              </button>
            </div>

            {errors.questions && <p style={{ color: '#ef4444', fontSize: '0.875rem', marginBottom: '1rem' }}>{errors.questions}</p>}

            {quiz.questions.map((question, qIndex) => (
              <div key={qIndex} style={{
                backgroundColor: 'var(--background)',
                borderRadius: '0.75rem',
                padding: '1.5rem',
                marginBottom: '1.5rem',
                borderLeft: `4px solid var(--text)`,
                border: `1px solid var(--border)`
              }}>
                <div className="flex justify-between items-start mb-4">
                  <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: '500',
                    color: 'var(--secondary-text)'
                  }}>
                    Soru {qIndex + 1}
                  </h3>
                  <button
                    onClick={() => removeQuestion(qIndex)}
                    style={{
                      color: '#ef4444',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '0.25rem',
                      borderRadius: '0.25rem'
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="mb-4">
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: 'var(--text)',
                    marginBottom: '0.5rem'
                  }}>
                    Soru Metni *
                  </label>
                  <textarea
                    value={question.question}
                    onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem 1rem',
                      border: `1px solid var(--border)`,
                      borderRadius: '0.5rem',
                      backgroundColor: 'var(--secondary-bg)',
                      color: 'var(--secondary-text)',
                      outline: 'none',
                      resize: 'vertical'
                    }}
                    rows={3}
                    placeholder="Sorunuzu yazın..."
                    maxLength={1024}
                  />
                  {errors[`question_${qIndex}`] && (
                    <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>{errors[`question_${qIndex}`]}</p>
                  )}
                </div>

                <div className="mb-4">
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: 'var(--text)',
                    marginBottom: '0.5rem'
                  }}>
                    Soru Görseli (URL)
                  </label>
                  <input
                    type="url"
                    value={question.img}
                    onChange={(e) => updateQuestion(qIndex, 'img', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem 1rem',
                      border: `1px solid var(--border)`,
                      borderRadius: '0.5rem',
                      backgroundColor: 'var(--secondary-bg)',
                      color: 'var(--secondary-text)',
                      outline: 'none'
                    }}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                {/* Cevaplar */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: 'var(--text)'
                    }}>
                      Cevap Seçenekleri *
                    </label>
                    <button
                      onClick={() => addAnswer(qIndex)}
                      style={{
                        color: 'var(--text)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Cevap Ekle
                    </button>
                  </div>

                  {errors[`answers_${qIndex}`] && (
                    <p style={{ color: '#ef4444', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{errors[`answers_${qIndex}`]}</p>
                  )}
                  {errors[`correct_${qIndex}`] && (
                    <p style={{ color: '#ef4444', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{errors[`correct_${qIndex}`]}</p>
                  )}

                  {question.answers.map((answer, aIndex) => (
                    <div key={aIndex} style={{
                      backgroundColor: 'var(--secondary-bg)',
                      borderRadius: '0.5rem',
                      padding: '1rem',
                      marginBottom: '0.75rem',
                      border: `1px solid var(--border)`
                    }}>
                      <div className="flex items-start gap-3">
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <input
                              type="text"
                              value={answer.answer}
                              onChange={(e) => updateAnswer(qIndex, aIndex, 'answer', e.target.value)}
                              style={{
                                width: '100%',
                                padding: '0.5rem 0.75rem',
                                border: `1px solid var(--border)`,
                                borderRadius: '0.25rem',
                                backgroundColor: 'var(--background)',
                                color: 'var(--secondary-text)',
                                outline: 'none'
                              }}
                              placeholder={`Cevap ${aIndex + 1}`}
                              maxLength={1024}
                            />
                            {errors[`answer_${qIndex}_${aIndex}`] && (
                              <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors[`answer_${qIndex}_${aIndex}`]}</p>
                            )}
                          </div>
                          <input
                            type="url"
                            value={answer.img}
                            onChange={(e) => updateAnswer(qIndex, aIndex, 'img', e.target.value)}
                            style={{
                              width: '100%',
                              padding: '0.5rem 0.75rem',
                              border: `1px solid var(--border)`,
                              borderRadius: '0.25rem',
                              backgroundColor: 'var(--background)',
                              color: 'var(--secondary-text)',
                              outline: 'none'
                            }}
                            placeholder="Cevap görseli (URL)"
                          />
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setCorrectAnswer(qIndex, aIndex)}
                            style={{
                              padding: '0.5rem 0.75rem',
                              borderRadius: '0.25rem',
                              fontSize: '0.875rem',
                              fontWeight: '500',
                              border: 'none',
                              cursor: 'pointer',
                              backgroundColor: answer.isCorrect ? '#10b981' : 'var(--background)',
                              color: answer.isCorrect ? 'white' : 'var(--text)',
                              transition: 'all 0.2s'
                            }}
                          >
                            {answer.isCorrect ? '✓ Doğru' : 'Doğru?'}
                          </button>
                          
                          {question.answers.length > 2 && (
                            <button
                              onClick={() => removeAnswer(qIndex, aIndex)}
                              style={{
                                color: '#ef4444',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '0.25rem',
                                borderRadius: '0.25rem'
                              }}
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
              style={{
                backgroundColor: '#10b981',
                color: 'white',
                padding: '0.75rem 2rem',
                borderRadius: '0.5rem',
                fontSize: '1.125rem',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#10b981'}
            >
              <Save className="w-5 h-5 mr-2" />
              Quiz'i Kaydet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizCreator;