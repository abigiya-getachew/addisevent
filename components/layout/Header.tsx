export function Header() {
  return (
   <header className="sticky top-0 z-50 bg-cream/90 backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* === LEFT: Logo === */}
        <a href="/" className="flex items-center gap-2">
          <span className="text-brand-gold text-xl">✦</span>
          <span className="font-bold text-lg">
            <span className="text-brand-red">Addis</span>
            <span className="text-brand-blue">Event</span>
          </span>
        </a>

        {/* === CENTER: Desktop Navigation === */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="/events" className="hover:text-brand-red">Events</a>
          <a href="/organizer" className="hover:text-brand-red">Organizers</a>
          <a href="/about" className="hover:text-brand-red">About</a>
        </nav>

        {/* === RIGHT: Language + Auth === */}
        <div className="flex items-center gap-3">
          {/* Language Toggle */}
          <button className="px-3 py-1 rounded-full border border-brand-gold text-sm">
            EN
          </button>
          
          {/* Sign In Button — shown when logged out */}
          <a 
            href="/login" 
            className="hidden sm:inline px-4 py-2 bg-brand-red text-white rounded-full hover:bg-opacity-90 transition"
          >
            Sign In
          </a>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-2xl">☰</button>
        </div>

      </div>
    </header>
  );
}