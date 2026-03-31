
import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Phone, Mail, Facebook, Instagram } from 'lucide-react';
import { FAMILY_CONTACT_INFO, FAMILY_REUNION_DETAILS } from '@/lib/sumlinData';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Events', path: '/events' },
    { name: 'Newsletter', path: '/newsletter' },
    { name: 'Fundraiser', path: '/store' },
    { name: 'Business Corner', path: '/family-business' },
    { name: 'Family Legacy', path: '/family-legacy' },
    { name: 'Official Rules', path: '/fundraiser-rules' },
    { name: 'Admin Command Central', path: '/admin' }
  ];

  const familyOfficers = [
    { name: 'Mike Cranford', phone: '703.899.6189' },
    { name: 'Debi Bass', phone: '513.265.5770' },
    { name: 'Ronika Sumlin', phone: '410.807.2337' },
    { name: 'Carrie Farley', phone: '937.931.0941' },
    { name: 'David Dowell', phone: '937.902.0020' }
  ];

  return (
    <footer className="bg-foreground text-background">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center text-foreground font-bold text-xl">
                SF
              </div>
              <div>
                <span className="font-bold text-lg block">Sumlin Family</span>
                <span className="text-sm text-background/70">Reunion 2026</span>
              </div>
            </div>
            <p className="text-background/80 text-sm leading-relaxed mb-6">
              Rooted in Faith, United in Legacy. Join us in celebrating our family heritage and building lasting connections.
            </p>
            <div className="space-y-2 text-sm text-background/75">
              <p>{FAMILY_REUNION_DETAILS.locationLabel}</p>
              <p>{FAMILY_REUNION_DETAILS.registrationLabel}</p>
            </div>
          </div>

          <div>
            <span className="font-semibold text-lg mb-4 block">Quick links</span>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path}
                    className="text-background/80 hover:text-primary transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className="font-semibold text-lg mb-4 block">Family officers</span>
            <ul className="space-y-2">
              {familyOfficers.map((officer, index) => (
                <li key={index} className="text-sm">
                  <span className="text-background/80 block">{officer.name}</span>
                  <a 
                    href={`tel:${officer.phone.replace(/\./g, '')}`}
                    className="text-background/60 hover:text-primary transition-colors duration-200 flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3" />
                    {officer.phone}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className="font-semibold text-lg mb-4 block">Contact</span>
            <ul className="space-y-3 text-sm">
              <li>
                <a 
                  href={FAMILY_CONTACT_INFO.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-background/80 hover:text-primary transition-colors duration-200 flex items-center gap-2"
                >
                  <Globe className="w-4 h-4" />
                  {FAMILY_CONTACT_INFO.websiteUrl}
                </a>
              </li>
              <li>
                <a 
                  href={`mailto:${FAMILY_CONTACT_INFO.email}`}
                  className="text-background/80 hover:text-primary transition-colors duration-200 flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  {FAMILY_CONTACT_INFO.email}
                </a>
              </li>
              <li>
                <a 
                  href={FAMILY_CONTACT_INFO.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-background/80 hover:text-primary transition-colors duration-200 flex items-center gap-2"
                >
                  <Instagram className="w-4 h-4" />
                  {FAMILY_CONTACT_INFO.instagramHandle}
                </a>
              </li>
              <li className="text-background/80 flex items-start gap-2">
                <Facebook className="w-4 h-4 mt-0.5" />
                <span>{FAMILY_CONTACT_INFO.facebookLabel}</span>
              </li>
              <li className="text-background/80">
                <span className="block mb-1">Payment via Cash App:</span>
                <span className="font-semibold text-primary">$SumlinReunionClub</span>
              </li>
              <li>
                <Link 
                  to="/admin"
                  className="text-background/80 hover:text-primary transition-colors duration-200"
                >
                  Admin Command Central
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-background/20">
          <div className="grid gap-4 text-sm text-background/60 md:grid-cols-3 md:items-center">
            <p className="text-center md:text-left">
              © {currentYear} Sumlin Family Reunion. All rights reserved.
            </p>
            <p className="text-center">
              Developed &amp; maintained by {' '}
              <a
                href="https://www.indigographix.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-primary transition-colors duration-200"
              >
                Indigo Group
              </a>
              {' '}·{' '}
              <a
                href="tel:4048890186"
                className="hover:text-primary transition-colors duration-200"
              >
                404.889.0186
              </a>
            </p>
            <div className="flex justify-center gap-6 md:justify-end">
              <Link to="/fundraiser-rules" className="hover:text-primary transition-colors duration-200">
                Fundraiser Rules
              </Link>
              <Link to="/family-business" className="hover:text-primary transition-colors duration-200">
                Family Business
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
