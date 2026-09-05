'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, Boxes, Search } from 'lucide-react';
import { useCatalog } from '@/features/catalog';
import { listOrders } from '@/core/supabase/store';
import { useLanguage } from '@/features/i18n';
import type { Order } from '@/types';

export default function InventoryPage() {
  const { products } = useCatalog();
  const { language } = useLanguage();
  const en = language === 'en';
  const [orders, setOrders] = useState<Order[]>([]);
  const [query, setQuery] = useState('');
  const [productId, setProductId] = useState('all');
  const [status, setStatus] = useState<'all'|'available'|'low'|'out'>('all');
  const [showUnavailable, setShowUnavailable] = useState(false);
  useEffect(() => { void listOrders().then(setOrders).catch(() => setOrders([])); }, []);
  const rows = useMemo(() => products.flatMap((product) => {
    const hasConfiguredVariants =
      product.variantStock && Object.keys(product.variantStock).length > 0;
    const variants = hasConfiguredVariants
      ? Object.entries(product.variantStock ?? {}).map(([key, stock]) => { const [color,size] = key.split('::'); return {color,size,stock:Number(stock)||0}; }).filter((v) => product.colors.includes(v.color) && product.sizes.includes(v.size))
      : product.colors.flatMap((color) => product.sizes.map((size) => ({color,size,stock:product.sizeStock?.[size] ?? product.stockQuantity ?? 0})));
    const count = (color:string,size:string,statuses:string[]) => orders.filter((order) => statuses.includes(order.status)).flatMap((order) => order.lines).filter((line) => line.productName===product.name && line.color===color && line.size===size).reduce((sum,line)=>sum+line.quantity,0);
    return variants.map((v) => ({product,...v,reserved:count(v.color,v.size,['new','contacted','confirmed']),sold:count(v.color,v.size,['shipped','completed'])}));
  }), [orders,products]);
  const visible = rows.filter((row) => {
    const threshold=row.product.lowStockThreshold ?? 5;
    const matchesText=`${row.product.name} ${row.color} ${row.size}`.toLowerCase().includes(query.toLowerCase());
    const matchesStatus=status==='all'||(status==='available'&&row.stock>threshold)||(status==='low'&&row.stock>0&&row.stock<=threshold)||(status==='out'&&row.stock===0);
    return matchesText && (productId==='all'||row.product.id===productId) && (showUnavailable||row.stock>0||status==='out') && matchesStatus;
  });
  const low=rows.filter((row)=>row.stock>0&&row.stock<=(row.product.lowStockThreshold??5));
  return <div className="space-y-5">
    <section className="admin-card flex flex-col xl:flex-row justify-between gap-5"><div><h2 className="display text-2xl">{en?'Inventory management':'Управление складом'}</h2><p className="text-xs text-muted mt-2">{en?'Only configured color and size combinations are shown.':'Показаны только настроенные комбинации цвета и размера.'}</p></div><div className="flex gap-2"><Summary n={visible.length} t={en?'Shown':'Показано'} /><Summary n={rows.reduce((s,r)=>s+r.stock,0)} t={en?'Units':'Единиц'} /><Summary n={low.length} t={en?'Low stock':'Мало'} danger /></div></section>
    <section className="admin-card grid md:grid-cols-2 xl:grid-cols-4 gap-3"><label className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"/><input className="field search-field" value={query} onChange={(e)=>setQuery(e.target.value)} placeholder={en?'Product, color or size':'Товар, цвет или размер'} /></label><select className="field" value={productId} onChange={(e)=>setProductId(e.target.value)}><option value="all">{en?'All products':'Все товары'}</option>{products.map((p)=><option key={p.id} value={p.id}>{p.name}</option>)}</select><select className="field" value={status} onChange={(e)=>setStatus(e.target.value as typeof status)}><option value="all">{en?'All available stock':'Все доступные'}</option><option value="available">{en?'Healthy stock':'Достаточно'}</option><option value="low">{en?'Low stock':'Мало'}</option><option value="out">{en?'Out of stock':'Нет в наличии'}</option></select><label className="field flex items-center gap-3 text-sm"><input type="checkbox" checked={showUnavailable} onChange={(e)=>setShowUnavailable(e.target.checked)}/>{en?'Show unavailable':'Показать недоступные'}</label></section>
    {low.length>0&&<div className="admin-card border-gold/40 flex gap-3 text-sm"><AlertTriangle className="text-gold shrink-0" size={19}/>{en?`${low.length} combinations reached the low-stock threshold.`:`${low.length} вариантов достигли минимального остатка.`}</div>}
    <section className="admin-card overflow-x-auto"><table className="w-full min-w-[760px] text-sm"><thead className="text-xs text-muted text-left"><tr>{(en?['Product','Color','Size','Available','Reserved','Sold']:['Товар','Цвет','Размер','Доступно','Зарезервировано','Продано']).map((h)=><th key={h} className="pb-3">{h}</th>)}<th/></tr></thead><tbody>{visible.map((r)=><tr key={`${r.product.id}-${r.color}-${r.size}`} className="border-t"><td className="py-3 font-medium">{r.product.name}</td><td>{r.color}</td><td>{r.size}</td><td><b className={r.stock===0?'text-red-700':r.stock<=(r.product.lowStockThreshold??5)?'text-brown':'text-green-700'}>{r.stock}</b></td><td className="text-brown">{r.reserved}</td><td className="text-muted">{r.sold}</td><td><Link href="/admin/products" className="text-xs underline">{en?'Edit':'Изменить'}</Link></td></tr>)}</tbody></table>{!visible.length&&<div className="py-14 text-center text-muted"><Boxes className="mx-auto mb-3"/>{en?'No combinations match these filters.':'По выбранным фильтрам ничего не найдено.'}</div>}</section>
  </div>;
}
function Summary({n,t,danger=false}:{n:number;t:string;danger?:boolean}){return <div className={`min-w-20 border px-3 py-2 text-center ${danger?'border-red-200 bg-red-50 text-red-700':'border-black/10'}`}><b className="block text-lg">{n}</b><span className="text-[9px] uppercase">{t}</span></div>}
