
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, Gift, HeartHandshake, PartyPopper } from 'lucide-react';
import SmoothScroller from '@/components/SmoothScroller';
import ProductsList from '@/components/ProductsList';
import { fetchFundraiserProgress } from '@/lib/sumlinData';

const TICKET_GOAL = 500;
const DOLLAR_GOAL = 500;

const fundraiserHighlights = [
  {
    title: 'Fundraiser complete',
    description: 'The 2026 basket fundraiser was a success, and the winners were officially announced on May 9, 2026.',
  },
  {
    title: 'Donations still matter',
    description: 'Family donations are still welcome and continue to help with reunion expenses, hospitality, and shared event needs.',
  },
  {
    title: 'More to come',
    description: 'Future fundraisers, drawings, and family support campaigns are still ahead, and this page will continue to share updates.',
  },
];

const continuingSupportCards = [
  {
    icon: HeartHandshake,
    eyebrow: 'Continue giving',
    title: 'Support reunion needs beyond the drawing',
    description: 'Donations still help with food, hospitality, planning, shared family experiences, and the costs that bring reunion weekend together.',
  },
  {
    icon: CalendarDays,
    eyebrow: 'Events ahead',
    title: 'More family moments are still on the calendar',
    description: 'This fundraiser may be complete, but reunion activities, updates, and future opportunities to participate are still ahead.',
  },
  {
    icon: Gift,
    eyebrow: 'More campaigns',
    title: 'Future fundraisers and drawings are still to come',
    description: 'We will continue sharing new family campaigns, special drawings, and ways to stay involved throughout the reunion season.',
  },
];

const StorePage = ({ setIsCartOpen }) => {
  const [progress, setProgress] = useState({ ticketsSold: 0, dollarsRaised: 0, loaded: false });

  useEffect(() => {
    fetchFundraiserProgress().then((res) => {
      setProgress({
        ticketsSold: res.ticketsSold || 0,
        dollarsRaised: res.dollarsRaised || 0,
        loaded: true,
      });
    });
  }, []);

  const ticketPct = Math.min(100, Math.round((progress.ticketsSold / TICKET_GOAL) * 100));
  const dollarPct = Math.min(100, Math.round((progress.dollarsRaised / DOLLAR_GOAL) * 100));

  return (
    <>
      <Helmet>
        <title>Fundraiser Update - Sumlin Family Reunion Support</title>
        <meta name="description" content="See the latest Sumlin Family Reunion fundraiser update, celebrate the 2026 basket winners, and continue supporting the reunion through donations." />
      </Helmet>

      <section className="section-spacing bg-background pt-24 md:pt-32 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-72 w-[48rem] rounded-full bg-yellow-200/20 blur-3xl" />
          <div className="absolute top-40 -left-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-10 right-0 h-72 w-72 rounded-full bg-yellow-300/10 blur-3xl" />
          <div className="absolute right-[8%] top-28 h-44 w-44 rounded-full bg-rose-200/20 blur-3xl" />
        </div>

        <div className="container-custom relative z-10">
          <SmoothScroller>
            <div className="mb-12 max-w-6xl mx-auto rounded-[2rem] border border-amber-200/70 bg-gradient-to-br from-white via-amber-50/90 to-rose-50/70 p-6 shadow-[0_30px_90px_-45px_rgba(120,53,15,0.45)] md:p-8 lg:p-10">
              <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/80 px-4 py-2 text-sm font-semibold uppercase tracking-[0.22em] text-primary shadow-sm">
                    <PartyPopper className="h-4 w-4" />
                    Sumlin Family Fundraiser Update
                  </div>
                  <h1 className="mt-5 text-5xl font-bold leading-[0.95] text-balance text-stone-950 md:text-6xl lg:text-7xl">
                    The fundraiser was a success. The giving continues.
                  </h1>
                  <div className="mt-6 max-w-3xl space-y-4">
                    <p className="text-xl text-stone-700 leading-relaxed">
                      The 2026 basket drawing is complete, and we are grateful for every family member and supporter who helped make it happen.
                    </p>
                    <p className="text-lg text-stone-600 leading-relaxed">
                      Donations are still encouraged as we continue preparing for reunion weekend, supporting family experiences, and building momentum for more events and fundraisers still to come.
                    </p>
                  </div>

                  <div className="mt-7 flex flex-wrap gap-3">
                    <div className="rounded-full border border-amber-200 bg-white px-4 py-2 text-sm font-semibold text-stone-700 shadow-sm">
                      Drawing completed May 9, 2026
                    </div>
                    <div className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800 shadow-sm">
                      Donations still open
                    </div>
                    <div className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-800 shadow-sm">
                      More events ahead
                    </div>
                  </div>
                </div>

                <div className="rounded-[1.75rem] bg-gradient-to-br from-stone-950 via-yellow-950 to-primary p-6 text-white shadow-[0_24px_80px_-40px_rgba(87,13,33,0.55)] md:p-8">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-yellow-200">Continue the momentum</p>
                  <h2 className="mt-4 text-3xl font-bold leading-tight text-balance">
                    Every donation now helps carry the reunion forward.
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-yellow-50/85">
                    The drawing may be complete, but family support still matters. Gifts made today help fund reunion hospitality, shared activities, and the next moments we create together.
                  </p>

                  <div className="mt-6 space-y-3">
                    <Link
                      to="/donate"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3.5 font-semibold text-stone-950 transition-all duration-200 hover:translate-y-[-1px]"
                    >
                      Continue with a donation
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      to="/fundraiser-rules"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3.5 font-semibold text-white transition-all duration-200 hover:bg-white/15"
                    >
                      View fundraiser details
                    </Link>
                  </div>

                  <div className="mt-6 rounded-2xl border border-white/10 bg-white/10 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-yellow-200">Why donate now</p>
                    <p className="mt-2 text-sm leading-relaxed text-yellow-50/85">
                      Continued giving helps bridge this completed fundraiser into the reunion events, family programming, and future opportunities still ahead.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          {/* Winners Announcement Section */}
            <section className="mb-12 max-w-5xl mx-auto rounded-[2rem] border border-amber-200/80 bg-white/85 p-6 shadow-[0_22px_80px_-48px_rgba(120,53,15,0.45)] backdrop-blur-sm md:p-8">
              <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
                <div>
                  <img
                    src="/winners.png"
                    alt="2026 Basket Winners"
                    className="w-full rounded-[1.5rem] border border-amber-200 shadow"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-amber-900">
                    <PartyPopper className="h-4 w-4" />
                    Winner announcement
                  </div>
                  <h3 className="mt-4 text-3xl font-bold text-stone-950 md:text-4xl">Congratulations to Our 2026 Basket Winners</h3>
                  <p className="mt-4 text-base leading-relaxed text-stone-600">
                    Announced May 9, 2026. We are proud to celebrate the winners and thankful for everyone who supported this fundraiser from start to finish.
                  </p>
                  <ul className="mt-6 space-y-3">
                    <li className="rounded-2xl border border-amber-100 bg-amber-50/70 px-4 py-3">
                      <span className="block text-sm font-semibold uppercase tracking-[0.18em] text-amber-900">Men&apos;s BBQ Basket</span>
                      <span className="block text-lg font-bold text-stone-900">Vicky Robertson</span>
                    </li>
                    <li className="rounded-2xl border border-fuchsia-100 bg-fuchsia-50/70 px-4 py-3">
                      <span className="block text-sm font-semibold uppercase tracking-[0.18em] text-fuchsia-900">Women&apos;s Spa Basket</span>
                      <span className="block text-lg font-bold text-stone-900">O&apos;Dell Rich Jr.</span>
                    </li>
                    <li className="rounded-2xl border border-blue-100 bg-blue-50/70 px-4 py-3">
                      <span className="block text-sm font-semibold uppercase tracking-[0.18em] text-blue-900">Children&apos;s Fun Basket</span>
                      <span className="block text-lg font-bold text-stone-900">Faye Boyd</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

          </SmoothScroller>

          <SmoothScroller delay={0.05}>
            <div className="max-w-6xl mx-auto mb-10 rounded-[2rem] border border-yellow-300/80 bg-gradient-to-br from-yellow-50 via-amber-50 to-white shadow-[0_24px_80px_-40px_rgba(120,53,15,0.45)] overflow-hidden">
              <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-0">
                <div className="p-7 md:p-10 lg:p-12">
                  <p className="text-sm uppercase tracking-[0.24em] text-yellow-900 font-semibold mb-4">Support beyond the fundraiser</p>
                  <h2 className="text-3xl md:text-5xl font-bold text-yellow-950 leading-tight mb-5 text-balance">
                    The fundraiser may be finished, but the mission is still moving
                  </h2>
                  <div className="space-y-4 max-w-2xl">
                    <p className="text-base md:text-lg text-yellow-950/90 leading-relaxed">
                      We want to acknowledge that this year&apos;s fundraiser has officially wrapped and the drawing has been completed.
                    </p>
                    <p className="text-base md:text-lg text-yellow-900/85 leading-relaxed">
                      We also want to keep the focus on what comes next: donations are still welcome, reunion planning is still active, and more family-centered events are still ahead.
                    </p>
                    <p className="text-sm font-medium text-yellow-900/80">
                      Every contribution still helps strengthen the experience we are building for the whole family.
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 mt-8">
                    <div className="rounded-2xl border border-yellow-200 bg-white/80 p-5">
                      <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-2">Now available</p>
                      <h3 className="text-lg font-semibold text-foreground mb-2">Support with a donation</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Continue supporting reunion planning, hospitality, and family event costs through a direct donation today.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-yellow-200 bg-white/80 p-5">
                      <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-2">Looking ahead</p>
                      <h3 className="text-lg font-semibold text-foreground mb-2">Stay ready for future fundraisers</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        This page will continue to highlight fundraiser updates, winner announcements, and future family drawing opportunities.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-b from-yellow-900 via-yellow-950 to-neutral-950 p-7 md:p-8 lg:p-10 text-white flex flex-col justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-yellow-200 font-semibold mb-4">What to do next</p>
                    <h3 className="text-2xl md:text-3xl font-bold leading-tight mb-4">Honor what was completed and invest in what comes next</h3>
                    <div className="space-y-3 text-sm md:text-base text-yellow-50/85 leading-relaxed">
                      <p>Use the donation page if you still want to contribute to reunion expenses or give in honor of a loved one.</p>
                      <p>Review this year’s basket recap and winner announcement as we close out the current drawing.</p>
                      <p>Keep an eye on family updates for future fundraisers, drawings, events, and reunion news.</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 pt-8">
                    <a
                      href="#basket-options"
                      className="inline-flex items-center justify-center gradient-burgundy text-white px-5 py-3 rounded-xl font-semibold hover:shadow-burgundy transition-all duration-200"
                    >
                      View basket archive
                    </a>
                    <Link
                      to="/donate"
                      className="inline-flex items-center justify-center gradient-gold text-foreground px-5 py-3 rounded-xl font-semibold transition-all duration-200"
                    >
                      Donate to the reunion
                    </Link>
                    <Link
                      to="/fundraiser-rules"
                      className="inline-flex items-center justify-center bg-white text-yellow-950 border border-white/60 px-5 py-3 rounded-xl font-semibold transition-all duration-200"
                    >
                      Read fundraiser details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SmoothScroller>

          <SmoothScroller delay={0.1}>
            <div className="max-w-6xl mx-auto mb-10 grid gap-5 md:grid-cols-3">
              {continuingSupportCards.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="rounded-[1.75rem] border border-border/60 bg-card/90 p-6 shadow-sm backdrop-blur-sm"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <p className="mt-5 text-xs font-semibold uppercase tracking-[0.22em] text-primary">{item.eyebrow}</p>
                    <h3 className="mt-3 text-2xl font-bold leading-tight text-foreground">{item.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </SmoothScroller>

          {/* ── Fundraiser Progress ── hidden until donations are connected */}
          {false && <SmoothScroller delay={0.1}>
            <div className="max-w-6xl mx-auto mb-10 rounded-[2rem] border border-yellow-300/60 bg-gradient-to-br from-yellow-50 via-amber-50 to-white shadow-md overflow-hidden p-7 md:p-10">
              <p className="text-sm uppercase tracking-[0.24em] text-yellow-900 font-semibold mb-1">Fundraiser Progress</p>
              <h3 className="text-2xl md:text-3xl font-bold text-yellow-950 mb-6">How we're doing — live totals</h3>

              <div className="grid sm:grid-cols-2 gap-8">
                {/* Tickets sold */}
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-semibold text-yellow-900 uppercase tracking-wide">Tickets Sold</span>
                    <span className="text-sm text-yellow-800 font-bold">
                      {progress.loaded ? progress.ticketsSold : '—'} / {TICKET_GOAL}
                    </span>
                  </div>
                  <div className="w-full h-4 bg-yellow-100 rounded-full overflow-hidden border border-yellow-200">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-yellow-700 to-amber-500 transition-all duration-700"
                      style={{ width: progress.loaded ? `${ticketPct}%` : '0%' }}
                    />
                  </div>
                  <p className="text-xs text-yellow-700 mt-1.5">{ticketPct}% of {TICKET_GOAL}-ticket goal</p>
                </div>

                {/* Dollars raised */}
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-semibold text-yellow-900 uppercase tracking-wide">Donations Raised</span>
                    <span className="text-sm text-yellow-800 font-bold">
                      {progress.loaded ? `$${progress.dollarsRaised.toFixed(0)}` : '—'} / ${DOLLAR_GOAL}
                    </span>
                  </div>
                  <div className="w-full h-4 bg-yellow-100 rounded-full overflow-hidden border border-yellow-200">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-rose-800 to-amber-600 transition-all duration-700"
                      style={{ width: progress.loaded ? `${dollarPct}%` : '0%' }}
                    />
                  </div>
                  <p className="text-xs text-yellow-700 mt-1.5">{dollarPct}% of ${DOLLAR_GOAL} donation goal</p>
                </div>
              </div>

              <p className="text-xs text-yellow-800/60 mt-6 italic">
                Totals reflect confirmed paid orders only and update in real time.
              </p>
            </div>
          </SmoothScroller>}

          <SmoothScroller delay={0.15}>
            <div className="max-w-6xl mx-auto mb-10 grid lg:grid-cols-[0.95fr_1.05fr] gap-5">
              <div className="rounded-3xl border border-border/50 bg-card p-6 md:p-8 shadow-sm">
                <p className="text-sm uppercase tracking-[0.22em] text-primary font-semibold mb-3">Fundraiser details</p>
                <h3 className="text-2xl font-bold mb-3">Looking for the original rules, updates, and giveaway details?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  The official fundraiser page still includes the original participation guidance, payment notes, public disclaimer, and helpful context for future family campaigns.
                </p>
              </div>

              <div className="bg-primary/10 border border-primary/20 rounded-3xl p-6 md:p-8 shadow-sm">
                <div className="grid md:grid-cols-[1fr_auto] gap-6 items-center">
                  <div className="space-y-3">
                    <p className="text-sm uppercase tracking-[0.22em] text-primary font-semibold">Important notice</p>
                    <p className="text-base md:text-lg leading-relaxed">
                      New ticket entries are no longer being accepted on this page. Please use the donation page if you want to continue supporting the reunion.
                    </p>
                  </div>
                  <Link
                    to="/donate"
                    className="inline-flex items-center justify-center gradient-burgundy text-white px-6 py-3 rounded-xl font-semibold hover:shadow-burgundy transition-all duration-200"
                  >
                    Make a donation
                  </Link>
                </div>
              </div>
            </div>
          </SmoothScroller>

          <SmoothScroller delay={0.2}>
            <div className="grid md:grid-cols-3 gap-5 mb-14 max-w-6xl mx-auto">
              {fundraiserHighlights.map((item) => (
                <div key={item.title} className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm text-left relative overflow-hidden">
                  <div className="absolute inset-x-0 top-0 h-1 gradient-gold" />
                  <p className="text-xs uppercase tracking-[0.22em] text-primary font-semibold mb-3">{item.title}</p>
                  <p className="text-base text-foreground leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </SmoothScroller>

          <div id="basket-options" className="mb-16 max-w-6xl mx-auto">
            <div className="rounded-[2rem] border border-border/50 bg-card/80 backdrop-blur-sm p-6 md:p-8 lg:p-10 shadow-sm">
              <div className="text-center mb-8 max-w-3xl mx-auto">
                <p className="text-sm uppercase tracking-[0.22em] text-primary font-semibold mb-3">2026 basket recap</p>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured baskets from this year’s completed drawing</h2>
                <p className="text-muted-foreground leading-relaxed">
                  The competition has ended, but these baskets remain on display as part of this year’s recap while we continue encouraging donations and look ahead to future fundraisers.
                </p>
              </div>
              <ProductsList setIsCartOpen={setIsCartOpen} archived />
            </div>
          </div>

          <SmoothScroller delay={0.4}>
            <div className="mt-16 text-center">
              <div className="bg-muted rounded-3xl p-8 max-w-2xl mx-auto border border-border/50 shadow-sm">
                <h3 className="text-2xl font-bold mb-4">Need help?</h3>
                <div className="space-y-3 text-muted-foreground leading-relaxed">
                  <p>If you have questions about the completed fundraiser, winner announcement, or reunion donations, the family can help.</p>
                  <p>Please contact a family organizer listed in the footer or visit the Business Corner page for more planning information.</p>
                </div>
              </div>
            </div>
          </SmoothScroller>
        </div>
      </section>
    </>
  );
};

export default StorePage;
