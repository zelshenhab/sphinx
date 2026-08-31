import type { Product, Category } from '@/types';
const art=(label:string,tone='dark')=>`/assets/products/${label}-${tone}.svg`;
export const categories:Category[]=[
 {id:'1',name:'Футболки',slug:'t-shirts',image:art('egyptian-power'),active:true},
 {id:'2',name:'Худи',slug:'hoodies',image:art('lotus','sand'),active:true},
 {id:'3',name:'Свитшоты',slug:'sweatshirts',image:art('heart'),active:true},
 {id:'4',name:'Спорт',slug:'sport',image:art('performance'),active:true},
];
const base={colors:['Black','White','Sand'],sizes:['XS','S','M','L','XL','XXL'],featured:true,material:'100% хлопок',gsm:'240 GSM',fit:'Unisex Oversized',type:'Streetwear' as const,description:'Плотный премиальный трикотаж, свободный силуэт и авторская графика SPHINX.'};
export const products:Product[]=[
 {id:'1',name:'Egyptian Power Oversized T-Shirt',slug:'egyptian-power-oversized-tshirt',category:'t-shirts',price:3490,images:[art('egyptian-power'),art('egyptian-power','sand')],isNew:true,...base},
 {id:'2',name:'Heart of Egypt T-Shirt',slug:'heart-of-egypt-tshirt',category:'t-shirts',price:3490,images:[art('heart'),art('heart','sand')],...base},
 {id:'3',name:'Spirit of Egypt T-Shirt',slug:'spirit-of-egypt-tshirt',category:'t-shirts',price:3290,oldPrice:3790,images:[art('spirit'),art('spirit','sand')],isSale:true,...base},
 {id:'4',name:'Lotus / Luxor T-Shirt',slug:'lotus-luxor-tshirt',category:'t-shirts',price:3690,images:[art('lotus'),art('lotus','sand')],...base},
 {id:'5',name:'Egyptian Power Hoodie',slug:'egyptian-power-hoodie',category:'hoodies',price:5990,images:[art('egyptian-power','sand'),art('egyptian-power')],isNew:true,...base,gsm:'420 GSM',fit:'Relaxed Oversized'},
 {id:'6',name:'Spirit of Egypt Hoodie',slug:'spirit-of-egypt-hoodie',category:'hoodies',price:5790,images:[art('spirit','sand'),art('spirit')],...base,gsm:'420 GSM'},
 {id:'7',name:'Lotus Hoodie',slug:'lotus-hoodie',category:'hoodies',price:5890,images:[art('lotus','sand'),art('lotus')],...base,gsm:'420 GSM'},
 {id:'8',name:'Egyptian Power Sweatshirt',slug:'egyptian-power-sweatshirt',category:'sweatshirts',price:4990,images:[art('egyptian-power'),art('egyptian-power','sand')],...base,gsm:'360 GSM'},
 {id:'9',name:'Heart of Egypt Sweatshirt',slug:'heart-of-egypt-sweatshirt',category:'sweatshirts',price:4890,images:[art('heart','sand'),art('heart')],...base,gsm:'360 GSM'},
 {id:'10',name:'SPHINX Performance Sleeveless',slug:'performance-sleeveless',category:'sport',price:2990,images:[art('performance'),art('performance','sand')],...base,type:'Performance',material:'90% полиэстер, 10% эластан',gsm:undefined,fit:'Athletic',description:'Эластичная быстросохнущая ткань для интенсивных тренировок.'},
 {id:'11',name:'SPHINX Performance T-Shirt',slug:'performance-tshirt',category:'sport',price:3290,images:[art('performance','sand'),art('performance')],...base,type:'Performance',material:'90% полиэстер, 10% эластан',gsm:undefined,fit:'Athletic',description:'Технологичная футболка с влагоотводящими свойствами.'},
];
