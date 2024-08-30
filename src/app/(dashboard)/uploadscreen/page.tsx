import { ContentLayout } from '@/components';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';
import { UploadComponent } from './_components';

const UploadScreen = () => {
  return (
    <>
      <ContentLayout title="Upload Screen">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/dashboard">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <UploadComponent />
      </ContentLayout>
    </>
  );
};

export default UploadScreen;
