import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Camera, MapPin, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@/lib/api";

interface AttendanceCaptureProps {
  attendanceType: "kehadiran" | "pulang";
  requiredLocation?: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  requiresCamera?: boolean;
  requiresGPS?: boolean;
}

export function AttendanceCapture({
  attendanceType = "kehadiran",
  requiredLocation,
  requiresCamera = false,
  requiresGPS = false,
}: AttendanceCaptureProps) {
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (requiresGPS) {
      getCurrentLocation();
    }
  }, [requiresGPS]);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation tidak didukung oleh browser ini");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setError("");
      },
      (error) => {
        setError("Gagal mendapatkan lokasi: " + error.message);
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (attendanceType === "kehadiran") {
        const { error } = await apiClient.checkIn(undefined, undefined, notes);
        if (error) {
          setError(error);
          return;
        }
        toast.success("Check-in berhasil!");
      } else {
        const { error } = await apiClient.checkOut(undefined, notes);
        if (error) {
          setError(error);
          return;
        }
        toast.success("Check-out berhasil!");
      }

      setNotes("");
      
    } catch (error) {
      setError("Terjadi kesalahan sistem");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          {attendanceType === "kehadiran" ? "Absen Masuk" : "Absen Pulang"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Textarea
              placeholder="Tambahkan catatan..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Clock className="mr-2 h-4 w-4 animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                {attendanceType === "kehadiran" ? "Absen Masuk" : "Absen Pulang"}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}