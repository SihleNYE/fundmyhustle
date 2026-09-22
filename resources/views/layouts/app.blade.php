<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ $title ?? 'FundMyHustle' }}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700;800&display=swap" rel="stylesheet">
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body>
    <header class="site-header">
        <nav class="nav shell">
            <a class="brand" href="{{ route('home') }}"><span>Fund</span>MyHustle</a>
            <div class="nav-links">
                <a href="{{ route('home') }}#campaigns">Discover</a>
                <a href="{{ route('home') }}#how-it-works">How it works</a>
                <a class="button button-small" href="{{ route('campaigns.create') }}">Start a campaign</a>
            </div>
        </nav>
    </header>

    @if (session('success'))
        <div class="shell"><div class="flash" role="status">{{ session('success') }}</div></div>
    @endif

    <main>@yield('content')</main>

    <footer class="site-footer">
        <div class="shell footer-content">
            <div><a class="brand" href="{{ route('home') }}"><span>Fund</span>MyHustle</a><p>Backing practical ideas and community progress.</p></div>
            <p>Built with Laravel 11 · Payments are currently in demo mode.</p>
        </div>
    </footer>
</body>
</html>
