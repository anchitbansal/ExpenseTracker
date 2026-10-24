/**
 * Dashboard View Module (Dark Theme - 3x1 Desktop Layout)
 * Renders summary metrics, horizontal bar charts, and detailed data lists based on API response
 */
const DashboardView = (() => {
  // Store chart instances globally to properly destroy old ones when filtering
  const chartInstances = {};

  /**
   * Helper function to dynamically load Chart.js library if not present
   */
  async function ensureChartJsLoaded() {
    if (window.Chart) return;
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
      script.onload = resolve;
      script.onerror = () => reject(new Error('Failed to load Chart.js'));
      document.head.appendChild(script);
    });
  }

  /**
   * Main render function
   * @param {HTMLElement} container - Target DOM element (`#mainContent`)
   */
  async function render(container) {
    container.innerHTML = `
      <style>
        .dashboard-view {
          color: #f8fafc;
          font-family: system-ui, -apple-system, sans-serif;
        }
        .view-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .view-header h2 {
          color: #f8fafc;
          margin: 0;
          font-size: 1.65rem;
          font-weight: 700;
        }
        .filter-bar-compact {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
          background: #1e293b;
          padding: 0.75rem 1rem;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.25);
          border: 1px solid #334155;
        }
        .filter-inputs {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }
        .date-group {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .date-group label {
          font-size: 13px;
          font-weight: 600;
          color: #94a3b8;
        }
        /* Dark Mobile Date Input Styling */
        .input-date-sm {
          padding: 0.4rem 0.6rem;
          border: 1px solid #334155;
          border-radius: 6px;
          font-size: 14px;
          color: #f8fafc !important;
          background-color: #0f172a !important;
          min-height: 36px;
          box-sizing: border-box;
          color-scheme: dark;
        }
        .input-date-sm:focus {
          outline: none;
          border-color: #3b82f6;
        }
        .filter-actions {
          display: flex;
          gap: 0.5rem;
        }
        .btn-filter-primary {
          background: #3b82f6;
          color: #ffffff;
          border: none;
          padding: 0.45rem 1rem;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          transition: background 0.2s ease;
        }
        .btn-filter-primary:hover {
          background: #2563eb;
        }
        .btn-filter-secondary {
          background: rgba(255, 255, 255, 0.05);
          color: #cbd5e1;
          border: 1px solid #334155;
          padding: 0.45rem 1rem;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: background 0.2s ease;
        }
        .btn-filter-secondary:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        /* Metric Cards Grid */
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .metric-card {
          background: #1e293b;
          padding: 1.25rem;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          display: flex;
          align-items: center;
          gap: 1rem;
          border: 1px solid #334155;
        }
        .metric-icon {
          font-size: 2rem;
        }
        .metric-label {
          font-size: 13px;
          color: #94a3b8;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }
        .metric-info h3 {
          margin: 0.2rem 0 0 0;
          font-size: 1.4rem;
          color: #f8fafc;
          font-weight: 700;
        }

        /* Breakdown Cards Grid - Strictly 3 Columns on Desktop */
        .breakdown-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
        }
        .breakdown-card {
          background: #1e293b;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.25);
          border: 1px solid #334155;
          padding: 1.15rem;
          display: flex;
          flex-direction: column;
          min-width: 0; /* Prevents overflow inside grid columns */
        }
        .breakdown-card h3 {
          margin: 0 0 1rem 0;
          font-size: 1.05rem;
          color: #f8fafc;
          border-bottom: 1px solid #334155;
          padding-bottom: 0.65rem;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .chart-container {
          position: relative;
          min-height: 220px;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        /* Details List at Bottom */
        .breakdown-details-list {
          margin-top: 1rem;
          padding-top: 0.75rem;
          border-top: 1px solid #334155;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          max-height: 250px;
          overflow-y: auto;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0.65rem;
          background: #0f172a;
          border-radius: 8px;
          font-size: 13px;
          border: 1px solid rgba(255,255,255,0.03);
        }
        .detail-label {
          display: flex;
          align-items: center;
          gap: 0.55rem;
          font-weight: 600;
          color: #e2e8f0;
          overflow: hidden;
        }
        .detail-label span:last-child {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .detail-color-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          display: inline-block;
          flex-shrink: 0;
        }
        .detail-stats {
          text-align: right;
          color: #cbd5e1;
          flex-shrink: 0;
          margin-left: 0.5rem;
        }
        .detail-amount {
          font-weight: 700;
          color: #f8fafc;
        }
        .detail-subtext {
          font-size: 11px;
          color: #94a3b8;
        }

        /* Responsive Breakpoints */
        @media (max-width: 1024px) {
          .breakdown-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .metrics-grid {
            grid-template-columns: 1fr;
          }
          .breakdown-grid {
            grid-template-columns: 1fr;
          }
          .view-header {
            flex-direction: column;
            align-items: stretch;
          }
          .filter-bar-compact, .filter-inputs {
            flex-direction: column;
            align-items: stretch;
            width: 100%;
          }
          .date-group {
            justify-content: space-between;
          }
          .date-group input {
            width: 65%;
          }
          .filter-actions {
            width: 100%;
          }
          .filter-actions button {
            flex: 1;
          }
        }
      </style>

      <div class="dashboard-view">
        <div class="view-header">
          <h2>Dashboard Overview</h2>
          
          <!-- Filter Bar -->
          <div class="filter-bar-compact">
            <div class="filter-inputs">
              <div class="date-group">
                <label for="dashFromDate">From:</label>
                <input type="date" id="dashFromDate" class="input-date-sm" />
              </div>
              <div class="date-group">
                <label for="dashToDate">To:</label>
                <input type="date" id="dashToDate" class="input-date-sm" />
              </div>
            </div>
            
            <div class="filter-actions">
              <button id="applyDashFilterBtn" class="btn-filter-primary">Apply</button>
              <button id="resetDashFilterBtn" class="btn-filter-secondary">Reset</button>
            </div>
          </div>
        </div>

        <!-- Metric Summary Cards -->
        <div class="metrics-grid">
          <div class="metric-card">
            <span class="metric-icon">💰</span>
            <div class="metric-info">
              <span class="metric-label">Total Spent</span>
              <h3 id="totalSpent" style="color: #60a5fa;">₹0.00</h3>
            </div>
          </div>
          <div class="metric-card">
            <span class="metric-icon">🧾</span>
            <div class="metric-info">
              <span class="metric-label">Total Transactions</span>
              <h3 id="totalTransactions" style="color: #38bdf8;">0</h3>
            </div>
          </div>
          <div class="metric-card">
            <span class="metric-icon">💳</span>
            <div class="metric-info">
              <span class="metric-label">Avg / Transaction</span>
              <h3 id="avgTransaction" style="color: #4ade80;">₹0.00</h3>
            </div>
          </div>
        </div>

        <!-- Breakdown Section (3 Columns on Desktop) -->
        <div class="breakdown-grid">
          
          <!-- Category Breakdown -->
          <div class="breakdown-card">
            <h3>📁 By Category</h3>
            <div class="chart-container" id="categoryChartContainer">
              <span style="color: #94a3b8;">Loading chart...</span>
            </div>
            <div class="breakdown-details-list" id="categoryDetailsList"></div>
          </div>

          <!-- Payment Type Breakdown -->
          <div class="breakdown-card">
            <h3>💳 By Pay Type</h3>
            <div class="chart-container" id="payTypeChartContainer">
              <span style="color: #94a3b8;">Loading chart...</span>
            </div>
            <div class="breakdown-details-list" id="payTypeDetailsList"></div>
          </div>

          <!-- Spent By Breakdown -->
          <div class="breakdown-card">
            <h3>👤 By Member (Exp By)</h3>
            <div class="chart-container" id="expByChartContainer">
              <span style="color: #94a3b8;">Loading chart...</span>
            </div>
            <div class="breakdown-details-list" id="expByDetailsList"></div>
          </div>

        </div>
      </div>
    `;

    // Event Listeners for Filters
    document.getElementById('applyDashFilterBtn').addEventListener('click', () => {
      const fromDate = document.getElementById('dashFromDate').value;
      const toDate = document.getElementById('dashToDate').value;
      fetchAndPopulateDashboard(fromDate, toDate);
    });

    document.getElementById('resetDashFilterBtn').addEventListener('click', () => {
      document.getElementById('dashFromDate').value = '';
      document.getElementById('dashToDate').value = '';
      fetchAndPopulateDashboard();
    });

    // Load Chart.js dynamically then fetch data
    try {
      await ensureChartJsLoaded();
      await fetchAndPopulateDashboard();
    } catch (err) {
      console.error(err);
      showErrorMessage('Error loading required chart assets.');
    }
  }

  /**
   * Fetch dashboard payload & update UI components
   */
  async function fetchAndPopulateDashboard(fromDate = '', toDate = '') {
    try {
      const res = await ApiManager.getDashboard(fromDate, toDate);

      if (res && res.status === '0000' && res.data) {
        const { summary, by_category, by_pay_type, by_exp_by } = res.data;

        // Render Summary Cards
        renderSummaryMetrics(summary || { total_spent: 0, total_transactions: 0 });

        // Render Category Bar Chart & Details
        renderBarChartAndDetails(
          'categoryChartContainer', 'categoryDetailsList', 'categoryCanvas', 
          by_category || [], item => ({
            label: item.category_name,
            amount: parseFloat(item.total_amount),
            count: item.transaction_count
          }), summary.total_spent
        );

        // Render Pay Type Bar Chart & Details
        renderBarChartAndDetails(
          'payTypeChartContainer', 'payTypeDetailsList', 'payTypeCanvas', 
          by_pay_type || [], item => ({
            label: item.pay_type,
            amount: parseFloat(item.total_amount),
            count: item.transaction_count
          }), summary.total_spent
        );

        // Render Exp By Bar Chart & Details
        renderBarChartAndDetails(
          'expByChartContainer', 'expByDetailsList', 'expByCanvas', 
          by_exp_by || [], item => ({
            label: item.exp_by,
            amount: parseFloat(item.total_amount),
            count: item.transaction_count
          }), summary.total_spent
        );

      } else {
        showErrorMessage('Failed to load dashboard data.');
      }
    } catch (err) {
      console.error('Dashboard Error:', err);
      showErrorMessage('Server error while loading dashboard.');
    }
  }

  /**
   * Top level metric calculations
   */
  function renderSummaryMetrics(summary) {
    const totalSpent = Number(summary.total_spent || 0);
    const totalTxns = Number(summary.total_transactions || 0);
    const avgSpent = totalTxns > 0 ? (totalSpent / totalTxns) : 0;

    document.getElementById('totalSpent').innerText = `₹${totalSpent.toFixed(2)}`;
    document.getElementById('totalTransactions').innerText = totalTxns;
    document.getElementById('avgTransaction').innerText = `₹${avgSpent.toFixed(2)}`;
  }

  /**
   * Combined Horizontal Bar Chart and Detail List Renderer
   */
  function renderBarChartAndDetails(chartContainerId, listContainerId, canvasId, items, mapFn, grandTotal) {
    const chartContainer = document.getElementById(chartContainerId);
    const listContainer = document.getElementById(listContainerId);

    if (!items || items.length === 0) {
      chartContainer.innerHTML = `<p style="color: #94a3b8; font-size: 14px;">No transaction data available.</p>`;
      listContainer.innerHTML = '';
      return;
    }

    // Re-create canvas
    chartContainer.innerHTML = `<canvas id="${canvasId}"></canvas>`;
    const ctx = document.getElementById(canvasId).getContext('2d');

    const labels = [];
    const dataValues = [];

    items.forEach(rawItem => {
      const { label, amount } = mapFn(rawItem);
      labels.push(label);
      dataValues.push(amount);
    });

    const totalAmt = Number(grandTotal) > 0 ? Number(grandTotal) : dataValues.reduce((a, b) => a + b, 0);

    // Dark Mode Palette Accent Colors
    const palette = [
      '#60a5fa', '#34d399', '#fbbf24', '#f87171', 
      '#a78bfa', '#f472b6', '#2dd4bf', '#818cf8'
    ];

    // Destroy existing chart if rendering again
    if (chartInstances[canvasId]) {
      chartInstances[canvasId].destroy();
    }

    // Render Horizontal Bar Chart
    chartInstances[canvasId] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          data: dataValues,
          backgroundColor: palette.slice(0, labels.length),
          borderRadius: 4
        }]
      },
      options: {
        indexAxis: 'y', // Makes it a horizontal bar chart
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false // Hidden as labels are on the Y-axis
          },
          tooltip: {
            backgroundColor: '#0f172a',
            titleColor: '#f8fafc',
            bodyColor: '#e2e8f0',
            borderColor: '#334155',
            borderWidth: 1,
            callbacks: {
              label: function(context) {
                const val = context.parsed.x || 0;
                const pct = totalAmt > 0 ? ((val / totalAmt) * 100).toFixed(1) : 0;
                return ` ₹${val.toFixed(2)} (${pct}%)`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(51, 65, 85, 0.5)' },
            ticks: {
              color: '#94a3b8',
              font: { size: 10 },
              callback: function(value) {
                return '₹' + value;
              }
            }
          },
          y: {
            grid: { display: false },
            ticks: {
              font: { size: 11, weight: '500' },
              color: '#e2e8f0'
            }
          }
        }
      }
    });

    // Render Detailed List Below Chart
    listContainer.innerHTML = items.map((rawItem, idx) => {
      const { label, amount, count } = mapFn(rawItem);
      const percentage = totalAmt > 0 ? ((amount / totalAmt) * 100).toFixed(1) : '0.0';
      const color = palette[idx % palette.length];

      return `
        <div class="detail-row">
          <div class="detail-label">
            <span class="detail-color-dot" style="background-color: ${color};"></span>
            <span title="${label}">${label}</span>
          </div>
          <div class="detail-stats">
            <div class="detail-amount">₹${amount.toFixed(2)}</div>
            <div class="detail-subtext">${percentage}% • ${count} txn${count !== 1 ? 's' : ''}</div>
          </div>
        </div>
      `;
    }).join('');
  }

  function showErrorMessage(message) {
    ['categoryChartContainer', 'payTypeChartContainer', 'expByChartContainer'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = `<p style="color: #f87171; font-size: 14px;">${message}</p>`;
    });
  }

  return { render };
})();