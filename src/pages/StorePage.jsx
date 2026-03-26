
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import SmoothScroller from '@/components/SmoothScroller';
import ProductsList from '@/components/ProductsList';

const fundraiserHighlights = [
  {
    title: 'Family support goal',
    description: 'Reunion support helps cover shared costs like venue needs, hospitality, food, and family weekend planning.',
  },
  {
    title: 'Fair family fun',
    description: 'Everyone can take part in a clear, welcoming, and family-friendly way as we build excitement for reunion weekend.',
  },
  {
    title: 'Shared celebration',
    description: 'Each basket is a simple way to show love, support the reunion, and enjoy the drawing together.',
  },
];

const howItWorksSteps = [
  {
    number: '1',
    title: 'Choose a basket',
    description: 'Pick the basket your household loves most and choose the entries you want to add.',
    tone: 'gold',
  },
  {
    number: '2',
    title: 'Share your support',
    description: 'Give toward the reunion if you would like, or follow the official rules for a no-cost entry option.',
    tone: 'burgundy',
  },
  {
    number: '3',
    title: 'Join the excitement',
    description: 'Watch for family updates, cheer everyone on, and enjoy the fun when drawing day arrives.',
    tone: 'gold',
  },
];

const StorePage = () => {
  return (
    <>
      <Helmet>
        <title>Fundraiser - Sumlin Family Reunion Support</title>
        <meta name="description" content="Support the Sumlin Family Reunion fundraiser and review the official disclaimer, entry language, and basket options." />
      </Helmet>

      <section className="section-spacing bg-background pt-24 md:pt-32">
        <div className="container-custom">
          <SmoothScroller>
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">Family fundraiser baskets</h1>
              <div className="max-w-4xl mx-auto space-y-4">
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Support the Sumlin Family Reunion through our family fundraiser baskets and reunion support entries.
                </p>
                <p className="text-base text-muted-foreground leading-relaxed">
                  These baskets are one more way for the family to celebrate together, help cover reunion weekend needs,
                  and keep the spirit of giving joyful and easy to follow.
                </p>
              </div>
            </div>
          </SmoothScroller>

          <SmoothScroller delay={0.05}>
            <div className="grid md:grid-cols-3 gap-4 mb-10 max-w-6xl mx-auto">
              {fundraiserHighlights.map((item) => (
                <div key={item.title} className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm text-left">
                  <p className="text-xs uppercase tracking-[0.22em] text-primary font-semibold mb-3">{item.title}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </SmoothScroller>

          <SmoothScroller delay={0.1}>
            <div className="bg-primary/10 border border-primary/20 rounded-3xl p-6 md:p-8 mb-10 max-w-5xl mx-auto">
              <div className="grid md:grid-cols-[1fr_auto] gap-6 items-center">
                <div className="space-y-3">
                  <p className="text-sm uppercase tracking-[0.22em] text-primary font-semibold">Important notice</p>
                  <p className="text-base md:text-lg leading-relaxed">
                    No purchase or donation is necessary to submit an entry request.
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    A donation does not increase the odds of being selected. Please review the official rules before you enter.
                  </p>
                </div>
                <Link
                  to="/fundraiser-rules"
                  className="inline-flex items-center justify-center gradient-burgundy text-white px-6 py-3 rounded-xl font-semibold hover:shadow-burgundy transition-all duration-200"
                >
                  Read official rules
                </Link>
              </div>
            </div>
          </SmoothScroller>

          <SmoothScroller delay={0.2}>
            <div className="bg-card rounded-3xl p-8 mb-16 shadow-lg max-w-5xl mx-auto border border-border/50">
              <h2 className="text-2xl font-bold mb-6 text-center">How it works</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {howItWorksSteps.map((step) => (
                  <div key={step.number} className="rounded-2xl border border-border/50 bg-muted/40 p-6 text-center">
                    <div className={`w-16 h-16 rounded-xl ${step.tone === 'burgundy' ? 'gradient-burgundy text-white' : 'gradient-gold text-foreground'} flex items-center justify-center mb-4 mx-auto font-bold text-2xl shadow-sm`}>
                      {step.number}
                    </div>
                    <h3 className="font-semibold mb-3 text-lg">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </SmoothScroller>

          <div className="mb-16">
            <ProductsList />
          </div>

          <SmoothScroller delay={0.4}>
            <div className="mt-16 text-center">
              <div className="bg-muted rounded-2xl p-8 max-w-2xl mx-auto border border-border/50">
                <h3 className="text-2xl font-bold mb-4">Need help?</h3>
                <div className="space-y-3 text-muted-foreground leading-relaxed">
                  <p>If you have questions about fundraiser baskets, entry options, or reunion support, the family can help.</p>
                  <p>Please contact a family organizer listed in the footer or visit the Business Corner page for more family planning information.</p>
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
