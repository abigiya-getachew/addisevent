import { Sparkles } from "lucide-react";

const messages = ["Discover", "Gather", "Celebrate", "Addis"];

function MessageGroup() {
  return (
    <ul className="brand-marquee__group">
      {messages.map((message) => (
        <li key={message} className="brand-marquee__item">
          <span>{message}</span>
          <span aria-hidden="true" className="brand-marquee__star">
            <Sparkles className="size-4" strokeWidth={1.8} />
          </span>
        </li>
      ))}
    </ul>
  );
}

export function BrandMarquee() {
  return (
    <section aria-label="Discover, gather, celebrate Addis" className="brand-marquee">
      <div className="brand-marquee__track" aria-hidden="true">
        <MessageGroup />
        <MessageGroup />
      </div>
    </section>
  );
}
