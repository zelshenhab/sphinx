'use client';
import {createContext,useCallback,useContext,useEffect,useRef,useState} from 'react';
import {AlertCircle,CheckCircle2,Info,X} from 'lucide-react';
import {useLanguage} from '@/features/i18n';
import {getMessage,type MessageKey} from './messages';

export type NotificationType='success'|'error'|'warning'|'info';
interface Notification{message:string;type:NotificationType}
interface NotificationContextValue{notify:(message:MessageKey|{ru:string;en:string},type?:NotificationType)=>void;dismiss:()=>void}
const NotificationContext=createContext<NotificationContextValue|null>(null);

export function NotificationProvider({children}:{children:React.ReactNode}){
  const{language}=useLanguage();const[current,setCurrent]=useState<Notification|null>(null);const timer=useRef<number|null>(null);
  const dismiss=useCallback(()=>{setCurrent(null);if(timer.current)window.clearTimeout(timer.current)},[]);
  const notify=useCallback((message:MessageKey|{ru:string;en:string},type:NotificationType='info')=>{if(timer.current)window.clearTimeout(timer.current);setCurrent({message:typeof message==='string'?getMessage(message,language):message[language],type});timer.current=window.setTimeout(()=>setCurrent(null),3500)},[language]);
  useEffect(()=>()=>{if(timer.current)window.clearTimeout(timer.current)},[]);
  useEffect(()=>{const handleStorageError=()=>notify('storage_error','error');window.addEventListener('sphinx:storage-error',handleStorageError);return()=>window.removeEventListener('sphinx:storage-error',handleStorageError)},[notify]);
  useEffect(()=>{const handleError=(event:ErrorEvent)=>{console.error('[SPHINX_RUNTIME_ERROR]',event.error);notify('unexpected_error','error')};const handleRejection=(event:PromiseRejectionEvent)=>{console.error('[SPHINX_ASYNC_ERROR]',event.reason);notify('unexpected_error','error')};window.addEventListener('error',handleError);window.addEventListener('unhandledrejection',handleRejection);return()=>{window.removeEventListener('error',handleError);window.removeEventListener('unhandledrejection',handleRejection)}},[notify]);
  const Icon=current?.type==='success'?CheckCircle2:current?.type==='error'?AlertCircle:Info;
  return <NotificationContext.Provider value={{notify,dismiss}}>{children}<div aria-live="polite" className={`fixed top-5 left-1/2 z-[100] w-[calc(100%-32px)] max-w-md -translate-x-1/2 transition-all duration-300 ${current?'translate-y-0 opacity-100':'-translate-y-5 opacity-0 pointer-events-none'}`}>{current&&<div className={`flex items-center gap-3 border px-4 py-3 shadow-xl backdrop-blur bg-white/95 ${current.type==='error'?'border-red-300':current.type==='success'?'border-green-300':'border-gold/50'}`}><Icon size={19} className={current.type==='error'?'text-red-700':current.type==='success'?'text-green-700':'text-brown'}/><p className="flex-1 text-sm">{current.message}</p><button onClick={dismiss} aria-label="Close"><X size={17}/></button></div>}</div></NotificationContext.Provider>;
}

export function useNotification(){const context=useContext(NotificationContext);if(!context)throw new Error('useNotification must be used inside NotificationProvider');return context}
