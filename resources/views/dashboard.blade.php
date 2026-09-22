@extends('layouts.app', ['title' => 'FundMyHustle — Fund meaningful work'])

@section('content')
<section class="hero">
    <div class="shell hero-grid">
        <div>
            <p class="eyebrow">Ideas worth backing</p>
            <h1>Put your hustle in front of people who believe in it.</h1>
            <p class="hero-copy">FundMyHustle helps South African founders, creators and communities turn a clear plan into real support.</p>
            <div class="hero-actions"><a class="button" href="{{ route('campaigns.create') }}">Start a campaign</a><a class="text-link" href="#campaigns">Explore projects <span>→</span></a></div>
            <dl class="stats"><div><dt>{{ $campaigns->count() }}</dt><dd>live campaigns</dd></div><div><dt>R{{ number_format($campaigns->sum('raised_amount'), 0) }}</dt><dd>backed so far</dd></div><div><dt>{{ $campaigns->sum('donor_count') }}</dt><dd>people pitching in</dd></div></dl>
        </div>
        <aside class="hero-card"><p class="eyebrow">Make it count</p><h2>Small contributions. Serious momentum.</h2><div class="hero-steps"><span>01</span><p><strong>Tell your story</strong><br>Set a goal that gives supporters a concrete reason to join in.</p><span>02</span><p><strong>Build your crowd</strong><br>Share a campaign page built to make funding easy.</p></div></aside>
    </div>
</section>

<section class="shell search-section" id="campaigns">
    <div class="section-heading"><div><p class="eyebrow">Discover campaigns</p><h2>See what people are building.</h2></div><a class="text-link" href="{{ route('campaigns.create') }}">Launch yours <span>→</span></a></div>
    <form class="filters" method="GET" action="{{ route('home') }}">
        <input name="q" value="{{ request('q') }}" placeholder="Search campaigns, people or ideas">
        <select name="category"><option value="">All categories</option>@foreach ($categories as $category)<option value="{{ $category }}" @selected(request('category') === $category)>{{ $category }}</option>@endforeach</select>
        <button class="button button-small" type="submit">Search</button>
    </form>
    <div class="campaign-grid">
        @forelse ($campaigns as $campaign)
        <article class="campaign-card">
            <a href="{{ route('campaigns.show', $campaign) }}" class="card-image" style="background-image:url('{{ $campaign->image_url ?: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1200&q=80' }}')"><span>{{ $campaign->category }}</span></a>
            <div class="card-body"><p class="creator">By {{ $campaign->creator_name }}</p><h3><a href="{{ route('campaigns.show', $campaign) }}">{{ $campaign->title }}</a></h3><p class="card-story">{{ Str::limit($campaign->story, 108) }}</p><div class="progress-track"><i style="width: {{ $campaign->progress }}%"></i></div><div class="funding"><strong>R{{ number_format($campaign->raised_amount, 0) }}</strong><span>of R{{ number_format($campaign->goal_amount, 0) }}</span><span>{{ $campaign->progress }}%</span></div><p class="supporters">{{ $campaign->donor_count }} supporters</p></div>
        </article>
        @empty
        <div class="empty"><h3>No campaigns found</h3><p>Try another search or <a href="{{ route('campaigns.create') }}">start the next great one</a>.</p></div>
        @endforelse
    </div>
</section>

<section class="how" id="how-it-works"><div class="shell"><p class="eyebrow">Straightforward by design</p><h2>From good idea to shared effort.</h2><div class="steps"><div><b>1</b><h3>Start with a plan</h3><p>Explain what you are making, who it helps and exactly what funding unlocks.</p></div><div><b>2</b><h3>Bring people in</h3><p>Share your campaign with your network and keep supporters close to the progress.</p></div><div><b>3</b><h3>Make it happen</h3><p>Reach the goal, get to work and show your backers what their contribution enabled.</p></div></div></div></section>
@endsection
