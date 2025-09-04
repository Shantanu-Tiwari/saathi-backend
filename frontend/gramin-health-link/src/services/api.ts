// API Service for Sehat Saathi Frontend
// Centralized API client for all backend communication

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('sehat-saathi-token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('sehat-saathi-token', token);
    } else {
      localStorage.removeItem('sehat-saathi-token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Authentication endpoints
  async requestOTP(mobile: string) {
    return this.request('/auth/request-otp', {
      method: 'POST',
      body: JSON.stringify({ mobile: `+91${mobile}` }),
    });
  }

  async verifyOTP(mobile: string, otp: string) {
    return this.request('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ mobile: `+91${mobile}`, otp }),
    });
  }

  // User endpoints
  async getMe() {
    return this.request('/users/me');
  }

  async updateMe(userData: any) {
    return this.request('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(userData),
    });
  }

  async submitCredentials(formData: FormData) {
    const url = `${this.baseURL}/users/submit-credentials`;
    const config: RequestInit = {
      method: 'POST',
      headers: {
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
      body: formData,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Doctor endpoints
  async getDoctors() {
    return this.request('/doctors');
  }

  async getDoctorDetails(id: string) {
    return this.request(`/doctors/${id}`);
  }

  async getDoctorSchedule() {
    return this.request('/doctors/me/schedule');
  }

  async addSlot(slotData: any) {
    return this.request('/doctors/me/slots', {
      method: 'POST',
      body: JSON.stringify(slotData),
    });
  }

  // Appointment endpoints
  async bookAppointment(appointmentData: any) {
    return this.request('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    });
  }

  async getAppointments() {
    return this.request('/appointments');
  }

  // Health Record endpoints
  async createHealthRecord(healthRecordData: any) {
    return this.request('/healthrecords', {
      method: 'POST',
      body: JSON.stringify(healthRecordData),
    });
  }

  async getHealthRecords() {
    return this.request('/healthrecords');
  }

  async getHealthRecordById(id: string) {
    return this.request(`/healthrecords/${id}`);
  }

  // Prescription endpoints
  async createPrescription(prescriptionData: any) {
    return this.request('/prescriptions', {
      method: 'POST',
      body: JSON.stringify(prescriptionData),
    });
  }

  async getPrescriptions() {
    return this.request('/prescriptions');
  }

  // Pharmacy endpoints
  async getAllPharmacies() {
    return this.request('/pharmacies');
  }

  async getPharmacy(id: string) {
    return this.request(`/pharmacies/${id}`);
  }

  async updateInventory(inventoryData: any) {
    return this.request('/pharmacies/update-inventory', {
      method: 'PATCH',
      body: JSON.stringify(inventoryData),
    });
  }

  async getPrescriptionQueue() {
    return this.request('/pharmacies/prescription-queue');
  }

  // Health check endpoint
  async healthCheck() {
    return this.request('/health');
  }
}

// Create and export a singleton instance
export const apiClient = new ApiClient(API_BASE_URL);
export default apiClient;
