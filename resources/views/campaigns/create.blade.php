@extends('layouts.app', ['title' => 'Start a campaign — FundMyHustle'])

@section('content')
<section class="form-page shell">
    <div class="form-intro"><p class="eyebrow">Start your campaign</p><h1>Give people a clear reason to back you.</h1><p>Tell supporters what you are building, why it matters and what their contribution makes possible. We will mark it for review before it appears publicly.</p></div>
    <form class="campaign-form" method="POST" action="{{ route('campaigns.store') }}">
        @csrf
        <div class="form-row"><label>Campaign title<input name="title" value="{{ old('title') }}" required maxlength="120" placeholder="e.g. Equipment for our community bakery">@error('title')<small>{{ $message }}</small>@enderror</label><label>Category<select name="category" required><option value="">Choose one</option>@foreach($categories as $category)<option @selected(old('category') === $category)>{{ $category }}</option>@endforeach</select>@error('category')<small>{{ $message }}</small>@enderror</label></div>
        <div class="form-row"><label>Your name<input name="creator_name" value="{{ old('creator_name') }}" required placeholder="How supporters should know you">@error('creator_name')<small>{{ $message }}</small>@enderror</label><label>Email address<input type="email" name="creator_email" value="{{ old('creator_email') }}" required placeholder="you@example.com">@error('creator_email')<small>{{ $message }}</small>@enderror</label></div>
        <div class="form-row"><label>Funding goal (ZAR)<input type="number" min="100" step="1" name="goal_amount" value="{{ old('goal_amount') }}" required placeholder="25000">@error('goal_amount')<small>{{ $message }}</small>@enderror</label><label>Target date <span class="optional">optional</span><input type="date" name="ends_at" value="{{ old('ends_at') }}">@error('ends_at')<small>{{ $message }}</small>@enderror</label></div>
        <label>Cover image URL <span class="optional">optional</span><input type="url" name="image_url" value="{{ old('image_url') }}" placeholder="https://...">@error('image_url')<small>{{ $message }}</small>@enderror</label>
        <label>Your story<textarea name="story" rows="8" required minlength="40" maxlength="4000" placeholder="What are you raising money for? What will the funds cover? Why now?">{{ old('story') }}</textarea>@error('story')<small>{{ $message }}</small>@enderror</label>
        <div class="form-actions"><button class="button" type="submit">Submit for review</button><p>By submitting, you confirm that your campaign accurately represents how funds will be used.</p></div>
    </form>
</section>
@endsection
