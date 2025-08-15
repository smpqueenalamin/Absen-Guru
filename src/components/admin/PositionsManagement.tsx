import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, Briefcase } from "lucide-react";

const mockPositions = [
  { id: 1, name: "Kepala Sekolah", code: "KS", description: "Memimpin dan mengelola seluruh kegiatan sekolah", count: 1 },
  { id: 2, name: "Wakil Kepala Sekolah", code: "WKS", description: "Membantu kepala sekolah dalam mengelola sekolah", count: 2 },
  { id: 3, name: "Guru Kelas", code: "GK", description: "Mengajar di kelas tertentu", count: 12 },
  { id: 4, name: "Guru Mata Pelajaran", code: "GMP", description: "Mengajar mata pelajaran khusus", count: 8 },
  { id: 5, name: "Guru Olahraga", code: "GO", description: "Mengajar pendidikan jasmani dan olahraga", count: 2 },
  { id: 6, name: "Guru BK", code: "BK", description: "Bimbingan dan konseling siswa", count: 1 },
  { id: 7, name: "Pustakawan", code: "PUS", description: "Mengelola perpustakaan sekolah", count: 1 },
  { id: 8, name: "Staf TU", code: "TU", description: "Tata usaha dan administrasi", count: 3 },
];

export const PositionsManagement = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Briefcase className="h-5 w-5 mr-2" />
            Data Jabatan
          </CardTitle>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Tambah Jabatan
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Tambah Jabatan Baru</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nama Jabatan</Label>
                  <Input id="name" placeholder="Masukkan nama jabatan" />
                </div>
                <div>
                  <Label htmlFor="code">Kode Jabatan</Label>
                  <Input id="code" placeholder="Masukkan kode jabatan" />
                </div>
                <div>
                  <Label htmlFor="description">Deskripsi</Label>
                  <Textarea id="description" placeholder="Masukkan deskripsi jabatan" />
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
              <TableHead>Kode</TableHead>
              <TableHead>Nama Jabatan</TableHead>
              <TableHead>Deskripsi</TableHead>
              <TableHead>Jumlah Guru</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockPositions.map((position) => (
              <TableRow key={position.id}>
                <TableCell className="font-medium">{position.code}</TableCell>
                <TableCell>{position.name}</TableCell>
                <TableCell className="max-w-xs truncate">{position.description}</TableCell>
                <TableCell>
                  <Badge variant="outline">{position.count} orang</Badge>
                </TableCell>
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