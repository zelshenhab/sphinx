module.exports = [
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/app/shop/[category]/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Category
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$products$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/data/products.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$product$2d$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/product-card.tsx [app-rsc] (ecmascript)");
;
;
;
;
async function Category({ params }) {
    const { category } = await params;
    const c = __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$products$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["categories"].find((x)=>x.slug === category);
    if (!c) (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["notFound"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "container-x py-16",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "eyebrow text-brown",
                children: "Collection"
            }, void 0, false, {
                fileName: "[project]/app/shop/[category]/page.tsx",
                lineNumber: 2,
                columnNumber: 221
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: "display text-5xl mt-3 mb-12",
                children: c.name
            }, void 0, false, {
                fileName: "[project]/app/shop/[category]/page.tsx",
                lineNumber: 2,
                columnNumber: 269
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$product$2d$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ProductGrid"], {
                products: __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$products$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["products"].filter((p)=>p.category === category)
            }, void 0, false, {
                fileName: "[project]/app/shop/[category]/page.tsx",
                lineNumber: 2,
                columnNumber: 326
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/shop/[category]/page.tsx",
        lineNumber: 2,
        columnNumber: 185
    }, this);
}
}),
"[project]/app/shop/[category]/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", (function(__turbopack_context__){

__turbopack_context__.n(__turbopack_context__.i("[project]/app/shop/[category]/page.tsx [app-rsc] (ecmascript)"));
}),
"[project]/components/product-card.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ProductCard",
    ()=>ProductCard,
    "ProductGrid",
    ()=>ProductGrid
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const ProductCard = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call ProductCard() from the server but ProductCard is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/components/product-card.tsx", "ProductCard");
const ProductGrid = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call ProductGrid() from the server but ProductGrid is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/components/product-card.tsx", "ProductGrid");
}),
"[project]/components/product-card.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ProductCard",
    ()=>ProductCard,
    "ProductGrid",
    ()=>ProductGrid
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const ProductCard = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call ProductCard() from the server but ProductCard is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/components/product-card.tsx <module evaluation>", "ProductCard");
const ProductGrid = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call ProductGrid() from the server but ProductGrid is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/components/product-card.tsx <module evaluation>", "ProductGrid");
}),
"[project]/components/product-card.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$product$2d$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/components/product-card.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$product$2d$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/components/product-card.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$product$2d$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
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
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1q0eb_-._.js.map