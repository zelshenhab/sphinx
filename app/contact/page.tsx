import { TELEGRAM_USERNAME } from '@/config/site';

export default function Contact() {
  const contacts = [
    ['Telegram', `@${TELEGRAM_USERNAME}`, `https://t.me/${TELEGRAM_USERNAME}`],
    ['Instagram', '@sphinx.wear', '#'],
    ['VK', 'SPHINX Store', '#'],
  ];
  return <main className="container-x py-20 min-h-[60vh]">
    <p className="eyebrow text-brown">Оставайтесь на связи</p>
    <h1 className="display text-5xl mt-4">Контакты</h1>
    <div className="grid md:grid-cols-3 gap-5 mt-12">
      {contacts.map((contact) => <a href={contact[2]} key={contact[0]} className="bg-white p-7 border border-black/10 hover:border-gold"><span className="eyebrow text-muted">{contact[0]}</span><p className="display text-2xl mt-4">{contact[1]}</p></a>)}
    </div>
    <p className="mt-10 text-muted">По вопросам заказа: <b className="text-ink">Telegram</b></p>
  </main>;
}
