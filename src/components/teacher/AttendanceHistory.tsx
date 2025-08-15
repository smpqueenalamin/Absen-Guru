import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, MapPin, Camera, Filter, Download } from "lucide-react";

// Mock attendance data
const mockAttendanceData = [
  {
    id: "1",
    date: "2024-01-15",
    time: "07:15",
    type: "Kehadiran",
    status: "Tepat Waktu",
    location: "Gedung A",
    photo: null,
    notes: null
  },
  {
    id: "2",
    date: "2024-01-14",
    time: "07:25",
    type: "Kehadiran",
    status: "Telat",
    location: "Gedung A",
    photo: null,
    notes: "Terjebak macet"
  },
  {
    id: "3",
    date: "2024-01-13",
    time: "08:00",
    type: "Izin",
    status: "-",
    location: "-",
    photo: null,
    notes: "Keperluan keluarga"
  },
  {
    id: "4",
    date: "2024-01-12",
    time: "07:10",
    type: "Kehadiran",
    status: "Tepat Waktu",
    location: "Gedung A",
    photo: null,
    notes: null
  },
  {
    id: "5",
    date: "2024-01-11",
    time: "07:30",
    type: "Perjalanan Dinas",
    status: "Telat",
    location: "Kantor Dinas",
    photo: null,
    notes: "Rapat koordinasi"
  },
  {
    id: "6",
    date: "2024-01-10",
    time: "-",
    type: "Sakit",
    status: "-",
    location: "-",
    photo: null,
    notes: "Demam tinggi"
  },
  {
    id: "7",
    date: "2024-01-09",
    time: "07:20",
    type: "Kehadiran",
    status: "Tepat Waktu",
    location: "Gedung A",
    photo: null,
    notes: null
  },
  {
    id: "8",
    date: "2024-01-08",
    time: "07:45",
    type: "Kehadiran",
    status: "Telat",
    location: "Gedung A",
    photo: null,
    notes: "Ban bocor"
  }
];

export const AttendanceHistory = () => {
  const [filterType, setFilterType] = useState<string>("all");
  const [filterMonth, setFilterMonth] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Tepat Waktu":
        return "default";
      case "Telat":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getTypeVariant = (type: string) => {
    switch (type) {
      case "Kehadiran":
        return "default";
      case "Izin":
        return "secondary";
      case "Sakit":
        return "destructive";
      case "Perjalanan Dinas":
        return "outline";
      default:
        return "secondary";
    }
  };

  const filteredData = mockAttendanceData.filter(item => {
    const matchesType = filterType === "all" || item.type.toLowerCase().includes(filterType.toLowerCase());
    const matchesSearch = item.notes?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && (searchTerm === "" || matchesSearch);
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Statistics
  const totalPresent = mockAttendanceData.filter(item => item.type === "Kehadiran").length;
  const totalLate = mockAttendanceData.filter(item => item.status === "Telat").length;
  const totalAbsent = mockAttendanceData.filter(item => ["Izin", "Sakit"].includes(item.type)).length;
  const totalBusinessTrip = mockAttendanceData.filter(item => item.type === "Perjalanan Dinas").length;

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Clock className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalPresent}</p>
                <p className="text-xs text-muted-foreground">Hadir</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-destructive/10 flex items-center justify-center">
                <Clock className="h-4 w-4 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalLate}</p>
                <p className="text-xs text-muted-foreground">Telat</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-secondary/10 flex items-center justify-center">
                <Calendar className="h-4 w-4 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalAbsent}</p>
                <p className="text-xs text-muted-foreground">Izin/Sakit</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center">
                <MapPin className="h-4 w-4 text-accent-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalBusinessTrip}</p>
                <p className="text-xs text-muted-foreground">Dinas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Riwayat Absensi
            </CardTitle>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Cari berdasarkan catatan atau lokasi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter Jenis" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Jenis</SelectItem>
                <SelectItem value="kehadiran">Kehadiran</SelectItem>
                <SelectItem value="izin">Izin</SelectItem>
                <SelectItem value="sakit">Sakit</SelectItem>
                <SelectItem value="perjalanan">Perjalanan Dinas</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterMonth} onValueChange={setFilterMonth}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter Bulan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Semua Bulan</SelectItem>
                <SelectItem value="01">Januari 2024</SelectItem>
                <SelectItem value="02">Februari 2024</SelectItem>
                <SelectItem value="03">Maret 2024</SelectItem>
                <SelectItem value="04">April 2024</SelectItem>
                <SelectItem value="05">Mei 2024</SelectItem>
                <SelectItem value="06">Juni 2024</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Waktu</TableHead>
                <TableHead>Jenis</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Lokasi</TableHead>
                <TableHead>Catatan</TableHead>
                <TableHead>Foto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{formatDate(item.date)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                      {item.time || "-"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getTypeVariant(item.type)}>
                      {item.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {item.status !== "-" ? (
                      <Badge variant={getStatusVariant(item.status)}>
                        {item.status}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                      {item.location || "-"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {item.notes || "-"}
                    </span>
                  </TableCell>
                  <TableCell>
                    {item.photo ? (
                      <Button variant="outline" size="sm">
                        <Camera className="h-4 w-4" />
                      </Button>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};