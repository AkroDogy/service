<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\Permission;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class RolePermissionController extends Controller
{
    public function index(): Response
    {
        $roles = Role::with('permissions')->get();
        $permissions = Permission::all();
        $defaultRoleNames = ['admin', 'worker', 'user'];
        $roles = $roles->map(function ($role) use ($defaultRoleNames) {
            $role->is_default = in_array(strtolower($role->name), $defaultRoleNames);
            return $role;
        });
        return Inertia::render('dashboard/roles', [
            'roles' => $roles,
            'permissions' => $permissions,
            'permissionsHelp' => $permissions->map(fn($p) => [
                'name' => $p->name,
                'description' => $p->description,
                'category' => $p->category,
            ])->values(),
            'defaultRoleNames' => $defaultRoleNames,
        ]);
    }

    public function storeRole(Request $request)
    {
        $request->validate(['name' => 'required|unique:roles,name', 'description' => 'nullable']);
        Role::create($request->only('name', 'description'));
        return redirect()->back()->with('success', 'Role created.');
    }

    public function storePermission(Request $request)
    {
        $request->validate(['name' => 'required|unique:permissions,name', 'description' => 'nullable']);
        Permission::create($request->only('name', 'description'));
        return redirect()->back()->with('success', 'Permission created.');
    }

    public function assignPermission(Request $request, $roleId)
    {
        $role = Role::findOrFail($roleId);
        $role->permissions()->sync($request->input('permissions', []));
        return redirect()->back()->with('success', 'Permissions updated.');
    }

    public function assignRoleToUser(Request $request, $userId)
    {
        $user = User::findOrFail($userId);
        $roleId = $request->input('role_id');
        $role = Role::findOrFail($roleId);
        if ($role->name === 'admin') {
            return redirect()->back()->with('error', 'Cannot assign admin role.');
        }
        $user->roles()->sync([$roleId]);
        return redirect()->back()->with('success', 'Role assigned to user.');
    }

    public function deleteRole($id)
    {
        $role = Role::findOrFail($id);
        if (in_array(strtolower($role->name), ['admin', 'worker', 'user'])) {
            return redirect()->back()->with('error', 'Cannot delete default roles.');
        }
        $role->permissions()->detach();
        $role->users()->update(['role_id' => null]);
        $role->delete();
        return redirect()->back()->with('success', 'Role deleted.');
    }
}
