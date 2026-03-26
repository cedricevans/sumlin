
import React from 'react';
import { Helmet } from 'react-helmet';
import SmoothScroller from '@/components/SmoothScroller';
import { Quote } from 'lucide-react';

const TestimonialsPage = () => {
  const testimonials = [
    {
      name: 'Lucia Torres',
      relation: 'Third generation',
      quote: 'The Sumlin Family Reunion is the highlight of our year. Seeing cousins I grew up with and meeting new family members is priceless. The raffle is always exciting, but the real prize is the time we spend together.',
      year: '2024'
    },
    {
      name: 'Kwame Asante',
      relation: 'Fourth generation',
      quote: 'I brought my children to their first reunion last year, and watching them connect with their heritage was incredible. They learned about our family crest, heard stories from their great-grandparents, and made memories that will last a lifetime.',
      year: '2024'
    },
    {
      name: 'Anika Bergström',
      relation: 'Second generation',
      quote: 'The planning committee does an amazing job every year. From the activities to the meals to the raffle baskets, everything is thoughtfully organized. I won the spa basket last year and it was absolutely wonderful!',
      year: '2023'
    },
    {
      name: 'Raj Patel',
      relation: 'Fifth generation',
      quote: 'As one of the younger members, I appreciate how the reunion bridges generations. The elders share wisdom and stories, while we bring energy and new ideas. It truly feels like one big family coming home.',
      year: '2024'
    },
    {
      name: 'Maya Chen',
      relation: 'Third generation',
      quote: 'The family portrait session was worth the trip alone. We got beautiful professional photos of four generations together. Those pictures now hang in all our homes as a reminder of our strong family bonds.',
      year: '2023'
    },
    {
      name: 'Elijah Washington',
      relation: 'Fourth generation',
      quote: 'I love how the reunion celebrates our faith and heritage. The opening ceremony always moves me to tears. Seeing the family crest and understanding what it represents makes me proud to be a Sumlin.',
      year: '2024'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Testimonials - Sumlin Family Reunion Stories</title>
        <meta name="description" content="Read heartfelt testimonials from Sumlin Family Reunion attendees. Discover why families return year after year to celebrate our heritage and legacy." />
      </Helmet>

      <section className="section-spacing bg-background pt-32">
        <div className="container-custom">
          <SmoothScroller>
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">Family testimonials</h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Hear from family members who have experienced the joy, connection, and celebration of the Sumlin Family Reunion. Their stories inspire us to continue this cherished tradition.
              </p>
            </div>
          </SmoothScroller>

          <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
            {testimonials.map((testimonial, index) => (
              <SmoothScroller key={index} delay={index * 0.1}>
                <div className="break-inside-avoid bg-card rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                  <Quote className="w-10 h-10 text-primary mb-4" />
                  <p className="text-muted-foreground leading-relaxed mb-6 italic">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center text-foreground font-bold text-lg">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.relation}</p>
                      <p className="text-xs text-muted-foreground">Reunion {testimonial.year}</p>
                    </div>
                  </div>
                </div>
              </SmoothScroller>
            ))}
          </div>

          <SmoothScroller delay={0.6}>
            <div className="mt-20 bg-muted rounded-2xl p-8 md:p-12 text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">Share your story</h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Have you attended a Sumlin Family Reunion? We'd love to hear about your experience. Your testimonial could inspire other family members to join us in 2026.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact"
                  className="inline-block gradient-gold text-foreground px-8 py-3 rounded-xl font-semibold hover:shadow-gold hover:scale-105 transition-all duration-200 active:scale-[0.98]"
                >
                  Submit your testimonial
                </a>
                <a
                  href="/family-legacy"
                  className="inline-block bg-card text-foreground px-8 py-3 rounded-xl font-semibold hover:bg-card/80 hover:scale-105 transition-all duration-200 active:scale-[0.98]"
                >
                  Join us in 2026
                </a>
              </div>
            </div>
          </SmoothScroller>
        </div>
      </section>
    </>
  );
};

export default TestimonialsPage;
