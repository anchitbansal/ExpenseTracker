/**
 * ApiManager - Centralized API Service Module
 * Handles API calls, headers, device tracking, and request payloads
 */
const ApiManager = (() => {
  const BASE_URL = 'http://139.59.44.69:3011'; 

  /**
   * Helper to perform force logout on status E999 or session invalidation
   */
  function handleForceLogout(message) {
    alert(message || 'Please log in again.');
    
    // Clear stored credentials and device identifiers
    localStorage.removeItem('auth_token');
    localStorage.removeItem('device_id');
    localStorage.removeItem('user');
    sessionStorage.clear();

    // Reload page to reset application state
    window.location.reload();
  }

  /**
   * Helper to get or generate active device ID
   */
  function getDeviceId() {
    let deviceId = localStorage.getItem('device_id');
    if (!deviceId) {
      deviceId = 'sess_' + Math.random().toString(36).substring(2, 11) + Date.now();
      localStorage.setItem('device_id', deviceId);
    }
    return deviceId;
  }

  /**
   * Helper to dynamically gather device headers
   */
  function getDeviceHeaders() {
    const userAgent = navigator.userAgent;
    let deviceName = "Browser";
    if (userAgent.includes("Chrome")) deviceName = "Chrome";
    else if (userAgent.includes("Safari")) deviceName = "Safari";
    else if (userAgent.includes("Firefox")) deviceName = "Firefox";
    else if (userAgent.includes("Edge")) deviceName = "Edge";

    let deviceType = "web";
    if (/android/i.test(userAgent)) deviceType = "android";
    else if (/iPad|iPhone|iPod/.test(userAgent)) deviceType = "ios";

    const deviceToken = localStorage.getItem('device_token') || 'device123';

    return {
      'device-id': getDeviceId(),
      'device-name': deviceName,
      'device-token': deviceToken,
      'device-version': '1.0.0',
      'device-type': deviceType
    };
  }

  /**
   * Universal fetch wrapper method
   */
  async function request(endpoint, payloadData = {}, apiName = "user_registration") {
    const token = localStorage.getItem('auth_token');
    const device_info = getDeviceHeaders();

    const requestBody = {
      data: payloadData,
      api: apiName,
      timestamp: Math.floor(Date.now() / 1000).toString()
    };

    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...device_info
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();

      // CHECK: Handle 'E999' Multi-device login / invalid session status
      if (responseData && responseData.status === 'E999') {
        handleForceLogout(responseData.message);
        return responseData;
      }

      // Automatically store auth_token upon successful response
      if (responseData.status === '0000' && responseData.data) {
        if (responseData.data.token) {
          localStorage.setItem('auth_token', responseData.data.token);
        }
      }
      return responseData;
    } catch (error) {
      console.error(`API Error on [${endpoint}]:`, error);
      throw error;
    }
  }

  return {
    // ---------------- AUTHENTICATION ---------------- //
    
    // User Login
    login: (email, password) => request('/api/user/login', {
      email: email,
      password: password
    }, "user_registration"),

    // User Signup / Registration
    signup: (display_name, email, mobile, password) => request('/api/user/signup', {
      display_name: display_name,
      email: email,
      mobile: mobile || '',
      password: password
    }, "user_registration"),

    // Manual Logout Helper
    logout: () => {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('device_id');
      localStorage.removeItem('user');
      window.location.reload();
    },

    // ---------------- EXPENSES & DATA ---------------- //

    // 1. Dashboard Overview Metrics
    getDashboard: (fromDate = '', toDate = '') => request('/api/user/auth/expense/dashboard', {
      from_date: fromDate || undefined,
      to_date: toDate || undefined
    }, "dashboard"),

    // 2. Main Categories List
    getCategories: () => request('/api/user/auth/category/list', {}, "category list"),

    // 3. Subcategories List by Category ID
    getSubcategoriesByCategory: (categoryId) => request('/api/user/auth/subcategory/list', {
      category_id: categoryId ? categoryId.toString() : ""
    }, "sub category list"),

    // 4. Filtered Expenses List with Pagination
    getExpenses: (pageNo = 1, filters = {}) => {
      const formattedFilters = {};

      if (filters.exp_by) formattedFilters.exp_by = filters.exp_by;
      if (filters.category_id) formattedFilters.category_id = parseInt(filters.category_id);
      if (filters.sub_category_id) formattedFilters.sub_category_id = parseInt(filters.sub_category_id);
      if (filters.pay_type) formattedFilters.pay_type = filters.pay_type;
      if (filters.from_date) formattedFilters.from_date = filters.from_date;
      if (filters.to_date) formattedFilters.to_date = filters.to_date;

      return request('/api/user/auth/expenses/list', {
        page_no: pageNo.toString(),
        filters: formattedFilters
      }, "expenses list");
    },

    // 5. Get Single Expense Details
    getExpenseDetail: (expenseId) => request('/api/user/auth/expense/detail', {
      expense_id: expenseId
    }, "expense detail"),

    // 6. Create New Expense Entry
    createExpense: (payload) => request('/api/user/auth/expense/add', {
      amount: payload.amount,
      exp_by: payload.exp_by,
      category_id: payload.category_id,
      sub_category_id: payload.sub_category_id,
      pay_type: payload.pay_type,
      exp_date: payload.exp_date,
      description: payload.description || ''
    }, "create expense"),

    // 7. Update Existing Expense Entry
    updateExpense: (expenseId, payload) => request('/api/user/auth/expense/update', {
      expense_id: parseInt(expenseId),
      exp_by: payload.exp_by,
      amount: parseFloat(payload.amount),
      category_id: parseInt(payload.category_id),
      sub_category_id: parseInt(payload.sub_category_id),
      pay_type: payload.pay_type,
      exp_date: payload.exp_date,
      description: payload.description || ''
    }, "update expense"),

    // 8. Delete Expense Entry
    deleteExpense: (expenseId) => request('/api/user/auth/expense/delete', {
      expense_id: expenseId
    }, "delete expense"),

    // ---------------- MEMBER MANAGEMENT ---------------- //

    // 1. Get Member List
    getMembers: () => request('/api/user/auth/member/list', {}, "member list"),

    // 2. Add New Member
    addMember: (memberName, relation) => request('/api/user/auth/member/add', {
      member_name: memberName,
      relation: relation
    }, "add member"),

    // 3. Update Existing Member
    updateMember: (memberId, memberName, relation, status) => request('/api/user/auth/member/update', {
      mid: memberId,
      member_name: memberName,
      relation: relation,
      status: status
    }, "update member"),

    // 4. Delete Member
    deleteMember: (memberId) => request('/api/user/auth/member/delete', {
      mid: memberId
    }, "delete member")
  };
})();