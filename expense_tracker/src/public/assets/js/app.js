/**
 * AppModule - Main Application Controller
 * Handles Navigation, Dynamic View Lifecycle, Authentication Flows, Modals, and Theme Toggle
 */
const AppModule = (() => {
  // Registered View Modules for Dashboard Tabs
  const views = {
    dashboard: DashboardView,
    expenses: ExpensesView,
    category: CategoriesView,
    profile: ProfileView,
    members: MembersView
  };

  function init() {
    initTheme();
    bindThemeEvents();
    bindNavEvents();
    bindGlobalAuthEvents();

    // Check token persistence matching ApiManager storage key
    const token = localStorage.getItem('auth_token');
    if (token) {
      showDashboard();
    } else {
      showLogin();
    }
  }

  // --- Theme Toggle Logic --- //

  function initTheme() {
    // Default theme dark hai (agar localStorage mein pehle se set na ho)
    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme);
  }

  function applyTheme(theme) {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }

    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (themeToggleBtn) {
      const sunIcon = themeToggleBtn.querySelector('.sun-icon');
      const moonIcon = themeToggleBtn.querySelector('.moon-icon');
      if (sunIcon && moonIcon) {
        // Dark theme active hone par Sun Icon show karo (to switch to light)
        // Light theme active hone par Moon Icon show karo (to switch to dark)
        sunIcon.classList.toggle('hidden', theme !== 'dark');
        moonIcon.classList.toggle('hidden', theme === 'dark');
      }
    }
  }

  function bindThemeEvents() {
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => {
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        const nextTheme = isLight ? 'dark' : 'light';
        localStorage.setItem('theme', nextTheme);
        applyTheme(nextTheme);
      });
    }
  }

  // --- Auth View Navigation & Rendering --- //

  function showLogin() {
    const authContainer = document.getElementById('authContainer');
    const dashboardContainer = document.getElementById('dashboard');

    if (dashboardContainer) dashboardContainer.classList.add('hidden');
    if (authContainer) {
      authContainer.classList.remove('hidden');
      LoginView.render(authContainer, {
        onSwitchToSignup: showSignup,
        onLoginSuccess: handleAuthSuccess
      });
    }
  }

  function showSignup() {
    const authContainer = document.getElementById('authContainer');
    const dashboardContainer = document.getElementById('dashboard');

    if (dashboardContainer) dashboardContainer.classList.add('hidden');
    if (authContainer) {
      authContainer.classList.remove('hidden');
      SignupView.render(authContainer, {
        onSwitchToLogin: showLogin,
        onSignupSuccess: () => {
          alert('Signup successful! Please log in.');
          showLogin();
        }
      });
    }
  }

  function handleAuthSuccess(data) {
    if (data && data.token) {
      localStorage.setItem('auth_token', data.token);
    }
    if (data && data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    showDashboard();
  }

  function bindGlobalAuthEvents() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        if (typeof ApiManager !== 'undefined' && typeof ApiManager.logout === 'function') {
          ApiManager.logout();
        } else {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          showLogin();
        }
      });
    }
  }

  // --- Dashboard & Navigation Routing --- //

  function showDashboard() {
    const authContainer = document.getElementById('authContainer');
    const dashboardContainer = document.getElementById('dashboard');

    if (authContainer) authContainer.classList.add('hidden');
    if (dashboardContainer) dashboardContainer.classList.remove('hidden');

    setActiveNavItem('dashboard');
    loadTab('dashboard');
  }

  function bindNavEvents() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        const targetTab = item.getAttribute('data-tab');
        setActiveNavItem(targetTab);
        loadTab(targetTab);
      });
    });
  }

  function setActiveNavItem(tabKey) {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      if (item.getAttribute('data-tab') === tabKey) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  function loadTab(tabKey) {
    const mainContent = document.getElementById('mainContent');
    if (!mainContent) return;

    mainContent.innerHTML = ''; // Container reset

    if (views[tabKey] && typeof views[tabKey].render === 'function') {
      views[tabKey].render(mainContent);
    } else {
      console.warn(`View for tab "${tabKey}" is not defined or missing a render method.`);
    }
  }

  // --- Modal Utilities --- //

  function showModal(contentHtml) {
    const modal = document.getElementById('globalModal');
    const modalCard = document.getElementById('modalCard');
    if (modal && modalCard) {
      modalCard.innerHTML = contentHtml;
      modal.classList.remove('hidden');
    }
  }

  function closeModal() {
    const modal = document.getElementById('globalModal');
    const modalCard = document.getElementById('modalCard');
    if (modal && modalCard) {
      modal.classList.add('hidden');
      modalCard.innerHTML = '';
    }
  }

  return { init, showLogin, showSignup, showDashboard, loadTab, showModal, closeModal };
})();

// Application Bootstrap
document.addEventListener('DOMContentLoaded', AppModule.init);