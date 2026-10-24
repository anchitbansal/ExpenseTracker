const MembersView = (() => {
  async function render(container) {
    container.innerHTML = `
      <style>
        .members-container {
          padding: 1.25rem;
          max-width: 1100px;
          margin: 0 auto;
          color: #f8fafc;
          font-family: system-ui, -apple-system, sans-serif;
          box-sizing: border-box;
        }

        .members-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .header-title-group h2 {
          color: #f8fafc;
          margin: 0;
          font-size: 1.65rem;
          font-weight: 700;
        }

        .btn-add {
          background: #3b82f6;
          color: #ffffff;
          border: none;
          padding: 0.75rem 1.35rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          font-size: 1rem;
        }

        .btn-add:hover {
          background: #2563eb;
        }

        .btn-add-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 22px;
          height: 22px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
        }

        /* Rounded Rectangle Stats Card */
        .stats-summary-card {
          background: #1e293b;
          border: 1px solid #334155;
          border-radius: 16px;
          padding: 1rem 1.25rem;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-around;
          gap: 1rem;
          box-shadow: 0 4px 15px rgba(0,0,0,0.15);
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.2rem;
        }

        .stat-label {
          font-size: 0.85rem;
          color: #94a3b8;
          text-transform: uppercase;
          font-weight: 600;
          letter-spacing: 0.05em;
        }

        .stat-value {
          font-size: 1.4rem;
          font-weight: 700;
          color: #f8fafc;
        }

        .stat-divider {
          width: 1px;
          height: 35px;
          background-color: #334155;
        }

        .members-table-wrapper {
          background: #1e293b;
          border-radius: 12px;
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.3);
          border: 1px solid #334155;
          overflow: hidden;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
          color: #e2e8f0;
          text-align: left;
        }

        .data-table th {
          padding: 1.1rem 1rem;
          color: #94a3b8;
          font-size: 0.95rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 600;
          border-bottom: 1px solid #334155;
          background: rgba(15, 23, 42, 0.4);
        }

        .data-table td {
          padding: 1.1rem 1rem;
          border-bottom: 1px solid #334155;
          font-size: 1.05rem;
        }

        .data-table tr:last-child td {
          border-bottom: none;
        }

        .icon-btn-edit {
          background: rgba(59, 130, 246, 0.15);
          color: #60a5fa;
          border: 1px solid rgba(59, 130, 246, 0.3);
          padding: 0.55rem;
          border-radius: 8px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .icon-btn-edit:hover {
          background: #3b82f6;
          color: #ffffff;
        }

        .icon-btn-delete {
          background: rgba(239, 68, 68, 0.15);
          color: #f87171;
          border: 1px solid rgba(239, 68, 68, 0.3);
          padding: 0.55rem;
          border-radius: 8px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .icon-btn-delete:hover {
          background: #ef4444;
          color: #ffffff;
        }

        /* Subtle Serial Number Badge for Mobile Card First Row */
        .mobile-sr-badge {
          display: none;
          align-items: center;
          justify-content: center;
          min-width: 26px;
          height: 26px;
          padding: 0 0.35rem;
          background: rgba(255, 255, 255, 0.08);
          color: #94a3b8;
          font-weight: 600;
          font-size: 0.85rem;
          border-radius: 6px;
          border: 1px solid rgba(255, 255, 255, 0.12);
        }

        /* Desktop Column Classes */
        .desktop-sr-col {
          display: table-cell;
          color: #94a3b8;
          font-weight: 600;
        }

        .text-center {
          text-align: center;
        }

        /* Mobile Layout Adjustments */
        @media (max-width: 640px) {
          .members-container {
            padding: 0.75rem;
          }

          .members-header {
            flex-direction: column;
            align-items: stretch;
          }

          .btn-add {
            width: 100%;
            justify-content: center;
          }

          .stats-summary-card {
            padding: 0.85rem;
          }

          .stat-value {
            font-size: 1.2rem;
          }

          .members-table-wrapper {
            background: transparent;
            border: none;
            box-shadow: none;
          }

          .data-table thead {
            display: none;
          }

          .data-table, .data-table tbody, .data-table tr, .data-table td {
            display: block;
            width: 100%;
            box-sizing: border-box;
          }

          /* Hide Desktop SR Column in Mobile */
          .desktop-sr-col {
            display: none !important;
          }

          .data-table tr {
            display: flex;
            flex-direction: column;
            margin-bottom: 1rem;
            border: 1px solid #334155;
            border-radius: 12px;
            padding: 0.85rem 1rem;
            background: #1e293b;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          }

          .data-table td {
            text-align: right;
            padding: 10px 0 !important;
            border-bottom: 1px dashed #334155 !important;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 1rem;
          }

          /* 1st Row for Mobile: Serial Badge on Left & Edit Button on Right */
          .data-table td.action-cell {
            order: 1;
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            border-bottom: 1px solid #334155 !important;
            padding-bottom: 8px !important;
            margin-bottom: 4px !important;
          }

          .data-table td.action-cell::before {
            display: none !important;
          }

          .mobile-sr-badge {
            display: inline-flex !important;
          }

          .data-table td[data-label="Member Name"] { order: 2; }
          .data-table td[data-label="Relation"] { order: 3; }
          .data-table td[data-label="Status"] { order: 4; }

          .data-table td[data-label="Created At"] {
            order: 5;
            border-bottom: none !important;
          }

          .data-table td::before {
            content: attr(data-label);
            font-weight: 600;
            color: #94a3b8;
            font-size: 0.85rem;
            text-transform: uppercase;
          }
        }
      </style>

      <div class="members-container">
        <div class="members-header">
          <div class="header-title-group">
            <h2>Manage Members</h2>
          </div>
          <button id="addMemberBtn" class="btn-add">
            <span class="btn-add-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </span>
            <span>Add Member</span>
          </button>
        </div>

        <!-- Rounded Rectangle Container for Member Stats -->
        <div class="stats-summary-card">
          <div class="stat-item">
            <span class="stat-label">Total</span>
            <span id="totalMembersCount" class="stat-value" style="color: #60a5fa;">0</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-label">Active</span>
            <span id="activeMembersCount" class="stat-value" style="color: #4ade80;">0</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-label">Inactive</span>
            <span id="inactiveMembersCount" class="stat-value" style="color: #f87171;">0</span>
          </div>
        </div>

        <div id="membersList">Loading members...</div>
      </div>
    `;

    document.getElementById('addMemberBtn').addEventListener('click', openAddModal);
    await loadMembers();
  }

  async function loadMembers() {
    const listContainer = document.getElementById('membersList');
    const totalCountEl = document.getElementById('totalMembersCount');
    const activeCountEl = document.getElementById('activeMembersCount');
    const inactiveCountEl = document.getElementById('inactiveMembersCount');

    if (!listContainer) return;

    try {
      const res = await ApiManager.getMembers();

      if (res && res.status === 'E999') {
        alert(res.message || 'Session expired');
        localStorage.clear();
        window.location.reload();
        return;
      }

      if (res.status === '0000' && res.data) {
        const members = Array.isArray(res.data) ? res.data : (res.data.list || []);
        
        let activeCount = 0;
        let inactiveCount = 0;

        members.forEach(m => {
          if (m.status === 'active' || m.status == 1) {
            activeCount++;
          } else {
            inactiveCount++;
          }
        });

        if (totalCountEl) totalCountEl.textContent = members.length;
        if (activeCountEl) activeCountEl.textContent = activeCount;
        if (inactiveCountEl) inactiveCountEl.textContent = inactiveCount;

        if (members.length === 0) {
          listContainer.innerHTML = '<p style="color: #94a3b8; text-align: center; padding: 2rem 0; font-size: 1.05rem;">No members found.</p>';
          return;
        }

        listContainer.innerHTML = `
          <div class="members-table-wrapper">
            <table class="data-table">
              <thead>
                <tr>
                  <th style="width: 50px;">#</th>
                  <th>Member Name</th>
                  <th>Relation</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th class="text-center" style="width: 80px;">Action</th>
                </tr>
              </thead>
              <tbody>
                ${members.map((m, index) => {
                  const isActive = m.status === 'active' || m.status == 1;
                  const statusText = isActive ? 'Active' : 'Inactive';
                  const srNo = index + 1;
                  
                  return `
                    <tr>
                      <!-- Leftmost Serial Number for Desktop -->
                      <td class="desktop-sr-col">${srNo}</td>
                      <td data-label="Member Name" style="color: #f8fafc; font-weight: 600; font-size: 1.1rem;">${m.member_name}</td>
                      <td data-label="Relation" style="color: #cbd5e1;">${m.relation || '-'}</td>
                      <td data-label="Status">
                        <span style="padding: 4px 10px; border-radius: 12px; font-size: 0.85rem; font-weight: 600; background: ${isActive ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)'}; color: ${isActive ? '#4ade80' : '#f87171'}; border: 1px solid ${isActive ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'};">
                          ${statusText}
                        </span>
                      </td>
                      <td data-label="Created At" style="color: #94a3b8;">${m.created_at ? new Date(m.created_at).toLocaleDateString() : '-'}</td>
                      <td class="action-cell text-center">
                        <!-- Mobile Only Serial Badge (Left Side) -->
                        <span class="mobile-sr-badge">${srNo}</span>
                        
                        <!-- Edit Button -->
                        <button class="icon-btn-edit edit-member-btn" 
                          data-id="${m.mid}" 
                          data-name="${m.member_name}" 
                          data-relation="${m.relation || ''}" 
                          data-status="${m.status}"
                          title="Edit Member">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        `;

        bindTableActions();
      } else {
        listContainer.innerHTML = `<p style="color: #f87171; font-size: 1.05rem;">${res.message || 'Failed to load members.'}</p>`;
      }
    } catch (err) {
      console.error('Error loading members:', err);
      listContainer.innerHTML = '<p style="color: #f87171; font-size: 1.05rem;">Server error loading members.</p>';
    }
  }

  function bindTableActions() {
    document.querySelectorAll('.edit-member-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget;
        const id = target.getAttribute('data-id');
        const name = target.getAttribute('data-name');
        const relation = target.getAttribute('data-relation');
        const status = target.getAttribute('data-status');
        openEditModal(id, name, relation, status);
      });
    });
  }

  function openAddModal() {
    const modalHtml = `
      <div style="padding: 1.25rem; color: #f8fafc; background: #1e293b; border-radius: 12px; max-width: 100%; box-sizing: border-box;">
        <h3 style="margin-top: 0; color: #f8fafc; font-size: 1.3rem;">Add New Member</h3>
        <form id="addMemberForm" style="margin-top: 1.25rem;">
          <div style="margin-bottom: 1.15rem;">
            <label style="display: block; margin-bottom: 0.4rem; font-weight: 500; color: #94a3b8; font-size: 0.95rem;">Member Name</label>
            <input type="text" id="memberNameInput" required style="width: 100%; padding: 0.75rem; background: #0f172a; border: 1px solid #334155; border-radius: 8px; box-sizing: border-box; font-size: 1rem; color: #f8fafc;" />
          </div>
          <div style="margin-bottom: 1.15rem;">
            <label style="display: block; margin-bottom: 0.4rem; font-weight: 500; color: #94a3b8; font-size: 0.95rem;">Relation (e.g. Spouse, Brother, Father)</label>
            <input type="text" id="memberRelationInput" required style="width: 100%; padding: 0.75rem; background: #0f172a; border: 1px solid #334155; border-radius: 8px; box-sizing: border-box; font-size: 1rem; color: #f8fafc;" />
          </div>
          <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem;">
            <button type="button" onclick="AppModule.closeModal()" style="padding: 0.75rem 1rem; border: 1px solid #334155; background: rgba(255,255,255,0.05); color: #cbd5e1; border-radius: 8px; cursor: pointer; flex: 1; font-weight: 600; font-size: 0.95rem;">Cancel</button>
            <button type="submit" style="padding: 0.75rem 1rem; background: #3b82f6; color: white; border: none; border-radius: 8px; cursor: pointer; flex: 1; font-weight: 600; font-size: 0.95rem;">Save</button>
          </div>
        </form>
      </div>
    `;

    AppModule.showModal(modalHtml);

    document.getElementById('addMemberForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('memberNameInput').value.trim();
      const relation = document.getElementById('memberRelationInput').value.trim();

      try {
        const res = await ApiManager.addMember(name, relation);
        if (res.status === '0000') {
          AppModule.closeModal();
          loadMembers();
        } else {
          alert(res.message || 'Failed to add member.');
        }
      } catch (err) {
        alert('Server error adding member.');
      }
    });
  }

  function openEditModal(id, currentName, currentRelation, currentStatus) {
    const isStatusActive = currentStatus === 'active' || currentStatus == 1;

    const modalHtml = `
      <div style="padding: 1.25rem; color: #f8fafc; background: #1e293b; border-radius: 12px; max-width: 100%; box-sizing: border-box;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; border-bottom: 1px solid #334155; padding-bottom: 0.75rem;">
          <h3 style="margin: 0; color: #f8fafc; font-size: 1.3rem;">Update Member</h3>
          <button id="modalDeleteBtn" class="icon-btn-delete" title="Delete Member">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        </div>

        <form id="editMemberForm">
          <div style="margin-bottom: 1.15rem;">
            <label style="display: block; margin-bottom: 0.4rem; font-weight: 500; color: #94a3b8; font-size: 0.95rem;">Member Name</label>
            <input type="text" id="editMemberName" value="${currentName}" required style="width: 100%; padding: 0.75rem; background: #0f172a; border: 1px solid #334155; border-radius: 8px; box-sizing: border-box; font-size: 1rem; color: #f8fafc;" />
          </div>
          <div style="margin-bottom: 1.15rem;">
            <label style="display: block; margin-bottom: 0.4rem; font-weight: 500; color: #94a3b8; font-size: 0.95rem;">Relation</label>
            <input type="text" id="editMemberRelation" value="${currentRelation}" required style="width: 100%; padding: 0.75rem; background: #0f172a; border: 1px solid #334155; border-radius: 8px; box-sizing: border-box; font-size: 1rem; color: #f8fafc;" />
          </div>
          <div style="margin-bottom: 1.15rem;">
            <label style="display: block; margin-bottom: 0.4rem; font-weight: 500; color: #94a3b8; font-size: 0.95rem;">Status</label>
            <select id="editMemberStatus" style="width: 100%; padding: 0.75rem; background: #0f172a; border: 1px solid #334155; border-radius: 8px; box-sizing: border-box; font-size: 1rem; color: #f8fafc;">
              <option value="1" ${isStatusActive ? 'selected' : ''}>Active</option>
              <option value="0" ${!isStatusActive ? 'selected' : ''}>Inactive</option>
            </select>
          </div>
          <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem;">
            <button type="button" onclick="AppModule.closeModal()" style="padding: 0.75rem 1rem; border: 1px solid #334155; background: rgba(255,255,255,0.05); color: #cbd5e1; border-radius: 8px; cursor: pointer; flex: 1; font-weight: 600; font-size: 0.95rem;">Cancel</button>
            <button type="submit" style="padding: 0.75rem 1rem; background: #3b82f6; color: white; border: none; border-radius: 8px; cursor: pointer; flex: 1; font-weight: 600; font-size: 0.95rem;">Update</button>
          </div>
        </form>
      </div>
    `;

    AppModule.showModal(modalHtml);

    document.getElementById('modalDeleteBtn').addEventListener('click', async () => {
      if (confirm('Are you sure you want to delete this member?')) {
        try {
          const res = await ApiManager.deleteMember(id);
          if (res.status === '0000') {
            AppModule.closeModal();
            loadMembers();
          } else {
            alert(res.message || 'Failed to delete member.');
          }
        } catch (err) {
          alert('Error deleting member.');
        }
      }
    });

    document.getElementById('editMemberForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('editMemberName').value.trim();
      const relation = document.getElementById('editMemberRelation').value.trim();
      const status = document.getElementById('editMemberStatus').value;

      try {
        const res = await ApiManager.updateMember(id, name, relation, status);
        if (res.status === '0000') {
          AppModule.closeModal();
          loadMembers();
        } else {
          alert(res.message || 'Failed to update member.');
        }
      } catch (err) {
        alert('Server error updating member.');
      }
    });
  }

  return { render };
})();