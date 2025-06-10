import '../index.css';
import "../config/firebase-config";
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/src/contexts/authContext/page";

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

const Qwiz = () => {

  const { currentUser } = useAuth()
  const token = currentUser?.stsTokenManager?.accessToken
  console.log('Token:', token)

  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [quizzes, setQuizzes] = useState([]);

  const mockQuizzes = [
    {
      id: "1",
      title: "JavaScript Temelleri",
      description: "JavaScript'in temel kavramlarını öğrenin",
      category: "Programlama",
      difficulty: "Kolay",
      questionCount: 15,
      createdAt: "2024-01-15",
      status: "Aktif",
      score: 85
    },
    {
      id: "2",
      title: "React Hooks",
      description: "React Hooks kullanımı ve best practices",
      category: "Programlama",
      difficulty: "Orta",
      questionCount: 20,
      createdAt: "2024-01-20",
      status: "Aktif",
      score: 92
    },
    {
      id: "3",
      title: "TypeScript İleri Seviye",
      description: "TypeScript'te generic'ler ve utility types",
      category: "Programlama",
      difficulty: "Zor",
      questionCount: 25,
      createdAt: "2024-01-25",
      status: "Taslak"
    },
    {
      id: "4",
      title: "CSS Grid Layout",
      description: "Modern CSS Grid sistemi",
      category: "Tasarım",
      difficulty: "Orta",
      questionCount: 12,
      createdAt: "2024-02-01",
      status: "Aktif",
      score: 78
    },
    {
      id: "5",
      title: "Node.js API Geliştirme",
      description: "RESTful API tasarımı ve geliştirme",
      category: "Backend",
      difficulty: "Zor",
      questionCount: 30,
      createdAt: "2024-02-05",
      status: "Arşivlenmiş",
      score: 88
    }
  ];

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
      accessorKey: "difficulty",
      header: "Zorluk",
      cell: ({ row }) => {
        const difficulty = row.getValue("difficulty");
        const colorClass = {
          "Kolay": "bg-green-100 text-green-800",
          "Orta": "bg-yellow-100 text-yellow-800",
          "Zor": "bg-red-100 text-red-800"
        }[difficulty] || "bg-gray-100 text-gray-800";

        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
            {difficulty}
          </span>
        );
      }
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
      accessorKey: "score",
      header: "Puan",
      cell: ({ row }) => {
        const score = row.getValue("score");
        return score ? (
          <div className="text-center font-medium">{score}%</div>
        ) : (
          <div className="text-center text-gray-400">-</div>
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
          <Button variant="outline" size="sm">Düzenle</Button>
          <Button variant="outline" size="sm">Görüntüle</Button>
        </div>
      )
    }
  ], []);

  const table = useReactTable({
    data: mockQuizzes,
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
        <Button className="ml-auto">Yeni Quiz Oluştur</Button>
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
            {table.getRowModel().rows.length ? (
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
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} / {table.getFilteredRowModel().rows.length} satır seçildi.
        </div>
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
