import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { AttendanceChart } from "@/components/dashboard/AttendanceChart";
import { AttendanceCapture } from "@/components/attendance/AttendanceCapture";
import { TeachersManagement } from "@/components/admin/TeachersManagement";
import { SchedulesManagement } from "@/components/admin/SchedulesManagement";
import { PositionsManagement } from "@/components/admin/PositionsManagement";
import { LocationsManagement } from "@/components/admin/LocationsManagement";
import { AcademicYearsManagement } from "@/components/admin/AcademicYearsManagement";
import { AttendanceDataManagement } from "@/components/admin/AttendanceDataManagement";
import { ReportsManagement } from "@/components/admin/ReportsManagement";
import { SettingsManagement } from "@/components/admin/SettingsManagement";
import { TeacherProfile } from "@/components/teacher/TeacherProfile";
import { AttendanceHistory } from "@/components/teacher/AttendanceHistory";
import { LoginForm } from "@/components/auth/LoginForm";
import { RoleSwitcher } from "@/components/dashboard/RoleSwitcher";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, MapPin, Briefcase, Camera, Clock, CheckCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import heroImage from "@/assets/hero-attendance.jpg";

const Index = () => {
  const { user, isLoading } = useAuth();
  const [activeMenuItem, setActiveMenuItem] = useState("dashboard");
  const [showAttendance, setShowAttendance] = useState(false);

  // Show loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-primary rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
            <span className="text-white font-bold text-lg">SA</span>
          </div>
          <p className="text-muted-foreground">Memuat...</p>
        </div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!user) {
    return <LoginForm />;
  }

  const renderContent = () => {
    if (showAttendance) {
      return (
        <div className="p-6">
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => setShowAttendance(false)}
              className="mb-4"
            >
              ← Kembali ke Dashboard
            </Button>
          </div>
          <AttendanceCapture 
            attendanceType="kehadiran"
            requiredLocation={{
              latitude: -6.2088,
              longitude: 106.8456,
              accuracy: 10
            }}
            requiresCamera={true}
            requiresGPS={true}
          />
        </div>
      );
    }

    if (activeMenuItem === "dashboard") {
      return (
        <div className="p-6 space-y-6">
          {/* Hero Section */}
          <Card className="bg-gradient-hero text-white overflow-hidden">
            <CardContent className="p-0">
              <div className="flex items-center">
                <div className="flex-1 p-8">
                  <h1 className="text-3xl font-bold mb-2">
                    Selamat Datang di Sistem Absensi
                  </h1>
                  <p className="text-white/90 mb-6">
                    Kelola absensi guru dengan mudah menggunakan teknologi GPS dan kamera
                  </p>
                  {user.role === "teacher" && (
                    <Button 
                      variant="secondary" 
                      size="lg"
                      onClick={() => setShowAttendance(true)}
                    >
                      <Camera className="mr-2 h-5 w-5" />
                      Absen Sekarang
                    </Button>
                  )}
                </div>
                <div className="flex-1 h-48 bg-cover bg-center" 
                     style={{ backgroundImage: `url(${heroImage})` }}>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Role Switcher for Demo */}
          <RoleSwitcher />

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total Guru"
              value={74}
              icon={Users}
              description="Guru aktif terdaftar"
              moreInfoTo="/teachers"
              variant="default"
            />
            <StatsCard
              title="Jabatan"
              value={8}
              icon={Briefcase}
              description="Jabatan tersedia"
              moreInfoTo="/positions"
              variant="info"
            />
            <StatsCard
              title="Lokasi"
              value={5}
              icon={MapPin}
              description="Lokasi absensi"
              moreInfoTo="/locations"
              variant="warning"
            />
            <StatsCard
              title="Jadwal"
              value={156}
              icon={Calendar}
              description="Jadwal mengajar"
              moreInfoTo="/schedules"
              variant="success"
            />
          </div>

          {/* Chart */}
          <AttendanceChart />

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Aktivitas Terbaru</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Sri Wahyuni, S.Pd", time: "08:00", status: "hadir", type: "Kehadiran" },
                  { name: "Ahmad Fauzi, M.Pd", time: "08:15", status: "telat", type: "Kehadiran" },
                  { name: "Dewi Sartika, S.Pd", time: "07:45", status: "hadir", type: "Kehadiran" },
                  { name: "Budi Santoso, S.Pd", time: "09:00", status: "izin", type: "Izin" },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                      <div>
                        <p className="font-medium">{activity.name}</p>
                        <p className="text-sm text-muted-foreground">{activity.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className={`status-${activity.status}`}>
                        {activity.status === "hadir" ? "Hadir" : 
                         activity.status === "telat" ? "Telat" :
                         activity.status === "izin" ? "Izin" : "Sakit"}
                      </Badge>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        {activity.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    // Admin menu content
    if (user.role === "admin") {
      switch (activeMenuItem) {
        case "teachers":
          return (
            <div className="p-6">
              <TeachersManagement />
            </div>
          );
        case "schedules":
          return (
            <div className="p-6">
              <SchedulesManagement />
            </div>
          );
        case "positions":
          return (
            <div className="p-6">
              <PositionsManagement />
            </div>
          );
        case "locations":
          return (
            <div className="p-6">
              <LocationsManagement />
            </div>
          );
        case "years":
          return (
            <div className="p-6">
              <AcademicYearsManagement />
            </div>
          );
        case "attendance":
          return (
            <div className="p-6">
              <AttendanceDataManagement />
            </div>
          );
        case "reports":
          return (
            <div className="p-6">
              <ReportsManagement />
            </div>
          );
        case "settings":
          return (
            <div className="p-6">
              <SettingsManagement />
            </div>
          );
        default:
          return null;
      }
    }

    // Teacher menu content
    switch (activeMenuItem) {
      case "profile":
        return (
          <div className="p-6">
            <TeacherProfile />
          </div>
        );
      case "history":
        return (
          <div className="p-6">
            <AttendanceHistory />
          </div>
        );
      case "idcard":
        return (
          <div className="p-6">
            <Card>
              <CardHeader>
                <CardTitle>ID Card</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Fitur ID Card akan dikembangkan di sini.
                </p>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        userRole={user.role}
        userName={user.name}
        userAvatar={user.avatar}
      />
      <div className="flex">
        <Sidebar 
          userRole={user.role}
          activeItem={activeMenuItem}
          onItemClick={setActiveMenuItem}
        />
        <main className="flex-1">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Index;
