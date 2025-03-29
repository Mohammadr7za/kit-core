import { redirect } from 'next/navigation';

import { PAGES } from '@/config/pages';
import { validateRequest } from '@/lib/utils/auth';
import LoginView from '@/components/templates/login';

export default async function Page({ searchParams }: { searchParams: any }) {
  const session = await validateRequest();
  if (session && session?.user) {
    redirect(PAGES.DASHBOARD.ROOT);
  }
  let { message } = await searchParams;
  return <LoginView message={message || ''} />;
}
