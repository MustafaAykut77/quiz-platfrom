import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

const GameCode = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState('');

  const handleInputChange = (event) => {
    setCode(event.target.value);
  };

  const handleJoinQuiz = () => {
    if (code.trim()) {
      navigate(`/game/${code}`);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleJoinQuiz();
    }
  };

  return (
    <div style={{
      width: '100%',
      height: '100vh - 2.5rem',
      backgroundColor: 'var(--background)',
      fontFamily: 'cursive',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{
        backgroundColor: 'var(--secondary-bg)',
        borderRadius: '1.5rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: '2px solid var(--border)',
        padding: '3rem',
        maxWidth: '28rem',
        width: '100%',
        textAlign: 'center'
      }}>
        {/* Logo */}
        <div style={{ marginBottom: '2rem' }}>
          <img 
            src="/logo.png" 
            alt="Logo" 
            style={{
              width: '6rem',
              height: '6rem',
              margin: '0 auto',
              display: 'block'
            }}
            draggable="false"
          />
        </div>

        {/* Title */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: 'var(--secondary-text)',
            marginBottom: '0.5rem'
          }}>
            Quiz'e Katıl
          </h1>
          <p style={{
            color: 'var(--text)',
            fontSize: '1rem'
          }}>
            Oyun kodunu girerek quiz'e katılın
          </p>
        </div>

        {/* Input Section */}
        <div style={{ marginBottom: '2rem' }}>
          <input
            type="text"
            placeholder="Oyun kodunu girin..."
            value={code}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            style={{
              width: '100%',
              padding: '1rem 1.25rem',
              fontSize: '1.125rem',
              fontWeight: '500',
              textAlign: 'center',
              borderRadius: '0.75rem',
              border: '2px solid var(--border)',
              backgroundColor: 'var(--background)',
              color: 'var(--secondary-text)',
              transition: 'all 0.2s',
              marginBottom: '1.5rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--text)';
              e.target.style.boxShadow = '0 0 0 4px rgba(var(--text-rgb), 0.1)';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border)';
              e.target.style.boxShadow = 'none';
              e.target.style.transform = 'translateY(0)';
            }}
          />
          
          <button
            onClick={handleJoinQuiz}
            disabled={!code.trim()}
            style={{
              width: '100%',
              padding: '1rem 2rem',
              backgroundColor: code.trim() ? 'var(--text)' : 'var(--border)',
              color: 'var(--secondary-bg)',
              fontWeight: '600',
              fontSize: '1.125rem',
              borderRadius: '0.75rem',
              border: 'none',
              cursor: code.trim() ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s',
              boxShadow: code.trim() ? '0 10px 20px -5px rgba(0, 0, 0, 0.2)' : 'none',
              opacity: code.trim() ? 1 : 0.6
            }}
            onMouseOver={(e) => {
              if (code.trim()) {
                e.target.style.backgroundColor = 'var(--secondary-text)';
                e.target.style.boxShadow = '0 15px 30px -5px rgba(0, 0, 0, 0.3)';
                e.target.style.transform = 'translateY(-3px)';
              }
            }}
            onMouseOut={(e) => {
              if (code.trim()) {
                e.target.style.backgroundColor = 'var(--text)';
                e.target.style.boxShadow = '0 10px 20px -5px rgba(0, 0, 0, 0.2)';
                e.target.style.transform = 'translateY(0)';
              }
            }}
          >
            Oyuna Katıl
          </button>
        </div>

        {/* Info Text */}
        <div style={{
          padding: '1rem',
          backgroundColor: 'var(--background)',
          borderRadius: '0.75rem',
          border: '1px solid var(--border)'
        }}>
          <p style={{
            color: 'var(--text)',
            fontSize: '0.875rem',
            margin: 0
          }}>
            💡 Oyun kodunu öğretmeninizden veya oyun düzenleyicisinden alabilirsiniz
          </p>
        </div>
      </div>
    </div>
  );
};

export default GameCode;