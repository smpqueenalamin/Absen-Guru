import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { useState } from "react";

const weeklyData = [
  { name: "Sen", hadir: 65, telat: 5, izin: 2, sakit: 1 },
  { name: "Sel", hadir: 68, telat: 3, izin: 1, sakit: 2 },
  { name: "Rab", hadir: 70, telat: 2, izin: 1, sakit: 1 },
  { name: "Kam", hadir: 67, telat: 4, izin: 2, sakit: 1 },
  { name: "Jum", hadir: 69, telat: 3, izin: 1, sakit: 1 },
];

const monthlyData = [
  { name: "Jan", hadir: 1250, telat: 80, izin: 45, sakit: 25 },
  { name: "Feb", hadir: 1320, telat: 65, izin: 38, sakit: 22 },
  { name: "Mar", hadir: 1380, telat: 72, izin: 42, sakit: 28 },
  { name: "Apr", hadir: 1360, telat: 68, izin: 40, sakit: 30 },
  { name: "Mei", hadir: 1400, telat: 75, izin: 35, sakit: 25 },
  { name: "Jun", hadir: 1420, telat: 70, izin: 38, sakit: 27 },
];

export const AttendanceChart = () => {
  const [period, setPeriod] = useState("weekly");
  
  const data = period === "weekly" ? weeklyData : monthlyData;
  
  return (
    <Card className="col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Grafik Absensi</CardTitle>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Per Minggu</SelectItem>
              <SelectItem value="monthly">Per Bulan</SelectItem>
              <SelectItem value="semester">Per Semester</SelectItem>
              <SelectItem value="yearly">Per Tahun</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="hadir" fill="hsl(var(--accent))" name="Hadir" />
            <Bar dataKey="telat" fill="#f59e0b" name="Telat" />
            <Bar dataKey="izin" fill="#8b5cf6" name="Izin" />
            <Bar dataKey="sakit" fill="#3b82f6" name="Sakit" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};