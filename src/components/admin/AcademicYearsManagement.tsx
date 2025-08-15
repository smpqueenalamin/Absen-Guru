import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, GraduationCap, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AcademicYear {
  id: string;
  year: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

export const AcademicYearsManagement = () => {
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingYear, setEditingYear] = useState<AcademicYear | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    year: "",
    startDate: "",
    endDate: "",
    isActive: false
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchAcademicYears();
  }, []);

  const fetchAcademicYears = async () => {
    try {
      const { data, error } = await supabase
        .from('academic_years')
        .select('*')
        .order('year', { ascending: false });

      if (error) throw error;
      setAcademicYears(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memuat data tahun ajaran",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.year.trim() || !formData.startDate || !formData.endDate) {
      toast({
        title: "Error",
        description: "Semua field wajib diisi",
        variant: "destructive"
      });
      return;
    }

    try {
      // If setting this year as active, deactivate all others first
      if (formData.isActive) {
        await supabase
          .from('academic_years')
          .update({ is_active: false })
          .neq('id', editingYear?.id || '');
      }

      const yearData = {
        year: formData.year,
        start_date: formData.startDate,
        end_date: formData.endDate,
        is_active: formData.isActive
      };

      if (editingYear) {
        const { error } = await supabase
          .from('academic_years')
          .update(yearData)
          .eq('id', editingYear.id);

        if (error) throw error;

        toast({
          title: "Berhasil",
          description: "Tahun ajaran berhasil diperbarui"
        });
      } else {
        const { error } = await supabase
          .from('academic_years')
          .insert(yearData);

        if (error) throw error;

        toast({
          title: "Berhasil",
          description: "Tahun ajaran berhasil ditambahkan"
        });
      }

      resetForm();
      fetchAcademicYears();
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menyimpan data tahun ajaran",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (year: AcademicYear) => {
    setEditingYear(year);
    setFormData({
      year: year.year,
      startDate: year.start_date,
      endDate: year.end_date,
      isActive: year.is_active
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus tahun ajaran ini?")) return;

    try {
      const { error } = await supabase
        .from('academic_years')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Berhasil",
        description: "Tahun ajaran berhasil dihapus"
      });
      fetchAcademicYears();
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menghapus tahun ajaran",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      year: "",
      startDate: "",
      endDate: "",
      isActive: false
    });
    setEditingYear(null);
    setIsAddDialogOpen(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <GraduationCap className="h-5 w-5 mr-2" />
            Tahun Ajaran
          </CardTitle>
          <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
            if (!open) resetForm();
            setIsAddDialogOpen(open);
          }}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Tambah Tahun Ajaran
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingYear ? "Edit Tahun Ajaran" : "Tambah Tahun Ajaran Baru"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="year">Tahun Ajaran</Label>
                  <Input 
                    id="year" 
                    placeholder="2024/2025"
                    value={formData.year}
                    onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="startDate">Tanggal Mulai</Label>
                    <Input 
                      id="startDate" 
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">Tanggal Selesai</Label>
                    <Input 
                      id="endDate" 
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="active"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                  />
                  <Label htmlFor="active">Tahun ajaran aktif</Label>
                </div>
                <Button className="w-full" onClick={handleSubmit}>
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
              <TableHead>Tahun Ajaran</TableHead>
              <TableHead>Periode</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">Memuat data...</TableCell>
              </TableRow>
            ) : academicYears.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">Tidak ada data</TableCell>
              </TableRow>
            ) : (
              academicYears.map((year) => (
                <TableRow key={year.id}>
                  <TableCell className="font-medium">{year.year}</TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                      {formatDate(year.start_date)} - {formatDate(year.end_date)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={year.is_active ? "default" : "secondary"}>
                      {year.is_active ? "Aktif" : "Tidak Aktif"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(year)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(year.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};