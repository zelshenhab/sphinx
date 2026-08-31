(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/product/[slug]/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ProductPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Minus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/minus.js [app-client] (ecmascript) <export default as Minus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$products$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/data/products.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/config.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$store$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/store.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
function ProductPage({ params }) {
    _s();
    const { slug } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["use"])(params);
    const p = __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$products$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["products"].find((x)=>x.slug === slug);
    if (!p) (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["notFound"])();
    const [color, setColor] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(p.colors[0]);
    const [size, setSize] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('M');
    const [q, setQ] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const [image, setImage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(p.images[0]);
    const { add } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$store$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCart"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "container-x py-10 grid lg:grid-cols-2 gap-12 lg:gap-20",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative aspect-[4/5] bg-sand",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            src: image,
                            alt: p.name,
                            fill: true,
                            className: "object-cover"
                        }, void 0, false, {
                            fileName: "[project]/app/product/[slug]/page.tsx",
                            lineNumber: 2,
                            columnNumber: 461
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/product/[slug]/page.tsx",
                        lineNumber: 2,
                        columnNumber: 414
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-3 mt-3",
                        children: p.images.map((x)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setImage(x),
                                className: "relative w-20 aspect-[4/5] bg-sand",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    src: x,
                                    alt: "",
                                    fill: true,
                                    className: "object-cover"
                                }, void 0, false, {
                                    fileName: "[project]/app/product/[slug]/page.tsx",
                                    lineNumber: 2,
                                    columnNumber: 669
                                }, this)
                            }, x, false, {
                                fileName: "[project]/app/product/[slug]/page.tsx",
                                lineNumber: 2,
                                columnNumber: 580
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/app/product/[slug]/page.tsx",
                        lineNumber: 2,
                        columnNumber: 530
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/product/[slug]/page.tsx",
                lineNumber: 2,
                columnNumber: 409
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "lg:sticky lg:top-28 self-start",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "eyebrow text-brown",
                        children: p.type
                    }, void 0, false, {
                        fileName: "[project]/app/product/[slug]/page.tsx",
                        lineNumber: 2,
                        columnNumber: 793
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "display text-4xl mt-4",
                        children: [
                            "SPHINX — ",
                            p.name
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/product/[slug]/page.tsx",
                        lineNumber: 2,
                        columnNumber: 839
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xl mt-5",
                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatPrice"])(p.price)
                    }, void 0, false, {
                        fileName: "[project]/app/product/[slug]/page.tsx",
                        lineNumber: 2,
                        columnNumber: 899
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-muted leading-7 mt-7",
                        children: p.description
                    }, void 0, false, {
                        fileName: "[project]/app/product/[slug]/page.tsx",
                        lineNumber: 2,
                        columnNumber: 953
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-9",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                className: "text-sm",
                                children: [
                                    "Цвет: ",
                                    color
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/product/[slug]/page.tsx",
                                lineNumber: 2,
                                columnNumber: 1035
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-2 mt-3",
                                children: p.colors.map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setColor(c),
                                        className: `px-4 py-2 text-xs border ${color === c ? 'border-ink' : 'border-black/15'}`,
                                        children: c
                                    }, c, false, {
                                        fileName: "[project]/app/product/[slug]/page.tsx",
                                        lineNumber: 2,
                                        columnNumber: 1125
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/app/product/[slug]/page.tsx",
                                lineNumber: 2,
                                columnNumber: 1075
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/product/[slug]/page.tsx",
                        lineNumber: 2,
                        columnNumber: 1013
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-7",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                className: "text-sm",
                                children: [
                                    "Размер: ",
                                    size
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/product/[slug]/page.tsx",
                                lineNumber: 2,
                                columnNumber: 1298
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-6 gap-2 mt-3",
                                children: p.sizes.map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setSize(s),
                                        className: `py-3 text-xs border ${size === s ? 'bg-ink text-white' : 'border-black/15'}`,
                                        children: s
                                    }, s, false, {
                                        fileName: "[project]/app/product/[slug]/page.tsx",
                                        lineNumber: 2,
                                        columnNumber: 1400
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/app/product/[slug]/page.tsx",
                                lineNumber: 2,
                                columnNumber: 1339
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/product/[slug]/page.tsx",
                        lineNumber: 2,
                        columnNumber: 1276
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-3 mt-7",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex border border-black/20 items-center gap-4 px-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setQ(Math.max(1, q - 1)),
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Minus$3e$__["Minus"], {
                                            size: 14
                                        }, void 0, false, {
                                            fileName: "[project]/app/product/[slug]/page.tsx",
                                            lineNumber: 2,
                                            columnNumber: 1697
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/product/[slug]/page.tsx",
                                        lineNumber: 2,
                                        columnNumber: 1653
                                    }, this),
                                    q,
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setQ(q + 1),
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                            size: 14
                                        }, void 0, false, {
                                            fileName: "[project]/app/product/[slug]/page.tsx",
                                            lineNumber: 2,
                                            columnNumber: 1759
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/product/[slug]/page.tsx",
                                        lineNumber: 2,
                                        columnNumber: 1727
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/product/[slug]/page.tsx",
                                lineNumber: 2,
                                columnNumber: 1584
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>add(p, color, size, q),
                                className: "btn btn-dark flex-1",
                                children: "Добавить в корзину"
                            }, void 0, false, {
                                fileName: "[project]/app/product/[slug]/page.tsx",
                                lineNumber: 2,
                                columnNumber: 1791
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/product/[slug]/page.tsx",
                        lineNumber: 2,
                        columnNumber: 1551
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        href: `https://t.me/${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TELEGRAM_USERNAME"]}`,
                        className: "btn border border-ink w-full mt-3",
                        children: "Заказать в Telegram"
                    }, void 0, false, {
                        fileName: "[project]/app/product/[slug]/page.tsx",
                        lineNumber: 2,
                        columnNumber: 1898
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-10 border-t text-sm",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Info, {
                                n: "Описание",
                                v: p.description
                            }, void 0, false, {
                                fileName: "[project]/app/product/[slug]/page.tsx",
                                lineNumber: 2,
                                columnNumber: 2053
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Info, {
                                n: "Состав",
                                v: p.material
                            }, void 0, false, {
                                fileName: "[project]/app/product/[slug]/page.tsx",
                                lineNumber: 2,
                                columnNumber: 2091
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Info, {
                                n: "Посадка",
                                v: p.fit + (p.gsm ? ` · ${p.gsm}` : '')
                            }, void 0, false, {
                                fileName: "[project]/app/product/[slug]/page.tsx",
                                lineNumber: 2,
                                columnNumber: 2124
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Info, {
                                n: "Доставка",
                                v: "По России курьерской службой. Бесплатно от 7 000 ₽."
                            }, void 0, false, {
                                fileName: "[project]/app/product/[slug]/page.tsx",
                                lineNumber: 2,
                                columnNumber: 2178
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/product/[slug]/page.tsx",
                        lineNumber: 2,
                        columnNumber: 2013
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/product/[slug]/page.tsx",
                lineNumber: 2,
                columnNumber: 745
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/product/[slug]/page.tsx",
        lineNumber: 2,
        columnNumber: 336
    }, this);
}
_s(ProductPage, "muOXoXtyCunBJovwvITnnupdVgo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$store$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCart"]
    ];
});
_c = ProductPage;
function Info({ n, v }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("details", {
        className: "border-b py-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("summary", {
                className: "cursor-pointer font-medium",
                children: n
            }, void 0, false, {
                fileName: "[project]/app/product/[slug]/page.tsx",
                lineNumber: 3,
                columnNumber: 84
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-muted mt-3 leading-6",
                children: v
            }, void 0, false, {
                fileName: "[project]/app/product/[slug]/page.tsx",
                lineNumber: 3,
                columnNumber: 145
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/product/[slug]/page.tsx",
        lineNumber: 3,
        columnNumber: 49
    }, this);
}
_c1 = Info;
var _c, _c1;
__turbopack_context__.k.register(_c, "ProductPage");
__turbopack_context__.k.register(_c1, "Info");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/data/products.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_1p_kp78._.js.map