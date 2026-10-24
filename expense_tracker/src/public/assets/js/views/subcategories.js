const SubcategoriesView = (() => {
  async function render(container) {
    container.innerHTML = `
      <div class="tab-view">
        <div class="page-title">Manage Subcategories</div>
        <div class="card-panel">
          <div class="list-header">
            <h3>Subcategories</h3>
            <button class="action-btn-sm" id="addSubCatBtn">+ New Subcategory</button>
          </div>
          <div id="subCategoryList"><div style="text-align:center; padding:1rem;">Loading...</div></div>
        </div>
      </div>
    `;

    document.getElementById('addSubCatBtn').addEventListener('click', openAddModal);
    await loadSubcategories();
  }

  async function loadSubcategories() {
    const res = await ApiManager.getSubcategoriesByCategory();
    const list = document.getElementById('subCategoryList');

    if (res.status === '0000' && res.data?.length > 0) {
      list.innerHTML = res.data.map(sub => `
        <div class="expense-item">
          <div class="expense-info">
            <div class="category-icon">📂</div>
            <div class="expense-details">
              <div class="title">${sub.name}</div>
              <div class="sub">Category: ${sub.category_name}</div>
            </div>
          </div>
        </div>
      `).join('');
    } else {
      list.innerHTML = `<div style="text-align:center; padding:1rem; color:var(--text-muted);">No subcategories configured.</div>`;
    }
  }

  function openAddModal() {
    AppModule.showModal(`
      <div class="modal-header">
        <h3>New Subcategory</h3>
        <button class="close-btn" onclick="AppModule.closeModal()">✕</button>
      </div>
      <form id="addSubCatForm">
        <div class="form-group">
          <label>Parent Category ID</label>
          <input type="number" id="parentCatId" required placeholder="1" />
        </div>
        <div class="form-group">
          <label>Subcategory Name</label>
          <input type="text" id="subCatName" required placeholder="e.g. Electricity" />
        </div>
        <button type="submit" class="btn">Create Subcategory</button>
      </form>
    `);

    document.getElementById('addSubCatForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const res = await ApiManager.createSubcategory(
        parseInt(document.getElementById('parentCatId').value),
        document.getElementById('subCatName').value
      );
      if (res.status === '0000') {
        AppModule.closeModal();
        loadSubcategories();
      }
    });
  }

  return { render };
})();