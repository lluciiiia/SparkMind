import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { getUser, getUserDetails, getSubscription } from '@/utils/supabase/user';
import { ContentLayout } from '@/components/dashboard/content-layout';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { CustomerPortalForm } from '@/components/account/CustomerPortalForm';
import { NameForm } from '@/components/account/NameForm';
import { EmailForm } from '@/components/account/EmailForm';

export default async function AccountPage() {
  const supabase = createClient();
  const [user, userDetails, subscription] = await Promise.all([
    getUser(supabase),
    getUserDetails(supabase),
    getSubscription(supabase)
  ]);

  if (!user) {
    return redirect('/signin');
  }

  return (
    <ContentLayout title="Account">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Account</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <section className="mb-32 bg-black">
        <div className="max-w-6xl px-4 py-8 mx-auto sm:px-6 sm:pt-24 lg:px-8">
          <div className="sm:align-center sm:flex sm:flex-col">
            <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
              Account
            </h1>
            <p className="max-w-2xl m-auto mt-5 text-xl text-zinc-200 sm:text-center sm:text-2xl">
              We partnered with Stripe for a simplified billing.
            </p>
          </div>
        </div>
        <div className="p-4">
          <CustomerPortalForm subscription={subscription} />
          <NameForm userName={userDetails?.full_name ?? ''} />
          <EmailForm userEmail={user.email} />
        </div>
      </section>
    </ContentLayout>
  );
}