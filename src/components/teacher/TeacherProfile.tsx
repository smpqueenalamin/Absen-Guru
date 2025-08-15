import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { User, Edit, Camera, Download, MapPin, Calendar } from "lucide-react";

// Mock teacher data
const mockTeacher = {
  id: "1",
  name: "Sri Wahyuni, S.Pd",
  email: "sri@sekolah.com",
  employeeCode: "G001",
  position: "Guru Kelas 5A",
  location: "Gedung A",
  phone: "081234567890",
  birthPlace: "Jakarta",
  birthDate: "1985-05-15",
  address: "Jl. Kebon Jeruk No. 45, Jakarta Barat",
  photoUrl: null,
  schedule: [
    { day: "Senin", time: "07:00 - 12:00", subject: "Matematika", location: "Kelas 5A" },
    { day: "Selasa", time: "07:00 - 12:00", subject: "Bahasa Indonesia", location: "Kelas 5A" },
    { day: "Rabu", time: "07:00 - 12:00", subject: "IPA", location: "Kelas 5A" },
    { day: "Kamis", time: "07:00 - 12:00", subject: "IPS", location: "Kelas 5A" },
    { day: "Jumat", time: "07:00 - 11:00", subject: "PKN", location: "Kelas 5A" },
  ]
};

export const TeacherProfile = () => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [name, setName] = useState(mockTeacher.name);
  const [phone, setPhone] = useState(mockTeacher.phone);
  const [address, setAddress] = useState(mockTeacher.address);

  const handleGenerateIdCard = () => {
    // Generate ID Card functionality
    console.log("Generating ID Card...");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            Profil Saya
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-32 w-32">
                <AvatarImage src={mockTeacher.photoUrl || ""} />
                <AvatarFallback className="text-2xl">
                  {mockTeacher.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm">
                <Camera className="h-4 w-4 mr-2" />
                Ubah Foto
              </Button>
            </div>
            
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Nama Lengkap</Label>
                  <p className="text-lg font-semibold">{mockTeacher.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Kode Guru</Label>
                  <p className="text-lg">{mockTeacher.employeeCode}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                  <p className="text-lg">{mockTeacher.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Jabatan</Label>
                  <Badge variant="secondary">{mockTeacher.position}</Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Lokasi</Label>
                  <p className="text-lg flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {mockTeacher.location}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">No. Telepon</Label>
                  <p className="text-lg">{mockTeacher.phone}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Tempat Lahir</Label>
                  <p className="text-lg">{mockTeacher.birthPlace}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Tanggal Lahir</Label>
                  <p className="text-lg flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(mockTeacher.birthDate)}
                  </p>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Alamat</Label>
                <p className="text-lg">{mockTeacher.address}</p>
              </div>
              
              <div className="flex gap-2">
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profil
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Edit Profil</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Nama Lengkap</Label>
                        <Input 
                          id="name" 
                          value={name} 
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">No. Telepon</Label>
                        <Input 
                          id="phone" 
                          value={phone} 
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="address">Alamat</Label>
                        <Input 
                          id="address" 
                          value={address} 
                          onChange={(e) => setAddress(e.target.value)}
                        />
                      </div>
                      <Button className="w-full" onClick={() => setIsEditDialogOpen(false)}>
                        Simpan Perubahan
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Button onClick={handleGenerateIdCard}>
                  <Download className="h-4 w-4 mr-2" />
                  Unduh ID Card
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Jadwal Mengajar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockTeacher.schedule.map((schedule, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Badge variant="outline" className="w-16 justify-center">
                    {schedule.day}
                  </Badge>
                  <div>
                    <p className="font-medium">{schedule.subject}</p>
                    <p className="text-sm text-muted-foreground">{schedule.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{schedule.location}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};