<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\User;
use App\Models\Role;

class ViewUsersController extends Controller
{
    public function index(Request $request): Response
    {
        $users = User::with('role')->get();
        $roles = Role::all();
        return Inertia::render('dashboard/users', [
            'users' => $users,
            'roles' => $roles,
        ]);
    }
}
