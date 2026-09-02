import { AdminSimple } from '@/features/admin';
export default function Page() {
  return (
    <AdminSimple
      title="Banners"
      fields={['Title', 'Subtitle', 'Image', 'CTA text', 'CTA URL', 'Active']}
    />
  );
}
