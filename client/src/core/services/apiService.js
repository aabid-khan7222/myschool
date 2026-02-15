const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const isDev = import.meta.env.DEV;
const TOKEN_KEY = 'preskool_token';

const getToken = () => localStorage.getItem(TOKEN_KEY);

class ApiService {
  async makeRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    if (isDev) console.log('Making API request to:', url);

    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(options.headers || {}),
    };

    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers,
        mode: 'cors',
        credentials: 'omit',
        ...options,
      });

      if (isDev) {
        console.log('Response status:', response.status);
      }

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem('preskool_user');
          window.dispatchEvent(new CustomEvent('auth:sessionExpired'));
        }
        const errorText = await response.text();
        if (isDev) console.error('Response error text:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const text = await response.text();
      if (!text || !text.trim()) {
        throw new Error('Server returned empty response. Check that the API URL is correct and CORS is configured for this site.');
      }
      let data;
      try {
        data = JSON.parse(text);
      } catch (_) {
        throw new Error('Server returned invalid JSON. Check API URL and backend logs.');
      }
      if (isDev) console.log('Response data:', data);
      return data;
    } catch (error) {
      if (isDev) {
        console.error('API request failed:', error);
      }
      throw error;
    }
  }

  // Academic Years
  async getAcademicYears() {
    return this.makeRequest('/academic-years');
  }

  async getAcademicYearById(id) {
    return this.makeRequest(`/academic-years/${id}`);
  }

  // Classes
  async getClasses() {
    return this.makeRequest('/classes');
  }

  async getClassById(id) {
    return this.makeRequest(`/classes/${id}`);
  }

  async getClassesByAcademicYear(academicYearId) {
    return this.makeRequest(`/classes/academic-year/${academicYearId}`);
  }

  // Sections
  async getSections() {
    return this.makeRequest('/sections');
  }

  async getSectionById(id) {
    return this.makeRequest(`/sections/${id}`);
  }

  async getSectionsByClass(classId) {
    return this.makeRequest(`/sections/class/${classId}`);
  }

  // Class schedules (timetable: class + subject + time_slot)
  async getClassSchedules() {
    return this.makeRequest('/class-schedules');
  }

  async getClassScheduleById(id) {
    return this.makeRequest(`/class-schedules/${id}`);
  }

  // Students
  async getStudents() {
    return this.makeRequest('/students');
  }

  async createStudent(studentData) {
    return this.makeRequest('/students', {
      method: 'POST',
      body: JSON.stringify(studentData)
    });
  }

  async updateStudent(id, studentData) {
    return this.makeRequest(`/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(studentData)
    });
  }

  async getStudentById(id) {
    return this.makeRequest(`/students/${id}`);
  }

  async getStudentsByClass(classId) {
    return this.makeRequest(`/students/class/${classId}`);
  }

  // Blood Groups
  async getBloodGroups() {
    return this.makeRequest('/blood-groups');
  }

  async getBloodGroupById(id) {
    return this.makeRequest(`/blood-groups/${id}`);
  }

  // Religions
  async getReligions() {
    return this.makeRequest('/religions');
  }

  async getReligionById(id) {
    return this.makeRequest(`/religions/${id}`);
  }

  // Casts
  async getCasts() {
    return this.makeRequest('/casts');
  }

  async getCastById(id) {
    return this.makeRequest(`/casts/${id}`);
  }

  // Mother Tongues
  async getMotherTongues() {
    return this.makeRequest('/mother-tongues');
  }

  async getMotherTongueById(id) {
    return this.makeRequest(`/mother-tongues/${id}`);
  }

  // Houses
  async getHouses() {
    return this.makeRequest('/houses');
  }

  async getHouseById(id) {
    return this.makeRequest(`/houses/${id}`);
  }

  // Parents
  async getParents() {
    return this.makeRequest('/parents');
  }

  async getParentById(id) {
    return this.makeRequest(`/parents/${id}`);
  }

  async getParentByStudentId(studentId) {
    return this.makeRequest(`/parents/student/${studentId}`);
  }

  async createParent(parentData) {
    return this.makeRequest('/parents', {
      method: 'POST',
      body: JSON.stringify(parentData)
    });
  }

  async updateParent(id, parentData) {
    return this.makeRequest(`/parents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(parentData)
    });
  }

  // Guardians
  async getGuardians() {
    return this.makeRequest('/guardians');
  }

  async getGuardianById(id) {
    return this.makeRequest(`/guardians/${id}`);
  }

  async getGuardianByStudentId(studentId) {
    return this.makeRequest(`/guardians/student/${studentId}`);
  }

  // Teachers
  async getTeachers() {
    return this.makeRequest('/teachers');
  }

  async getTeacherById(id) {
    return this.makeRequest(`/teachers/${id}`);
  }

  async getTeachersByClass(classId) {
    return this.makeRequest(`/teachers/class/${classId}`);
  }

  // Staff
  async getStaff() {
    return this.makeRequest('/staff');
  }

  async getStaffById(id) {
    return this.makeRequest(`/staff/${id}`);
  }

  // Departments
  async getDepartments() {
    return this.makeRequest('/departments');
  }

  async getDepartmentById(id) {
    return this.makeRequest(`/departments/${id}`);
  }

  // Designations
  async getDesignations() {
    return this.makeRequest('/designations');
  }

  async getDesignationById(id) {
    return this.makeRequest(`/designations/${id}`);
  }

  // Users
  async getUsers() {
    return this.makeRequest('/users');
  }

  async getUserById(id) {
    return this.makeRequest(`/users/${id}`);
  }

  // User Roles
  async getUserRoles() {
    return this.makeRequest('/user-roles');
  }

  async getUserRoleById(id) {
    return this.makeRequest(`/user-roles/${id}`);
  }

  // Dashboard stats
  async getDashboardStats() {
    return this.makeRequest('/dashboard/stats');
  }

  async getLeaveApplications(params = {}) {
    const searchParams = new URLSearchParams();
    if (params.limit != null) searchParams.set('limit', params.limit);
    const qs = searchParams.toString();
    return this.makeRequest(`/leave-applications${qs ? `?${qs}` : ''}`);
  }

  // Transport
  async getTransportRoutes() {
    return this.makeRequest('/transport/routes');
  }

  async getTransportRouteById(id) {
    return this.makeRequest(`/transport/routes/${id}`);
  }

  async getTransportPickupPoints() {
    return this.makeRequest('/transport/pickup-points');
  }

  async getTransportPickupPointById(id) {
    return this.makeRequest(`/transport/pickup-points/${id}`);
  }

  async getTransportVehicles() {
    return this.makeRequest('/transport/vehicles');
  }

  async getTransportVehicleById(id) {
    return this.makeRequest(`/transport/vehicles/${id}`);
  }

  async getTransportDrivers() {
    return this.makeRequest('/transport/drivers');
  }

  async getTransportDriverById(id) {
    return this.makeRequest(`/transport/drivers/${id}`);
  }

  // Subjects
  async getSubjects() {
    return this.makeRequest('/subjects');
  }

  async getSubjectById(id) {
    return this.makeRequest(`/subjects/${id}`);
  }

  async getSubjectsByClass(classId) {
    return this.makeRequest(`/subjects/class/${classId}`);
  }

  // Hostels
  async getHostels() {
    return this.makeRequest('/hostels');
  }

  async getHostelById(id) {
    return this.makeRequest(`/hostels/${id}`);
  }

  // Hostel Rooms
  async getHostelRooms() {
    return this.makeRequest('/hostel-rooms');
  }

  async getHostelRoomById(id) {
    return this.makeRequest(`/hostel-rooms/${id}`);
  }

  // Room Types
  async getRoomTypes() {
    return this.makeRequest('/room-types');
  }

  async getRoomTypeById(id) {
    return this.makeRequest(`/room-types/${id}`);
  }

  // Health check
  async getHealthStatus() {
    return this.makeRequest('/health');
  }

  // Auth
  async login(username, password) {
    return this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  async getMe() {
    return this.makeRequest('/auth/me');
  }
}

export const apiService = new ApiService();
