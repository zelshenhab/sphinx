module.exports = [
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/app/admin/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Admin
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$products$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/data/products.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/config.ts [app-rsc] (ecmascript)");
;
;
;
function Admin() {
    const stats = [
        [
            'Всего товаров',
            __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$products$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["products"].length
        ],
        [
            'Активные товары',
            __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$products$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["products"].length
        ],
        [
            'Категории',
            __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$products$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["categories"].length
        ],
        [
            'Товаров со скидкой',
            __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$products$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["products"].filter((p)=>p.isSale).length
        ]
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid sm:grid-cols-2 xl:grid-cols-4 gap-4",
                children: stats.map((x)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "admin-card",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-muted",
                                children: x[0]
                            }, void 0, false, {
                                fileName: "[project]/app/admin/page.tsx",
                                lineNumber: 1,
                                columnNumber: 421
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                className: "display text-4xl block mt-4",
                                children: x[1]
                            }, void 0, false, {
                                fileName: "[project]/app/admin/page.tsx",
                                lineNumber: 1,
                                columnNumber: 465
                            }, this)
                        ]
                    }, x[0], true, {
                        fileName: "[project]/app/admin/page.tsx",
                        lineNumber: 1,
                        columnNumber: 382
                    }, this))
            }, void 0, false, {
                fileName: "[project]/app/admin/page.tsx",
                lineNumber: 1,
                columnNumber: 310
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid xl:grid-cols-2 gap-5 mt-5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "admin-card",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "display text-2xl mb-5",
                                children: "Последние товары"
                            }, void 0, false, {
                                fileName: "[project]/app/admin/page.tsx",
                                lineNumber: 1,
                                columnNumber: 608
                            }, this),
                            __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$products$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["products"].slice(0, 5).map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-between border-t py-3 text-sm",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: p.name
                                        }, void 0, false, {
                                            fileName: "[project]/app/admin/page.tsx",
                                            lineNumber: 1,
                                            columnNumber: 766
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatPrice"])(p.price)
                                        }, void 0, false, {
                                            fileName: "[project]/app/admin/page.tsx",
                                            lineNumber: 1,
                                            columnNumber: 787
                                        }, this)
                                    ]
                                }, p.id, true, {
                                    fileName: "[project]/app/admin/page.tsx",
                                    lineNumber: 1,
                                    columnNumber: 695
                                }, this))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/admin/page.tsx",
                        lineNumber: 1,
                        columnNumber: 580
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "admin-card",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "display text-2xl mb-5",
                                children: "Популярные категории"
                            }, void 0, false, {
                                fileName: "[project]/app/admin/page.tsx",
                                lineNumber: 1,
                                columnNumber: 858
                            }, this),
                            __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$products$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["categories"].map((c, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-between border-t py-3 text-sm",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: c.name
                                        }, void 0, false, {
                                            fileName: "[project]/app/admin/page.tsx",
                                            lineNumber: 1,
                                            columnNumber: 1015
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-muted",
                                            children: [
                                                30 - i * 5,
                                                "%"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/admin/page.tsx",
                                            lineNumber: 1,
                                            columnNumber: 1036
                                        }, this)
                                    ]
                                }, c.id, true, {
                                    fileName: "[project]/app/admin/page.tsx",
                                    lineNumber: 1,
                                    columnNumber: 944
                                }, this))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/admin/page.tsx",
                        lineNumber: 1,
                        columnNumber: 830
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/admin/page.tsx",
                lineNumber: 1,
                columnNumber: 532
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/admin/page.tsx",
        lineNumber: 1,
        columnNumber: 308
    }, this);
}
}),
"[project]/app/admin/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", (function(__turbopack_context__){

__turbopack_context__.n(__turbopack_context__.i("[project]/app/admin/page.tsx [app-rsc] (ecmascript)"));
}),
"[project]/data/products.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "categories",
    ()=>categories,
    "products",
    ()=>products
]);
const art = (label, tone = 'dark')=>`/assets/products/${label}-${tone}.svg`;
const categories = [
    {
        id: '1',
        name: 'Футболки',
        slug: 't-shirts',
        image: art('egyptian-power'),
        active: true
    },
    {
        id: '2',
        name: 'Худи',
        slug: 'hoodies',
        image: art('lotus', 'sand'),
        active: true
    },
    {
        id: '3',
        name: 'Свитшоты',
        slug: 'sweatshirts',
        image: art('heart'),
        active: true
    },
    {
        id: '4',
        name: 'Спорт',
        slug: 'sport',
        image: art('performance'),
        active: true
    }
];
const base = {
    colors: [
        'Black',
        'White',
        'Sand'
    ],
    sizes: [
        'XS',
        'S',
        'M',
        'L',
        'XL',
        'XXL'
    ],
    featured: true,
    material: '100% хлопок',
    gsm: '240 GSM',
    fit: 'Unisex Oversized',
    type: 'Streetwear',
    description: 'Плотный премиальный трикотаж, свободный силуэт и авторская графика SPHINX.'
};
const products = [
    {
        id: '1',
        name: 'Egyptian Power Oversized T-Shirt',
        slug: 'egyptian-power-oversized-tshirt',
        category: 't-shirts',
        price: 3490,
        images: [
            art('egyptian-power'),
            art('egyptian-power', 'sand')
        ],
        isNew: true,
        ...base
    },
    {
        id: '2',
        name: 'Heart of Egypt T-Shirt',
        slug: 'heart-of-egypt-tshirt',
        category: 't-shirts',
        price: 3490,
        images: [
            art('heart'),
            art('heart', 'sand')
        ],
        ...base
    },
    {
        id: '3',
        name: 'Spirit of Egypt T-Shirt',
        slug: 'spirit-of-egypt-tshirt',
        category: 't-shirts',
        price: 3290,
        oldPrice: 3790,
        images: [
            art('spirit'),
            art('spirit', 'sand')
        ],
        isSale: true,
        ...base
    },
    {
        id: '4',
        name: 'Lotus / Luxor T-Shirt',
        slug: 'lotus-luxor-tshirt',
        category: 't-shirts',
        price: 3690,
        images: [
            art('lotus'),
            art('lotus', 'sand')
        ],
        ...base
    },
    {
        id: '5',
        name: 'Egyptian Power Hoodie',
        slug: 'egyptian-power-hoodie',
        category: 'hoodies',
        price: 5990,
        images: [
            art('egyptian-power', 'sand'),
            art('egyptian-power')
        ],
        isNew: true,
        ...base,
        gsm: '420 GSM',
        fit: 'Relaxed Oversized'
    },
    {
        id: '6',
        name: 'Spirit of Egypt Hoodie',
        slug: 'spirit-of-egypt-hoodie',
        category: 'hoodies',
        price: 5790,
        images: [
            art('spirit', 'sand'),
            art('spirit')
        ],
        ...base,
        gsm: '420 GSM'
    },
    {
        id: '7',
        name: 'Lotus Hoodie',
        slug: 'lotus-hoodie',
        category: 'hoodies',
        price: 5890,
        images: [
            art('lotus', 'sand'),
            art('lotus')
        ],
        ...base,
        gsm: '420 GSM'
    },
    {
        id: '8',
        name: 'Egyptian Power Sweatshirt',
        slug: 'egyptian-power-sweatshirt',
        category: 'sweatshirts',
        price: 4990,
        images: [
            art('egyptian-power'),
            art('egyptian-power', 'sand')
        ],
        ...base,
        gsm: '360 GSM'
    },
    {
        id: '9',
        name: 'Heart of Egypt Sweatshirt',
        slug: 'heart-of-egypt-sweatshirt',
        category: 'sweatshirts',
        price: 4890,
        images: [
            art('heart', 'sand'),
            art('heart')
        ],
        ...base,
        gsm: '360 GSM'
    },
    {
        id: '10',
        name: 'SPHINX Performance Sleeveless',
        slug: 'performance-sleeveless',
        category: 'sport',
        price: 2990,
        images: [
            art('performance'),
            art('performance', 'sand')
        ],
        ...base,
        type: 'Performance',
        material: '90% полиэстер, 10% эластан',
        gsm: undefined,
        fit: 'Athletic',
        description: 'Эластичная быстросохнущая ткань для интенсивных тренировок.'
    },
    {
        id: '11',
        name: 'SPHINX Performance T-Shirt',
        slug: 'performance-tshirt',
        category: 'sport',
        price: 3290,
        images: [
            art('performance', 'sand'),
            art('performance')
        ],
        ...base,
        type: 'Performance',
        material: '90% полиэстер, 10% эластан',
        gsm: undefined,
        fit: 'Athletic',
        description: 'Технологичная футболка с влагоотводящими свойствами.'
    }
];
}),
"[project]/lib/config.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TELEGRAM_USERNAME",
    ()=>TELEGRAM_USERNAME,
    "formatPrice",
    ()=>formatPrice
]);
const TELEGRAM_USERNAME = 'SPHINX_STORE';
const formatPrice = (n)=>new Intl.NumberFormat('ru-RU').format(n) + ' ₽';
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__11pyquy._.js.map