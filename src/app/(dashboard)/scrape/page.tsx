import { ContentLayout } from '@/components';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { fetchAllScrapes, fetchRecentScrapes } from '@/lib/scrape';
import Link from 'next/link';
import React from 'react';
import { Search } from './_components';
import { Results } from './_components/Results';

const ScrapePage = async ({
  searchParams,
}: { searchParams?: { query?: string; page?: string } }) => {
  const query = searchParams?.query || '';
  const page = searchParams?.page || '1';

  const all = await fetchAllScrapes(query);
  const recent = await fetchRecentScrapes(query);

  return (
    <ContentLayout title={`Scrape`}>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Scrape</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <section className={`flex flex-col gap-4`}>
        <Search search={query} />
        <Results query={query} page={page} all={all} recent={recent} />
      </section>
    </ContentLayout>
  );
};

export default ScrapePage;
