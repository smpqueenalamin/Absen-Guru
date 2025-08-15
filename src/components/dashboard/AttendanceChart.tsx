import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const attendanceData = [
  { name: "Sen", hadir: 65, telat: 8, izin: 2 },
  { name: "Sel", hadir: 68, telat: 5, izin: 1 },
  { name: "Rab", hadir: 70, telat: 3, izin: 2 },
  { name: "Kam", hadir: 67, telat: 6, izin: 1 },
  { name: "Jum", hadir: 64, telat: 7, izin: 3 },
];

export function AttendanceChart() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Absensi Harian</CardTitle>
          <CardDescription>
            Data absensi guru minggu ini
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {attendanceData.map((data, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="font-medium">{data.name}</span>
                <div className="flex space-x-2">
                  <span className="text-green-600">Hadir: {data.hadir}</span>
                  <span className="text-yellow-600">Telat: {data.telat}</span>
                  <span className="text-gray-600">Izin: {data.izin}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Statistik Kehadiran</CardTitle>
          <CardDescription>
            Ringkasan absensi hari ini
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Total Guru</span>
              <span className="font-bold">74</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-600">Hadir</span>
              <span className="font-bold text-green-600">65</span>
            </div>
            <div className="flex justify-between">
              <span className="text-yellow-600">Telat</span>
              <span className="font-bold text-yellow-600">6</span>
            </div>
            <div className="flex justify-between">
              <span className="text-red-600">Tidak Hadir</span>
              <span className="font-bold text-red-600">3</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}