
import React, { useState } from 'react';
import { Globe, Phone, Mail, Facebook, Instagram } from 'lucide-react';
import SmoothScroller from '@/components/SmoothScroller';
import { FAMILY_CONTACT_INFO } from '@/lib/sumlinData';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const familyOfficers = [
    { name: 'Mike Cranford', phone: '703.899.6189' },
    { name: 'Debi Bass', phone: '513.265.5770' },
    { name: 'Ronika Sumlin', phone: '410.807.2337' },
    { name: 'Carrie Farley', phone: '937.931.0941' },
    { name: 'David Dowell', phone: '937.902.0020' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section className="section-spacing bg-muted">
      <div className="container-custom">
        <SmoothScroller>
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Get in touch</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Have questions about the reunion or raffle? Our family officers are here to help.
            </p>
          </div>
        </SmoothScroller>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          <SmoothScroller delay={0.2}>
            <div className="bg-card rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold mb-6">Family officers</h3>
              <div className="space-y-4">
                {familyOfficers.map((officer, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-4 p-4 bg-muted rounded-xl hover:bg-muted/80 transition-colors duration-200"
                  >
                    <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center text-foreground font-bold text-lg">
                      {officer.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-grow">
                      <p className="font-semibold">{officer.name}</p>
                      <a 
                        href={`tel:${officer.phone.replace(/\./g, '')}`}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" />
                        {officer.phone}
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-border">
                <h4 className="font-semibold mb-4">Established family contact info</h4>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <a
                    href={FAMILY_CONTACT_INFO.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 hover:text-primary transition-colors duration-200"
                  >
                    <Globe className="w-4 h-4" />
                    {FAMILY_CONTACT_INFO.websiteUrl}
                  </a>
                  <a
                    href={`mailto:${FAMILY_CONTACT_INFO.email}`}
                    className="flex items-center gap-2 hover:text-primary transition-colors duration-200"
                  >
                    <Mail className="w-4 h-4" />
                    {FAMILY_CONTACT_INFO.email}
                  </a>
                  <a
                    href={FAMILY_CONTACT_INFO.instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 hover:text-primary transition-colors duration-200"
                  >
                    <Instagram className="w-4 h-4" />
                    {FAMILY_CONTACT_INFO.instagramHandle}
                  </a>
                  <a
                    href={FAMILY_CONTACT_INFO.facebookSearchUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 hover:text-primary transition-colors duration-200"
                  >
                    <Facebook className="w-4 h-4" />
                    {FAMILY_CONTACT_INFO.facebookLabel}
                  </a>
                </div>
              </div>
            </div>
          </SmoothScroller>

          <SmoothScroller delay={0.4}>
            <div className="bg-card rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold mb-6">Send us a message</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Your name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200"
                    placeholder="Maya Chen"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200"
                    placeholder="maya@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200 resize-none"
                    placeholder="How can we help you?"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full gradient-burgundy text-white py-3 rounded-xl font-semibold hover:shadow-burgundy hover:scale-[1.02] transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <Mail className="w-5 h-5" />
                  Send message
                </button>
              </form>
            </div>
          </SmoothScroller>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
