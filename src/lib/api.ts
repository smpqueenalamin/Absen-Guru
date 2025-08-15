// API configuration and utilities for PHP backend
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost/api' 
  : '/api';

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

class ApiClient {
  private baseUrl: string;
  private authToken: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.authToken = sessionStorage.getItem('auth_token');
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}/${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(this.authToken && { Authorization: `Bearer ${this.authToken}` }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        return { error: data.error || 'Request failed' };
      }
      
      return { data };
    } catch (error) {
      return { error: 'Network error' };
    }
  }

  setAuthToken(token: string | null) {
    this.authToken = token;
    if (token) {
      sessionStorage.setItem('auth_token', token);
    } else {
      sessionStorage.removeItem('auth_token');
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await this.request<{user: any, session: any}>('auth.php?endpoint=login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.data?.session?.access_token) {
      this.setAuthToken(response.data.session.access_token);
    }
    
    return response;
  }

  async register(email: string, password: string, name: string, role: string = 'teacher') {
    const response = await this.request<{user: any, session: any}>('auth.php?endpoint=register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, role }),
    });
    
    if (response.data?.session?.access_token) {
      this.setAuthToken(response.data.session.access_token);
    }
    
    return response;
  }

  async logout() {
    const response = await this.request('auth.php?endpoint=logout', {
      method: 'POST',
    });
    this.setAuthToken(null);
    return response;
  }

  async getCurrentUser() {
    return this.request<{user: any}>('auth.php?endpoint=me');
  }

  // Attendance endpoints
  async getAttendance(limit: number = 50, offset: number = 0) {
    return this.request<any[]>(`attendance.php?endpoint=list&limit=${limit}&offset=${offset}`);
  }

  async checkIn(locationId?: string, scheduleId?: string, notes?: string) {
    return this.request('attendance.php?endpoint=checkin', {
      method: 'POST',
      body: JSON.stringify({ location_id: locationId, schedule_id: scheduleId, notes }),
    });
  }

  async checkOut(attendanceId?: string, notes?: string) {
    return this.request('attendance.php?endpoint=checkout', {
      method: 'POST',
      body: JSON.stringify({ attendance_id: attendanceId, notes }),
    });
  }

  async getStats() {
    return this.request('attendance.php?endpoint=stats');
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
export default apiClient;