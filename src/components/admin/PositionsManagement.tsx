import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, Briefcase } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Position {
  id: string;
  name: string;
  description?: string;
  count?: number;
}

export const PositionsManagement = () => {
  const [positions, setPositions] = useState<Position[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingPosition, setEditingPosition] = useState<Position | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchPositions();
  }, []);

  const fetchPositions = async () => {
    try {
      const { data, error } = await supabase
        .from('positions')
        .select(`
          *,
          profiles(count)
        `);

      if (error) throw error;

      const positionsWithCount = data?.map(position => ({
        ...position,
        count: position.profiles?.length || 0
      })) || [];

      setPositions(positionsWithCount);
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memuat data jabatan",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Error", 
        description: "Nama jabatan wajib diisi",
        variant: "destructive"
      });
      return;
    }

    try {
      if (editingPosition) {
        const { error } = await supabase
          .from('positions')
          .update({
            name: formData.name,
            description: formData.description
          })
          .eq('id', editingPosition.id);

        if (error) throw error;

        toast({
          title: "Berhasil",
          description: "Jabatan berhasil diperbarui"
        });
      } else {
        const { error } = await supabase
          .from('positions')
          .insert({
            name: formData.name,
            description: formData.description
          });

        if (error) throw error;

        toast({
          title: "Berhasil",
          description: "Jabatan berhasil ditambahkan"
        });
      }

      resetForm();
      fetchPositions();
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menyimpan data jabatan",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (position: Position) => {
    setEditingPosition(position);
    setFormData({
      name: position.name,
      description: position.description || ""
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus jabatan ini?")) return;

    try {
      const { error } = await supabase
        .from('positions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Berhasil",
        description: "Jabatan berhasil dihapus"
      });
      fetchPositions();
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menghapus jabatan",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({ name: "", description: "" });
    setEditingPosition(null);
    setIsAddDialogOpen(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Briefcase className="h-5 w-5 mr-2" />
            Data Jabatan
          </CardTitle>
          <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
            if (!open) resetForm();
            setIsAddDialogOpen(open);
          }}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Tambah Jabatan
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingPosition ? "Edit Jabatan" : "Tambah Jabatan Baru"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nama Jabatan</Label>
                  <Input 
                    id="name" 
                    placeholder="Masukkan nama jabatan"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Deskripsi</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Masukkan deskripsi jabatan"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
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
              <TableHead>Nama Jabatan</TableHead>
              <TableHead>Deskripsi</TableHead>
              <TableHead>Jumlah Guru</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">Memuat data...</TableCell>
              </TableRow>
            ) : positions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">Tidak ada data</TableCell>
              </TableRow>
            ) : (
              positions.map((position) => (
                <TableRow key={position.id}>
                  <TableCell className="font-medium">{position.name}</TableCell>
                  <TableCell className="max-w-xs truncate">{position.description}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{position.count} orang</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(position)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(position.id)}>
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