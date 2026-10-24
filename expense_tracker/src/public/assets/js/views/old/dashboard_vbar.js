/**
 * Dashboard View Module
 * Renders summary metrics, vertical bar charts (with rotated X-axis labels), and detailed data lists based on API response
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
          color: #0f172a;
        }
        .view-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .filter-bar-compact {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
          background: #ffffff;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.08);
          border: 1px solid #e2e8f0;
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
          gap: 0.35rem;
        }
        .date-group label {
          font-size: 13px;
          font-weight: 600;
          color: #334155;
        }
        /* Mobile Date Input Fix */
        .input-date-sm {
          padding: 0.4rem 0.6rem;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          font-size: 14px;
          color: #0f172a !important;
          background-color: #ffffff !important;
          min-height: 36px;
          box-sizing: border-box;
          color-scheme: light;
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
          font-weight: 500;
        }
        .btn-filter-secondary {
          background: #f1f5f9;
          color: #475569;
          border: 1px solid #cbd5e1;
          padding: 0.45rem 1rem;
          border-radius: 6px;
          cursor: pointer;
        }

        /* Metric Cards Grid */
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .metric-card {
          background: #ffffff;
          padding: 1.25rem;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.08);
          display: flex;
          align-items: center;
          gap: 1rem;
          border: 1px solid #e2e8f0;
        }
        .metric-icon {
          font-size: 2rem;
        }
        .metric-label {
          font-size: 13px;
          color: #64748b;
          font-weight: 500;
        }
        .metric-info h3 {
          margin: 0.2rem 0 0 0;
          font-size: 1.35rem;
          color: #0f172a;
        }

        /* Breakdown Cards & Chart Layout */
        .breakdown-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 1.25rem;
        }
        .breakdown-card {
          background: #ffffff;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.08);
          border: 1px solid #e2e8f0;
          padding: 1rem;
          display: flex;
          flex-direction: column;
        }
        .breakdown-card h3 {
          margin: 0 0 1rem 0;
          font-size: 1rem;
          color: #1e293b;
          border-bottom: 1px solid #f1f5f9;
          padding-bottom: 0.5rem;
        }
        .chart-container {
          position: relative;
          height: 250px; /* Slightly increased to fit vertical labels smoothly */
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        /* Details List at Bottom */
        .breakdown-details-list {
          margin-top: 1rem;
          padding-top: 0.75rem;
          border-top: 1px solid #f1f5f9;
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
          padding: 0.4rem 0.5rem;
          background: #f8fafc;
          border-radius: 6px;
          font-size: 13px;
        }
        .detail-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          color: #1e293b;
        }
        .detail-color-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          display: inline-block;
        }
        .detail-stats {
          text-align: right;
          color: #475569;
        }
        .detail-amount {
          font-weight: 700;
          color: #0f172a;
        }
        .detail-subtext {
          font-size: 11px;
          color: #64748b;
        }

        /* Mobile Layout Tweaks */
        @media (max-width: 640px) {
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
          <h2 style="margin: 0;">Dashboard Overview</h2>
          
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
              <h3 id="totalSpent">₹0.00</h3>
            </div>
          </div>
          <div class="metric-card">
            <span class="metric-icon">🧾</span>
            <div class="metric-info">
              <span class="metric-label">Total Transactions</span>
              <h3 id="totalTransactions">0</h3>
            </div>
          </div>
          <div class="metric-card">
            <span class="metric-icon">💳</span>
            <div class="metric-info">
              <span class="metric-label">Avg / Transaction</span>
              <h3 id="avgTransaction">₹0.00</h3>
            </div>
          </div>
        </div>

        <!-- Breakdown Section -->
        <div class="breakdown-grid">
          
          <!-- Category Breakdown -->
          <div class="breakdown-card">
            <h3>📁 By Category</h3>
            <div class="chart-container" id="categoryChartContainer">
              <span style="color: #64748b;">Loading chart...</span>
            </div>
            <div class="breakdown-details-list" id="categoryDetailsList"></div>
          </div>

          <!-- Payment Type Breakdown -->
          <div class="breakdown-card">
            <h3>💳 By Pay Type</h3>
            <div class="chart-container" id="payTypeChartContainer">
              <span style="color: #64748b;">Loading chart...</span>
            </div>
            <div class="breakdown-details-list" id="payTypeDetailsList"></div>
          </div>

          <!-- Spent By Breakdown -->
          <div class="breakdown-card">
            <h3>👤 By Person (Exp By)</h3>
            <div class="chart-container" id="expByChartContainer">
              <span style="color: #64748b;">Loading chart...</span>
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

        // Render Category Vertical Bar Chart & Details
        renderVerticalBarChartAndDetails(
          'categoryChartContainer', 'categoryDetailsList', 'categoryCanvas', 
          by_category || [], item => ({
            label: item.category_name,
            amount: parseFloat(item.total_amount),
            count: item.transaction_count
          }), summary.total_spent
        );

        // Render Pay Type Vertical Bar Chart & Details
        renderVerticalBarChartAndDetails(
          'payTypeChartContainer', 'payTypeDetailsList', 'payTypeCanvas', 
          by_pay_type || [], item => ({
            label: item.pay_type,
            amount: parseFloat(item.total_amount),
            count: item.transaction_count
          }), summary.total_spent
        );

        // Render Exp By Vertical Bar Chart & Details
        renderVerticalBarChartAndDetails(
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
   * Combined Vertical Bar Chart with Rotated Labels and Detail List
   */
  function renderVerticalBarChartAndDetails(chartContainerId, listContainerId, canvasId, items, mapFn, grandTotal) {
    const chartContainer = document.getElementById(chartContainerId);
    const listContainer = document.getElementById(listContainerId);

    if (!items || items.length === 0) {
      chartContainer.innerHTML = `<p style="color: #64748b; font-size: 14px;">No transaction data available.</p>`;
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

    // Color Palette
    const palette = [
      '#3b82f6', '#10b981', '#f59e0b', '#ef4444', 
      '#8b5cf6', '#ec4899', '#14b8a6', '#6366f1'
    ];

    // Destroy existing chart if rendering again
    if (chartInstances[canvasId]) {
      chartInstances[canvasId].destroy();
    }

    // Render Vertical Bar Chart
    chartInstances[canvasId] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          data: dataValues,
          backgroundColor: palette.slice(0, labels.length),
          borderRadius: 4,
          maxBarThickness: 36
        }]
      },
      options: {
        indexAxis: 'x',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const val = context.parsed.y || 0;
                const pct = totalAmt > 0 ? ((val / totalAmt) * 100).toFixed(1) : 0;
                return ` ₹${val.toFixed(2)} (${pct}%)`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              font: { size: 11, weight: '500' },
              color: '#334155',
              maxRotation: 90, // Rotates labels 90 degrees vertically
              minRotation: 90  // Forces vertical display even on wider screens
            }
          },
          y: {
            grid: { color: '#f1f5f9' },
            ticks: {
              font: { size: 11 },
              callback: function(value) {
                return '₹' + value;
              }
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
            <span>${label}</span>
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
      if (el) el.innerHTML = `<p style="color: #ef4444; font-size: 14px;">${message}</p>`;
    });
  }

  return { render };
})();