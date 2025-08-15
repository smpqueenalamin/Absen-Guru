import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Calendar as CalendarIcon, BarChart3, PieChart, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

const reportTypes = [
  { id: "daily", name: "Laporan Harian", description: "Data absensi per hari" },
  { id: "weekly", name: "Laporan Mingguan", description: "Ringkasan absensi per minggu" },
  { id: "monthly", name: "Laporan Bulanan", description: "Statistik absensi per bulan" },
  { id: "semester", name: "Laporan Semester", description: "Data absensi per semester" },
  { id: "yearly", name: "Laporan Tahunan", description: "Rekap absensi per tahun ajaran" },
  { id: "teacher", name: "Laporan per Guru", description: "Detail absensi individual guru" },
];

const quickStats = [
  { title: "Laporan Hari Ini", value: "74/74", description: "Guru hadir", color: "bg-green-500" },
  { title: "Laporan Minggu Ini", value: "98%", description: "Tingkat kehadiran", color: "bg-blue-500" },
  { title: "Laporan Bulan Ini", value: "15", description: "Hari kerja", color: "bg-purple-500" },
  { title: "Total Laporan", value: "156", description: "Laporan dibuat", color: "bg-orange-500" },
];

export const ReportsManagement = () => {
  const [selectedReport, setSelectedReport] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();

  const generateReport = () => {
    console.log("Generating report:", {
      type: selectedReport,
      teacher: selectedTeacher,
      dateFrom,
      dateTo
    });
  };

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${stat.color}`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Report Generator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Generator Laporan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Jenis Laporan</label>
              <Select value={selectedReport} onValueChange={setSelectedReport}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis laporan" />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Guru (Opsional)</label>
              <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih guru" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Guru</SelectItem>
                  <SelectItem value="sri">Sri Wahyuni, S.Pd</SelectItem>
                  <SelectItem value="ahmad">Ahmad Fauzi, M.Pd</SelectItem>
                  <SelectItem value="dewi">Dewi Sartika, S.Pd</SelectItem>
                  <SelectItem value="budi">Budi Santoso, S.Pd</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Tanggal Mulai</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {dateFrom ? format(dateFrom, "dd MMM yyyy", { locale: id }) : "Pilih tanggal"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateFrom}
                    onSelect={setDateFrom}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Tanggal Selesai</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {dateTo ? format(dateTo, "dd MMM yyyy", { locale: id }) : "Pilih tanggal"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateTo}
                    onSelect={setDateTo}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button onClick={generateReport} disabled={!selectedReport}>
              <BarChart3 className="h-4 w-4 mr-2" />
              Generate Laporan
            </Button>
            <Button variant="outline" onClick={generateReport} disabled={!selectedReport}>
              <Download className="h-4 w-4 mr-2" />
              Download Excel
            </Button>
            <Button variant="outline" onClick={generateReport} disabled={!selectedReport}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Available Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Jenis Laporan Tersedia</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportTypes.map((report) => (
              <Card key={report.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      {report.id === "daily" && <CalendarIcon className="h-5 w-5 text-primary" />}
                      {report.id === "weekly" && <BarChart3 className="h-5 w-5 text-primary" />}
                      {report.id === "monthly" && <TrendingUp className="h-5 w-5 text-primary" />}
                      {report.id === "semester" && <PieChart className="h-5 w-5 text-primary" />}
                      {report.id === "yearly" && <FileText className="h-5 w-5 text-primary" />}
                      {report.id === "teacher" && <FileText className="h-5 w-5 text-primary" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{report.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{report.description}</p>
                      <Badge variant="outline" className="mt-2">
                        Tersedia
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};