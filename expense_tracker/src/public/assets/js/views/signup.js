/**
 * Signup View Module
 * Renders the Registration Card and attaches validation/submit listeners
 */
const SignupView = (() => {
  /**
   * Render Signup Card into container
   * @param {HTMLElement} container - Target DOM element (e.g. #authContainer)
   * @param {Object} callbacks - Hooks for navigation and form handling ({ onSignupSuccess, onSwitchToLogin })
   */
  function render(container, callbacks = {}) {
    container.innerHTML = `
      <div id="signupCard" class="auth-card">
        <!-- Site Name & Modern Wallet Analytics Icon -->
        <div class="auth-brand">
          <div class="brand-icon-badge" title="Expenses Tracker">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3"></path>
              <path d="M3 10h18"></path>
              <path d="M16 19l2-2 3 3"></path>
            </svg>
          </div>
          <h1 class="auth-brand-title">Create Account</h1>
        </div>

        <form id="signupForm">
          <div class="form-group">
            <label for="signupDisplayName">Display Name</label>
            <input type="text" id="signupDisplayName" required placeholder="e.g. Alex Smith" />
          </div>
          <div class="form-group">
            <label for="signupEmail">Email</label>
            <input type="email" id="signupEmail" required placeholder="alex@example.com" />
          </div>
          <div class="form-group">
            <label for="signupMobile">Mobile Number</label>
            <input type="text" id="signupMobile" required placeholder="9876543210" />
          </div>
          <div class="form-group">
            <label>Password</label>
            <div class="password-wrapper" style="position: relative; display: flex; align-items: center;">
              <input type="password" id="signupPassword" required placeholder="Enter password" style="width: 100%; padding-right: 2.5rem;" />
              <button type="button" class="toggle-pwd-btn" data-target="signupPassword" style="position: absolute; right: 0.5rem; background: transparent; border: none; cursor: pointer;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              </button>
            </div>
          </div>

          <!-- Retype Password -->
          <div class="form-group">
            <label>Retype Password</label>
            <div class="password-wrapper" style="position: relative; display: flex; align-items: center;">
              <input type="password" id="signupConfirmPassword" required placeholder="Confirm password" style="width: 100%; padding-right: 2.5rem;" />
              <button type="button" class="toggle-pwd-btn" data-target="signupConfirmPassword" style="position: absolute; right: 0.5rem; background: transparent; border: none; cursor: pointer;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              </button>
            </div>
          </div>

          <button type="submit" id="signupSubmitBtn" class="btn">
            <span>Sign Up</span>
          </button>
          <div id="signupError" class="error-msg" style="color: #f87171; margin-top: 0.5rem; font-size: 14px;"></div>
        </form>

        <div class="auth-switch">
          Already have an account? <a href="#" id="showLogin">Log in</a>
        </div>
      </div>
    `;

    bindEvents(container, callbacks);
  }

  function bindEvents(container, callbacks) {
    // Password Toggle Buttons
    container.querySelectorAll('.toggle-pwd-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        const input = container.querySelector(`#${targetId}`);
        if (input) {
          input.type = input.type === 'password' ? 'text' : 'password';
        }
      });
    });

    // Switch to Login View
    const switchBtn = container.querySelector('#showLogin');
    if (switchBtn) {
      switchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (typeof callbacks.onSwitchToLogin === 'function') {
          callbacks.onSwitchToLogin();
        }
      });
    }

    // Form Submission
    const form = container.querySelector('#signupForm');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const displayName = container.querySelector('#signupDisplayName').value.trim();
        const email = container.querySelector('#signupEmail').value.trim();
        const mobile = container.querySelector('#signupMobile').value.trim();
        const password = container.querySelector('#signupPassword').value;
        const confirmPassword = container.querySelector('#signupConfirmPassword').value;
        const errorEl = container.querySelector('#signupError');

        errorEl.textContent = '';

        if (password !== confirmPassword) {
          errorEl.textContent = 'Passwords do not match.';
          return;
        }

        try {
          const res = await ApiManager.signup(displayName, email, mobile, password );
          if (res && res.status === '0000') {
            if (typeof callbacks.onSignupSuccess === 'function') {
              callbacks.onSignupSuccess(res.data);
            }
          } else {
            errorEl.textContent = res.message || 'Registration failed.';
          }
        } catch (err) {
          console.error('Signup Error:', err);
          errorEl.textContent = 'Server error during sign up.';
        }
      });
    }
  }

  return { render };
})();