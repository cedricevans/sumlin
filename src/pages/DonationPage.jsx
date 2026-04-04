import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { CheckCircle, Copy, CreditCard, Gift, Heart, Mail, Receipt, Star, Ticket, User, Users } from 'lucide-react';
import ParallaxHero from '@/components/ParallaxHero';
import SmoothScroller from '@/components/SmoothScroller';
import ContactSection from '@/components/ContactSection';

const PAYPAL_BUSINESS_EMAIL = 'dbass@seniorcarexpress.com';
const CASH_APP_HANDLE = '$SumlinReunionClub';
const PAYPAL_DONATE_LINK = `https://www.paypal.com/donate/?business=${encodeURIComponent(PAYPAL_BUSINESS_EMAIL)}&currency_code=USD`;

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

function buildPayPalUrl({ amount, tickets, reference }) {
  const params = new URLSearchParams({
    business: PAYPAL_BUSINESS_EMAIL,
    currency_code: 'USD',
  });

  if (amount > 0) {
    params.set('amount', amount.toFixed(2));
  }

  const itemName = reference
    ? `Sumlin Fundraiser ${reference}`
    : tickets > 0
    ? `Sumlin Fundraiser – ${tickets} ticket${tickets === 1 ? '' : 's'}`
    : 'Sumlin Family Reunion Fundraiser';

  params.set('item_name', itemName);

  return `https://www.paypal.com/donate/?${params.toString()}`;
}

const reasons = [
  {
    icon: Users,
    title: 'Reunion Activities',
    description: 'Help cover the cost of events, entertainment, and activities that bring the family together.',
    gradient: 'gradient-burgundy',
    iconColor: 'text-white',
  },
  {
    icon: Gift,
    title: 'Family Awards',
    description: 'Fund prizes, scholarships, and recognition for family members who go above and beyond.',
    gradient: 'gradient-gold',
    iconColor: 'text-foreground',
  },
  {
    icon: Star,
    title: 'Memories & Keepsakes',
    description: 'Support photo books, videos, and commemorative items that preserve our legacy for generations.',
    gradient: 'gradient-burgundy',
    iconColor: 'text-white',
  },
  {
    icon: Heart,
    title: 'Family in Need',
    description: 'A portion of donations go directly to supporting family members facing hardship.',
    gradient: 'gradient-gold',
    iconColor: 'text-foreground',
  },
];

const PRESET_AMOUNTS = [10, 25, 50, 100, 250];

const DonationPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [customAmount, setCustomAmount] = useState('');
  const [copied, setCopied] = useState(false);

  const amountFromQuery = Number.parseFloat(searchParams.get('amount') || '0');
  const ticketsFromQuery = Number.parseInt(searchParams.get('tickets') || '0', 10);
  const name = searchParams.get('name') || location.state?.customer?.name || '';
  const email = searchParams.get('email') || location.state?.customer?.email || '';
  const orderId = searchParams.get('orderId') || location.state?.orderId || '';
  const referenceCode = searchParams.get('reference') || location.state?.referenceCode || '';
  const tickets = Array.isArray(location.state?.tickets) ? location.state.tickets : [];
  const legacyTicketNumbers = Array.isArray(location.state?.ticketNumbers) ? location.state.ticketNumbers : [];
  const ticketsByRaffle = tickets.reduce((acc, ticket) => {
    const raffleName = ticket?.raffle_name || 'General';
    const ticketNumber = ticket?.number ?? ticket?.ticket_number;

    if (ticketNumber === undefined || ticketNumber === null) {
      return acc;
    }

    if (!acc[raffleName]) {
      acc[raffleName] = [];
    }

    acc[raffleName].push(ticketNumber);
    return acc;
  }, {});
  const hasGroupedTickets = Object.keys(ticketsByRaffle).length > 0;

  const hasCheckoutContext = amountFromQuery > 0 || ticketsFromQuery > 0 || Boolean(referenceCode);
  const paypalUrl = buildPayPalUrl({
    amount: amountFromQuery,
    tickets: ticketsFromQuery,
    reference: referenceCode,
  });

  // For the standalone donation amount chooser
  const parsedCustom = Number.parseFloat(customAmount) || 0;
  const standalonePaypalUrl = parsedCustom > 0
    ? buildPayPalUrl({ amount: parsedCustom, tickets: 0, reference: null })
    : PAYPAL_DONATE_LINK;

  const handleCopyCashApp = async () => {
    try {
      await navigator.clipboard.writeText(CASH_APP_HANDLE);
    } catch {
      // fallback: select a temp input
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <>
      <Helmet>
        <title>Donate | Sumlin Family Reunion 2026</title>
        <meta
          name="description"
          content="Support the Sumlin Family Reunion 2026 with a donation. Every contribution helps make our reunion unforgettable."
        />
      </Helmet>

      <ParallaxHero
        backgroundImage="https://horizons-cdn.hostinger.com/6ddbc4c1-b479-4ef4-be4a-ff36b8b1842e/b21b2d1ea8690c7803645629877d22a3.jpg"
        title="Support the Family"
        tagline="Every dollar given is an investment in our legacy"
        height="min-h-[60vh]"
      />

      <section className="section-spacing bg-background">
        <div className="container-custom max-w-4xl">
          <SmoothScroller>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-5 py-2 text-sm font-semibold uppercase tracking-wider text-primary mb-6">
                <Heart className="w-4 h-4" />
                {hasCheckoutContext ? 'Final Payment' : 'Support the Family'}
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                {hasCheckoutContext ? 'Complete Your Fundraiser Payment' : 'Make a Difference'}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                {hasCheckoutContext
                  ? 'Your entry information has been saved. Complete your ticket payment below — or scroll down to make a separate donation of any amount, no ticket needed.'
                  : 'Your generosity keeps the Sumlin Family Reunion alive. Every contribution helps us create unforgettable memories and honor the legacy that connects us all.'}
              </p>
            </div>
          </SmoothScroller>

          {hasCheckoutContext && (
            <SmoothScroller delay={0.05}>
              <div className="bg-card border border-border/50 rounded-3xl p-8 shadow-lg mb-10">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl bg-muted/50 p-5 border border-border/50">
                    <div className="flex items-center gap-3 mb-2">
                      <Ticket className="w-5 h-5 text-primary" />
                      <p className="font-semibold">Entry Summary</p>
                    </div>
                    <p className="text-3xl font-bold text-foreground mb-2">{formatCurrency(amountFromQuery || 0)}</p>
                    <p className="text-sm text-muted-foreground">
                      {ticketsFromQuery} ticket{ticketsFromQuery === 1 ? '' : 's'} selected
                    </p>
                  </div>

                  <div className="rounded-2xl bg-muted/50 p-5 border border-border/50 space-y-3">
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-primary" />
                      <p className="text-sm text-muted-foreground">{name || 'Name pending'}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-primary" />
                      <p className="text-sm text-muted-foreground">{email || 'Email pending'}</p>
                    </div>
                    {(referenceCode || orderId) && (
                      <div className="flex items-center gap-3">
                        <Receipt className="w-4 h-4 text-primary" />
                        <p className="text-sm text-muted-foreground">{referenceCode || orderId}</p>
                      </div>
                    )}
                  </div>
                </div>

                {(hasGroupedTickets || legacyTicketNumbers.length > 0) && (
                  <div className="mt-6 rounded-2xl border border-border/50 p-5">
                    <p className="text-sm uppercase tracking-[0.2em] text-primary font-semibold mb-3">
                      Reserved Ticket Numbers
                    </p>
                    {hasGroupedTickets ? (
                      <div className="space-y-2">
                        {Object.entries(ticketsByRaffle).map(([raffleName, numbers]) => (
                          <div key={raffleName} className="flex flex-col gap-1 text-sm sm:flex-row sm:gap-3">
                            <span className="font-semibold text-foreground sm:min-w-[160px]">{raffleName}:</span>
                            <span className="text-muted-foreground">{numbers.map((number) => `#${number}`).join(' · ')}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {legacyTicketNumbers.map((number) => `#${number}`).join(' · ')}
                      </p>
                    )}
                  </div>
                )}

                {/* Payment options */}
                <div className="mt-8">
                  <p className="text-center text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-6">
                    Choose how to pay
                  </p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {/* PayPal */}
                    <motion.a
                      href={paypalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex flex-col items-center gap-3 rounded-2xl border-2 border-primary/30 bg-primary/5 px-6 py-7 text-center font-bold hover:border-primary hover:bg-primary/10 transition-all duration-200 cursor-pointer"
                    >
                      <img
                        src="https://www.paypalobjects.com/webstatic/icon/pp258.png"
                        alt="PayPal"
                        className="w-10 h-10 object-contain"
                      />
                      <div>
                        <p className="text-lg font-bold">Pay with PayPal</p>
                        <p className="text-sm text-muted-foreground mt-1">Secure online payment — no account required.</p>
                        <p className="text-2xl font-bold text-primary mt-2">{formatCurrency(amountFromQuery || 0)}</p>
                      </div>
                      <span className="inline-flex items-center gap-2 gradient-burgundy text-white px-5 py-2.5 rounded-xl text-sm font-semibold">
                        <CreditCard className="w-4 h-4" />
                        Pay {formatCurrency(amountFromQuery || 0)} with PayPal
                      </span>
                    </motion.a>

                    {/* Cash App */}
                    <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-border/50 bg-muted/40 px-6 py-7 text-center">
                      <div className="w-10 h-10 rounded-xl bg-[#00D632] flex items-center justify-center text-white font-bold text-lg">$</div>
                      <div>
                        <p className="text-lg font-bold">Pay with Cash App</p>
                        <p className="text-sm text-muted-foreground mt-1">Open Cash App and send to the handle below.</p>
                        <p className="text-2xl font-bold text-foreground mt-2">{CASH_APP_HANDLE}</p>
                        <p className="text-sm text-muted-foreground mt-1">Amount: {formatCurrency(amountFromQuery || 0)}</p>
                        <p className="text-xs text-muted-foreground mt-1">Add <strong>{referenceCode || orderId || 'your order number'}</strong> in the note.</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyCashApp}
                        className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${copied ? 'bg-green-600 text-white' : 'gradient-gold text-foreground hover:shadow-gold'}`}
                      >
                        {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'Copied!' : 'Copy Cash App Handle'}
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground text-center mt-5">
                    Please send the exact amount shown so we can match your payment to your ticket reservation.
                  </p>
                </div>
              </div>
            </SmoothScroller>
          )}

          {/* ── Standalone Donation Bucket — always visible ── */}
          <SmoothScroller delay={hasCheckoutContext ? 0.1 : 0.05}>
            <div className="bg-card border border-border/50 rounded-3xl p-8 shadow-lg mb-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl gradient-gold flex items-center justify-center">
                  <Heart className="w-5 h-5 text-foreground" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Make a Direct Donation</h3>
                  <p className="text-sm text-muted-foreground">No ticket needed — any amount is welcome.</p>
                </div>
              </div>

              {hasCheckoutContext && (
                <div className="mt-4 mb-6 rounded-2xl bg-primary/5 border border-primary/20 px-5 py-3">
                  <p className="text-sm text-muted-foreground">
                    This is <strong>separate</strong> from your ticket payment above. Use this section to add a gift on top of your entry, or to donate on behalf of a family member.
                  </p>
                </div>
              )}

              {/* Amount chooser */}
              <div className={hasCheckoutContext ? 'mt-4 mb-8' : 'mb-8'}>
                <p className="text-center text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-5">
                  Choose a donation amount
                </p>
                <div className="flex flex-wrap justify-center gap-3 mb-5">
                  {PRESET_AMOUNTS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setCustomAmount(String(preset))}
                      className={`px-5 py-2.5 rounded-xl font-semibold text-sm border-2 transition-all duration-200 ${
                        customAmount === String(preset)
                          ? 'gradient-burgundy border-transparent text-white shadow-md'
                          : 'border-border/60 bg-card hover:border-primary/50 hover:bg-muted'
                      }`}
                    >
                      {formatCurrency(preset)}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-3 max-w-xs mx-auto">
                  <span className="text-muted-foreground font-semibold">$</span>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    placeholder="Enter custom amount"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="w-full rounded-xl border border-border/60 bg-background px-4 py-3 text-center text-lg font-bold focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                {parsedCustom > 0 && (
                  <p className="text-center text-sm text-muted-foreground mt-3">
                    Donating <span className="font-bold text-foreground">{formatCurrency(parsedCustom)}</span> to the Sumlin Family Reunion
                  </p>
                )}
              </div>

              {/* Payment options */}
              <p className="text-center text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-6">
                Choose how to donate
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {/* PayPal */}
                <motion.a
                  href={standalonePaypalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex flex-col items-center gap-3 rounded-2xl border-2 border-primary/30 bg-primary/5 px-6 py-7 text-center font-bold hover:border-primary hover:bg-primary/10 transition-all duration-200"
                >
                  <img
                    src="https://www.paypalobjects.com/webstatic/icon/pp258.png"
                    alt="PayPal"
                    className="w-10 h-10 object-contain"
                  />
                  <div>
                    <p className="text-lg font-bold">Donate with PayPal</p>
                    <p className="text-sm text-muted-foreground mt-1">Secure online donation — no account required.</p>
                    {parsedCustom > 0 && (
                      <p className="text-2xl font-bold text-primary mt-2">{formatCurrency(parsedCustom)}</p>
                    )}
                  </div>
                  <span className="inline-flex items-center gap-2 gradient-burgundy text-white px-5 py-2.5 rounded-xl text-sm font-semibold">
                    <CreditCard className="w-4 h-4" />
                    {parsedCustom > 0 ? `Donate ${formatCurrency(parsedCustom)} via PayPal` : 'Donate with PayPal'}
                  </span>
                </motion.a>

                {/* Cash App */}
                <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-border/50 bg-muted/40 px-6 py-7 text-center">
                  <div className="w-10 h-10 rounded-xl bg-[#00D632] flex items-center justify-center text-white font-bold text-lg">$</div>
                  <div>
                    <p className="text-lg font-bold">Donate with Cash App</p>
                    <p className="text-sm text-muted-foreground mt-1">Open Cash App, search the handle, and send your donation.</p>
                    <p className="text-2xl font-bold text-foreground mt-2">{CASH_APP_HANDLE}</p>
                    {parsedCustom > 0 && (
                      <p className="text-sm text-muted-foreground mt-1">Amount: <span className="font-bold">{formatCurrency(parsedCustom)}</span></p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">Add <strong>"Sumlin Reunion Donation"</strong> in the note.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyCashApp}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${copied ? 'bg-green-600 text-white' : 'gradient-gold text-foreground hover:shadow-gold'}`}
                  >
                    {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy Cash App Handle'}
                  </button>
                </div>
              </div>

              <p className="text-xs text-muted-foreground text-center mt-6">
                Secure payment via PayPal or Cash App. Every dollar supports the Sumlin Family Reunion.
              </p>
            </div>
          </SmoothScroller>

        </div>
      </section>

      <section className="section-spacing bg-muted/50">
        <div className="container-custom">
          <SmoothScroller>
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Where Your Money Goes</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Every donation is used to directly improve the reunion experience and support our family.
              </p>
            </div>
          </SmoothScroller>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {reasons.map((item, index) => (
              <SmoothScroller key={item.title} delay={index * 0.1}>
                <div className="bg-card rounded-2xl p-6 text-center shadow-lg border border-border/50 h-full flex flex-col items-center">
                  <div className={`w-14 h-14 rounded-xl ${item.gradient} flex items-center justify-center mb-4`}>
                    <item.icon className={`w-7 h-7 ${item.iconColor}`} />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </SmoothScroller>
            ))}
          </div>
        </div>
      </section>

      <ContactSection />
    </>
  );
};

export default DonationPage;
