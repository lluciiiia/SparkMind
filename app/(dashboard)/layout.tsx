import React from 'react'
import AdminPanelLayout from '@/components/dashboard/admin-panel-layout'
const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AdminPanelLayout>
      {children}
    </AdminPanelLayout>
  )
}

export default DashboardLayout