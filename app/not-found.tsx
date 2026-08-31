import Link from 'next/link';

export default function NotFound(){
  return <main className="container-x min-h-[60vh] grid place-items-center py-20 text-center"><div><p className="eyebrow text-brown">404</p><h1 className="display text-5xl mt-4">Страница не найдена</h1><p className="text-muted mt-4">Page not found</p><Link href="/" className="btn btn-dark mt-7">На главную · Go home</Link></div></main>;
}
