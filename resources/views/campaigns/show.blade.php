@extends('layouts.app', ['title' => $campaign->title.' — FundMyHustle'])

@section('content')
<section class="campaign-page shell">
    <a class="back-link" href="{{ route('home') }}#campaigns">← Back to campaigns</a>
    <div class="campaign-detail-grid">
        <div><div class="detail-image" style="background-image:url('{{ $campaign->image_url ?: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1400&q=80' }}')"></div><p class="eyebrow">{{ $campaign->category }}</p><h1>{{ $campaign->title }}</h1><p class="byline">Created by <strong>{{ $campaign->creator_name }}</strong></p><div class="story">{!! nl2br(e($campaign->story)) !!}</div></div>
        <aside class="donation-panel"><div class="progress-track"><i style="width: {{ $campaign->progress }}%"></i></div><p class="amount"><strong>R{{ number_format($campaign->raised_amount, 0) }}</strong> raised of R{{ number_format($campaign->goal_amount, 0) }}</p><p class="supporters">{{ $campaign->donor_count }} supporters @if($campaign->ends_at) · {{ $campaign->ends_at->diffForHumans() }} @endif</p>
            @if($campaign->status === 'approved' && $campaign->progress < 100)
            <form class="donation-form" method="POST" action="{{ route('campaigns.donations.store', $campaign) }}">@csrf
                <h2>Back this hustle</h2><p class="demo-note">Demo payment mode — donations are recorded locally, not charged.</p>
                <label>Your name<input name="donor_name" value="{{ old('donor_name') }}" required></label>@error('donor_name')<small>{{ $message }}</small>@enderror
                <label>Email address<input type="email" name="donor_email" value="{{ old('donor_email') }}" required></label>@error('donor_email')<small>{{ $message }}</small>@enderror
                <label>Amount (ZAR)<input type="number" name="amount" min="10" step="1" value="{{ old('amount', 100) }}" required></label>@error('amount')<small>{{ $message }}</small>@enderror
                <label>Message <span class="optional">optional</span><textarea name="message" rows="3">{{ old('message') }}</textarea></label>
                <button class="button" type="submit">Record demo donation</button>
            </form>
            @else <div class="goal-reached"><h2>Goal reached</h2><p>This campaign has received all the funding it needs. Good work, internet.</p></div>@endif
        </aside>
    </div>
</section>
@endsection
