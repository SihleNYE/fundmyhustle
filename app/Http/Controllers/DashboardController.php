<?php

namespace App\Http\Controllers;

use App\Models\Campaign;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __invoke(Request $request)
    {
        $campaigns = Campaign::query()
            ->where('status', 'approved')
            ->when($request->filled('q'), function ($query) use ($request) {
                $term = '%'.$request->string('q')->toString().'%';
                $query->where(fn ($campaigns) => $campaigns
                    ->where('title', 'like', $term)
                    ->orWhere('story', 'like', $term)
                    ->orWhere('creator_name', 'like', $term));
            })
            ->when($request->filled('category'), fn ($query) => $query->where('category', $request->string('category')))
            ->latest()
            ->get();

        $categories = Campaign::query()->where('status', 'approved')->distinct()->orderBy('category')->pluck('category');

        return view('dashboard', compact('campaigns', 'categories'));
    }
}
