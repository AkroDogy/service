import React, { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';

function Stations() {
  const { auth, stations = [], locations = [], success, error } = usePage().props as any;
  const userPermissions: string[] = auth?.user?.permissions || [];
  const userRoles: string[] = (auth?.user?.roles || []).map((r: string) => r.toLowerCase());
  const isSuperAdmin = userRoles.includes('admin') || userPermissions.includes('dashboard.administrator');
  const hasPermission = (perm: string) => isSuperAdmin || userPermissions.includes(perm);
  if (!hasPermission('dashboard.stations')) {
    return <div className="p-8 text-center text-red-500">You do not have permission to view this page.</div>;
  }

  const [name, setName] = useState('');
  const [locationId, setLocationId] = useState('');
  const [editId, setEditId] = useState<number|null>(null);
  const [editName, setEditName] = useState('');
  const [editLocationId, setEditLocationId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.post('/dashboard/stations', { name, location_id: locationId }, {
      onSuccess: () => {
        setName('');
        setLocationId('');
      },
      preserveScroll: true,
    });
  };

  const handleEdit = (station: any) => {
    setEditId(station.id);
    setEditName(station.name);
    setEditLocationId(station.location_id);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      router.put(`/dashboard/stations/${editId}`, { name: editName, location_id: editLocationId }, {
        onSuccess: () => {
          setEditId(null);
          setEditName('');
          setEditLocationId('');
        },
        preserveScroll: true,
      });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this station?')) {
      router.delete(`/dashboard/stations/${id}`);
    }
  };

  return (
    <AppLayout>
      <div className="p-8 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Stations</h1>
        {success && <div className="mb-4 text-green-700 bg-green-100 border border-green-300 rounded px-4 py-2">{success}</div>}
        {error && <div className="mb-4 text-red-600 bg-red-100 border border-red-300 rounded px-4 py-2">{error}</div>}
        {hasPermission('dashboard.stations.create') && (
          <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Station name" className="border rounded px-3 py-2 flex-1" required />
            <select value={locationId} onChange={e => setLocationId(e.target.value)} className="border rounded px-3 py-2" required>
              <option value="">Select location...</option>
              {locations.map((loc: any) => (
                <option key={loc.id} value={loc.id}>{loc.name}</option>
              ))}
            </select>
            <Button type="submit">Add Station</Button>
          </form>
        )}
        <ul className="space-y-2">
          {stations.map((station: any) => (
            <li key={station.id} className="border rounded p-3 bg-white flex flex-col gap-1">
              {editId === station.id ? (
                <form onSubmit={handleEditSubmit} className="flex gap-2 items-center">
                  <input value={editName} onChange={e => setEditName(e.target.value)} className="border rounded px-2 py-1 flex-1" required />
                  <select value={editLocationId} onChange={e => setEditLocationId(e.target.value)} className="border rounded px-2 py-1" required>
                    <option value="">Select location...</option>
                    {locations.map((loc: any) => (
                      <option key={loc.id} value={loc.id}>{loc.name}</option>
                    ))}
                  </select>
                  <Button type="submit" size="sm">Save</Button>
                  <Button type="button" size="sm" variant="secondary" onClick={() => setEditId(null)}>Cancel</Button>
                </form>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="font-semibold flex-1">{station.name}</span>
                  <span className="text-xs text-gray-500">Location: {station.location?.name}</span>
                  {hasPermission('dashboard.stations.edit') && (
                    <Button size="sm" onClick={() => handleEdit(station)}>Edit</Button>
                  )}
                  {hasPermission('dashboard.stations.delete') && (
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(station.id)}>Delete</Button>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </AppLayout>
  );
}

export default Stations;