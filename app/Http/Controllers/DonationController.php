<?php

namespace App\Http\Controllers;

use App\Models\Campaign;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class DonationController extends Controller
{
    public function store(Request $request, Campaign $campaign)
    {
        abort_if($campaign->status !== 'approved', 404);

        $data = $request->validate([
            'donor_name' => ['required', 'string', 'max:80'],
            'donor_email' => ['required', 'email', 'max:255'],
            'amount' => ['required', 'numeric', 'min:10', 'max:'.max(10, ((float) $campaign->goal_amount - (float) $campaign->raised_amount))],
            'message' => ['nullable', 'string', 'max:400'],
        ]);

        $campaign->donations()->create($data + [
            'payment_reference' => 'demo_'.Str::upper(Str::random(12)),
        ]);

        $campaign->increment('raised_amount', $data['amount']);
        $campaign->increment('donor_count');

        return back()->with('success', 'Thank you — your demo donation has been recorded. Connect Stripe before accepting live payments.');
    }
}
