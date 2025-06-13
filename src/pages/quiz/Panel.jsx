import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { startGame, getGameData } from '@/src/controllers/GameRequest';
import { useAuth } from '@/src/contexts/authContext/page';

const Panel = () => {
    const [code, setCode] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { currentUser } = useAuth();
    const [gameStarted, setGameStarted] = useState(false);
    const [playerList, setPlayerList] = useState([]);
    
    const handleStartGame = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = currentUser?.stsTokenManager?.accessToken;   
            const response = await startGame(token);
            console.log('Oyun başlatma isteği:', response);
            
            if (response.success) {
                console.log('Oyun başarıyla başlatıldı:', response);
                setGameStarted(true);
            } else {
                setError(response.message || 'Oyun başlatılamadı');
            }
        } catch (err) {
            setError('Oyun başlatılırken bir hata oluştu');
            console.error('Oyun başlatma hatası:', err);
        } finally {
            setLoading(false);
        }
    };

    // Oyun verilerini çekmek için interval
    useEffect(() => {
        let intervalId;
        
        console.log('Oyun başladı, veriler çekiliyor...');
        const fetchGameData = async () => {
            try {
                const token = currentUser?.stsTokenManager?.accessToken;
                const response = await getGameData(token);
                console.log('Oyun verisi çekildi:', response);
                if (response.success) {
                    setPlayerList(response.data.players);
                    setCode(response.data.code);
                    console.log('Güncel oyun verisi:', response.data);
                }
            } catch (err) {
                console.error('Oyun verisi çekilirken hata:', err);
            }
        };

        // İlk veriyi hemen çek
        fetchGameData();
        
        // Her saniye güncelle
        intervalId = setInterval(fetchGameData, 1000);
        
        // Cleanup function
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [gameStarted, currentUser, code]);

    return (
        <main style={{
            width: '100%',
            height: 'calc(100vh - 3.5rem)',
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
                animation: 'fadeIn 0.5s ease-out'
            }}>
                {/* Header Bölümü */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
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
                    gridTemplateColumns: 'repeat(4, 1fr)', // 4 sütun olacak şekilde değiştirildi
                    gap: '1rem',
                    maxHeight: '400px',
                    overflowY: 'auto',
                    padding: '1rem',
                    backgroundColor: 'var(--background)',
                    borderRadius: '0.75rem',
                    border: '1px solid var(--border)'
                }}>
                    {playerList.reverse().map((player, index) => (
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
                                {player.playerName}
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

                {/* Oyunu Başlat Butonu ve Hata Mesajı */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '2rem'
                }}>
                    <button
                        onClick={handleStartGame}
                        disabled={loading || playerList.length < 2}
                        style={{
                            padding: '1rem 2rem',
                            backgroundColor: loading || playerList.length < 2 ? 'var(--border)' : 'var(--text)',
                            color: 'var(--secondary-bg)',
                            border: 'none',
                            borderRadius: '0.75rem',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            cursor: loading || playerList.length < 2 ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                        onMouseOver={(e) => {
                            if (!loading && playerList.length >= 2) {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 6px 8px -2px rgba(0, 0, 0, 0.15)';
                            }
                        }}
                        onMouseOut={(e) => {
                            if (!loading && playerList.length >= 2) {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                            }
                        }}
                    >
                        {loading ? 'Başlatılıyor...' : 'Oyunu Başlat'}
                    </button>
                </div>

                {error && (
                    <div style={{
                        marginTop: '1rem',
                        padding: '0.75rem',
                        backgroundColor: 'rgba(220, 38, 38, 0.1)',
                        color: 'rgb(220, 38, 38)',
                        borderRadius: '0.5rem',
                        textAlign: 'center',
                        fontSize: '0.875rem'
                    }}>
                        {error}
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

export default Panel;