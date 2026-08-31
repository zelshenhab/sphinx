module.exports = [
"[project]/app/shop/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Shop
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$products$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/data/products.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$product$2d$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/product-card.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
function Shop() {
    const [cat, setCat] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('all');
    const [sort, setSort] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('new');
    const list = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>__TURBOPACK__imported__module__$5b$project$5d2f$data$2f$products$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["products"].filter((p)=>cat === 'all' || p.category === cat).sort((a, b)=>sort === 'asc' ? a.price - b.price : sort === 'desc' ? b.price - a.price : Number(b.isNew) - Number(a.isNew)), [
        cat,
        sort
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "container-x py-16",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "eyebrow text-brown",
                children: "SPHINX Store"
            }, void 0, false, {
                fileName: "[project]/app/shop/page.tsx",
                lineNumber: 2,
                columnNumber: 334
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: "display text-5xl mt-3",
                children: "Магазин"
            }, void 0, false, {
                fileName: "[project]/app/shop/page.tsx",
                lineNumber: 2,
                columnNumber: 384
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-wrap justify-between gap-4 my-10 border-y py-5 border-black/10",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                        className: "bg-transparent",
                        value: cat,
                        onChange: (e)=>setCat(e.target.value),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "all",
                                children: "Все категории"
                            }, void 0, false, {
                                fileName: "[project]/app/shop/page.tsx",
                                lineNumber: 2,
                                columnNumber: 608
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "t-shirts",
                                children: "Футболки"
                            }, void 0, false, {
                                fileName: "[project]/app/shop/page.tsx",
                                lineNumber: 2,
                                columnNumber: 650
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "hoodies",
                                children: "Худи"
                            }, void 0, false, {
                                fileName: "[project]/app/shop/page.tsx",
                                lineNumber: 2,
                                columnNumber: 692
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "sweatshirts",
                                children: "Свитшоты"
                            }, void 0, false, {
                                fileName: "[project]/app/shop/page.tsx",
                                lineNumber: 2,
                                columnNumber: 729
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "sport",
                                children: "Спорт"
                            }, void 0, false, {
                                fileName: "[project]/app/shop/page.tsx",
                                lineNumber: 2,
                                columnNumber: 774
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/shop/page.tsx",
                        lineNumber: 2,
                        columnNumber: 524
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-5 text-sm text-muted",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Размер: Все"
                            }, void 0, false, {
                                fileName: "[project]/app/shop/page.tsx",
                                lineNumber: 2,
                                columnNumber: 866
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Цвет: Все"
                            }, void 0, false, {
                                fileName: "[project]/app/shop/page.tsx",
                                lineNumber: 2,
                                columnNumber: 890
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Цена: Все"
                            }, void 0, false, {
                                fileName: "[project]/app/shop/page.tsx",
                                lineNumber: 2,
                                columnNumber: 912
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/shop/page.tsx",
                        lineNumber: 2,
                        columnNumber: 819
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                        className: "bg-transparent",
                        value: sort,
                        onChange: (e)=>setSort(e.target.value),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "new",
                                children: "Новинки"
                            }, void 0, false, {
                                fileName: "[project]/app/shop/page.tsx",
                                lineNumber: 2,
                                columnNumber: 1026
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "asc",
                                children: "Цена: по возрастанию"
                            }, void 0, false, {
                                fileName: "[project]/app/shop/page.tsx",
                                lineNumber: 2,
                                columnNumber: 1062
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "desc",
                                children: "Цена: по убыванию"
                            }, void 0, false, {
                                fileName: "[project]/app/shop/page.tsx",
                                lineNumber: 2,
                                columnNumber: 1111
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/shop/page.tsx",
                        lineNumber: 2,
                        columnNumber: 940
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/shop/page.tsx",
                lineNumber: 2,
                columnNumber: 434
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$product$2d$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ProductGrid"], {
                products: list
            }, void 0, false, {
                fileName: "[project]/app/shop/page.tsx",
                lineNumber: 2,
                columnNumber: 1173
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/shop/page.tsx",
        lineNumber: 2,
        columnNumber: 298
    }, this);
}
}),
"[project]/components/product-card.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ProductCard",
    ()=>ProductCard,
    "ProductGrid",
    ()=>ProductGrid
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/config.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$store$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/store.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
function ProductCard({ product }) {
    const { add } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$store$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCart"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
        className: "group",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                href: `/product/${product.slug}`,
                className: "relative block bg-sand overflow-hidden aspect-[4/5]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        src: product.images[0],
                        alt: product.name,
                        fill: true,
                        className: "object-cover transition duration-700 group-hover:scale-[1.035]"
                    }, void 0, false, {
                        fileName: "[project]/components/product-card.tsx",
                        lineNumber: 3,
                        columnNumber: 217
                    }, this),
                    (product.isNew || product.isSale) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "absolute top-3 left-3 bg-white px-3 py-1 text-[9px] tracking-widest",
                        children: product.isSale ? 'SALE' : 'NEW'
                    }, void 0, false, {
                        fileName: "[project]/components/product-card.tsx",
                        lineNumber: 3,
                        columnNumber: 382
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/product-card.tsx",
                lineNumber: 3,
                columnNumber: 113
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pt-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        href: `/product/${product.slug}`,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-sm",
                            children: product.name
                        }, void 0, false, {
                            fileName: "[project]/components/product-card.tsx",
                            lineNumber: 3,
                            columnNumber: 574
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/product-card.tsx",
                        lineNumber: 3,
                        columnNumber: 534
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between items-end mt-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatPrice"])(product.price)
                                    }, void 0, false, {
                                        fileName: "[project]/components/product-card.tsx",
                                        lineNumber: 3,
                                        columnNumber: 700
                                    }, this),
                                    product.oldPrice && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("s", {
                                        className: "text-muted ml-2",
                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatPrice"])(product.oldPrice)
                                    }, void 0, false, {
                                        fileName: "[project]/components/product-card.tsx",
                                        lineNumber: 3,
                                        columnNumber: 754
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/product-card.tsx",
                                lineNumber: 3,
                                columnNumber: 677
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>add(product, product.colors[0], product.sizes[2]),
                                className: "text-[10px] uppercase tracking-wider border-b border-black",
                                children: "Быстро добавить"
                            }, void 0, false, {
                                fileName: "[project]/components/product-card.tsx",
                                lineNumber: 3,
                                columnNumber: 825
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/product-card.tsx",
                        lineNumber: 3,
                        columnNumber: 624
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-2 mt-3",
                        children: product.colors.map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                title: c,
                                className: "w-3 h-3 rounded-full border border-black/20",
                                style: {
                                    background: c === 'Black' ? '#222' : c === 'White' ? '#fff' : '#c8ad82'
                                }
                            }, c, false, {
                                fileName: "[project]/components/product-card.tsx",
                                lineNumber: 3,
                                columnNumber: 1052
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/components/product-card.tsx",
                        lineNumber: 3,
                        columnNumber: 996
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/product-card.tsx",
                lineNumber: 3,
                columnNumber: 512
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/product-card.tsx",
        lineNumber: 3,
        columnNumber: 86
    }, this);
}
function ProductGrid({ products }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-7",
        children: products.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ProductCard, {
                product: p
            }, p.id, false, {
                fileName: "[project]/components/product-card.tsx",
                lineNumber: 4,
                columnNumber: 163
            }, this))
    }, void 0, false, {
        fileName: "[project]/components/product-card.tsx",
        lineNumber: 4,
        columnNumber: 69
    }, this);
}
}),
"[project]/data/products.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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

//# sourceMappingURL=_0s-mkts._.js.map