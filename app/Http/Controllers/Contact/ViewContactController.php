<?php

namespace App\Http\Controllers\Contact;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class ViewContactController extends Controller
{
    public function view(Request $request): Response
    {
        $companyInfo = [
            'name' => 'Premium Auto Service SRL',
            'address' => 'Calea Victoriei St. Nr 123, Bucharest, Romania',
            'phone' => '+40 721 234 567',
            'email' => 'contact@autoservice.com',
            'hours' => [
                'Monday - Friday: 08:00 - 18:00',
                'Saturday: 09:00 - 14:00',
                'Sunday: Closed'
            ],
            'services' => [
                'General car repairs',
                'ITP service',
                'Computer diagnostics',
                'Test',
                'Test',
                'Test',
            ]
        ];

        return Inertia::render('contact', [
            'companyInfo' => $companyInfo
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'fname' => 'required|string|max:255',
            'lname' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'description' => 'required|string|max:1000',
        ]);

        Contact::create([
            'fname' => $request->fname,
            'lname' => $request->lname,
            'email' => $request->email,
            'phone' => $request->phone,
            'description' => $request->description,
            'status' => 'PENDING',
        ]);

        return redirect()->route('contact')->with('success', 'Mesajul a fost trimis cu succes!');
    }
}
