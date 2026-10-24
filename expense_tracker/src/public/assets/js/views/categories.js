const CategoriesView = (() =>
{
    /* ============================================================
       CATEGORY ICONS
    ============================================================ */

    function getCategoryIcon(categoryName)
    {
        const name = String(categoryName || '')
            .toLowerCase()
            .trim();

        const svg = (path) => `
            <svg
                viewBox="0 0 24 24"
                width="26"
                height="26"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            >
                ${path}
            </svg>
        `;


        /* FOOD */
        if (
            name.includes('food') ||
            name.includes('restaurant') ||
            name.includes('dining') ||
            name.includes('meal') ||
            name.includes('snack') ||
            name.includes('lunch') ||
            name.includes('dinner') ||
            name.includes('breakfast')
        )
        {
            return svg(`
                <path d="M6 3v7"/>
                <path d="M3 3v7a3 3 0 0 0 6 0V3"/>
                <path d="M6 13v8"/>
                <path d="M18 3v18"/>
                <path d="M18 3c-3 2-3 7 0 9"/>
            `);
        }


        /* GROCERIES */
        if (
            name.includes('grocery') ||
            name.includes('groceries') ||
            name.includes('supermarket')
        )
        {
            return svg(`
                <path d="M4 6h17l-1.5 12h-14z"/>
                <path d="M8 6a4 4 0 0 1 8 0"/>
                <path d="M9 10v4"/>
                <path d="M15 10v4"/>
            `);
        }


        /* TRAVEL */
        if (
            name.includes('travel') ||
            name.includes('trip') ||
            name.includes('tour') ||
            name.includes('vacation') ||
            name.includes('holiday') ||
            name.includes('flight')
        )
        {
            return svg(`
                <path d="M2 12h20"/>
                <path d="M12 2l3 10-3 10"/>
                <path d="M5 12l-3 6h5l2-6"/>
                <path d="M19 12l3 6h-5l-2-6"/>
            `);
        }


        /* SHOPPING */
        if (
            name.includes('shopping') ||
            name.includes('shop') ||
            name.includes('clothing') ||
            name.includes('clothes') ||
            name.includes('fashion')
        )
        {
            return svg(`
                <path d="M6 2l-4 5h20l-4-5"/>
                <path d="M4 7l1 14h14l1-14"/>
                <path d="M9 11a3 3 0 0 0 6 0"/>
            `);
        }


        /* BILLS */
        if (
            name.includes('bill') ||
            name.includes('payment') ||
            name.includes('invoice')
        )
        {
            return svg(`
                <rect x="5" y="2" width="14" height="20" rx="2"/>
                <path d="M8 6h8"/>
                <path d="M8 10h8"/>
                <path d="M8 14h5"/>
                <path d="M8 18h4"/>
            `);
        }


        /* UTILITIES */
        if (
            name.includes('utilit') ||
            name.includes('electric') ||
            name.includes('electricity') ||
            name.includes('water') ||
            name.includes('gas') ||
            name.includes('internet') ||
            name.includes('wifi')
        )
        {
            return svg(`
                <path d="M13 2L3 14h9l-1 8 10-12h-9z"/>
            `);
        }


        /* TRANSPORT */
        if (
            name.includes('transport') ||
            name.includes('transportation') ||
            name.includes('vehicle') ||
            name.includes('bus') ||
            name.includes('taxi') ||
            name.includes('cab') ||
            name.includes('metro') ||
            name.includes('train') ||
            name.includes('auto')
        )
        {
            return svg(`
                <path d="M5 17h14"/>
                <path d="M6 17l1-8h10l1 8"/>
                <path d="M7 9l2-4h6l2 4"/>
                <circle cx="8" cy="19" r="1.5"/>
                <circle cx="16" cy="19" r="1.5"/>
            `);
        }


        /* FUEL */
        if (
            name.includes('fuel') ||
            name.includes('petrol') ||
            name.includes('diesel') ||
            name.includes('gasoline')
        )
        {
            return svg(`
                <path d="M5 22V4a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v18"/>
                <path d="M5 10h11"/>
                <path d="M8 6h5"/>
                <path d="M16 7h2l3 3v8a2 2 0 0 1-4 0v-5"/>
            `);
        }


        /* HEALTH */
        if (
            name.includes('health') ||
            name.includes('medical') ||
            name.includes('medicine') ||
            name.includes('doctor') ||
            name.includes('hospital') ||
            name.includes('pharmacy') ||
            name.includes('fitness') ||
            name.includes('gym')
        )
        {
            return svg(`
                <path d="M12 21s-7-4.5-9-9.5C1 6 4 3 7.5 3c2 0 3.5 1.2 4.5 3 1-1.8 2.5-3 4.5-3C20 3 23 6 21 11.5 19 16.5 12 21 12 21z"/>
                <path d="M9 11h6"/>
                <path d="M12 8v6"/>
            `);
        }


        /* EDUCATION */
        if (
            name.includes('education') ||
            name.includes('school') ||
            name.includes('college') ||
            name.includes('university') ||
            name.includes('course') ||
            name.includes('book')
        )
        {
            return svg(`
                <path d="M2 10l10-5 10 5-10 5z"/>
                <path d="M6 12v5c3 2 9 2 12 0v-5"/>
                <path d="M22 10v6"/>
            `);
        }


        /* ENTERTAINMENT */
        if (
            name.includes('entertainment') ||
            name.includes('movie') ||
            name.includes('cinema') ||
            name.includes('gaming') ||
            name.includes('game') ||
            name.includes('music') ||
            name.includes('netflix') ||
            name.includes('subscription')
        )
        {
            return svg(`
                <rect x="3" y="5" width="18" height="14" rx="2"/>
                <path d="M10 9l5 3-5 3z"/>
            `);
        }


        /* HOME / RENT */
        if (
            name.includes('home') ||
            name.includes('house') ||
            name.includes('rent') ||
            name.includes('mortgage')
        )
        {
            return svg(`
                <path d="M3 11l9-8 9 8"/>
                <path d="M5 10v11h14V10"/>
                <path d="M9 21v-6h6v6"/>
            `);
        }


        /* FAMILY */
        if (
            name.includes('family') ||
            name.includes('child') ||
            name.includes('children') ||
            name.includes('kids')
        )
        {
            return svg(`
                <circle cx="9" cy="7" r="3"/>
                <circle cx="17" cy="9" r="2"/>
                <path d="M3 21v-2a6 6 0 0 1 12 0v2"/>
                <path d="M15 14a5 5 0 0 1 6 5v2"/>
            `);
        }


        /* PERSONAL */
        if (
            name.includes('personal') ||
            name.includes('self') ||
            name.includes('care') ||
            name.includes('beauty') ||
            name.includes('salon')
        )
        {
            return svg(`
                <circle cx="12" cy="8" r="4"/>
                <path d="M4 21a8 8 0 0 1 16 0"/>
            `);
        }


        /* SALARY / INCOME */
        if (
            name.includes('salary') ||
            name.includes('income') ||
            name.includes('earning') ||
            name.includes('earnings') ||
            name.includes('wages')
        )
        {
            return svg(`
                <rect x="3" y="5" width="18" height="14" rx="2"/>
                <circle cx="12" cy="12" r="3"/>
                <path d="M7 9h.01"/>
                <path d="M17 15h.01"/>
            `);
        }


        /* INVESTMENT */
        if (
            name.includes('investment') ||
            name.includes('invest') ||
            name.includes('stocks') ||
            name.includes('stock') ||
            name.includes('mutual') ||
            name.includes('crypto')
        )
        {
            return svg(`
                <path d="M3 20h18"/>
                <path d="M5 17l5-5 4 3 6-7"/>
                <path d="M16 8h4v4"/>
            `);
        }


        /* SAVINGS */
        if (
            name.includes('saving') ||
            name.includes('savings')
        )
        {
            return svg(`
                <path d="M19 8h2v4h-2"/>
                <path d="M4 8h13a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2z"/>
                <circle cx="15" cy="14" r="1"/>
                <path d="M7 8V5a2 2 0 0 1 2-2h5l2 3"/>
            `);
        }


        /* GIFTS */
        if (
            name.includes('gift') ||
            name.includes('present') ||
            name.includes('donation') ||
            name.includes('charity')
        )
        {
            return svg(`
                <path d="M20 12v9H4v-9"/>
                <path d="M2 7h20v5H2z"/>
                <path d="M12 7v14"/>
                <path d="M12 7H7.5a2.5 2.5 0 1 1 2.5-2.5C10 7 12 7 12 7z"/>
                <path d="M12 7h4.5A2.5 2.5 0 1 0 14 4.5C14 7 12 7 12 7z"/>
            `);
        }


        /* PETS */
        if (
            name.includes('pet') ||
            name.includes('dog') ||
            name.includes('cat')
        )
        {
            return svg(`
                <circle cx="8" cy="9" r="2"/>
                <circle cx="16" cy="9" r="2"/>
                <circle cx="5" cy="13" r="2"/>
                <circle cx="19" cy="13" r="2"/>
                <path d="M12 11c-3 0-5 2-5 5 0 3 2 5 5 5s5-2 5-5c0-3-2-5-5-5z"/>
            `);
        }


        /* INSURANCE */
        if (
            name.includes('insurance') ||
            name.includes('policy')
        )
        {
            return svg(`
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <path d="M9 12l2 2 4-4"/>
            `);
        }


        /* TAX */
        if (
            name.includes('tax') ||
            name.includes('taxes')
        )
        {
            return svg(`
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <path d="M7 17L17 7"/>
                <circle cx="8" cy="8" r="1"/>
                <circle cx="16" cy="16" r="1"/>
            `);
        }


        /* LOAN / DEBT */
        if (
            name.includes('loan') ||
            name.includes('debt') ||
            name.includes('emi') ||
            name.includes('credit')
        )
        {
            return svg(`
                <rect x="3" y="5" width="18" height="14" rx="2"/>
                <path d="M3 10h18"/>
                <path d="M7 15h4"/>
            `);
        }


        /* COMMUNICATION */
        if (
            name.includes('phone') ||
            name.includes('mobile') ||
            name.includes('telephone') ||
            name.includes('communication')
        )
        {
            return svg(`
                <rect x="7" y="2" width="10" height="20" rx="2"/>
                <path d="M10 5h4"/>
                <path d="M11 18h2"/>
            `);
        }


        /* TECHNOLOGY */
        if (
            name.includes('technology') ||
            name.includes('tech') ||
            name.includes('computer') ||
            name.includes('software') ||
            name.includes('laptop') ||
            name.includes('electronic')
        )
        {
            return svg(`
                <rect x="3" y="4" width="18" height="13" rx="2"/>
                <path d="M8 21h8"/>
                <path d="M12 17v4"/>
            `);
        }


        /* OFFICE / WORK */
        if (
            name.includes('office') ||
            name.includes('work') ||
            name.includes('business') ||
            name.includes('professional')
        )
        {
            return svg(`
                <rect x="3" y="6" width="18" height="14" rx="2"/>
                <path d="M8 6V4h8v2"/>
                <path d="M3 11h18"/>
                <path d="M10 11v2h4v-2"/>
            `);
        }


        /* DEFAULT */
        return svg(`
            <circle cx="12" cy="12" r="9"/>
            <path d="M12 8v8"/>
            <path d="M8 12h8"/>
        `);
    }


    /* ============================================================
       ADD CSS
    ============================================================ */

    function addStyles()
    {
        if (document.getElementById('categories-view-styles'))
            return;

        const style = document.createElement('style');

        style.id = 'categories-view-styles';

        style.innerHTML = `
            /* ========================================================
               CATEGORY
            ======================================================== */

            .categories-list-container
            {
                width: 100%;
            }

            .category-item
            {
                padding: 18px 12px;
                border-bottom: 1px solid rgba(255,255,255,0.08);
                cursor: pointer;
                transition: background 0.2s ease;
            }

            .category-item:hover
            {
                background: rgba(255,255,255,0.025);
            }


            /* ========================================================
               SUBCATEGORY AREA
            ======================================================== */

            .subcategory-container
            {
                display: none;
                margin-top: 18px;
                width: 100%;
                box-sizing: border-box;
            }


            .subcategory-list
            {
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                flex-wrap: wrap;
                gap: 12px;
                box-sizing: border-box;
                padding: 16px;
                background: rgba(255,255,255,0.035);
                border: 1px solid rgba(255,255,255,0.08);
                border-radius: 12px;
            }


            .subcategory-item
            {
                min-width: 140px;
                max-width: 220px;
                padding: 11px 18px;
                border-radius: 8px;
                background: rgba(255,255,255,0.055);
                border: 1px solid rgba(255,255,255,0.08);
                color: #e2e8f0;
                font-size: 14px;
                font-weight: 500;
                text-align: center;
                box-sizing: border-box;
            }


            .subcategory-item:hover
            {
                background: rgba(255,255,255,0.09);
            }


            /* ========================================================
               LAPTOP / SMALLER DESKTOP
               Vertical + centered
            ======================================================== */

            @media (max-width: 1200px)
            {
                .subcategory-list
                {
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                }

                .subcategory-item
                {
                    width: min(80%, 320px);
                    max-width: 320px;
                }
            }


            /* ========================================================
               TABLET / MOBILE
            ======================================================== */

            @media (max-width: 700px)
            {
                .category-item
                {
                    padding: 15px 8px;
                }

                .subcategory-list
                {
                    padding: 12px;
                }

                .subcategory-item
                {
                    width: 90%;
                    max-width: 300px;
                }
            }
        `;

        document.head.appendChild(style);
    }


    /* ============================================================
       RENDER
    ============================================================ */

    async function render(container)
    {
        addStyles();

        container.innerHTML = `
            <div class="tab-view">

                <div class="page-title">
                    Categories List
                </div>

                <div class="card-panel">

                    <div
                        id="categoryList"
                        class="categories-list-container"
                    >
                        <div
                            style="
                                text-align:center;
                                padding:1rem;
                                color:#94a3b8;
                            "
                        >
                            Loading categories...
                        </div>
                    </div>

                </div>

            </div>
        `;

        await loadCategories();
    }


    /* ============================================================
       LOAD CATEGORIES
    ============================================================ */

    async function loadCategories()
    {
        const list =
            document.getElementById('categoryList');

        if (!list)
            return;

        try
        {
            const res =
                await ApiManager.getCategories();

            if (
                res.status === '0000' &&
                Array.isArray(res.data) &&
                res.data.length > 0
            )
            {
                list.innerHTML =
                    res.data.map(cat =>
                    {
                        return `
                            <div
                                class="category-item"
                                data-category-id="${cat.id}"
                            >

                                <!-- CATEGORY HEADER -->

                                <div
                                    style="
                                        display:flex;
                                        justify-content:space-between;
                                        align-items:center;
                                    "
                                >

                                    <div
                                        style="
                                            display:flex;
                                            align-items:center;
                                            gap:14px;
                                        "
                                    >

                                        <!-- ICON -->

                                        <div
                                            style="
                                                width:54px;
                                                height:54px;
                                                border-radius:12px;
                                                background:#334155;
                                                color:#e2e8f0;
                                                display:flex;
                                                align-items:center;
                                                justify-content:center;
                                                flex-shrink:0;
                                            "
                                        >
                                            ${getCategoryIcon(cat.name)}
                                        </div>


                                        <!-- NAME -->

                                        <div>

                                            <div
                                                style="
                                                    color:#f1f5f9;
                                                    font-size:17px;
                                                    font-weight:600;
                                                "
                                            >
                                                ${cat.name}
                                            </div>

                                            <div
                                                style="
                                                    color:#94a3b8;
                                                    font-size:13px;
                                                    margin-top:4px;
                                                "
                                            >
                                                Category ID: ${cat.id}
                                            </div>

                                        </div>

                                    </div>


                                    <!-- ARROW -->

                                    <div
                                        class="category-arrow"
                                        style="
                                            width:9px;
                                            height:9px;
                                            border-right:2px solid #94a3b8;
                                            border-bottom:2px solid #94a3b8;
                                            transform:rotate(-45deg);
                                            margin-right:10px;
                                            transition:transform 0.2s ease;
                                        "
                                    ></div>

                                </div>


                                <!-- SUBCATEGORY -->

                                <div
                                    id="subcategory-${cat.id}"
                                    class="subcategory-container"
                                >
                                </div>

                            </div>
                        `;
                    }).join('');

                bindCategoryActions();
            }
            else
            {
                list.innerHTML = `
                    <div
                        style="
                            text-align:center;
                            padding:1.5rem;
                            color:#94a3b8;
                        "
                    >
                        No categories found.
                    </div>
                `;
            }
        }
        catch (err)
        {
            console.error(
                'Error loading categories:',
                err
            );

            list.innerHTML = `
                <div
                    style="
                        text-align:center;
                        padding:1.5rem;
                        color:#ef4444;
                    "
                >
                    Failed to load categories.
                </div>
            `;
        }
    }


    /* ============================================================
       CATEGORY CLICK
    ============================================================ */

    function bindCategoryActions()
    {
        document
            .querySelectorAll('.category-item')
            .forEach(category =>
            {
                category.addEventListener(
                    'click',
                    async function(e)
                    {
                        const categoryId =
                            this.dataset.categoryId;

                        const subContainer =
                            document.getElementById(
                                `subcategory-${categoryId}`
                            );

                        const arrow =
                            this.querySelector(
                                '.category-arrow'
                            );

                        if (!subContainer)
                            return;


                        /* ====================================================
                           CLOSE
                        ==================================================== */

                        if (
                            subContainer.style.display ===
                            'block'
                        )
                        {
                            subContainer.style.display =
                                'none';

                            arrow.style.transform =
                                'rotate(-45deg)';

                            return;
                        }


                        /* ====================================================
                           OPEN
                        ==================================================== */

                        subContainer.style.display =
                            'block';

                        arrow.style.transform =
                            'rotate(45deg)';


                        subContainer.innerHTML = `
                            <div
                                style="
                                    text-align:center;
                                    padding:15px;
                                    color:#94a3b8;
                                    font-size:14px;
                                "
                            >
                                Loading subcategories...
                            </div>
                        `;


                        try
                        {
                            const res =
                                await ApiManager
                                    .getSubcategoriesByCategory(
                                        categoryId
                                    );


                            /* ====================================================
                               SUCCESS
                            ==================================================== */

                            if (
                                res.status === '0000' &&
                                Array.isArray(res.data) &&
                                res.data.length > 0
                            )
                            {
                                subContainer.innerHTML = `
                                    <div class="subcategory-list">

                                        ${res.data.map(sub =>
                                        {
                                            return `
                                                <div
                                                    class="subcategory-item"
                                                >
                                                    ${sub.name}
                                                </div>
                                            `;
                                        }).join('')}

                                    </div>
                                `;
                            }
                            else
                            {
                                subContainer.innerHTML = `
                                    <div
                                        style="
                                            width:100%;
                                            text-align:center;
                                            padding:15px;
                                            color:#94a3b8;
                                            font-size:14px;
                                        "
                                    >
                                        No subcategories found.
                                    </div>
                                `;
                            }
                        }
                        catch (err)
                        {
                            console.error(
                                'Error loading subcategories:',
                                err
                            );

                            subContainer.innerHTML = `
                                <div
                                    style="
                                        width:100%;
                                        text-align:center;
                                        padding:15px;
                                        color:#f87171;
                                        font-size:14px;
                                    "
                                >
                                    Failed to load subcategories.
                                </div>
                            `;
                        }
                    }
                );
            });
    }


    /* ============================================================
       RETURN
    ============================================================ */

    return {
        render
    };

})();