'use client';

import {useEffect} from 'react';
import {usePathname} from 'next/navigation';

export function MotionEffects(){
  const pathname=usePathname();
  useEffect(()=>{
    const elements=document.querySelectorAll<HTMLElement>('main section, main article, main [data-reveal], .admin-card');
    elements.forEach((element,index)=>{
      element.classList.add('reveal');
      element.style.setProperty('--reveal-delay',`${Math.min(index%4,3)*55}ms`);
    });
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){
      elements.forEach(element=>element.classList.add('is-visible'));
      return;
    }
    const observer=new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },{rootMargin:'0px 0px -7% 0px',threshold:0.08});
    elements.forEach(element=>observer.observe(element));
    return()=>observer.disconnect();
  },[pathname]);
  return null;
}
