import React, { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
  {
    title: 'Roles',
    href: '/dashboard/roles',
  },
];

export default function RolesPermissionsPage() {
  const { auth, roles = [], permissions = [], permissionsHelp = [], defaultRoleNames = [] } = usePage().props as any;
  console.log('Roles & Permissions Page Props:', { auth, roles, permissions, permissionsHelp, defaultRoleNames });
  const userPermissions: string[] = auth?.user?.permissions || [];
  if (!userPermissions.includes('dashboard')) {
    return <div className="p-8 text-center text-red-500">You do not have permission to view this page.</div>;
  }
  const [roleName, setRoleName] = useState('');
  const [roleDesc, setRoleDesc] = useState('');
  const [selectedRole, setSelectedRole] = useState<number | null>(null);
  const [selectedPerms, setSelectedPerms] = useState<number[]>([]);
  const [showHelp, setShowHelp] = useState(false);
  const permissionsByCategory = permissions.reduce((acc: any, perm: any) => {
    if (!acc[perm.category]) acc[perm.category] = [];
    acc[perm.category].push(perm);
    return acc;
  }, {});
  const handleCreateRole = (e: React.FormEvent) => {
    e.preventDefault();
    router.post('/dashboard/roles', { name: roleName, description: roleDesc });
    setRoleName('');
    setRoleDesc('');
  };

  const handleAssignPerms = (roleId: number) => {
    router.post(`/dashboard/roles/${roleId}/permissions`, { permissions: selectedPerms });
  };
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="p-8 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Roles & Permissions</h1>
        <div className="mb-4 flex justify-end">
          <Button onClick={() => setShowHelp(true)} variant="outline">Help Permissions</Button>
        </div>
        {showHelp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full relative">
              <h2 className="text-xl font-bold mb-4">Permissions Help</h2>
              <Button onClick={() => setShowHelp(false)} className="absolute top-2 right-2">Close</Button>
              <div className="max-h-[60vh] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th className="text-left p-2">Permission</th>
                      <th className="text-left p-2">Description</th>
                      <th className="text-left p-2">Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {permissionsHelp.map((perm: any) => (
                      <tr key={perm.name}>
                        <td className="p-2 font-mono">{perm.name}</td>
                        <td className="p-2">{perm.description}</td>
                        <td className="p-2">{perm.category}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <form onSubmit={handleCreateRole} className="flex flex-col gap-3 border rounded p-4 shadow-sm bg-white">
            <h2 className="font-semibold text-lg">Create Role</h2>
            <input
              value={roleName}
              onChange={e => setRoleName(e.target.value)}
              placeholder="Role name"
              className="border rounded px-3 py-2"
              required
            />
            <input
              value={roleDesc}
              onChange={e => setRoleDesc(e.target.value)}
              placeholder="Description"
              className="border rounded px-3 py-2"
            />
            <Button type="submit">Add Role</Button>
          </form>

          <div className="border rounded p-4 shadow-sm bg-white">
            <h2 className="font-semibold text-lg mb-2">Assign Permissions to Role</h2>
            <select
              className="border rounded px-3 py-2 mb-4 w-full"
              value={selectedRole || ''}
              onChange={e => {
                setSelectedRole(Number(e.target.value));
                const role = roles.find((r: any) => r.id === Number(e.target.value));
                setSelectedPerms(role ? role.permissions.map((p: any) => p.id) : []);
              }}
            >
              <option value="">Select role...</option>
              {roles.map((role: any) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                  {defaultRoleNames.includes(role.name.toLowerCase()) && <span className="text-xs text-gray-500 ml-1"> (Default)</span>}
                </option>
              ))}
            </select>
            {selectedRole && (
              <div className="flex flex-col gap-2">
                {Object.entries(permissionsByCategory).map(([cat, perms]: any) => (
                  <div key={cat} className="border rounded p-3 mb-2">
                    <div className="font-semibold text-sm mb-2">
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {perms.map((perm: any) => (
                        <label key={perm.id} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedPerms.includes(perm.id)}
                            onChange={e => {
                              setSelectedPerms(sel =>
                                e.target.checked ? [...sel, perm.id] : sel.filter(id => id !== perm.id)
                              );
                            }}
                          />
                          {perm.name.replace('dashboard.', '').replaceAll('.', ' › ')}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="flex gap-2 mt-2">
                  <Button onClick={() => handleAssignPerms(selectedRole)}>Save Permissions</Button>
                  {(() => {
                    const role = roles.find((r: any) => r.id === selectedRole);
                    if (role && !defaultRoleNames.includes(role.name.toLowerCase())) {
                      return (
                        <Button
                          variant="destructive"
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this role?')) {
                              router.delete(`/dashboard/roles/${selectedRole}`);
                              setSelectedRole(null);
                              setSelectedPerms([]);
                            }
                          }}
                        >
                          Delete Role
                        </Button>
                      );
                    }
                    return null;
                  })()}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="font-semibold text-lg mb-2">All Roles</h2>
          <table className="w-full border mb-4">
            <thead>
              <tr>
                <th className="border p-2 text-left">Role</th>
                <th className="border p-2 text-left">Description</th>
                <th className="border p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role: any) => (
                <tr key={role.id}>
                  <td className="border p-2">
                    {role.name}
                    {defaultRoleNames.includes(role.name.toLowerCase()) && <span className="text-xs text-gray-500 ml-1">(Default)</span>}
                  </td>
                  <td className="border p-2">{role.description}</td>
                  <td className="border p-2 flex gap-2">
                    {userPermissions.includes('dashboard.roles.edit') && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedRole(role.id);
                          setSelectedPerms(role.permissions.map((p: any) => p.id));
                        }}
                      >Edit</Button>
                    )}
                    {userPermissions.includes('dashboard.roles.delete') && !defaultRoleNames.includes(role.name.toLowerCase()) && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this role?')) {
                            router.delete(`/dashboard/roles/${role.id}`);
                          }
                        }}
                      >Delete</Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
