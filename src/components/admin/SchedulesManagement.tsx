import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Clock } from "lucide-react";

const mockSchedules = [
  { id: 1, teacher: "Sri Wahyuni, S.Pd", day: "Senin", startTime: "07:00", endTime: "12:00", subject: "Matematika", location: "Kelas 5A" },
  { id: 2, teacher: "Ahmad Fauzi, M.Pd", day: "Selasa", startTime: "08:00", endTime: "16:00", subject: "Administrasi", location: "Kantor" },
  { id: 3, teacher: "Dewi Sartika, S.Pd", day: "Rabu", startTime: "07:30", endTime: "13:00", subject: "Bahasa Indonesia", location: "Kelas 6B" },
  { id: 4, teacher: "Budi Santoso, S.Pd", day: "Kamis", startTime: "08:00", endTime: "11:00", subject: "Olahraga", location: "Lapangan" },
];

export const SchedulesManagement = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Jadwal Mengajar</CardTitle>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Tambah Jadwal
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Tambah Jadwal Baru</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="teacher">Guru</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih guru" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sri">Sri Wahyuni, S.Pd</SelectItem>
                      <SelectItem value="ahmad">Ahmad Fauzi, M.Pd</SelectItem>
                      <SelectItem value="dewi">Dewi Sartika, S.Pd</SelectItem>
                      <SelectItem value="budi">Budi Santoso, S.Pd</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="day">Hari</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih hari" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="senin">Senin</SelectItem>
                      <SelectItem value="selasa">Selasa</SelectItem>
                      <SelectItem value="rabu">Rabu</SelectItem>
                      <SelectItem value="kamis">Kamis</SelectItem>
                      <SelectItem value="jumat">Jumat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="startTime">Jam Mulai</Label>
                    <Input id="startTime" type="time" />
                  </div>
                  <div>
                    <Label htmlFor="endTime">Jam Selesai</Label>
                    <Input id="endTime" type="time" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="subject">Mata Pelajaran</Label>
                  <Input id="subject" placeholder="Masukkan mata pelajaran" />
                </div>
                <div>
                  <Label htmlFor="location">Lokasi</Label>
                  <Input id="location" placeholder="Masukkan lokasi" />
                </div>
                <Button className="w-full" onClick={() => setIsAddDialogOpen(false)}>
                  Simpan
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Guru</TableHead>
              <TableHead>Hari</TableHead>
              <TableHead>Waktu</TableHead>
              <TableHead>Mata Pelajaran</TableHead>
              <TableHead>Lokasi</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockSchedules.map((schedule) => (
              <TableRow key={schedule.id}>
                <TableCell>{schedule.teacher}</TableCell>
                <TableCell>{schedule.day}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                    {schedule.startTime} - {schedule.endTime}
                  </div>
                </TableCell>
                <TableCell>{schedule.subject}</TableCell>
                <TableCell>{schedule.location}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};