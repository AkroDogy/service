<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ViewUsersController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('dashboard/users', [
            'users' => $request->user()->all(),
        ]);
    }
}
