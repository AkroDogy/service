<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use App\Models\Reviews;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ViewReviewsController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('dashboard/reviews', [
            'reviews' => Reviews::all(),
        ]);
    }
}
