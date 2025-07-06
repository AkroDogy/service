import React, { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';

function LocationGroups() {
  const { groups = [], locations = [], success, error, auth } = usePage().props as any;
  const [name, setName] = useState('');
  const [selectedLocations, setSelectedLocations] = useState<number[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editLocations, setEditLocations] = useState<number[]>([]);
  const [locationSearch, setLocationSearch] = useState('');

  const userPermissions: string[] = auth?.user?.permissions || [];
  const userRoles: string[] = (auth?.user?.roles || []).map((r: string) => r.toLowerCase());
  const isSuperAdmin = userRoles.includes('admin') || userPermissions.includes('dashboard.administrator');
  const hasPermission = (perm: string) => isSuperAdmin || userPermissions.includes(perm);

  if (!hasPermission('dashboard.locations')) {
    return <div className="p-8 text-center text-red-500">You do not have permission to view this page.</div>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.post('/dashboard/location-groups', { name, locations: selectedLocations }, {
      onSuccess: () => {
        setName('');
        setSelectedLocations([]);
      },
      preserveScroll: true,
    });
  };

  const handleEdit = (group: any) => {
    setEditId(group.id);
    setEditName(group.name);
    setEditLocations(group.locations.map((l: any) => l.id));
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      router.put(`/dashboard/location-groups/${editId}`, { name: editName, locations: editLocations }, {
        onSuccess: () => {
          setEditId(null);
          setEditName('');
          setEditLocations([]);
        },
        preserveScroll: true,
      });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this location group?')) {
      router.delete(`/dashboard/location-groups/${id}`);
    }
  };

  const filteredLocations = locations.filter((loc: any) =>
    loc.name.toLowerCase().includes(locationSearch.toLowerCase())
  );

  const toggleLocation = (id: number) => {
    const state = editId ? editLocations : selectedLocations;
    const setState = editId ? setEditLocations : setSelectedLocations;

    if (state.includes(id)) {
      setState(state.filter((lid) => lid !== id));
    } else {
      setState([...state, id]);
    }
  };

  const isChecked = (id: number) => {
    return editId ? editLocations.includes(id) : selectedLocations.includes(id);
  };

  return (
    <AppLayout>
      <div className="p-8 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Location Groups</h1>

        {success && <div className="mb-4 text-green-700 bg-green-100 border border-green-300 rounded px-4 py-2">{success}</div>}
        {error && <div className="mb-4 text-red-600 bg-red-100 border border-red-300 rounded px-4 py-2">{error}</div>}

        <form onSubmit={editId ? handleEditSubmit : handleSubmit} className="flex flex-col gap-3 mb-6">
          <input
            value={editId ? editName : name}
            onChange={e => editId ? setEditName(e.target.value) : setName(e.target.value)}
            placeholder="Group name"
            className="border rounded px-3 py-2"
            required
          />

          <label className="font-semibold">Select Locations</label>

          <input
            type="text"
            placeholder="Search locations..."
            className="border rounded px-3 py-2"
            value={locationSearch}
            onChange={e => setLocationSearch(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-2 border rounded p-3 max-h-64 overflow-y-auto bg-white">
            {filteredLocations.length > 0 ? (
              filteredLocations.map((loc: any) => (
                <label key={loc.id} className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={isChecked(loc.id)}
                    onChange={() => toggleLocation(loc.id)}
                    className="accent-blue-500"
                  />
                  <span>{loc.name}</span>
                </label>
              ))
            ) : (
              <span className="text-gray-500 col-span-2 text-sm">No locations found.</span>
            )}
          </div>

          <div className="flex gap-2 mt-2">
            <Button type="submit">{editId ? 'Save Group' : 'Add Group'}</Button>
            {editId && (
              <Button type="button" variant="secondary" onClick={() => {
                setEditId(null);
                setEditName('');
                setEditLocations([]);
              }}>
                Cancel
              </Button>
            )}
          </div>
        </form>

        <ul className="space-y-2">
          {groups.map((group: any) => (
            <li key={group.id} className="border rounded p-3 bg-white flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold flex-1">{group.name}</span>
                {hasPermission('dashboard.locations.edit') && (
                  <Button size="sm" onClick={() => handleEdit(group)}>Edit</Button>
                )}
                {hasPermission('dashboard.locations.delete') && (
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(group.id)}>Delete</Button>
                )}
              </div>
              {group.locations && group.locations.length > 0 && (
                <span className="text-xs text-gray-500">
                  Locations: {group.locations.map((l: any) => l.name).join(', ')}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </AppLayout>
  );
}

export default LocationGroups;
