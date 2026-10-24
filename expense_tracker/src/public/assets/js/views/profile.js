const ProfileView = (() => {
  async function render(container) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const displayName = user.display_name ? user.display_name.trim() : 'User';
    const initial = displayName ? displayName.charAt(0).toUpperCase() : 'U';
    const email = user.email ? user.email.trim() : 'N/A';
    const mobile = user.mobile ? user.mobile.trim() : 'N/A';
    const role = user.role ? user.role.trim() : 'User';
    
    // Dynamic Join Date or Fallback Date
    const joinedDate = user.created_at || user.createdDate 
      ? new Date(user.created_at || user.createdDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      : 'Jan 15, 2024';

    container.innerHTML = `
      <style>
        .profile-wrapper {
          max-width: 1000px;
          margin: 0 auto;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          font-family: system-ui, -apple-system, sans-serif;
          box-sizing: border-box;
          color: #f8fafc;
        }

        /* Top Header Card - Dark Theme */
        .profile-header-card {
          background: #1e293b;
          border-radius: 16px;
          padding: 1.75rem;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
          border: 1px solid #334155;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1.5rem;
        }

        .user-info-group {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          flex-wrap: wrap;
        }

        .avatar-circle-lg {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: #3b82f6;
          color: #ffffff;
          font-size: 2.25rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 0 15px rgba(59, 130, 246, 0.3);
        }

        .user-text-details {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .user-text-details h2 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 700;
          color: #f8fafc;
          line-height: 1.2;
        }

        .user-text-details p {
          margin: 0;
          color: #94a3b8;
          font-size: 0.925rem;
          word-break: break-all;
        }

        .header-actions {
          display: flex;
          gap: 0.75rem;
        }

        .btn {
          padding: 0.65rem 1.25rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          border: none;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .btn-primary {
          background: #3b82f6;
          color: #ffffff;
        }

        .btn-primary:hover {
          background: #2563eb;
        }

        .btn-outlined {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid #334155;
          color: #e2e8f0;
        }

        .btn-outlined:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        /* Layout Grid */
        .profile-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 1.25rem;
        }

        .info-card {
          background: #1e293b;
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2);
          border: 1px solid #334155;
        }

        .card-title {
          margin: 0 0 1.25rem 0;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid #334155;
          font-size: 1.1rem;
          font-weight: 600;
          color: #f8fafc;
        }

        .details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.25rem;
        }

        .detail-field {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .detail-label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 600;
          color: #94a3b8;
        }

        .detail-value {
          font-size: 0.975rem;
          font-weight: 500;
          color: #f1f5f9;
          word-break: break-word;
        }

        .summary-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 0;
          border-bottom: 1px solid #334155;
        }

        .summary-item:last-child {
          border-bottom: none;
        }

        .badge-active {
          background: rgba(34, 197, 94, 0.15);
          color: #4ade80;
          border: 1px solid rgba(34, 197, 94, 0.3);
          padding: 0.2rem 0.65rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        /* Mobile Responsive View (Center Aligned Avatar & Details) */
        @media (max-width: 640px) {
          .profile-wrapper {
            padding: 0.75rem;
          }

          .profile-header-card {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }

          .user-info-group {
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 100%;
            gap: 0.85rem;
          }

          .user-text-details {
            align-items: center;
          }

          .header-actions {
            width: 100%;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0.5rem;
          }

          .btn {
            text-align: center;
            width: 100%;
          }

          .profile-grid {
            grid-template-columns: 1fr;
          }
        }
      </style>

      <div class="profile-wrapper">
        <!-- Top Profile Card -->
        <div class="profile-header-card">
          <div class="user-info-group">
            <div class="avatar-circle-lg">${initial}</div>
            <div class="user-text-details">
              <h2>${displayName}</h2>
              <p>${email}</p>
            </div>
          </div>
          <div class="header-actions">
            <button class="btn btn-outlined" id="edit-profile-btn">Edit Profile</button>
            <button class="btn btn-primary" id="change-pass-btn">Change Password</button>
          </div>
        </div>

        <!-- Details Grid -->
        <div class="profile-grid">
          <!-- Information Card -->
          <div class="info-card">
            <h3 class="card-title">Personal Information</h3>
            <div class="details-grid">
              <div class="detail-field">
                <span class="detail-label">Display Name</span>
                <span class="detail-value">${displayName}</span>
              </div>
              <div class="detail-field">
                <span class="detail-label">Email Address</span>
                <span class="detail-value">${email}</span>
              </div>
              <div class="detail-field">
                <span class="detail-label">Mobile</span>
                <span class="detail-value">${mobile}</span>
              </div>
              <div class="detail-field">
                <span class="detail-label">Role</span>
                <span class="detail-value">${role}</span>
              </div>
            </div>
          </div>

          <!-- Summary Card -->
          <div class="info-card">
            <h3 class="card-title">Account Summary</h3>
            <div class="summary-item">
              <span style="color: #94a3b8; font-size: 0.875rem;">Account Status</span>
              <span class="badge-active">Active</span>
            </div>
            <div class="summary-item">
              <span style="color: #94a3b8; font-size: 0.875rem;">Joined Date</span>
              <span style="font-weight: 600; font-size: 0.875rem; color: #f8fafc;">${joinedDate}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  return { render };
})();