import { isDev, isProd } from '../utils/runtimeEnv';

const BUILD_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

let cachedSuperAdminBaseUrl: string | null = null;

async function getSuperAdminApiBaseUrl(): Promise<string> {
  if (cachedSuperAdminBaseUrl) return cachedSuperAdminBaseUrl;

  // For now, mirror tenant API base logic but target /super-admin/api.
  // BUILD_API_URL typically ends with /api.
  let base = BUILD_API_URL;
  if (base.endsWith('/api')) {
    base = base.replace(/\/api$/, '/super-admin/api');
  } else {
    base = base.replace(/\/+$/, '') + '/super-admin/api';
  }
  cachedSuperAdminBaseUrl = base;
  return cachedSuperAdminBaseUrl;
}

class SuperAdminApiService {
  async makeRequest(endpoint: string, options: RequestInit = {}) {
    const base = await getSuperAdminApiBaseUrl();
    const url = `${base}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

    if (isDev) {
      console.log('[SuperAdmin] API request:', url);
    }

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(options.headers || {}),
    };

    try {
      const response = await fetch(url, {
        method: options.method || 'GET',
        headers,
        credentials: 'include',
        ...options,
      });

      if (isDev) {
        console.log('[SuperAdmin] Response status:', response.status);
      }

      if (!response.ok) {
        const text = await response.text();
        if (isDev) console.error('[SuperAdmin] Error response:', text);
        throw new Error(text || `HTTP error ${response.status}`);
      }

      const text = await response.text();
      if (!text || !text.trim()) {
        throw new Error('Empty response from Super Admin API');
      }
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error('Invalid JSON from Super Admin API');
      }
      return data;
    } catch (err) {
      if (isDev) console.error('[SuperAdmin] API request failed:', err);
      throw err;
    }
  }

  // Auth
  async login(emailOrUsername: string, password: string) {
    return this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ emailOrUsername, password }),
    });
  }

  async getProfile() {
    return this.makeRequest('/me');
  }

  async logout() {
    return this.makeRequest('/auth/logout', { method: 'POST' });
  }

  // Schools
  async listSchools(status?: string) {
    const qs = status ? `?status=${encodeURIComponent(status)}` : '';
    return this.makeRequest(`/schools${qs}`);
  }

  async updateSchoolStatus(id: number, status: 'active' | 'disabled') {
    return this.makeRequest(`/schools/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async getSchoolById(id: number) {
    return this.makeRequest(`/schools/${id}`);
  }

  async updateSchool(
    id: number,
    payload: {
      school_name?: string;
      institute_number?: string;
    }
  ) {
    return this.makeRequest(`/schools/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  }

  async deleteSchool(id: number) {
    return this.makeRequest(`/schools/${id}`, {
      method: 'DELETE',
    });
  }

  async createSchool(payload: {
    school_name: string;
    institute_number: string;
    admin_name: string;
    admin_email: string;
    admin_password: string;
  }) {
    return this.makeRequest('/schools', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // Platform stats
  async getPlatformStats() {
    return this.makeRequest('/stats/platform');
  }
}

export const superAdminApiService = new SuperAdminApiService();

