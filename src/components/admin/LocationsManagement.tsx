import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, MapPin } from "lucide-react";

const mockLocations = [
  { 
    id: 1, 
    name: "Gedung A", 
    address: "Jl. Pendidikan No. 123", 
    latitude: -6.2088, 
    longitude: 106.8456, 
    radius: 50,
    description: "Gedung utama untuk kelas 1-3"
  },
  { 
    id: 2, 
    name: "Gedung B", 
    address: "Jl. Pendidikan No. 125", 
    latitude: -6.2090, 
    longitude: 106.8460, 
    radius: 50,
    description: "Gedung untuk kelas 4-6"
  },
  { 
    id: 3, 
    name: "Lapangan Olahraga", 
    address: "Jl. Pendidikan No. 127", 
    latitude: -6.2085, 
    longitude: 106.8450, 
    radius: 100,
    description: "Area olahraga dan upacara"
  },
  { 
    id: 4, 
    name: "Perpustakaan", 
    address: "Jl. Pendidikan No. 129", 
    latitude: -6.2092, 
    longitude: 106.8455, 
    radius: 30,
    description: "Ruang baca dan koleksi buku"
  },
  { 
    id: 5, 
    name: "Kantor Administrasi", 
    address: "Jl. Pendidikan No. 121", 
    latitude: -6.2087, 
    longitude: 106.8458, 
    radius: 40,
    description: "Kantor tata usaha dan kepala sekolah"
  },
];

export const LocationsManagement = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Data Lokasi
          </CardTitle>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Tambah Lokasi
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Tambah Lokasi Baru</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nama Lokasi</Label>
                  <Input id="name" placeholder="Masukkan nama lokasi" />
                </div>
                <div>
                  <Label htmlFor="address">Alamat</Label>
                  <Input id="address" placeholder="Masukkan alamat lengkap" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input id="latitude" type="number" step="0.000001" placeholder="-6.2088" />
                  </div>
                  <div>
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input id="longitude" type="number" step="0.000001" placeholder="106.8456" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="radius">Radius (meter)</Label>
                  <Input id="radius" type="number" placeholder="50" />
                </div>
                <div>
                  <Label htmlFor="description">Deskripsi</Label>
                  <Textarea id="description" placeholder="Masukkan deskripsi lokasi" />
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
              <TableHead>Nama Lokasi</TableHead>
              <TableHead>Alamat</TableHead>
              <TableHead>Koordinat</TableHead>
              <TableHead>Radius</TableHead>
              <TableHead>Deskripsi</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockLocations.map((location) => (
              <TableRow key={location.id}>
                <TableCell className="font-medium">{location.name}</TableCell>
                <TableCell className="max-w-xs truncate">{location.address}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>Lat: {location.latitude}</div>
                    <div>Lng: {location.longitude}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{location.radius}m</Badge>
                </TableCell>
                <TableCell className="max-w-xs truncate">{location.description}</TableCell>
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