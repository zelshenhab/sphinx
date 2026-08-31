import { AdminSimple } from '@/features/admin';
export default function Page() {
  return <AdminSimple title="Categories" fields={['Name', 'Slug', 'Image', 'Active']} />;
}
