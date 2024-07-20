import AdminPanelLayout from '@/components/dashboard/admin-panel-layout';
import type React from 'react';
const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <AdminPanelLayout>{children}</AdminPanelLayout>;
};

export default DashboardLayout;
