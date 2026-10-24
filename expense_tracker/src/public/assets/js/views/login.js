const LoginView = (() => {

  function render(container, callbacks = {}) {
    container.innerHTML = `
      <div class="login-page">
        <div class="login-shell">

          <!-- LEFT HERO -->
          <section class="login-hero">

            <div class="hero-brand">
              <img
                src="../../../img/logo3.png"
                alt="Expense Tracker Logo"
                class="hero-logo"
              />
            </div>

            <div class="hero-content">
              <h1 class="hero-title">
                Take Control of<br />
                Your Expenses
              </h1>

              <p class="hero-subtitle">
                Easily track your spending, manage your budget and achieve
                your financial goals — all in one place.
              </p>

              <div class="hero-features">

                <div class="feature-item">
                  <div class="feature-icon green">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <path d="M18 20V10M12 20V4M6 20v-6"/>
                    </svg>
                  </div>
                  <div class="feature-text">
                    <strong>Track Spending</strong>
                    <span>See where your money goes</span>
                  </div>
                </div>

                <div class="feature-item">
                  <div class="feature-icon blue">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 6v6l4 2"/>
                    </svg>
                  </div>
                  <div class="feature-text">
                    <strong>Manage Budget</strong>
                    <span>Stay within your limits</span>
                  </div>
                </div>

                <div class="feature-item">
                  <div class="feature-icon purple">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <circle cx="12" cy="12" r="10"/>
                      <circle cx="12" cy="12" r="6"/>
                      <circle cx="12" cy="12" r="2"/>
                    </svg>
                  </div>
                  <div class="feature-text">
                    <strong>Reach Goals</strong>
                    <span>Build a better tomorrow</span>
                  </div>
                </div>

              </div>
            </div>

            <!-- Decorative illustration -->
            <div class="hero-illustration" aria-hidden="true">
              <div class="illustration-glow"></div>

              <div class="phone">
                <div class="phone-screen">
                  <div class="phone-heading">Monthly Expenses</div>

                  <div class="donut-chart">
                    <div class="donut-hole"></div>
                  </div>

                  <div class="expense-row">
                    <span><i class="dot green-dot"></i>Food</span>
                    <b>₹5,200</b>
                  </div>
                  <div class="expense-row">
                    <span><i class="dot blue-dot"></i>Transport</span>
                    <b>₹2,300</b>
                  </div>
                  <div class="expense-row">
                    <span><i class="dot orange-dot"></i>Shopping</span>
                    <b>₹3,800</b>
                  </div>
                  <div class="expense-row">
                    <span><i class="dot purple-dot"></i>Bills</span>
                    <b>₹4,500</b>
                  </div>
                </div>
              </div>

              <div class="wallet">
                <div class="wallet-line"></div>
                <div class="wallet-lock"></div>
              </div>

              <div class="coins">
                <span></span>
                <span></span>
                <span></span>
              </div>

              <div class="plant">
                <span class="leaf leaf-one"></span>
                <span class="leaf leaf-two"></span>
                <span class="leaf leaf-three"></span>
                <span class="pot"></span>
              </div>
            </div>

          </section>

          <!-- RIGHT LOGIN CARD -->
          <section class="login-panel">

            <div id="loginCard" class="login-card">

              <!-- Mobile logo -->
              <div class="mobile-brand-logo">
                <img
                  src="../../../img/logo3.png"
                  alt="Expense Tracker Logo"
                />
              </div>

              

              <form id="loginForm" novalidate>

                <div class="form-group">
                  <label for="loginUsername">Email or Username</label>

                  <div class="input-field-wrapper">
                    <span class="input-icon-left">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                    </span>

                    <input
                      type="text"
                      id="loginUsername"
                      required
                      placeholder="Enter your email or username"
                      autocomplete="username"
                    />
                  </div>
                </div>

                <div class="form-group password-group">
                  <label for="loginPassword">Password</label>

                  <div class="input-field-wrapper password-wrapper">
                    <span class="input-icon-left">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="11" width="18" height="11" rx="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                    </span>

                    <input
                      type="password"
                      id="loginPassword"
                      required
                      placeholder="Enter your password"
                      autocomplete="current-password"
                    />

                    <button
                      type="button"
                      class="toggle-pwd-btn"
                      data-target="loginPassword"
                      aria-label="Show password"
                    >
                      <svg class="eye-icon eye-open" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>

                      <svg class="eye-icon eye-off hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                        <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <div class="form-options-row">
                  <label class="checkbox-container">
                    <input type="checkbox" id="rememberMe" />
                    <span class="custom-checkbox"></span>
                    <span>Remember me</span>
                  </label>

                  <a href="#" id="forgotPasswordLink" class="forgot-pwd-link">
                    Forgot password?
                  </a>
                </div>

                <button type="submit" id="loginSubmitBtn" class="btn-primary-blue">
                  <span class="btn-text">Login</span>

                  <svg class="login-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>

                  <div class="spinner hidden"></div>
                </button>

                <div id="loginError" class="error-msg"></div>
              </form>

              <div class="auth-switch">
                Don’t have an account?
                <a href="#" id="showSignup">Sign Up</a>
              </div>

            </div>
          </section>

        </div>
      </div>
    `;

    bindEvents(container, callbacks);
  }

  function bindEvents(container, callbacks) {

    // Toggle Password Visibility
    const toggleBtn = container.querySelector('.toggle-pwd-btn');

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const input = container.querySelector('#loginPassword');
        const eyeOpen = toggleBtn.querySelector('.eye-open');
        const eyeOff = toggleBtn.querySelector('.eye-off');

        if (input) {
          const isPassword = input.type === 'password';

          input.type = isPassword ? 'text' : 'password';

          if (eyeOpen && eyeOff) {
            eyeOpen.classList.toggle('hidden', isPassword);
            eyeOff.classList.toggle('hidden', !isPassword);
          }

          toggleBtn.setAttribute(
            'aria-label',
            isPassword ? 'Hide password' : 'Show password'
          );
        }
      });
    }

    // Switch to Signup
    const switchBtn = container.querySelector('#showSignup');

    if (switchBtn) {
      switchBtn.addEventListener('click', (e) => {
        e.preventDefault();

        if (typeof callbacks.onSwitchToSignup === 'function') {
          callbacks.onSwitchToSignup();
        }
      });
    }

    // Forgot Password
    const forgotPwdBtn = container.querySelector('#forgotPasswordLink');

    if (forgotPwdBtn) {
      forgotPwdBtn.addEventListener('click', (e) => {
        e.preventDefault();

        if (typeof callbacks.onForgotPassword === 'function') {
          callbacks.onForgotPassword();
        }
      });
    }

    // Google Login
    const googleBtn = container.querySelector('#googleLoginBtn');

    if (googleBtn) {
      googleBtn.addEventListener('click', () => {
        if (typeof callbacks.onGoogleLogin === 'function') {
          callbacks.onGoogleLogin();
        }
      });
    }

    // Form Submission
    const form = container.querySelector('#loginForm');

    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = container
          .querySelector('#loginUsername')
          .value
          .trim();

        const password = container
          .querySelector('#loginPassword')
          .value
          .trim();

        const rememberMe = container
          .querySelector('#rememberMe')
          .checked;

        const errorEl = container.querySelector('#loginError');
        const submitBtn = container.querySelector('#loginSubmitBtn');
        const btnText = submitBtn.querySelector('.btn-text');
        const spinner = submitBtn.querySelector('.spinner');

        errorEl.textContent = '';

        submitBtn.disabled = true;

        if (btnText) {
          btnText.style.opacity = '0.5';
        }

        if (spinner) {
          spinner.classList.remove('hidden');
        }

        try {
          const res = await ApiManager.login(
            email,
            password,
            rememberMe
          );

          if (res && res.status === '0000') {

            if (typeof callbacks.onLoginSuccess === 'function') {
              callbacks.onLoginSuccess(res.data);
            }

          } else {

            errorEl.textContent =
              res.message || 'Invalid credentials.';
          }

        } catch (err) {

          console.error('Login Error:', err);

          errorEl.textContent =
            'Server error during sign in.';

        } finally {

          submitBtn.disabled = false;

          if (btnText) {
            btnText.style.opacity = '1';
          }

          if (spinner) {
            spinner.classList.add('hidden');
          }
        }
      });
    }
  }

  return { render };

})();