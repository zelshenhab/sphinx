import type {Metadata} from 'next';import './globals.css';import {Header,Footer} from '@/features/cart';import {AppProviders} from '@/components/providers/app-providers';
export const metadata:Metadata={title:'SPHINX — THE GUARDIAN',description:'Современный Египет в streetwear'};
export default function Root({children}:{children:React.ReactNode}){return <html lang="ru"><body><AppProviders><Header/>{children}<Footer/></AppProviders></body></html>}
