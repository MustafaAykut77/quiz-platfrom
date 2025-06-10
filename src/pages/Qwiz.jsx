import '../index.css';
import "../config/firebase-config";
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/src/contexts/authContext/page";
import { useNavigate } from 'react-router-dom';

import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// Import getAllQuizzes function
import { getAllQuizzes, updateQuiz, deleteQuiz } from '../controllers/QuizRequest';

const Qwiz = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth()
  const token = currentUser?.stsTokenManager?.accessToken
  console.log('Token:', token)

  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [quizzes, setQuizzes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
            category: quiz.category || 'Kategorisiz',
            difficulty: quiz.difficulty || 'Belirtilmemiş',
            questionCount: quiz.questions?.length || 0,
            status: quiz.status || 'Aktif',
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

  const handleEditQuiz = (quizId) => {
    navigate(`/editQuiz/${quizId}`);
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

  const columns = useMemo(() => [
    {
      accessorKey: "title",
      header: "Quiz Başlığı",
      cell: ({ row }) => <div className="font-medium">{row.getValue("title")}</div>
    },
    {
      accessorKey: "category",
      header: "Kategori",
      cell: ({ row }) => (
        <div className="text-sm text-gray-600">{row.getValue("category")}</div>
      )
    },
    {
      accessorKey: "questionCount",
      header: "Soru Sayısı",
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("questionCount")}</div>
      )
    },
    {
      accessorKey: "status",
      header: "Durum",
      cell: ({ row }) => {
        const status = row.getValue("status");
        const colorClass = {
          "Aktif": "bg-green-100 text-green-800",
          "Taslak": "bg-blue-100 text-blue-800",
          "Arşivlenmiş": "bg-gray-100 text-gray-800"
        }[status] || "bg-gray-100 text-gray-800";

        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
            {status}
          </span>
        );
      }
    },
    {
      accessorKey: "createdAt",
      header: "Oluşturma Tarihi",
      cell: ({ row }) => (
        <div className="text-sm text-gray-600">{row.getValue("createdAt")}</div>
      )
    },
    {
      id: "actions",
      header: "İşlemler",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button 
            variant="success" 
            size="sm" 
            onClick={() => alert(`${row.original.title} quiz'i başlatılacak`)}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Başlat
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleEditQuiz(row.original.id, row.original)}
          >
            Düzenle
          </Button>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={() => handleDeleteQuiz(row.original.id)}
          >
            Sil
          </Button>
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
    navigate('/createQuiz');
  };

  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">
          Merhaba Çukulatam
        </h1>
        <p className="text-gray-600">Quiz'lerinizi görüntüleyin ve yönetin.</p>
      </div>

      <div className="flex items-center py-4">
        <Input
          placeholder="Quiz'lerde ara..."
          value={table.getColumn("title")?.getFilterValue() ?? ""}
          onChange={(e) =>
            table.getColumn("title")?.setFilterValue(e.target.value)
          }
          className="max-w-sm"
        />
        <Button className="ml-auto" onClick={handleCreateQuiz}>Yeni Quiz Oluştur</Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : header.column.columnDef.header}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Quizler yükleniyor...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {cell.column.columnDef.cell(cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Sonuç bulunamadı.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            Önceki
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Sonraki
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Qwiz;
