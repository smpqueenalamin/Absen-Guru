import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, MapPin, Clock, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
}

interface AttendanceCaptureProps {
  attendanceType: "kehadiran" | "izin" | "sakit" | "dinas";
  requiredLocation?: LocationData;
  requiresCamera?: boolean;
  requiresGPS?: boolean;
}

export const AttendanceCapture = ({ 
  attendanceType, 
  requiredLocation,
  requiresCamera = true,
  requiresGPS = true 
}: AttendanceCaptureProps) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isLocationValid, setIsLocationValid] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      toast({
        title: "GPS tidak didukung",
        description: "Browser Anda tidak mendukung geolocation",
        variant: "destructive",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };
        setCurrentLocation(location);
        
        // Check if location is within required range (100m radius)
        if (requiredLocation) {
          const distance = calculateDistance(
            location.latitude,
            location.longitude,
            requiredLocation.latitude,
            requiredLocation.longitude
          );
          setIsLocationValid(distance <= 100);
        } else {
          setIsLocationValid(true);
        }
      },
      (error) => {
        toast({
          title: "Error GPS",
          description: "Tidak dapat mengakses lokasi Anda",
          variant: "destructive",
        });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, [requiredLocation, toast]);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  };

  const startCamera = async () => {
    try {
      setIsCapturing(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      toast({
        title: "Error Kamera",
        description: "Tidak dapat mengakses kamera",
        variant: "destructive",
      });
      setIsCapturing(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      if (context) {
        context.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageData);
        
        // Stop camera
        const stream = video.srcObject as MediaStream;
        stream?.getTracks().forEach(track => track.stop());
        setIsCapturing(false);
      }
    }
  };

  const submitAttendance = () => {
    // Here you would submit the attendance data
    toast({
      title: "Absensi Berhasil",
      description: `Absensi ${attendanceType} telah dicatat`,
    });
  };

  const getAttendanceTypeLabel = () => {
    switch (attendanceType) {
      case "kehadiran": return "Kehadiran";
      case "izin": return "Izin";
      case "sakit": return "Sakit";
      case "dinas": return "Perjalanan Dinas";
    }
  };

  const getAttendanceTypeColor = () => {
    switch (attendanceType) {
      case "kehadiran": return "status-present";
      case "izin": return "status-permit";
      case "sakit": return "status-sick";
      case "dinas": return "bg-blue-500 text-white";
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Absensi {getAttendanceTypeLabel()}</span>
          <Badge className={getAttendanceTypeColor()}>
            {getAttendanceTypeLabel()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Time Display */}
        <div className="flex items-center space-x-2 text-lg font-semibold">
          <Clock className="h-5 w-5 text-primary" />
          <span>{new Date().toLocaleString('id-ID')}</span>
        </div>

        {/* GPS Section */}
        {requiresGPS && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">Lokasi GPS</span>
              <Button variant="outline" size="sm" onClick={getCurrentLocation}>
                <MapPin className="h-4 w-4 mr-2" />
                Dapatkan Lokasi
              </Button>
            </div>
            {currentLocation && (
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <p>Lat: {currentLocation.latitude.toFixed(6)}</p>
                    <p>Lng: {currentLocation.longitude.toFixed(6)}</p>
                    <p>Akurasi: {currentLocation.accuracy.toFixed(0)}m</p>
                  </div>
                  {isLocationValid ? (
                    <Badge className="status-present">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Valid
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      Lokasi Tidak Valid
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Camera Section */}
        {requiresCamera && (
          <div className="space-y-3">
            <span className="font-medium">Foto Absensi</span>
            {!isCapturing && !capturedImage && (
              <Button onClick={startCamera} className="w-full">
                <Camera className="h-4 w-4 mr-2" />
                Buka Kamera
              </Button>
            )}
            
            {isCapturing && (
              <div className="space-y-3">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  className="w-full rounded-lg border"
                  style={{ maxHeight: '300px' }}
                />
                <Button onClick={capturePhoto} className="w-full">
                  Ambil Foto
                </Button>
              </div>
            )}
            
            {capturedImage && (
              <div className="space-y-3">
                <img 
                  src={capturedImage} 
                  alt="Captured" 
                  className="w-full rounded-lg border max-h-60 object-cover"
                />
                <Button variant="outline" onClick={() => {
                  setCapturedImage(null);
                  startCamera();
                }}>
                  Ambil Ulang
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Submit Button */}
        <Button 
          onClick={submitAttendance} 
          className="w-full" 
          size="lg"
          disabled={
            (requiresGPS && (!currentLocation || !isLocationValid)) ||
            (requiresCamera && !capturedImage)
          }
        >
          Submit Absensi
        </Button>

        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </CardContent>
    </Card>
  );
};