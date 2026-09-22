<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCampaignRequest;
use App\Models\Campaign;

class CampaignController extends Controller
{
    public function create()
    {
        return view('campaigns.create', [
            'categories' => ['Business', 'Community', 'Education', 'Health', 'Creative', 'Technology'],
        ]);
    }

    public function store(StoreCampaignRequest $request)
    {
        $campaign = Campaign::create($request->validated() + ['status' => 'pending']);

        return redirect()->route('campaigns.show', $campaign)
            ->with('submitted_campaign', $campaign->id)
            ->with('success', 'Your campaign has been submitted for review.');
    }

    public function show(Campaign $campaign)
    {
        abort_unless($campaign->status === 'approved' || session('submitted_campaign') === $campaign->id, 404);

        return view('campaigns.show', compact('campaign'));
    }
}
