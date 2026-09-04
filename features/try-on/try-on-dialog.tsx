'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { Camera, Download, ImagePlus, LoaderCircle, RotateCcw, Sparkles, X } from 'lucide-react';
import { useLanguage } from '@/features/i18n';

type Props = { open: boolean; onClose: () => void; garmentImage: string; productName: string };
type StatusResponse = { status?: string; output?: string[]; error?: string | { message?: string } };

async function prepareImage(file: File) {
  if (!file.type.startsWith('image/')) throw new Error('invalid-image');
  if (file.size > 12 * 1024 * 1024) throw new Error('large-image');
  const bitmap = await createImageBitmap(file);
  const maxSide = 1400;
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const context = canvas.getContext('2d');
  if (!context) throw new Error('image-processing');
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return canvas.toDataURL('image/jpeg', 0.84);
}

const wait = (milliseconds: number) =>
  new Promise((resolve) => window.setTimeout(resolve, milliseconds));

export function TryOnDialog({ open, onClose, garmentImage, productName }: Props) {
  const { language } = useLanguage();
  const en = language === 'en';
  const [personImage, setPersonImage] = useState('');
  const [result, setResult] = useState('');
  const [working, setWorking] = useState(false);
  const [error, setError] = useState('');
  const [consent, setConsent] = useState(false);
  const cancelled = useRef(false);

  useEffect(() => {
    if (!open) return;
    cancelled.current = false;
    document.body.style.overflow = 'hidden';
    return () => {
      cancelled.current = true;
      document.body.style.overflow = '';
    };
  }, [open]);

  const reset = () => {
    setPersonImage('');
    setResult('');
    setError('');
    setConsent(false);
  };
  const close = () => {
    cancelled.current = true;
    setWorking(false);
    reset();
    onClose();
  };

  const chooseImage = async (file?: File) => {
    if (!file) return;
    setError('');
    setResult('');
    try {
      setPersonImage(await prepareImage(file));
    } catch (imageError) {
      setError(
        imageError instanceof Error && imageError.message === 'large-image'
          ? en
            ? 'The image must be smaller than 12 MB.'
            : 'Размер изображения не должен превышать 12 МБ.'
          : en
            ? 'Please choose a valid JPG, PNG or WebP image.'
            : 'Выберите корректное изображение JPG, PNG или WebP.',
      );
    }
  };

  const generate = async () => {
    if (!personImage || !consent || working) return;
    setWorking(true);
    setError('');
    setResult('');
    cancelled.current = false;
    try {
      const absoluteGarmentImage = new URL(garmentImage, window.location.origin).href;
      const start = await fetch('/api/try-on', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modelImage: personImage, garmentImage: absoluteGarmentImage }),
      });
      const started = (await start.json()) as { id?: string; error?: string };
      if (!start.ok || !started.id) throw new Error(started.error || 'start-failed');
      for (let attempt = 0; attempt < 35; attempt += 1) {
        await wait(2000);
        if (cancelled.current) return;
        const check = await fetch(`/api/try-on?id=${encodeURIComponent(started.id)}`, {
          cache: 'no-store',
        });
        const status = (await check.json()) as StatusResponse;
        if (!check.ok)
          throw new Error(typeof status.error === 'string' ? status.error : 'status-failed');
        if (status.status === 'completed' && status.output?.[0]) {
          setResult(status.output[0]);
          return;
        }
        if (status.status === 'failed')
          throw new Error(
            typeof status.error === 'object'
              ? status.error.message
              : status.error || 'generation-failed',
          );
      }
      throw new Error('timeout');
    } catch (generationError) {
      console.error('[SPHINX_TRY_ON_ERROR]', generationError);
      const message = generationError instanceof Error ? generationError.message : '';
      setError(
        message.includes('configured')
          ? en
            ? 'Virtual try-on is being prepared. Please try again soon.'
            : 'Виртуальная примерка ещё настраивается. Попробуйте позже.'
          : en
            ? 'We could not create the try-on. Use a clear, front-facing full-body photo and try again.'
            : 'Не удалось создать примерку. Загрузите чёткое фото в полный рост анфас и попробуйте снова.',
      );
    } finally {
      setWorking(false);
    }
  };

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[100] bg-black/65 backdrop-blur-sm p-0 sm:p-5 grid place-items-center"
      onClick={close}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label={en ? 'Virtual try-on' : 'Виртуальная примерка'}
        className="bg-ivory w-full h-[100dvh] sm:h-auto sm:max-h-[92vh] sm:max-w-5xl overflow-y-auto sm:border border-white/20"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="sticky top-0 z-10 bg-ivory/95 backdrop-blur border-b border-black/10 px-5 sm:px-7 py-4 flex items-center justify-between">
          <div>
            <p className="eyebrow text-gold">SPHINX AI</p>
            <h2 className="display text-2xl mt-1">
              {en ? 'Try it on virtually' : 'Виртуальная примерка'}
            </h2>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={close}
            className="w-11 h-11 grid place-items-center border border-black/15"
          >
            <X />
          </button>
        </header>
        <div className="grid lg:grid-cols-[1fr_1fr] gap-6 p-5 sm:p-7">
          <div>
            <div className="grid grid-cols-2 gap-3">
              <Preview
                title={en ? 'Your photo' : 'Ваше фото'}
                src={personImage}
                emptyIcon={<Camera />}
              />
              <Preview title={productName} src={garmentImage} />
            </div>
            <label className="btn border border-ink w-full mt-4 cursor-pointer gap-2">
              <ImagePlus size={17} />
              {personImage
                ? en
                  ? 'Change photo'
                  : 'Изменить фото'
                : en
                  ? 'Upload your photo'
                  : 'Загрузить своё фото'}
              <input
                type="file"
                className="sr-only"
                accept="image/jpeg,image/png,image/webp"
                capture="environment"
                onChange={(event) => void chooseImage(event.target.files?.[0])}
              />
            </label>
            <div className="bg-sand/65 p-4 mt-4 text-xs leading-5 text-muted">
              <b className="text-ink block mb-2">
                {en ? 'For the best result' : 'Для лучшего результата'}
              </b>
              {en
                ? 'Use a clear, front-facing photo from head to knees, with good lighting and arms slightly away from the body.'
                : 'Используйте чёткое фото анфас от головы до колен, при хорошем освещении и слегка отведите руки от тела.'}
            </div>
            <label className="flex items-start gap-3 mt-4 text-xs leading-5 cursor-pointer">
              <input
                type="checkbox"
                checked={consent}
                onChange={(event) => setConsent(event.target.checked)}
                className="mt-1 accent-black"
              />
              <span>
                {en
                  ? 'I own this photo or have permission to use it. I agree to send it securely to the AI provider to create this preview.'
                  : 'Я владею этим фото или имею разрешение на его использование и согласен отправить его AI-сервису для создания примерки.'}
              </span>
            </label>
            {error && (
              <p className="text-sm text-red-700 mt-4" role="alert">
                {error}
              </p>
            )}
            <button
              type="button"
              disabled={!personImage || !consent || working}
              onClick={() => void generate()}
              className="btn btn-dark w-full mt-5 gap-2 disabled:opacity-35 disabled:cursor-not-allowed"
            >
              {working ? (
                <>
                  <LoaderCircle size={17} className="animate-spin" />
                  {en ? 'Creating your look…' : 'Создаём ваш образ…'}
                </>
              ) : (
                <>
                  <Sparkles size={17} />
                  {en ? 'Generate try-on' : 'Создать примерку'}
                </>
              )}
            </button>
            <p className="text-[10px] text-muted text-center mt-3">
              {en
                ? 'AI preview only — fit and colors may differ from reality.'
                : 'Это AI-визуализация — посадка и цвета могут отличаться.'}
            </p>
          </div>
          <div className="min-h-[420px] bg-sand relative overflow-hidden flex items-center justify-center">
            {result ? (
              <>
                <Image
                  src={result}
                  alt={
                    en ? `Virtual try-on of ${productName}` : `Виртуальная примерка ${productName}`
                  }
                  fill
                  unoptimized
                  className="object-contain"
                />
                <div className="absolute inset-x-3 bottom-3 flex gap-2">
                  <a
                    href={result}
                    download="sphinx-try-on.jpg"
                    className="btn bg-white text-ink flex-1 gap-2"
                  >
                    <Download size={16} />
                    {en ? 'Save' : 'Сохранить'}
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setResult('');
                      setError('');
                    }}
                    className="btn bg-ink text-white gap-2"
                  >
                    <RotateCcw size={16} />
                    {en ? 'Again' : 'Ещё раз'}
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center px-8">
                <Sparkles
                  className={`mx-auto text-gold ${working ? 'animate-pulse' : ''}`}
                  size={34}
                />
                <p className="display text-2xl mt-5">
                  {working
                    ? en
                      ? 'AI is fitting the garment…'
                      : 'AI примеряет изделие…'
                    : en
                      ? 'Your result will appear here'
                      : 'Здесь появится результат'}
                </p>
                <p className="text-xs text-muted mt-3">
                  {working
                    ? en
                      ? 'Usually takes 8–20 seconds. Keep this window open.'
                      : 'Обычно это занимает 8–20 секунд. Не закрывайте окно.'
                    : en
                      ? 'Upload a photo to see this piece on you.'
                      : 'Загрузите фото, чтобы увидеть изделие на себе.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function Preview({
  title,
  src,
  emptyIcon,
}: {
  title: string;
  src?: string;
  emptyIcon?: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-muted mb-2 truncate">{title}</p>
      <div className="relative aspect-[4/5] bg-sand overflow-hidden">
        {src ? (
          <Image
            src={src}
            alt={title}
            fill
            unoptimized={src.startsWith('data:')}
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-muted">{emptyIcon}</div>
        )}
      </div>
    </div>
  );
}
