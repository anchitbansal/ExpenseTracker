const ExpensesView = (() => {
    let categoriesCache = [];
    let membersCache = [];

    let currentPage = 1;
    const itemsPerPage = 50;

    let activeFilters =
    {
        from_date: '',
        to_date: '',
        category_id: '',
        sub_category_id: '',
        pay_type: '',
        exp_by: ''
    };


    /* ============================================================
       SVG ICONS
    ============================================================ */

    const SVG_ICONS =
    {
        filter: `
            <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            >
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
            </svg>
        `,

        eye: `
            <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
            </svg>
        `,

        edit: `
            <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
        `,

        trash: `
            <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            >
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
                <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/>
            </svg>
        `,

        close: `
            <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            >
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
        `,

        calendar: `
            <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            >
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
        `,

        tag: `
            <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            >
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                <line x1="7" y1="7" x2="7.01" y2="7"/>
            </svg>
        `,

        user: `
            <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
            </svg>
        `,

        card: `
            <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            >
                <rect x="1" y="4" width="22" height="16" rx="2"/>
                <line x1="1" y1="10" x2="23" y2="10"/>
            </svg>
        `
    };


    /* ============================================================
       TITLE CASE
    ============================================================ */

    function toTitleCase(str) {
        if (!str) {
            return 'Self';
        }

        return String(str)
            .toLowerCase()
            .split(' ')
            .map(word => {
                return word.charAt(0).toUpperCase() +
                    word.slice(1);
            })
            .join(' ');
    }


    /* ============================================================
       RENDER
    ============================================================ */

    async function render(container) {
        container.innerHTML = `
            <style>

                .expense-page-header
                {
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                    gap:.8rem;
                    margin-bottom:1.3rem;
                    flex-wrap:wrap;
                }

                .expense-header-actions
                {
                    display:flex;
                    gap:1rem;
                    align-items:center;
                }


                /* ========================================================
                   DESKTOP TABLE
                ======================================================== */

                .desktop-table-container
                {
                    width:100%;
                    overflow-x:auto;
                    display:block;
                }

                .expense-table
                {
                    width:100%;
                    border-collapse:collapse;
                    text-align:left;
                    font-size:0.9rem;
                }

                .expense-table th
                {
                    background:rgba(30,41,59,0.6);
                    color:#94a3b8;
                    padding:0.85rem 1.2rem;
                    font-weight:600;
                    border-bottom:1px solid var(--border-color,#334155);
                    white-space:nowrap;
                }

                .expense-table td
                {
                    padding:0.9rem 1.2rem;
                    border-bottom:1px solid var(--border-color,#334155);
                    color:#f8fafc;
                    vertical-align:middle;
                }

                .expense-table tr:hover
                {
                    background:rgba(255,255,255,0.03);
                }

                .mobile-expense-list
                {
                    display:none;
                }


                /* ========================================================
                   ACTION BUTTONS
                ======================================================== */

                .expense-action-buttons
                {
                    display:flex;
                    gap:0.4rem;
                }

                .expense-action-btn
                {
                    padding:0.45rem 0.65rem;
                    border-radius:6px;
                    border:none;
                    cursor:pointer;
                    color:#fff;
                    display:inline-flex;
                    align-items:center;
                    justify-content:center;
                }


                /* ========================================================
                   DETAIL FORM
                ======================================================== */

                .detail-form-group
                {
                    display:flex;
                    flex-direction:column;
                    gap:0.2rem;
                    padding:1.2rem 0.75rem;
                    background:rgba(15,23,42,0.7);
                    border:1px solid #334155;
                    border-radius:8px;
                    width:100%;
                    box-sizing:border-box;
                }

                .detail-form-label
                {
                    font-size:0.72rem;
                    color:#94a3b8;
                    text-transform:uppercase;
                    font-weight:600;
                    letter-spacing:0.5px;
                }

                .detail-form-val
                {
                    font-size:0.95rem;
                    color:#f8fafc;
                    font-weight:500;
                    word-break:break-word;
                }


                /* ========================================================
                   FILTER
                ======================================================== */

                .modern-filter-container
                {
                    padding:0.25rem 0;
                }

                .modal-header-modern
                {
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                    padding-bottom:0.85rem;
                    border-bottom:1px solid rgba(255,255,255,0.1);
                    margin-bottom:1rem;
                }

                .modal-title-wrap
                {
                    display:flex;
                    align-items:center;
                    gap:0.5rem;
                    font-size:1.1rem;
                    font-weight:700;
                    color:#f8fafc;
                }

                .modern-close-btn
                {
                    background:rgba(255,255,255,0.05);
                    border:1px solid rgba(255,255,255,0.1);
                    color:#94a3b8;
                    border-radius:8px;
                    width:32px;
                    height:32px;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    cursor:pointer;
                }

                .filter-grid-modern
                {
                    display:grid;
                    grid-template-columns:1fr 1fr;
                    gap:0.85rem;
                    margin-bottom:0.85rem;
                }

                .modern-field
                {
                    display:flex;
                    flex-direction:column;
                    gap:0.35rem;
                }

                .modern-label
                {
                    font-size:0.75rem;
                    font-weight:600;
                    color:#94a3b8;
                    text-transform:uppercase;
                    letter-spacing:0.5px;
                }

                .modern-input-wrapper
                {
                    position:relative;
                    display:flex;
                    align-items:center;
                }

                .field-icon
                {
                    position:absolute;
                    left:0.75rem;
                    color:#64748b;
                    pointer-events:none;
                    display:flex;
                    align-items:center;
                }

                .modern-input-wrapper input,
                .modern-input-wrapper select
                {
                    width:100%;
                    background:#0f172a;
                    border:1px solid #334155;
                    border-radius:8px;
                    padding:0.65rem 0.75rem 0.65rem 2.4rem;
                    color:#f8fafc;
                    font-size:0.9rem;
                    outline:none;
                    box-sizing:border-box;
                    color-scheme:dark;
                }

                .btn-modern-primary
                {
                    flex:1;
                    background:#3b82f6;
                    color:#ffffff;
                    border:none;
                    border-radius:8px;
                    padding:0.75rem;
                    font-weight:600;
                    font-size:0.9rem;
                    cursor:pointer;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    gap:0.5rem;
                }


                /* ========================================================
                   MOBILE
                ======================================================== */
				

   

                @media (max-width:640px)
                {
                	 .filter-grid-modern
    				{
        				grid-template-columns:1fr;
        				gap:0.75rem;
    				}

   
                    .desktop-table-container
                    {
                        display:none;
                    }

                    .mobile-expense-list
                    {
                        display:flex;
                        flex-direction:column;
                        gap:0.55rem;
                        width:100%;
                        align-items:center;
                    }

                    .expense-page-header
                    {
                        flex-direction:column;
                        align-items:stretch;
                    }

                    .expense-header-actions
                    {
                        width:100%;
                    }

                    .expense-header-actions button
                    {
                        flex:1;
                        justify-content:center;
                    }

                    .card-panel
                    {
                        padding:0.35rem !important;
                        width:100% !important;
                        box-sizing:border-box;
                    }


                    /* ====================================================
                       MOBILE RECORD BOX
                       Increased width
                    ==================================================== */

                    .mobile-expense-card
                    {
                        border:.5px solid var(--border-color,#774155);
                        border-radius:5px;

                        padding:0.7rem 0.75rem;

                        background:rgba(30,41,59,0.55);

                        display:flex;
                        flex-direction:column;

                        /* IMPORTANT:
                           remove large internal gap */
                        gap:0;

                        width:94%;
                        max-width:94%;

                        margin:0 auto;

                        box-sizing:border-box;
                    }


                    .mobile-card-top-row
                    {
                        display:flex;
                        justify-content:space-between;
                        align-items:center;
                        gap:0.5rem;

                        margin:0;
                        padding:0;
                    }


                    .serial-and-category
                    {
                        display:flex;
                        align-items:center;
                        gap:0.45rem;
                        flex-wrap:wrap;

                        margin:0;
                        padding:0;
                    }


                    .id-badge
                    {
                        background:#3b82f6;
                        color:#ffffff;
                        font-size:0.72rem;
                        font-weight:700;
                        padding:0.15rem 0.45rem;
                        border-radius:6px;
                        display:inline-block;
                        line-height:1.2;
                    }


                    .highlighted-category
                    {
                        font-size:0.92rem;
                        font-weight:700;
                        color:#60a5fa;
                        letter-spacing:0.2px;

                        line-height:1.2;
                        margin:0;
                        padding:0;
                    }


                    .modern-date-highlighter
                    {
                        background:rgba(234,179,8,0.12);
                        color:#fde047;
                        border:1px solid rgba(234,179,8,0.3);

                        font-size:0.8rem;
                        font-weight:600;

                        padding:0.18rem 0.5rem;
                        border-radius:20px;

                        letter-spacing:0.3px;
                        white-space:nowrap;

                        line-height:1.2;
                    }


                    /* ====================================================
                       SUBCATEGORY
                       Directly below category
                    ==================================================== */

                    .mobile-subcategory-row
                    {
                        font-size:0.78rem;
                        color:#94a3b8;
                        font-weight:500;

                        margin:1px 0 0 0;
                        padding:0;

                        line-height:1.15;

                        display:block;
                    }


                    /* ====================================================
                       MEMBER + AMOUNT
                       No extra gap from subcategory
                    ==================================================== */

                    .mobile-card-bottom-row
                    {
                        display:flex;
                        justify-content:space-between;
                        align-items:center;

                        margin:1px 0 0 0;
                        padding:0;

                        min-height:0;
                    }


                    .mobile-member-by
                    {
                        font-size:0.78rem;
                        color:#cbd5e1;
                        font-weight:500;

                        margin:0;
                        padding:0;

                        line-height:1.15;
                    }


                    .mobile-card-actions
                    {
                        display:flex;
                        align-items:center;
                        gap:0.5rem;

                        margin:0;
                        padding:0;
                    }


                    .edit-icon-btn-subtle
                    {
                        background:rgba(255,255,255,0.06);
                        color:#94a3b8;

                        border:1px solid rgba(255,255,255,0.12);
                        border-radius:6px;

                        padding:0.28rem 0.42rem;

                        display:inline-flex;
                        align-items:center;
                        justify-content:center;

                        cursor:pointer;

                        transition:all 0.15s ease;
                    }

                    .edit-icon-btn-subtle:active
                    {
                        background:rgba(234,179,8,0.2);
                        color:#fde047;
                        border-color:rgba(234,179,8,0.4);
                    }


                    /* Remove unwanted paragraph/default spacing */
                    .mobile-expense-card div,
                    .mobile-expense-card span
                    {
                        box-sizing:border-box;
                    }
                }


                /* ========================================================
                   VERY SMALL MOBILE
                ======================================================== */

                @media (max-width:380px)
                {
                    .mobile-expense-card
                    {
                        width:100%;
                        max-width:100%;
                        padding:0.6rem;
                    }

                    .highlighted-category
                    {
                        font-size:0.86rem;
                    }

                    .mobile-subcategory-row
                    {
                        font-size:0.75rem;
                    }

                    .mobile-member-by
                    {
                        font-size:0.74rem;
                    }
                }

            </style>


            <div class="tab-view">

                <div class="expense-page-header">

                    <span
                        style="
                            font-size:1.25rem;
                            font-weight:700;
                        "
                    >
                        Expense Records
                    </span>

                    <div class="expense-header-actions">

                        <button
                            class="action-btn-sm"
                            id="openFilterModalBtn"
                            style="
                                background:#3b82f6;
                                display:inline-flex;
                                align-items:center;
                                gap:0.35rem;
                            "
                        >
                            ${SVG_ICONS.filter}
                            Filter
                        </button>

                        <button class="action-btn-sm" id="addExpenseBtn"> + Add Expense </button>

                    </div>

                </div>


                <div
                    id="activeFilterBadge"
                    style="
                        display:none;
                        background:#1e293b;
                        padding:0.6rem 1rem;
                        border-radius:8px;
                        margin-bottom:1rem;
                        align-items:center;
                        font-size:0.85rem;
                    "
                >

                    <span
                        id="activeFilterText"
                        style="color:var(--text-muted);"
                    >
                        Filters Applied
                    </span>

                    <button
                        id="clearFiltersBtn"
                        style="
                            background:transparent;
                            border:none;
                            color:#ef4444;
                            cursor:pointer;
                            font-weight:600;
                            display:inline-flex;
                            align-items:center;
                            gap:0.2rem;
                            margin-left:auto;
                        "
                    >
                        Clear ${SVG_ICONS.close}
                    </button>

                </div>


                <div class="card-panel">

                    <div class="list-header">
                        <h3>Transactions</h3>
                    </div>

                    <div id="expenseList">

                        <div
                            style="
                                text-align:center;
                                padding:1.5rem;
                                color:var(--text-muted);
                            "
                        >
                            Loading transactions...
                        </div>

                    </div>


                    <div
                        style="
                            display:flex;
                            justify-content:space-between;
                            align-items:center;
                            margin-top:1.25rem;
                            padding-top:0.75rem;
                            border-top:1px solid var(--border-color,#334155);
                        "
                    >

                        <button
                            class="action-btn-sm"
                            id="prevPageBtn"
                            style="background:#334155;"
                        >
                            &laquo; Previous
                        </button>

                        <span
                            id="pageIndicator"
                            style="
                                font-size:0.85rem;
                                color:var(--text-muted);
                            "
                        >
                            Page 1
                        </span>

                        <button
                            class="action-btn-sm"
                            id="nextPageBtn"
                            style="background:#334155;"
                        >
                            Next &raquo;
                        </button>

                    </div>

                </div>

            </div>
        `;


        /* ============================================================
           EVENTS
        ============================================================ */

        document
            .getElementById('addExpenseBtn')
            .addEventListener(
                'click',
                () => openExpenseModal()
            );


        document
            .getElementById('openFilterModalBtn')
            .addEventListener(
                'click',
                () => openFilterModal()
            );


        document
            .getElementById('clearFiltersBtn')
            .addEventListener(
                'click',
                () => {
                    activeFilters =
                    {
                        from_date: '',
                        to_date: '',
                        category_id: '',
                        sub_category_id: '',
                        pay_type: '',
                        exp_by: ''
                    };

                    currentPage = 1;

                    updateFilterBadge();

                    loadData();
                }
            );


        document
            .getElementById('prevPageBtn')
            .addEventListener(
                'click',
                () => {
                    if (currentPage > 1) {
                        currentPage--;
                        loadData();
                    }
                }
            );


        document
            .getElementById('nextPageBtn')
            .addEventListener(
                'click',
                () => {
                    currentPage++;
                    loadData();
                }
            );


        await Promise.all(
            [
                loadCategories(),
                loadMembers()
            ]
        );

        await loadData();
    }


    /* ============================================================
       LOAD CATEGORIES
    ============================================================ */

    async function loadCategories() {
        try {
            const res =
                await ApiManager.getCategories();

            if (
                res.status === '0000' &&
                Array.isArray(res.data)
            ) {
                categoriesCache = res.data;
            }
        }
        catch (e) {
            console.warn(
                'Categories load error',
                e
            );
        }
    }


    /* ============================================================
       LOAD MEMBERS
    ============================================================ */

    async function loadMembers() {
        try {
            const res =
                await ApiManager.getMembers();

            if (
                res.status === '0000' &&
                Array.isArray(res.data)
            ) {
                membersCache = res.data;
            }
            else if (Array.isArray(res)) {
                membersCache = res;
            }
        }
        catch (e) {
            console.warn(
                'Members load error',
                e
            );
        }
    }


    /* ============================================================
       SUBCATEGORY DROPDOWN
    ============================================================ */

    async function populateSubcategoriesDropdown(
        categoryId,
        dropdownId,
        selectedSubId = ''
    ) {
        const subSelect =
            document.getElementById(dropdownId);

        if (!subSelect) {
            return;
        }


        if (!categoryId) {
            subSelect.innerHTML =
                '<option value="">All Subcategories</option>';

            return;
        }


        subSelect.innerHTML =
            '<option value="">Loading...</option>';


        try {
            const res =
                await ApiManager.getSubcategoriesByCategory(
                    categoryId
                );


            if (
                res.status === '0000' &&
                Array.isArray(res.data)
            ) {
                subSelect.innerHTML =
                    '<option value="">All Subcategories</option>' +
                    res.data
                        .map(sc => {
                            return `
                                <option
                                    value="${sc.id}"
                                    ${sc.id == selectedSubId
                                    ? 'selected'
                                    : ''
                                }
                                >
                                    ${sc.name}
                                </option>
                            `;
                        })
                        .join('');
            }
            else {
                subSelect.innerHTML =
                    '<option value="">No subcategories found</option>';
            }
        }
        catch (e) {
            subSelect.innerHTML =
                '<option value="">All Subcategories</option>';
        }
    }


    /* ============================================================
       FILTER MODAL
    ============================================================ */

    function openFilterModal() {
        const categoryOptions =
            categoriesCache
                .map(c => {
                    return `
                        <option
                            value="${c.id}"
                            ${activeFilters.category_id == c.id
                            ? 'selected'
                            : ''
                        }
                        >
                            ${c.name}
                        </option>
                    `;
                })
                .join('');


        const memberOptions = membersCache
    .filter(m => m.status === 1) // Sirf status 1 wale members filter honge
    .map(m => {
        const mName = m.member_name;

        return `
            <option
                value="${mName}"
                ${activeFilters.exp_by === mName ? 'selected' : ''}
            >
                ${mName}
            </option>
        `;
    })
    .join('');


        AppModule.showModal(`
            <div class="modern-filter-container">

                <div class="modal-header-modern">

                    <div class="modal-title-wrap">

                        <span style="color:#3b82f6;">
                            ${SVG_ICONS.filter}
                        </span>

                        Filter Expense Records

                    </div>

                    <button
                        class="modern-close-btn"
                        onclick="AppModule.closeModal()"
                    >
                        ${SVG_ICONS.close}
                    </button>

                </div>


                <form id="filterForm">

                    <div class="filter-grid-modern">

                        <div class="modern-field">

                            <label class="modern-label">
                                From Date
                            </label>

                            <div class="modern-input-wrapper">

                                <span class="field-icon">
                                    ${SVG_ICONS.calendar}
                                </span>

                                <input
                                    type="date"
                                    id="filterFromDate"
                                    value="${activeFilters.from_date}"
                                />

                            </div>

                        </div>


                        <div class="modern-field">

                            <label class="modern-label">
                                To Date
                            </label>

                            <div class="modern-input-wrapper">

                                <span class="field-icon">
                                    ${SVG_ICONS.calendar}
                                </span>

                                <input
                                    type="date"
                                    id="filterToDate"
                                    value="${activeFilters.to_date}"
                                />

                            </div>

                        </div>

                    </div>


                    <div class="filter-grid-modern">

                        <div class="modern-field">

                            <label class="modern-label">
                                Category
                            </label>

                            <div class="modern-input-wrapper">

                                <span class="field-icon">
                                    ${SVG_ICONS.tag}
                                </span>

                                <select id="filterCatId">

                                    <option value="">
                                        All Categories
                                    </option>

                                    ${categoryOptions}

                                </select>

                            </div>

                        </div>


                        <div class="modern-field">

                            <label class="modern-label">
                                Subcategory
                            </label>

                            <div class="modern-input-wrapper">

                                <span class="field-icon">
                                    ${SVG_ICONS.tag}
                                </span>

                                <select id="filterSubCatId">

                                    <option value="">
                                        Select Category First
                                    </option>

                                </select>

                            </div>

                        </div>

                    </div>


                    <div class="filter-grid-modern">

                        <div class="modern-field">

                            <label class="modern-label">
                                Payment Method
                            </label>

                            <div class="modern-input-wrapper">

                                <span class="field-icon">
                                    ${SVG_ICONS.card}
                                </span>

                                <select id="filterPayType">

                                    <option value="">
                                        All Payment Types
                                    </option>

                                    <option
                                        value="CASH"
                                        ${activeFilters.pay_type === 'CASH'
                ? 'selected'
                : ''
            }
                                    >
                                        CASH
                                    </option>

                                    <option
                                        value="UPI"
                                        ${activeFilters.pay_type === 'UPI'
                ? 'selected'
                : ''
            }
                                    >
                                        UPI
                                    </option>

                                    <option
                                        value="CARD"
                                        ${activeFilters.pay_type === 'CARD'
                ? 'selected'
                : ''
            }
                                    >
                                        CARD
                                    </option>

                                    <option
                                        value="OTHER"
                                        ${activeFilters.pay_type === 'OTHER'
                ? 'selected'
                : ''
            }
                                    >
                                        OTHER
                                    </option>

                                </select>

                            </div>

                        </div>


                        <div class="modern-field">

                            <label class="modern-label">
                                Spent By
                            </label>

                            <div class="modern-input-wrapper">

                                <span class="field-icon">
                                    ${SVG_ICONS.user}
                                </span>

                                <select id="filterExpBy">

                                    <option value="">
                                        All Members
                                    </option>

                                    ${memberOptions}

                                </select>

                            </div>

                        </div>

                    </div>


                    <div
                        style="
                            margin-top:1.25rem;
                            padding-top:0.85rem;
                            border-top:1px solid rgba(255,255,255,0.1);
                        "
                    >

                        <button
                            type="submit"
                            class="btn-modern-primary"
                            style="width:100%;"
                        >
                            ${SVG_ICONS.filter}
                            Apply Filters
                        </button>

                    </div>

                </form>

            </div>
        `);


        const catSelect =
            document.getElementById('filterCatId');


        if (activeFilters.category_id) {
            populateSubcategoriesDropdown(
                activeFilters.category_id,
                'filterSubCatId',
                activeFilters.sub_category_id
            );
        }


        catSelect.addEventListener(
            'change',
            e => {
                populateSubcategoriesDropdown(
                    e.target.value,
                    'filterSubCatId'
                );
            }
        );


        document
            .getElementById('filterForm')
            .addEventListener(
                'submit',
                e => {
                    e.preventDefault();

                    activeFilters =
                    {
                        from_date:
                            document.getElementById(
                                'filterFromDate'
                            ).value,

                        to_date:
                            document.getElementById(
                                'filterToDate'
                            ).value,

                        category_id:
                            document.getElementById(
                                'filterCatId'
                            ).value,

                        sub_category_id:
                            document.getElementById(
                                'filterSubCatId'
                            ).value,

                        pay_type:
                            document.getElementById(
                                'filterPayType'
                            ).value,

                        exp_by:
                            document.getElementById(
                                'filterExpBy'
                            ).value
                    };


                    currentPage = 1;

                    AppModule.closeModal();

                    updateFilterBadge();

                    loadData();
                }
            );
    }


    /* ============================================================
       FILTER BADGE
    ============================================================ */

    function updateFilterBadge() {
        const badge =
            document.getElementById(
                'activeFilterBadge'
            );

        const hasActiveFilters =
            Object.values(activeFilters)
                .some(
                    val => val !== ''
                );


        if (badge) {
            badge.style.display =
                hasActiveFilters
                    ? 'flex'
                    : 'none';
        }
    }


    /* ============================================================
       DATE FORMAT
    ============================================================ */

    function formatDateOnly(rawDate) {
        if (!rawDate) {
            return 'N/A';
        }


        const cleanStr =
            typeof rawDate === 'string'
                ? rawDate
                    .split('T')[0]
                    .replace(/-/g, '/')
                : rawDate;


        const dateObj =
            new Date(cleanStr);


        if (!isNaN(dateObj.getTime())) {
            return dateObj.toLocaleDateString(
                'en-IN',
                {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                }
            );
        }


        return String(rawDate)
            .split('T')[0];
    }


    /* ============================================================
       LOAD EXPENSE DATA
    ============================================================ */

    async function loadData() {
        const listContainer =
            document.getElementById(
                'expenseList'
            );


        if (!listContainer) {
            return;
        }


        listContainer.innerHTML = `
            <div
                style="
                    text-align:center;
                    padding:1.5rem;
                    color:var(--text-muted);
                "
            >
                Loading transactions...
            </div>
        `;


        try {
            const listRes =
                await ApiManager.getExpenses(
                    currentPage,
                    activeFilters
                );


            let items = [];


            if (Array.isArray(listRes.data)) {
                items = listRes.data;
            }
            else if (
                listRes.data?.expenses &&
                Array.isArray(
                    listRes.data.expenses
                )
            ) {
                items =
                    listRes.data.expenses;
            }


            document
                .getElementById(
                    'pageIndicator'
                )
                .innerText =
                `Page ${currentPage} / ${listRes.data.pagination.total_pages}  `;


            document
                .getElementById(
                    'prevPageBtn'
                )
                .disabled =
                currentPage <= 1;
                
              document
                .getElementById(
                    'nextPageBtn'
                )
                .disabled =
                currentPage >= listRes.data.pagination.total_pages;

            if (items.length > 0) {

                /* ========================================================
                   DESKTOP
                ======================================================== */

                const desktopTableRows =
                    items
                        .map(
                            (item, index) => {
                                const rowNum =
                                    (currentPage - 1) *
                                    itemsPerPage +
                                    (index + 1);

                                const catName =
                                    item.category_name ||
                                    item.category ||
                                    'General';

                                const subCatName =
                                    item.sub_category_name ||
                                    item.subcategory ||
                                    item.sub_category ||
                                    'Other';

                                const amount =
                                    Number(
                                        item.amount || 0
                                    ).toFixed(2);

                                const expBy =
                                    toTitleCase(
                                        item.exp_by ||
                                        item.paid_by ||
                                        'Self'
                                    );

                                const itemId =
                                    item.id ||
                                    item.expense_id;

                                const formattedDate =
                                    formatDateOnly(
                                        item.exp_date ||
                                        item.expense_date ||
                                        item.created_at ||
                                        item.date
                                    );


                                return `
                                    <tr>

                                        <td>
                                            <span class="id-badge">
                                                #${rowNum}
                                            </span>
                                        </td>

                                        <td>
                                            <span
                                                style="
                                                    color:#6366f1;
                                                    font-weight:500;
                                                "
                                            >
                                                ${catName}
                                            </span>

                                            &rarr;

                                            ${subCatName}
                                        </td>

                                        <td>
                                            ${expBy}
                                        </td>

                                        <td>
                                            ${formattedDate}
                                        </td>

                                        <td
                                            style="
                                                color:#ef4444;
                                                font-weight:700;
                                            "
                                        >
                                            -&#8377;${amount}
                                        </td>

                                        <td>

                                            <div
                                                class="expense-action-buttons"
                                            >

                                                <button
                                                    class="expense-action-btn"
                                                    title="View Details"
                                                    style="
                                                        background:#3b82f6;
                                                    "
                                                    onclick="
                                                        ExpensesView.showDetails('${itemId}')
                                                    "
                                                >
                                                    ${SVG_ICONS.eye}
                                                </button>


                                                <button
                                                    class="expense-action-btn"
                                                    title="Update Expense"
                                                    style="
                                                        background:#eab308;
                                                        color:#000;
                                                    "
                                                    onclick="
                                                        ExpensesView.editExpense('${itemId}')
                                                    "
                                                >
                                                    ${SVG_ICONS.edit}
                                                </button>

                                            </div>

                                        </td>

                                    </tr>
                                `;
                            }
                        )
                        .join('');


                /* ========================================================
                   MOBILE
                ======================================================== */

                const mobileCards =
                    items
                        .map(
                            (item, index) => {
                                const rowNum =
                                    (currentPage - 1) *
                                    itemsPerPage +
                                    (index + 1);

                                const catName =
                                    item.category_name ||
                                    item.category ||
                                    'General';

                                const subCatName =
                                    item.sub_category_name ||
                                    item.subcategory ||
                                    item.sub_category ||
                                    'Other';

                                const rawMember =
                                    item.exp_by ||
                                    item.paid_by ||
                                    'Self';

                                const formattedMember =
                                    toTitleCase(
                                        rawMember
                                    );

                                const amount =
                                    Number(
                                        item.amount || 0
                                    ).toFixed(2);

                                const itemId =
                                    item.id ||
                                    item.expense_id;

                                const formattedDate =
                                    formatDateOnly(
                                        item.exp_date ||
                                        item.expense_date ||
                                        item.created_at ||
                                        item.date
                                    );


                                return `
                                    <div
                                        class="mobile-expense-card"
                                        onclick="
                                            ExpensesView.showDetails('${itemId}')
                                        "
                                    >

                                        <!-- TOP ROW -->

                                        <div
                                            class="
                                                mobile-card-top-row
                                            "
                                        >

                                            <div
                                                class="
                                                    serial-and-category
                                                "
                                            >

                                                <span
                                                    class="id-badge"
                                                >
                                                    #${rowNum}
                                                </span>


                                                <span
                                                    class="
                                                        highlighted-category
                                                    "
                                                >
                                                    ${catName}
                                                </span>

                                            </div>


                                            <span
                                                class="
                                                    modern-date-highlighter
                                                "
                                            >
                                                ${formattedDate}
                                            </span>

                                        </div>


                                        <!-- SUBCATEGORY -->

                                        <div
                                            class="
                                                mobile-subcategory-row
                                            "
                                        >
                                            ${subCatName}
                                        </div>


                                        <!-- MEMBER + AMOUNT -->

                                        <div
                                            class="
                                                mobile-card-bottom-row
                                            "
                                        >

                                            <div
                                                class="
                                                    mobile-member-by
                                                "
                                            >
                                                By ${formattedMember}
                                            </div>


                                            <div
                                                class="
                                                    mobile-card-actions
                                                "
                                            >

                                                <div
                                                    style="
                                                        color:#ef4444;
                                                        font-weight:700;
                                                        font-size:0.92rem;
                                                    "
                                                >
                                                    -&#8377;${amount}
                                                </div>


                                                <button
                                                    class="
                                                        edit-icon-btn-subtle
                                                    "
                                                    title="Update Expense"
                                                    onclick="
                                                        event.stopPropagation();
                                                        ExpensesView.editExpense('${itemId}')
                                                    "
                                                >
                                                    ${SVG_ICONS.edit}
                                                </button>

                                            </div>

                                        </div>

                                    </div>
                                `;
                            }
                        )
                        .join('');


                listContainer.innerHTML = `

                    <!-- DESKTOP -->

                    <div
                        class="desktop-table-container"
                    >

                        <table
                            class="expense-table"
                        >

                            <thead>

                                <tr>

                                    <th>#</th>
                                    <th>Category / Subcategory</th>
                                    <th>Spent By</th>
                                    <th>Date</th>
                                    <th>Amount</th>
                                    <th>Actions</th>

                                </tr>

                            </thead>


                            <tbody>
                                ${desktopTableRows}
                            </tbody>

                        </table>

                    </div>


                    <!-- MOBILE -->

                    <div
                        class="mobile-expense-list"
                    >
                        ${mobileCards}
                    </div>

                `;
            }
            else {
                listContainer.innerHTML = `
                    <div
                        style="
                            text-align:center;
                            padding:1.5rem;
                            color:var(--text-muted);
                        "
                    >
                        No records found.
                    </div>
                `;
            }
        }
        catch (e) {
            console.error(e);

            listContainer.innerHTML = `
                <div
                    style="
                        text-align:center;
                        padding:1.5rem;
                        color:#ef4444;
                    "
                >
                    Failed to load transactions.
                </div>
            `;
        }
    }


    /* ============================================================
       ADD EXPENSE
    ============================================================ */

    function openExpenseModal() {
        const categoryOptions =
            categoriesCache
                .map(c => {
                    return `
                        <option value="${c.id}">
                            ${c.name}
                        </option>
                    `;
                })
                .join('');


        const memberOptions = membersCache
    .filter(m => (typeof m === 'object' ? m.status === 1 : true))
    .map(m => {
        const name =
            m.member_name ||
            m.name ||
            m;

        return `
            <option value="${name}">
                ${toTitleCase(name)}
            </option>
        `;
    })
    .join('');


        AppModule.showModal(`

            <div class="modal-header-modern">

                <div class="modal-title-wrap">
                    Add New Expense
                </div>

                <button
                    class="modern-close-btn"
                    onclick="AppModule.closeModal()"
                >
                    ${SVG_ICONS.close}
                </button>

            </div>


            <form id="addExpenseForm">

                <div class="form-group">
                    <label>Amount (&#8377;)</label>

                    <input
                        type="number"
                        step="0.01"
                        id="expAmount"
                        required
                        placeholder="0.00"
                    />
                </div>


                <div class="form-group">
                    <label>Category</label>

                    <select
                        id="expCatId"
                        required
                    >
                        <option value="">
                            Select Category
                        </option>

                        ${categoryOptions}
                    </select>
                </div>


                <div class="form-group">
                    <label>Subcategory</label>

                    <select
                        id="expSubCatId"
                        required
                    >
                        <option value="">
                            Select Category First
                        </option>
                    </select>
                </div>


                <div class="form-group">
                    <label>Member</label>

                    <select
                        id="expBy"
                        required
                    >
                        <option value="">
                            Select Member
                        </option>

                        ${memberOptions}
                    </select>
                </div>


                <div class="form-group">
                    <label>Payment Method</label>

                    <select
                        id="expPayType"
                        required
                    >
                        <option value="CASH">
                            CASH
                        </option>

                        <option value="UPI">
                            UPI
                        </option>

                        <option value="CARD">
                            CARD
                        </option>

                        <option value="OTHER">
                            OTHER
                        </option>
                    </select>
                </div>


                <div class="form-group">
                    <label>Date</label>

                    <input
                        type="date"
                        id="expDate"
                        style="color-scheme:dark;"
                        required
                    />
                </div>


                <div class="form-group">
                    <label>Description</label>

                    <textarea
                        id="expDesc"
                        rows="3"
                        placeholder="Optional details..."
                    ></textarea>
                </div>


                <button
                    type="submit"
                    class="btn-modern-primary"
                    style="
                        margin-top:1rem;
                        width:100%;
                    "
                >
                    Save Expense
                </button>

            </form>

        `);


        document.getElementById(
            'expDate'
        ).value =
            new Date()
                .toISOString()
                .split('T')[0];


        document
            .getElementById('expCatId')
            .addEventListener(
                'change',
                async e => {
                    await populateSubcategoriesDropdown(
                        e.target.value,
                        'expSubCatId'
                    );
                }
            );


        document
            .getElementById('addExpenseForm')
            .addEventListener(
                'submit',
                async e => {
                    e.preventDefault();


                    const payload =
                    {
                        amount:
                            parseFloat(
                                document
                                    .getElementById(
                                        'expAmount'
                                    )
                                    .value
                            ),

                        exp_by:
                            document
                                .getElementById(
                                    'expBy'
                                )
                                .value,

                        category_id:
                            parseInt(
                                document
                                    .getElementById(
                                        'expCatId'
                                    )
                                    .value
                            ),

                        sub_category_id:
                            parseInt(
                                document
                                    .getElementById(
                                        'expSubCatId'
                                    )
                                    .value
                            ),

                        pay_type:
                            document
                                .getElementById(
                                    'expPayType'
                                )
                                .value,

                        exp_date:
                            document
                                .getElementById(
                                    'expDate'
                                )
                                .value,

                        description:
                            document
                                .getElementById(
                                    'expDesc'
                                )
                                .value
                    };


                    try {
                        const res =
                            await ApiManager.createExpense(
                                payload
                            );


                        if (
                            res.status === '0000'
                        ) {
                            AppModule.closeModal();

                            loadData();
                        }
                        else {
                            alert(
                                res.message ||
                                'Error saving expense'
                            );
                        }
                    }
                    catch (err) {
                        alert(
                            'Server communication error.'
                        );
                    }
                }
            );
    }


    /* ============================================================
       VIEW DETAILS
    ============================================================ */

    async function showDetails(expenseId) {
        AppModule.showModal(`

            <div class="modal-header-modern">

                <div class="modal-title-wrap">
                    Expense Details
                </div>

                <button
                    class="modern-close-btn"
                    onclick="AppModule.closeModal()"
                >
                    ${SVG_ICONS.close}
                </button>

            </div>


            <div
                id="detailsContent"
                style="
                    text-align:center;
                    padding:0.5rem;
                    color:var(--text-muted);
                "
            >
                Fetching details...
            </div>

        `);


        try {
            const res =
                await ApiManager.getExpenseDetail(
                    expenseId
                );


            const content =
                document.getElementById(
                    'detailsContent'
                );


            if (
                res.status === '0000' &&
                res.data
            ) {
                const d = res.data;

                const formattedDate =
                    formatDateOnly(
                        d.exp_date ||
                        d.expense_date ||
                        d.date
                    );

                const categoryDisplay =
                    d.category_name ||
                    d.category ||
                    'General';

                const subCategoryDisplay =
                    d.sub_category_name ||
                    d.subcategory ||
                    d.sub_category ||
                    'Other';

                const memberDisplay =
                    toTitleCase(
                        d.exp_by ||
                        'Self'
                    );


                content.innerHTML = `

                    <div
                        style="
                            display:flex;
                            flex-direction:column;
                            gap:0.5rem;
                            width:100%;
                        "
                    >

                        <div class="detail-form-group">

                            <span class="detail-form-label">
                                Transaction ID
                            </span>

                            <span class="detail-form-val">
                                #${d.id || expenseId}
                            </span>

                        </div>


                        <div
                            style="
                                display:grid;
                                grid-template-columns:1fr 1fr;
                                gap:0.5rem;
                                width:100%;
                            "
                        >

                            <div class="detail-form-group">

                                <span class="detail-form-label">
                                    Amount
                                </span>

                                <span
                                    class="detail-form-val"
                                    style="
                                        color:#ef4444;
                                        font-weight:700;
                                    "
                                >
                                    &#8377;${Number(
                    d.amount
                ).toFixed(2)}
                                </span>

                            </div>


                            <div class="detail-form-group">

                                <span class="detail-form-label">
                                    Date
                                </span>

                                <span class="detail-form-val">
                                    ${formattedDate}
                                </span>

                            </div>

                        </div>


                        <div
                            style="
                                display:grid;
                                grid-template-columns:1fr 1fr;
                                gap:0.5rem;
                                width:100%;
                            "
                        >

                            <div class="detail-form-group">

                                <span class="detail-form-label">
                                    Category
                                </span>

                                <span
                                    class="detail-form-val"
                                    style="color:#6366f1;"
                                >
                                    ${categoryDisplay}
                                </span>

                            </div>


                            <div class="detail-form-group">

                                <span class="detail-form-label">
                                    Subcategory
                                </span>

                                <span class="detail-form-val">
                                    ${subCategoryDisplay}
                                </span>

                            </div>

                        </div>


                        <div
                            style="
                                display:grid;
                                grid-template-columns:1fr 1fr;
                                gap:0.5rem;
                                width:100%;
                            "
                        >

                            <div class="detail-form-group">

                                <span class="detail-form-label">
                                    Spent By
                                </span>

                                <span class="detail-form-val">
                                    By ${memberDisplay}
                                </span>

                            </div>


                            <div class="detail-form-group">

                                <span class="detail-form-label">
                                    Payment Method
                                </span>

                                <span class="detail-form-val">
                                    ${d.pay_type || 'N/A'}
                                </span>

                            </div>

                        </div>


                        <div class="detail-form-group">

                            <span class="detail-form-label">
                                Description
                            </span>

                            <span class="detail-form-val">
                                ${d.description ||
                    d.title ||
                    'No description available.'
                    }
                            </span>

                        </div>

                    </div>

                `;
            }
            else {
                content.innerHTML = `
                    <div style="color:#ef4444;">
                        Could not load details.
                    </div>
                `;
            }
        }
        catch (e) {
            const content =
                document.getElementById(
                    'detailsContent'
                );

            if (content) {
                content.innerHTML = `
                    <div style="color:#ef4444;">
                        Failed to fetch details from API.
                    </div>
                `;
            }
        }
    }


    /* ============================================================
       EDIT EXPENSE
    ============================================================ */

    async function editExpense(expenseId) {
        AppModule.showModal(`

            <div class="modal-header-modern">

                <div class="modal-title-wrap">
                    Update Expense
                </div>

                <button
                    class="modern-close-btn"
                    onclick="AppModule.closeModal()"
                >
                    ${SVG_ICONS.close}
                </button>

            </div>


            <div
                id="editModalLoading"
                style="
                    text-align:center;
                    padding:1.5rem;
                    color:var(--text-muted);
                "
            >
                Loading transaction details...
            </div>

        `);


        try {
            const res =
                await ApiManager.getExpenseDetail(
                    expenseId
                );


            const data =
                res.data ||
                res.result ||
                (
                    res.id
                        ? res
                        : null
                );


            if (!data) {
                document
                    .getElementById(
                        'editModalLoading'
                    )
                    .innerHTML = `
                        <div style="color:#ef4444;">
                            Failed to fetch expense details.
                        </div>
                    `;

                return;
            }


            const categoryOptions =
                categoriesCache
                    .map(c => {
                        return `
                            <option
                                value="${c.id}"
                                ${c.id ==
                                (
                                    data.category_id ||
                                    data.category
                                )
                                ? 'selected'
                                : ''
                            }
                            >
                                ${c.name}
                            </option>
                        `;
                    })
                    .join('');


            const memberOptions = membersCache
    .filter(m => (typeof m === 'object' ? m.status === 1 : true))
    .map(m => {
        const name =
            m.member_name ||
            m.name ||
            m;

        return `
            <option
                value="${name}"
                ${name === (data.exp_by || data.paid_by) ? 'selected' : ''}
            >
                ${toTitleCase(name)}
            </option>
        `;
    })
    .join('');


            let dateVal = '';

            const rawDate =
                data.exp_date ||
                data.expense_date ||
                data.date;


            if (rawDate) {
                dateVal =
                    new Date(
                        rawDate
                    )
                        .toISOString()
                        .split('T')[0];
            }


            AppModule.showModal(`

                <div class="modal-header-modern">

                    <div class="modal-title-wrap">
                        Update Expense #${expenseId}
                    </div>


                    <div
                        style="
                            display:flex;
                            gap:0.5rem;
                            align-items:center;
                        "
                    >

                        <button
                            class="action-btn-sm"
                            title="Delete Expense"
                            style="
                                background:#ef4444;
                                padding:.5rem 0.5rem;
                            "
                            onclick="
                                ExpensesView.deleteItem('${expenseId}')
                            "
                        >
                            ${SVG_ICONS.trash}
                        </button>


                        <button
                            class="modern-close-btn"
                            onclick="AppModule.closeModal()"
                        >
                            ${SVG_ICONS.close}
                        </button>

                    </div>

                </div>


                <form id="editExpenseForm">

                    <div class="form-group">

                        <label>
                            Amount (&#8377;)
                        </label>

                        <input
                            type="number"
                            step="0.01"
                            id="editExpAmount"
                            value="${data.amount || ''}"
                            required
                        />

                    </div>


                    <div class="form-group">

                        <label>
                            Category
                        </label>

                        <select
                            id="editExpCatId"
                            required
                        >

                            <option value="">
                                Select Category
                            </option>

                            ${categoryOptions}

                        </select>

                    </div>


                    <div class="form-group">

                        <label>
                            Subcategory
                        </label>

                        <select
                            id="editExpSubCatId"
                            required
                        >

                            <option value="">
                                Loading...
                            </option>

                        </select>

                    </div>


                    <div class="form-group">

                        <label>
                            Spent By
                        </label>

                        <select
                            id="editExpBy"
                            required
                        >

                            <option value="">
                                Select Member
                            </option>

                            ${memberOptions}

                        </select>

                    </div>


                    <div class="form-group">

                        <label>
                            Payment Method
                        </label>

                        <select
                            id="editExpPayType"
                            required
                        >

                            <option
                                value="CASH"
                                ${data.pay_type === 'CASH'
                    ? 'selected'
                    : ''
                }
                            >
                                CASH
                            </option>

                            <option
                                value="UPI"
                                ${data.pay_type === 'UPI'
                    ? 'selected'
                    : ''
                }
                            >
                                UPI
                            </option>

                            <option
                                value="CARD"
                                ${data.pay_type === 'CARD'
                    ? 'selected'
                    : ''
                }
                            >
                                CARD
                            </option>

                            <option
                                value="OTHER"
                                ${data.pay_type === 'OTHER'
                    ? 'selected'
                    : ''
                }
                            >
                                OTHER
                            </option>

                        </select>

                    </div>


                    <div class="form-group">

                        <label>
                            Date
                        </label>

                        <input
                            type="date"
                            id="editExpDate"
                            value="${dateVal}"
                            style="color-scheme:dark;"
                            required
                        />

                    </div>


                    <div class="form-group">

                        <label>
                            Description
                        </label>

                        <textarea
                            id="editExpDesc"
                            rows="2"
                        >${data.description ||
                data.title ||
                ''
                }</textarea>

                    </div>


                    <div
                        style="
                            display:flex;
                            justify-content:flex-end;
                            margin-top:1rem;
                        "
                    >

                        <button
                            type="submit"
                            class="btn-modern-primary"
                            style="
                                background:#eab308;
                                color:#000;
                                width:100%;
                            "
                        >
                            Save Changes
                        </button>

                    </div>

                </form>

            `);


            const catSelect =
                document.getElementById(
                    'editExpCatId'
                );


            const initialCatId =
                data.category_id ||
                data.category;


            const initialSubCatId =
                data.sub_category_id ||
                data.subcategory;


            if (initialCatId) {
                populateSubcategoriesDropdown(
                    initialCatId,
                    'editExpSubCatId',
                    initialSubCatId
                );
            }


            catSelect.addEventListener(
                'change',
                e => {
                    populateSubcategoriesDropdown(
                        e.target.value,
                        'editExpSubCatId'
                    );
                }
            );


            document
                .getElementById(
                    'editExpenseForm'
                )
                .addEventListener(
                    'submit',
                    async e => {
                        e.preventDefault();


                        const payload =
                        {
                            amount:
                                parseFloat(
                                    document
                                        .getElementById(
                                            'editExpAmount'
                                        )
                                        .value
                                ),

                            exp_by:
                                document
                                    .getElementById(
                                        'editExpBy'
                                    )
                                    .value,

                            category_id:
                                parseInt(
                                    document
                                        .getElementById(
                                            'editExpCatId'
                                        )
                                        .value
                                ),

                            sub_category_id:
                                parseInt(
                                    document
                                        .getElementById(
                                            'editExpSubCatId'
                                        )
                                        .value
                                ),

                            pay_type:
                                document
                                    .getElementById(
                                        'editExpPayType'
                                    )
                                    .value,

                            exp_date:
                                document
                                    .getElementById(
                                        'editExpDate'
                                    )
                                    .value,

                            description:
                                document
                                    .getElementById(
                                        'editExpDesc'
                                    )
                                    .value
                        };


                        try {
                            const updateRes =
                                await ApiManager.updateExpense(
                                    expenseId,
                                    payload
                                );


                            if (
                                updateRes.status === '0000' ||
                                updateRes.status === true
                            ) {
                                AppModule.closeModal();

                                loadData();
                            }
                            else {
                                alert(
                                    updateRes.message ||
                                    'Failed to update expense.'
                                );
                            }
                        }
                        catch (err) {
                            console.error(err);

                            alert(
                                'Error communicating with server.'
                            );
                        }
                    }
                );
        }
        catch (e) {
            console.error(e);

            const loading =
                document.getElementById(
                    'editModalLoading'
                );

            if (loading) {
                loading.innerHTML = `
                    <div style="color:#ef4444;">
                        Error fetching data.
                    </div>
                `;
            }
        }
    }


    /* ============================================================
       DELETE
    ============================================================ */

    async function deleteItem(id) {
        if (
            confirm(
                'Are you sure you want to delete this expense?'
            )
        ) {
            const res =
                await ApiManager.deleteExpense(id);


            if (res.status === '0000') {
                AppModule.closeModal();

                loadData();
            }
            else {
                alert(
                    res.message ||
                    'Could not delete entry.'
                );
            }
        }
    }


    /* ============================================================
       PUBLIC
    ============================================================ */

    return {
        render,
        deleteItem,
        showDetails,
        editExpense
    };

})();