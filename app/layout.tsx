import type {Metadata} from 'next';import './globals.css';import {StoreProvider,Header,Footer} from '@/components/store';import {MotionEffects} from '@/components/motion-effects';
export const metadata:Metadata={title:'SPHINX — THE GUARDIAN',description:'Современный Египет в streetwear'};
export default function Root({children}:{children:React.ReactNode}){return <html lang="ru"><body><StoreProvider><MotionEffects/><Header/>{children}<Footer/></StoreProvider></body></html>}
