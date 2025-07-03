<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use App\Models\Contact;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ViewMessagesController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('dashboard/contact-messages', [
            'messages' => Contact::all(),
        ]);
    }
}
