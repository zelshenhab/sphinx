'use client';

import {useEffect} from 'react';
import {AlertTriangle,RefreshCw} from 'lucide-react';
import Link from 'next/link';
import {useLanguage} from '@/features/i18n';

export default function ErrorPage({error,reset}:{error:Error&{digest?:string};reset:()=>void}){
  const{language}=useLanguage();
  useEffect(()=>{console.error('[SPHINX_PAGE_ERROR]',{message:error.message,digest:error.digest,stack:error.stack})},[error]);
  const copy=language==='ru'?{title:'Что-то пошло не так',description:'Не удалось загрузить этот раздел. Попробуйте ещё раз или вернитесь на главную.',retry:'Попробовать снова',home:'На главную'}:{title:'Something went wrong',description:'We could not load this section. Try again or return to the homepage.',retry:'Try again',home:'Go home'};
  return <main className="container-x min-h-[60vh] grid place-items-center py-20"><div className="max-w-lg text-center"><AlertTriangle className="mx-auto text-brown" size={38}/><p className="eyebrow text-brown mt-6">Error</p><h1 className="display text-4xl mt-3">{copy.title}</h1><p className="text-muted leading-7 mt-4">{copy.description}</p><div className="flex justify-center gap-3 mt-8"><button onClick={reset} className="btn btn-dark gap-2"><RefreshCw size={15}/>{copy.retry}</button><Link href="/" className="btn border border-ink">{copy.home}</Link></div>{error.digest&&<p className="text-[10px] text-muted mt-6">Error ID: {error.digest}</p>}</div></main>;
}
