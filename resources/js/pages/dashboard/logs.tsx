import React from 'react'
import { usePage } from '@inertiajs/react';

function Logs() {
  const { auth } = usePage().props as any;
  const userPermissions: string[] = auth?.user?.permissions || [];
  const userRoles: string[] = (auth?.user?.roles || []).map((r: string) => r.toLowerCase());
  const isSuperAdmin = userRoles.includes('admin') || userPermissions.includes('dashboard.administrator');
  const hasPermission = (perm: string) => isSuperAdmin || userPermissions.includes(perm);
  if (!hasPermission('dashboard.logs')) {
    return <div className="p-8 text-center text-red-500">You do not have permission to view this page.</div>;
  }
  return (
    <div>appointments</div>
  )
}

export default Logs