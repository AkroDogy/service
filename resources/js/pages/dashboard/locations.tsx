import React, { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';

function Locations() {
  const { locations = [], success, error, auth } = usePage().props as any;
  const [name, setName] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');

  const userPermissions: string[] = auth?.user?.permissions || [];
  const userRoles: string[] = (auth?.user?.roles || []).map((r: string) => r.toLowerCase());
  const isSuperAdmin = userRoles.includes('admin') || userPermissions.includes('dashboard.administrator');
  const hasPermission = (perm: string) => isSuperAdmin || userPermissions.includes(perm);
  if (!hasPermission('dashboard.locations')) {
    return <div className="p-8 text-center text-red-500">You do not have permission to view this page.</div>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.post('/dashboard/locations', { name }, {
      onSuccess: () => setName(''),
      preserveScroll: true,
    });
  };

  const handleEdit = (loc: any) => {
    setEditId(loc.id);
    setEditName(loc.name);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      router.put(`/dashboard/locations/${editId}`, { name: editName }, {
        onSuccess: () => {
          setEditId(null);
          setEditName('');
        },
        preserveScroll: true,
      });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this location?')) {
      router.delete(`/dashboard/locations/${id}`);
    }
  };

  return (
    <AppLayout>
      <div className="p-8 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Locations</h1>
        {success && <div className="mb-4 text-green-700 bg-green-100 border border-green-300 rounded px-4 py-2">{success}</div>}
        {error && <div className="mb-4 text-red-600 bg-red-100 border border-red-300 rounded px-4 py-2">{error}</div>}
        {hasPermission('dashboard.locations.create') && (
          <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Location name" className="border rounded px-3 py-2 flex-1" required />
            <Button type="submit">Add Location</Button>
          </form>
        )}
        <ul className="space-y-2">
          {locations.map((loc: any) => (
            <li key={loc.id} className="border rounded p-3 bg-white flex flex-col gap-1">
              {editId === loc.id ? (
                <form onSubmit={handleEditSubmit} className="flex gap-2 items-center">
                  <input value={editName} onChange={e => setEditName(e.target.value)} className="border rounded px-2 py-1 flex-1" required />
                  <Button type="submit" size="sm">Save</Button>
                  <Button type="button" size="sm" variant="secondary" onClick={() => setEditId(null)}>Cancel</Button>
                </form>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="font-semibold flex-1">{loc.name}</span>
                  {hasPermission('dashboard.locations.edit') && (
                    <Button size="sm" onClick={() => handleEdit(loc)}>Edit</Button>
                  )}
                  {hasPermission('dashboard.locations.delete') && (
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(loc.id)}>Delete</Button>
                  )}
                </div>
              )}
              {loc.stations && loc.stations.length > 0 && (
                <span className="text-xs text-gray-500">Stations: {loc.stations.map((s: any) => s.name).join(', ')}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </AppLayout>
  );
}

export default Locations;