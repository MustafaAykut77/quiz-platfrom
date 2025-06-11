import '../index.css';
import "../config/firebase-config";
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/src/contexts/authContext/page";
import { useNavigate } from 'react-router-dom';
import { getUser } from "@/src/controllers/UserRequest";

import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// Import getAllQuizzes function
import { getAllQuizzes, updateQuiz, deleteQuiz } from '../controllers/QuizRequest';
import { createGame } from '../controllers/GameRequest';

const Qwiz = () => {
  const navigate = useNavigate();
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [quizzes, setQuizzes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState('Kullanıcı');
  const { currentUser } = useAuth();
  const token = currentUser?.stsTokenManager?.accessToken
  // console.log('Token:', token)

  // Remove mockQuizzes array and add this useEffect
  useEffect(() => {
    const fetchQuizzes = async () => {
      setIsLoading(true);
      try {
        const response = await getAllQuizzes(token);
        if (response.success) {
          // Transform the quiz data to match table structure
          const formattedQuizzes = response.data.map(quiz => ({
            id: quiz.quizid,
            title: quiz.quizName,
            category: quiz.quizCategory || 'Kategorisiz',
            questionCount: quiz.questionCount || 0,
            score: quiz.score,
            createdAt: new Date(quiz.createdAt).toLocaleDateString('tr-TR') || '-'
          }));
          setQuizzes(formattedQuizzes);
        }
      } catch (error) {
        console.error('Quizler yüklenirken hata oluştu:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchQuizzes();
    }
  }, [token]);

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await getUser(token);
        if (response.data.success) {
          setUserName(response.data.data.username || 'Kullanıcı');
        }
      } catch (error) {
        console.error('Kullanıcı bilgisi yüklenirken hata:', error);
        setUserName('Kullanıcı');
      }
    };

    if (token) {
      fetchUserName();
    }
  }, [token]);

  const handleEditQuiz = (quizId) => {
    navigate(`/quiz/${quizId}`);
  };

  const handleDeleteQuiz = async (quizId) => {
    if (window.confirm('Bu quiz\'i silmek istediğinizden emin misiniz?')) {
      try {
        const response = await deleteQuiz(token, quizId);
        if (response.success) {
          // Remove deleted quiz from state
          const updatedQuizzes = quizzes.filter(quiz => quiz.id !== quizId);
          setQuizzes(updatedQuizzes);
        }
      } catch (error) {
        console.error('Quiz silinirken hata oluştu:', error);
      }
    }
  };

  const handleCreateGame = async (quizId) => {
    try {
      console.log('Creating game for quiz ID:', quizId);

      const response = await createGame(token, quizId );
      if (response.success) {
        // Navigate to the game page with the new game ID
        navigate(`/game/${response.data.gameId}`);
      } else {
        console.error('Oyun oluşturulurken hata:', response.message);
        alert('Oyun oluşturulurken bir hata oluştu.');
      }
    } catch (error) {
      console.error('Oyun oluşturulurken hata:', error);
      alert('Oyun oluşturulurken bir hata oluştu.');
    }
  };

  const columns = useMemo(() => [
    {
      accessorKey: "id",
      header: "Quiz ID",
      cell: ({ row }) => (
        <div style={{ fontSize: '0.875rem', color: 'var(--text)'}}>{row.getValue("id")}</div>
      )
    },
    {
      accessorKey: "title",
      header: "Quiz Başlığı",
      cell: ({ row }) => <div style={{ fontWeight: '600', color: 'var(--secondary-text)' }}>{row.getValue("title")}</div>
    },
    {
      accessorKey: "category",
      header: "Kategori",
      cell: ({ row }) => (
        <div style={{ fontSize: '0.875rem', color: 'var(--text)' }}>{row.getValue("category")}</div>
      )
    },
    {
      accessorKey: "questionCount",
      header: "Soru Sayısı",
      cell: ({ row }) => (
        <div style={{ textAlign: 'center', fontWeight: '500', color: 'var(--secondary-text)' }}>{row.getValue("questionCount")}</div>
      )
    },
    {
      accessorKey: "createdAt",
      header: "Oluşturma Tarihi",
      cell: ({ row }) => (
        <div style={{ fontSize: '0.875rem', color: 'var(--text)' }}>{row.getValue("createdAt")}</div>
      )
    },
    {
      id: "actions",
      header: "İşlemler",
      cell: ({ row }) => (
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button
            onClick={() => handleCreateGame(row.original.id)}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '0.75rem',
              fontWeight: '500',
              borderRadius: '0.375rem',
              border: '2px solid #6366f1',
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              color: '#6366f1',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#6366f1';
              e.target.style.color = 'white';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = 'rgba(99, 102, 241, 0.1)';
              e.target.style.color = '#6366f1';
            }}
          >
            Oyun Oluştur
          </button>
          <button
            onClick={() => handleEditQuiz(row.original.id, row.original)}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '0.75rem',
              fontWeight: '500',
              borderRadius: '0.375rem',
              border: '2px solid var(--border)',
              backgroundColor: 'var(--background)',
              color: 'var(--secondary-text)',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.target.style.borderColor = 'var(--text)';
              e.target.style.backgroundColor = 'var(--secondary-bg)';
            }}
            onMouseOut={(e) => {
              e.target.style.borderColor = 'var(--border)';
              e.target.style.backgroundColor = 'var(--background)';
            }}
          >
            Düzenle
          </button>
          <button
            onClick={() => handleDeleteQuiz(row.original.id)}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '0.75rem',
              fontWeight: '500',
              borderRadius: '0.375rem',
              border: '2px solid #ef4444',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              color: '#ef4444',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#ef4444';
              e.target.style.color = 'white';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
              e.target.style.color = '#ef4444';
            }}
          >
            Sil
          </button>
        </div>
      )
    }
  ], [quizzes]); // Add quizzes as dependency

  const table = useReactTable({
    // Replace mockQuizzes with quizzes state
    data: quizzes,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection
    }
  });

  const handleCreateQuiz = () => {
    navigate('/createquiz');
  };

  if (isLoading) {
    return (
      <div style={{
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
          <div style={{
            width: '3rem',
            height: '3rem',
            border: '4px solid var(--border)',
            borderTop: '4px solid var(--text)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem auto'
          }}></div>
          <p>Quizler yükleniyor...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: 'var(--background)',
      fontFamily: 'cursive',
      padding: '2rem'
    }}>
      <div style={{
        maxWidth: '80rem',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: 'var(--secondary-text)',
            marginBottom: '0.5rem'
          }}>
            Merhaba, {userName}!
          </h1>
          <p style={{
            color: 'var(--text)',
            fontSize: '1rem'
          }}>
            Quiz'lerinizi görüntüleyin ve yönetin.
          </p>
        </div>

        {/* Search and Create Button */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{ flex: '1', maxWidth: '20rem' }}>
            <input
              type="text"
              placeholder="Quiz'lerde ara..."
              value={table.getColumn("title")?.getFilterValue() ?? ""}
              onChange={(e) => table.getColumn("title")?.setFilterValue(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                border: '2px solid var(--border)',
                backgroundColor: 'var(--secondary-bg)',
                color: 'var(--secondary-text)',
                fontSize: '0.875rem',
                transition: 'all 0.2s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--text)';
                e.target.style.boxShadow = '0 0 0 3px rgba(var(--text-rgb), 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
          <button
            onClick={handleCreateQuiz}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: 'var(--text)',
              color: 'var(--secondary-bg)',
              fontWeight: '500',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.875rem',
              transition: 'all 0.2s',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = 'var(--secondary-text)';
              e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = 'var(--text)';
              e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            Yeni Quiz Oluştur
          </button>
        </div>

        {/* Table Container */}
        <div style={{
          backgroundColor: 'var(--secondary-bg)',
          borderRadius: '1rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '2px solid var(--border)',
          overflow: 'hidden'
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse'
            }}>
              <thead>
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id} style={{
                    backgroundColor: 'var(--background)',
                    borderBottom: '2px solid var(--border)'
                  }}>
                    {headerGroup.headers.map(header => (
                      <th key={header.id} style={{
                        padding: '1rem',
                        textAlign: 'left',
                        fontWeight: '600',
                        color: 'var(--secondary-text)',
                        fontSize: '0.875rem',
                        borderRight: '1px solid var(--border)'
                      }}>
                        {header.isPlaceholder
                          ? null
                          : header.column.columnDef.header}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map(row => (
                    <tr key={row.id} style={{
                      borderBottom: '1px solid var(--border)',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--background)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}>
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id} style={{
                          padding: '1rem',
                          borderRight: '1px solid var(--border)',
                          fontSize: '0.875rem'
                        }}>
                          {cell.column.columnDef.cell(cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length} style={{
                      padding: '3rem',
                      textAlign: 'center',
                      color: 'var(--text)',
                      fontSize: '1rem'
                    }}>
                      {isLoading ? 'Quizler yükleniyor...' : 'Sonuç bulunamadı.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '2rem'
        }}>
          <div style={{
            color: 'var(--text)',
            fontSize: '0.875rem'
          }}>
            Toplam {quizzes.length} quiz
          </div>
          <div style={{
            display: 'flex',
            gap: '0.5rem'
          }}>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                borderRadius: '0.375rem',
                border: '2px solid var(--border)',
                backgroundColor: table.getCanPreviousPage() ? 'var(--secondary-bg)' : 'var(--background)',
                color: table.getCanPreviousPage() ? 'var(--secondary-text)' : 'var(--text)',
                cursor: table.getCanPreviousPage() ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s',
                opacity: table.getCanPreviousPage() ? 1 : 0.5
              }}
              onMouseOver={(e) => {
                if (table.getCanPreviousPage()) {
                  e.target.style.borderColor = 'var(--text)';
                  e.target.style.backgroundColor = 'var(--background)';
                }
              }}
              onMouseOut={(e) => {
                if (table.getCanPreviousPage()) {
                  e.target.style.borderColor = 'var(--border)';
                  e.target.style.backgroundColor = 'var(--secondary-bg)';
                }
              }}
            >
              Önceki
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                borderRadius: '0.375rem',
                border: '2px solid var(--border)',
                backgroundColor: table.getCanNextPage() ? 'var(--secondary-bg)' : 'var(--background)',
                color: table.getCanNextPage() ? 'var(--secondary-text)' : 'var(--text)',
                cursor: table.getCanNextPage() ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s',
                opacity: table.getCanNextPage() ? 1 : 0.5
              }}
              onMouseOver={(e) => {
                if (table.getCanNextPage()) {
                  e.target.style.borderColor = 'var(--text)';
                  e.target.style.backgroundColor = 'var(--background)';
                }
              }}
              onMouseOut={(e) => {
                if (table.getCanNextPage()) {
                  e.target.style.borderColor = 'var(--border)';
                  e.target.style.backgroundColor = 'var(--secondary-bg)';
                }
              }}
            >
              Sonraki
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Qwiz;