import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Settings, School, MapPin, Clock, Shield, Bell } from "lucide-react";

export const SettingsManagement = () => {
  const [settings, setSettings] = useState({
    schoolName: "SDN 01 Cempaka Putih",
    schoolAddress: "Jl. Pendidikan No. 123, Jakarta Pusat",
    schoolEmail: "admin@sdn01cempakaputih.sch.id",
    schoolPhone: "(021) 1234-5678",
    defaultLatitude: "-6.2088",
    defaultLongitude: "106.8456",
    attendanceRadius: "50",
    workStartTime: "07:00",
    workEndTime: "14:00",
    lateThreshold: "15",
    autoAlpha: true,
    autoAlphaTime: "12:00",
    emailNotifications: true,
    smsNotifications: false,
    attendanceReminder: true,
  });

  const handleSave = () => {
    console.log("Saving settings:", settings);
    // Here you would save to your backend
  };

  const handleInputChange = (key: string, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="space-y-6">
      {/* School Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <School className="h-5 w-5 mr-2" />
            Informasi Sekolah
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="schoolName">Nama Sekolah</Label>
              <Input
                id="schoolName"
                value={settings.schoolName}
                onChange={(e) => handleInputChange("schoolName", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="schoolEmail">Email Sekolah</Label>
              <Input
                id="schoolEmail"
                type="email"
                value={settings.schoolEmail}
                onChange={(e) => handleInputChange("schoolEmail", e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="schoolAddress">Alamat Sekolah</Label>
            <Textarea
              id="schoolAddress"
              value={settings.schoolAddress}
              onChange={(e) => handleInputChange("schoolAddress", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="schoolPhone">Nomor Telepon</Label>
            <Input
              id="schoolPhone"
              value={settings.schoolPhone}
              onChange={(e) => handleInputChange("schoolPhone", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* GPS Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Pengaturan GPS
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="defaultLatitude">Latitude Default</Label>
              <Input
                id="defaultLatitude"
                type="number"
                step="0.000001"
                value={settings.defaultLatitude}
                onChange={(e) => handleInputChange("defaultLatitude", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="defaultLongitude">Longitude Default</Label>
              <Input
                id="defaultLongitude"
                type="number"
                step="0.000001"
                value={settings.defaultLongitude}
                onChange={(e) => handleInputChange("defaultLongitude", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="attendanceRadius">Radius Absensi (meter)</Label>
              <Input
                id="attendanceRadius"
                type="number"
                value={settings.attendanceRadius}
                onChange={(e) => handleInputChange("attendanceRadius", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Time Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Pengaturan Waktu
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="workStartTime">Jam Masuk Kerja</Label>
              <Input
                id="workStartTime"
                type="time"
                value={settings.workStartTime}
                onChange={(e) => handleInputChange("workStartTime", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="workEndTime">Jam Pulang Kerja</Label>
              <Input
                id="workEndTime"
                type="time"
                value={settings.workEndTime}
                onChange={(e) => handleInputChange("workEndTime", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="lateThreshold">Batas Telat (menit)</Label>
              <Input
                id="lateThreshold"
                type="number"
                value={settings.lateThreshold}
                onChange={(e) => handleInputChange("lateThreshold", e.target.value)}
              />
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="autoAlpha">Auto Alpha</Label>
                <p className="text-sm text-muted-foreground">
                  Otomatis tandai sebagai alpha jika belum absen pada waktu tertentu
                </p>
              </div>
              <Switch
                id="autoAlpha"
                checked={settings.autoAlpha}
                onCheckedChange={(checked) => handleInputChange("autoAlpha", checked)}
              />
            </div>
            
            {settings.autoAlpha && (
              <div>
                <Label htmlFor="autoAlphaTime">Waktu Auto Alpha</Label>
                <Input
                  id="autoAlphaTime"
                  type="time"
                  value={settings.autoAlphaTime}
                  onChange={(e) => handleInputChange("autoAlphaTime", e.target.value)}
                  className="w-32"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Pengaturan Notifikasi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="emailNotifications">Notifikasi Email</Label>
              <p className="text-sm text-muted-foreground">
                Kirim notifikasi absensi via email
              </p>
            </div>
            <Switch
              id="emailNotifications"
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => handleInputChange("emailNotifications", checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="smsNotifications">Notifikasi SMS</Label>
              <p className="text-sm text-muted-foreground">
                Kirim notifikasi absensi via SMS
              </p>
            </div>
            <Switch
              id="smsNotifications"
              checked={settings.smsNotifications}
              onCheckedChange={(checked) => handleInputChange("smsNotifications", checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="attendanceReminder">Pengingat Absensi</Label>
              <p className="text-sm text-muted-foreground">
                Kirim pengingat jika guru belum absen
              </p>
            </div>
            <Switch
              id="attendanceReminder"
              checked={settings.attendanceReminder}
              onCheckedChange={(checked) => handleInputChange("attendanceReminder", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Pengaturan Keamanan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button variant="outline">
              Backup Database
            </Button>
            <Button variant="outline">
              Reset Password Semua User
            </Button>
            <Button variant="destructive">
              Reset Semua Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg">
          <Settings className="h-4 w-4 mr-2" />
          Simpan Pengaturan
        </Button>
      </div>
    </div>
  );
};