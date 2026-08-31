module.exports = [
"[project]/app/admin/products/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Products
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$products$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/data/products.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/config.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
const KEY = 'sphinx-products';
const blank = {
    name: '',
    slug: '',
    category: 't-shirts',
    price: '',
    oldPrice: '',
    description: '',
    material: '100% хлопок',
    gsm: '240 GSM',
    fit: 'Unisex Oversized',
    colors: 'Black, White, Sand',
    sizes: 'XS, S, M, L, XL, XXL',
    image: '/assets/products/egyptian-power-dark.svg',
    type: 'Streetwear',
    featured: true,
    isNew: true,
    isSale: false
};
function load() {
    if ("TURBOPACK compile-time truthy", 1) return __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$products$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["products"];
    //TURBOPACK unreachable
    ;
}
function Products() {
    const [list, setList] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(load);
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [form, setForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(blank);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const save = (x)=>{
        setList(x);
        localStorage.setItem(KEY, JSON.stringify(x));
    };
    const create = (e)=>{
        e.preventDefault();
        if (!form.name.trim() || !form.slug.trim() || !Number(form.price)) {
            setError('اكتب اسم المنتج وSlug والسعر.');
            return;
        }
        const p = {
            id: Date.now().toString(),
            name: form.name.trim(),
            slug: form.slug.trim().toLowerCase().replace(/\s+/g, '-'),
            category: form.category,
            price: Number(form.price),
            oldPrice: form.oldPrice ? Number(form.oldPrice) : undefined,
            description: form.description || 'Новая модель SPHINX.',
            material: form.material,
            gsm: form.gsm || undefined,
            fit: form.fit,
            colors: form.colors.split(',').map((x)=>x.trim()).filter(Boolean),
            sizes: form.sizes.split(',').map((x)=>x.trim()).filter(Boolean),
            images: [
                form.image || blank.image
            ],
            type: form.type,
            featured: form.featured,
            isNew: form.isNew,
            isSale: form.isSale
        };
        save([
            p,
            ...list
        ]);
        setForm(blank);
        setError('');
        setOpen(false);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "admin-card overflow-auto",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-between items-center mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "display text-2xl",
                                children: "Товары"
                            }, void 0, false, {
                                fileName: "[project]/app/admin/products/page.tsx",
                                lineNumber: 6,
                                columnNumber: 1177
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-muted mt-1",
                                children: [
                                    list.length,
                                    " товаров · сохранение в браузере"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/admin/products/page.tsx",
                                lineNumber: 6,
                                columnNumber: 1221
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/admin/products/page.tsx",
                        lineNumber: 6,
                        columnNumber: 1172
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setOpen(!open),
                        className: "btn btn-dark",
                        children: open ? 'Закрыть' : 'Добавить товар'
                    }, void 0, false, {
                        fileName: "[project]/app/admin/products/page.tsx",
                        lineNumber: 6,
                        columnNumber: 1315
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/admin/products/page.tsx",
                lineNumber: 6,
                columnNumber: 1116
            }, this),
            open && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                onSubmit: create,
                className: "bg-sand/60 border border-black/10 p-5 mb-7",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "display text-xl mb-5",
                        children: "Новый товар"
                    }, void 0, false, {
                        fileName: "[project]/app/admin/products/page.tsx",
                        lineNumber: 6,
                        columnNumber: 1511
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid md:grid-cols-2 xl:grid-cols-3 gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                label: "Name *",
                                value: form.name,
                                change: (v)=>setForm({
                                        ...form,
                                        name: v,
                                        slug: form.slug || v.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
                                    })
                            }, void 0, false, {
                                fileName: "[project]/app/admin/products/page.tsx",
                                lineNumber: 6,
                                columnNumber: 1622
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                label: "Slug *",
                                value: form.slug,
                                change: (v)=>setForm({
                                        ...form,
                                        slug: v
                                    })
                            }, void 0, false, {
                                fileName: "[project]/app/admin/products/page.tsx",
                                lineNumber: 6,
                                columnNumber: 1781
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(T, {
                                        children: "Category"
                                    }, void 0, false, {
                                        fileName: "[project]/app/admin/products/page.tsx",
                                        lineNumber: 6,
                                        columnNumber: 1867
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        className: "field mt-2",
                                        value: form.category,
                                        onChange: (e)=>setForm({
                                                ...form,
                                                category: e.target.value
                                            }),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "t-shirts",
                                                children: "T-Shirts"
                                            }, void 0, false, {
                                                fileName: "[project]/app/admin/products/page.tsx",
                                                lineNumber: 6,
                                                columnNumber: 1992
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "hoodies",
                                                children: "Hoodies"
                                            }, void 0, false, {
                                                fileName: "[project]/app/admin/products/page.tsx",
                                                lineNumber: 6,
                                                columnNumber: 2034
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "sweatshirts",
                                                children: "Sweatshirts"
                                            }, void 0, false, {
                                                fileName: "[project]/app/admin/products/page.tsx",
                                                lineNumber: 6,
                                                columnNumber: 2074
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "sport",
                                                children: "Sport"
                                            }, void 0, false, {
                                                fileName: "[project]/app/admin/products/page.tsx",
                                                lineNumber: 6,
                                                columnNumber: 2122
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/admin/products/page.tsx",
                                        lineNumber: 6,
                                        columnNumber: 1882
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/admin/products/page.tsx",
                                lineNumber: 6,
                                columnNumber: 1860
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                label: "Price *",
                                type: "number",
                                value: form.price,
                                change: (v)=>setForm({
                                        ...form,
                                        price: v
                                    })
                            }, void 0, false, {
                                fileName: "[project]/app/admin/products/page.tsx",
                                lineNumber: 6,
                                columnNumber: 2175
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                label: "Old price",
                                type: "number",
                                value: form.oldPrice,
                                change: (v)=>setForm({
                                        ...form,
                                        oldPrice: v
                                    })
                            }, void 0, false, {
                                fileName: "[project]/app/admin/products/page.tsx",
                                lineNumber: 6,
                                columnNumber: 2271
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(T, {
                                        children: "Product type"
                                    }, void 0, false, {
                                        fileName: "[project]/app/admin/products/page.tsx",
                                        lineNumber: 6,
                                        columnNumber: 2382
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        className: "field mt-2",
                                        value: form.type,
                                        onChange: (e)=>setForm({
                                                ...form,
                                                type: e.target.value
                                            }),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                children: "Streetwear"
                                            }, void 0, false, {
                                                fileName: "[project]/app/admin/products/page.tsx",
                                                lineNumber: 6,
                                                columnNumber: 2522
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                children: "Performance"
                                            }, void 0, false, {
                                                fileName: "[project]/app/admin/products/page.tsx",
                                                lineNumber: 6,
                                                columnNumber: 2549
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/admin/products/page.tsx",
                                        lineNumber: 6,
                                        columnNumber: 2401
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/admin/products/page.tsx",
                                lineNumber: 6,
                                columnNumber: 2375
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                label: "Colors",
                                value: form.colors,
                                change: (v)=>setForm({
                                        ...form,
                                        colors: v
                                    })
                            }, void 0, false, {
                                fileName: "[project]/app/admin/products/page.tsx",
                                lineNumber: 6,
                                columnNumber: 2594
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                label: "Sizes",
                                value: form.sizes,
                                change: (v)=>setForm({
                                        ...form,
                                        sizes: v
                                    })
                            }, void 0, false, {
                                fileName: "[project]/app/admin/products/page.tsx",
                                lineNumber: 6,
                                columnNumber: 2677
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                label: "Image path",
                                value: form.image,
                                change: (v)=>setForm({
                                        ...form,
                                        image: v
                                    })
                            }, void 0, false, {
                                fileName: "[project]/app/admin/products/page.tsx",
                                lineNumber: 6,
                                columnNumber: 2757
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                label: "Material",
                                value: form.material,
                                change: (v)=>setForm({
                                        ...form,
                                        material: v
                                    })
                            }, void 0, false, {
                                fileName: "[project]/app/admin/products/page.tsx",
                                lineNumber: 6,
                                columnNumber: 2842
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                label: "GSM",
                                value: form.gsm,
                                change: (v)=>setForm({
                                        ...form,
                                        gsm: v
                                    })
                            }, void 0, false, {
                                fileName: "[project]/app/admin/products/page.tsx",
                                lineNumber: 6,
                                columnNumber: 2931
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                label: "Fit",
                                value: form.fit,
                                change: (v)=>setForm({
                                        ...form,
                                        fit: v
                                    })
                            }, void 0, false, {
                                fileName: "[project]/app/admin/products/page.tsx",
                                lineNumber: 6,
                                columnNumber: 3005
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "md:col-span-2 xl:col-span-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(T, {
                                        children: "Description"
                                    }, void 0, false, {
                                        fileName: "[project]/app/admin/products/page.tsx",
                                        lineNumber: 6,
                                        columnNumber: 3126
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                        className: "field mt-2",
                                        rows: 3,
                                        value: form.description,
                                        onChange: (e)=>setForm({
                                                ...form,
                                                description: e.target.value
                                            })
                                    }, void 0, false, {
                                        fileName: "[project]/app/admin/products/page.tsx",
                                        lineNumber: 6,
                                        columnNumber: 3144
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/admin/products/page.tsx",
                                lineNumber: 6,
                                columnNumber: 3079
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/admin/products/page.tsx",
                        lineNumber: 6,
                        columnNumber: 1564
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-5 mt-5 text-sm",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Check, {
                                label: "Featured",
                                checked: form.featured,
                                change: (v)=>setForm({
                                        ...form,
                                        featured: v
                                    })
                            }, void 0, false, {
                                fileName: "[project]/app/admin/products/page.tsx",
                                lineNumber: 6,
                                columnNumber: 3327
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Check, {
                                label: "New",
                                checked: form.isNew,
                                change: (v)=>setForm({
                                        ...form,
                                        isNew: v
                                    })
                            }, void 0, false, {
                                fileName: "[project]/app/admin/products/page.tsx",
                                lineNumber: 6,
                                columnNumber: 3418
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Check, {
                                label: "Sale",
                                checked: form.isSale,
                                change: (v)=>setForm({
                                        ...form,
                                        isSale: v
                                    })
                            }, void 0, false, {
                                fileName: "[project]/app/admin/products/page.tsx",
                                lineNumber: 6,
                                columnNumber: 3498
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/admin/products/page.tsx",
                        lineNumber: 6,
                        columnNumber: 3286
                    }, this),
                    error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-red-700 text-sm mt-4",
                        children: error
                    }, void 0, false, {
                        fileName: "[project]/app/admin/products/page.tsx",
                        lineNumber: 6,
                        columnNumber: 3595
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "submit",
                        className: "btn btn-dark mt-5",
                        children: "Сохранить товар"
                    }, void 0, false, {
                        fileName: "[project]/app/admin/products/page.tsx",
                        lineNumber: 6,
                        columnNumber: 3648
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/admin/products/page.tsx",
                lineNumber: 6,
                columnNumber: 1432
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                className: "w-full text-sm text-left min-w-[800px]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                        className: "text-xs text-muted",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                            children: [
                                'Image',
                                'Name',
                                'Category',
                                'Price',
                                'Old Price',
                                'Status',
                                'Stock',
                                'Actions'
                            ].map((x)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                    className: "py-3",
                                    children: x
                                }, x, false, {
                                    fileName: "[project]/app/admin/products/page.tsx",
                                    lineNumber: 6,
                                    columnNumber: 3915
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/app/admin/products/page.tsx",
                            lineNumber: 6,
                            columnNumber: 3828
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/admin/products/page.tsx",
                        lineNumber: 6,
                        columnNumber: 3790
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                        children: list.map((p, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                className: "border-t",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        className: "py-3",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                            src: p.images[0],
                                            alt: "",
                                            width: 46,
                                            height: 56
                                        }, void 0, false, {
                                            fileName: "[project]/app/admin/products/page.tsx",
                                            lineNumber: 6,
                                            columnNumber: 4048
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/admin/products/page.tsx",
                                        lineNumber: 6,
                                        columnNumber: 4027
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        children: p.name
                                    }, void 0, false, {
                                        fileName: "[project]/app/admin/products/page.tsx",
                                        lineNumber: 6,
                                        columnNumber: 4109
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        children: p.category
                                    }, void 0, false, {
                                        fileName: "[project]/app/admin/products/page.tsx",
                                        lineNumber: 6,
                                        columnNumber: 4126
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatPrice"])(p.price)
                                    }, void 0, false, {
                                        fileName: "[project]/app/admin/products/page.tsx",
                                        lineNumber: 6,
                                        columnNumber: 4147
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        children: p.oldPrice ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatPrice"])(p.oldPrice) : '—'
                                    }, void 0, false, {
                                        fileName: "[project]/app/admin/products/page.tsx",
                                        lineNumber: 6,
                                        columnNumber: 4178
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        className: "text-green-700",
                                        children: "Active"
                                    }, void 0, false, {
                                        fileName: "[project]/app/admin/products/page.tsx",
                                        lineNumber: 6,
                                        columnNumber: 4227
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        children: "In stock"
                                    }, void 0, false, {
                                        fileName: "[project]/app/admin/products/page.tsx",
                                        lineNumber: 6,
                                        columnNumber: 4269
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        className: "space-x-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>save([
                                                        ...list,
                                                        {
                                                            ...p,
                                                            id: Date.now().toString(),
                                                            name: p.name + ' Copy'
                                                        }
                                                    ]),
                                                children: "Duplicate"
                                            }, void 0, false, {
                                                fileName: "[project]/app/admin/products/page.tsx",
                                                lineNumber: 6,
                                                columnNumber: 4312
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "text-red-700",
                                                onClick: ()=>save(list.filter((_, n)=>n !== i)),
                                                children: "Delete"
                                            }, void 0, false, {
                                                fileName: "[project]/app/admin/products/page.tsx",
                                                lineNumber: 6,
                                                columnNumber: 4420
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/admin/products/page.tsx",
                                        lineNumber: 6,
                                        columnNumber: 4286
                                    }, this)
                                ]
                            }, p.id, true, {
                                fileName: "[project]/app/admin/products/page.tsx",
                                lineNumber: 6,
                                columnNumber: 3991
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/app/admin/products/page.tsx",
                        lineNumber: 6,
                        columnNumber: 3967
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/admin/products/page.tsx",
                lineNumber: 6,
                columnNumber: 3732
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/admin/products/page.tsx",
        lineNumber: 6,
        columnNumber: 1074
    }, this);
}
function T({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "text-xs text-muted",
        children: children
    }, void 0, false, {
        fileName: "[project]/app/admin/products/page.tsx",
        lineNumber: 7,
        columnNumber: 58
    }, this);
}
function Field({ label, value, change, type = 'text' }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(T, {
                children: label
            }, void 0, false, {
                fileName: "[project]/app/admin/products/page.tsx",
                lineNumber: 8,
                columnNumber: 129
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                type: type,
                className: "field mt-2",
                value: value,
                onChange: (e)=>change(e.target.value)
            }, void 0, false, {
                fileName: "[project]/app/admin/products/page.tsx",
                lineNumber: 8,
                columnNumber: 143
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/admin/products/page.tsx",
        lineNumber: 8,
        columnNumber: 122
    }, this);
}
function Check({ label, checked, change }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
        className: "flex items-center gap-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                type: "checkbox",
                checked: checked,
                onChange: (e)=>change(e.target.checked)
            }, void 0, false, {
                fileName: "[project]/app/admin/products/page.tsx",
                lineNumber: 9,
                columnNumber: 146
            }, this),
            label
        ]
    }, void 0, true, {
        fileName: "[project]/app/admin/products/page.tsx",
        lineNumber: 9,
        columnNumber: 103
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

//# sourceMappingURL=_1-xy4yk._.js.map