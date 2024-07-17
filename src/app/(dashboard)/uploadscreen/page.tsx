import { UploadComponent } from './_components';
import { ContentLayout } from '@/components';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

const uploadscreen = () => {
  return (
    <>
      <ContentLayout title="Upload Screen">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <UploadComponent />
      </ContentLayout>
    </>
  );
};

export default uploadscreen;
