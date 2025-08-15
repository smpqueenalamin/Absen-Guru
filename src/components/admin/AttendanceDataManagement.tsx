import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Search, Download, Filter, Clock, Camera, MapPin } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

const mockAttendanceData = [
  { 
    id: 1, 
    teacher: "Sri Wahyuni, S.Pd", 
    date: "2024-12-15", 
    checkIn: "07:45", 
    checkOut: "14:30",
    status: "hadir", 
    type: "Kehadiran",
    location: "Gedung A",
    photo: true,
    notes: ""
  },
  { 
    id: 2, 
    teacher: "Ahmad Fauzi, M.Pd", 
    date: "2024-12-15", 
    checkIn: "08:15", 
    checkOut: "16:00",
    status: "telat", 
    type: "Kehadiran",
    location: "Gedung B",
    photo: true,
    notes: "Terlambat 15 menit"
  },
  { 
    id: 3, 
    teacher: "Dewi Sartika, S.Pd", 
    date: "2024-12-15", 
    checkIn: "07:30", 
    checkOut: "13:30",
    status: "hadir", 
    type: "Kehadiran",
    location: "Gedung A",
    photo: true,
    notes: ""
  },
  { 
    id: 4, 
    teacher: "Budi Santoso, S.Pd", 
    date: "2024-12-15", 
    checkIn: "-", 
    checkOut: "-",
    status: "izin", 
    type: "Izin",
    location: "-",
    photo: false,
    notes: "Keperluan keluarga"
  },
];

export const AttendanceDataManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState<Date>();

  const getStatusBadge = (status: string) => {
    const variants = {
      hadir: "default",
      telat: "destructive", 
      izin: "secondary",
      sakit: "outline",
      alpha: "destructive"
    } as const;
    
    const labels = {
      hadir: "Hadir",
      telat: "Telat", 
      izin: "Izin",
      sakit: "Sakit",
      alpha: "Alpha"
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || "outline"}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  const filteredData = mockAttendanceData.filter(record => {
    const matchesSearch = record.teacher.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Data Absensi</CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Excel
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6 space-y-4">
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari guru..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="hadir">Hadir</SelectItem>
                <SelectItem value="telat">Telat</SelectItem>
                <SelectItem value="izin">Izin</SelectItem>
                <SelectItem value="sakit">Sakit</SelectItem>
                <SelectItem value="alpha">Alpha</SelectItem>
              </SelectContent>
            </Select>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  {dateFilter ? format(dateFilter, "dd MMM yyyy", { locale: id }) : "Pilih Tanggal"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateFilter}
                  onSelect={setDateFilter}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Guru</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Jam Masuk</TableHead>
              <TableHead>Jam Keluar</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Jenis</TableHead>
              <TableHead>Lokasi</TableHead>
              <TableHead>Foto</TableHead>
              <TableHead>Keterangan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((record) => (
              <TableRow key={record.id}>
                <TableCell className="font-medium">{record.teacher}</TableCell>
                <TableCell>{format(new Date(record.date), "dd MMM yyyy", { locale: id })}</TableCell>
                <TableCell>
                  {record.checkIn !== "-" && (
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                      {record.checkIn}
                    </div>
                  )}
                  {record.checkIn === "-" && "-"}
                </TableCell>
                <TableCell>
                  {record.checkOut !== "-" && (
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                      {record.checkOut}
                    </div>
                  )}
                  {record.checkOut === "-" && "-"}
                </TableCell>
                <TableCell>{getStatusBadge(record.status)}</TableCell>
                <TableCell>{record.type}</TableCell>
                <TableCell>
                  {record.location !== "-" && (
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                      {record.location}
                    </div>
                  )}
                  {record.location === "-" && "-"}
                </TableCell>
                <TableCell>
                  {record.photo ? (
                    <div className="flex items-center text-green-600">
                      <Camera className="h-4 w-4 mr-1" />
                      Ada
                    </div>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell className="max-w-xs truncate">{record.notes || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};