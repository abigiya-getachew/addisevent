import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-[#2A2A2A] text-[#F9F6F0] pt-16 pb-8">
      {/* Decorative top line */}
      <div className="max-w-7xl mx-auto px-4 mb-10">
        <div className="h-px bg-[#D4A03C]/40 relative">
          <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-[#2A2A2A] px-3 text-[#D4A03C] text-lg">
            ✦
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* === Main Grid === */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <span className="text-[#D4A03C] text-xl">✦</span>
              <span className="font-bold text-lg">
                <span className="text-[#E04038]">Addis</span>
                <span className="text-[#F9F6F0]">Event</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              Bringing Addis together, one event at a time.
            </p>
          </div>

          {/* === Explore === */}
          <div>
            <h3 className="font-semibold text-[#D4A03C] mb-4">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/events" className="hover:text-[#D4A03C] transition-colors">All Events</Link></li>
              <li><Link href="/events?filter=weekend" className="hover:text-[#D4A03C] transition-colors">This Weekend</Link></li>
              <li><Link href="/events?filter=free" className="hover:text-[#D4A03C] transition-colors">Free Events</Link></li>
              <li><Link href="/categories" className="hover:text-[#D4A03C] transition-colors">Categories</Link></li>
            </ul>
          </div>

          {/* === For Organizers === */}
          <div>
            <h3 className="font-semibold text-[#D4A03C] mb-4">For Organizers</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/organizer/new" className="hover:text-[#D4A03C] transition-colors">Create Event</Link></li>
              <li><Link href="/organizer/how-it-works" className="hover:text-[#D4A03C] transition-colors">How It Works</Link></li>
              <li><Link href="/organizer/resources" className="hover:text-[#D4A03C] transition-colors">Resources</Link></li>
              <li><Link href="/organizer/pricing" className="hover:text-[#D4A03C] transition-colors">Pricing</Link></li>
            </ul>
          </div>

          {/* === Support === */}
          <div>
            <h3 className="font-semibold text-[#D4A03C] mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/help" className="hover:text-[#D4A03C] transition-colors">Help Center</Link></li>
              <li><Link href="/contact" className="hover:text-[#D4A03C] transition-colors">Contact Us</Link></li>
              <li><Link href="/help/sms" className="hover:text-[#D4A03C] transition-colors">SMS Tickets</Link></li>
              <li><Link href="/help/payments" className="hover:text-[#D4A03C] transition-colors">Payments</Link></li>
            </ul>
          </div>

          {/* === Connect === */}
          <div>
            <h3 className="font-semibold text-[#D4A03C] mb-4">Connect</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-[#D4A03C] transition-colors">Telegram</a></li>
              <li><a href="#" className="hover:text-[#D4A03C] transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-[#D4A03C] transition-colors">Facebook</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar — Copyright & Legal */}
        <div className="border-t border-gray-700 pt-6 mt-10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} AddisEvent. Proudly built in Addis Ababa, Ethiopia.</p>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-[#D4A03C]">Terms</Link>
            <Link href="/privacy" className="hover:text-[#D4A03C]">Privacy</Link>
            <Link href="/refund" className="hover:text-[#D4A03C]">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}