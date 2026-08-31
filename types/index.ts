export interface ProductVariant { color:string; size:string; stock:number }
export interface Product { id:string; name:string; slug:string; category:string; price:number; oldPrice?:number; colors:string[]; sizes:string[]; images:string[]; featured:boolean; isNew?:boolean; isSale?:boolean; material:string; gsm?:string; fit:string; type:'Streetwear'|'Performance'; description:string; variants?:ProductVariant[] }
export interface Category { id:string; name:string; slug:string; image:string; active:boolean }
export interface CartItem { product:Product; color:string; size:string; quantity:number }
export interface Order { id:string; customer:string; items:number; total:number; date:string; status:string }
export interface Banner { id:string; title:string; subtitle:string; image:string; ctaText:string; ctaUrl:string; active:boolean }
export interface Collection { id:string; name:string; slug:string; productIds:string[] }
