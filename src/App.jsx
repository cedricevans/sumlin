
import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import HomePage from '@/pages/HomePage.jsx';
import FamilyLegacyPage from '@/pages/FamilyLegacyPage.jsx';
import Reunion2026Page from '@/pages/Reunion2026Page.jsx';
import StorePage from '@/pages/StorePage.jsx';
import FamilyPortraitsPage from '@/pages/FamilyPortraitsPage.jsx';
import TestimonialsPage from '@/pages/TestimonialsPage.jsx';
import Shop from '@/pages/Shop.jsx';
import About from '@/pages/About.jsx';
import Contact from '@/pages/Contact.jsx';
import ProductDetailPage from '@/pages/ProductDetailPage.jsx';
import Success from '@/pages/Success.jsx';
import ShippingPolicy from '@/pages/ShippingPolicy.jsx';
import ReturnsPolicy from '@/pages/ReturnsPolicy.jsx';
import FundraiserRulesPage from '@/pages/FundraiserRulesPage.jsx';
import FamilyBusinessPage from '@/pages/FamilyBusinessPage.jsx';
import AdminPage from '@/pages/AdminPage.jsx';
import DonationPage from '@/pages/DonationPage.jsx';
import ShoppingCart from '@/components/ShoppingCart.jsx';
import ScrollToTop from '@/components/ScrollToTop.jsx';
import { CartProvider } from '@/hooks/useCart.jsx';

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <ScrollToTop />
        <Header setIsCartOpen={setIsCartOpen} />
        <ShoppingCart isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/family-legacy" element={<FamilyLegacyPage />} />
            <Route path="/reunion-2026" element={<Reunion2026Page />} />
            <Route path="/store" element={<StorePage />} />
            <Route path="/family-portraits" element={<FamilyPortraitsPage />} />
            <Route path="/testimonials" element={<TestimonialsPage />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/product/:id" element={<ProductDetailPage setIsCartOpen={setIsCartOpen} />} />
            <Route path="/success" element={<Success />} />
            <Route path="/fundraiser-rules" element={<FundraiserRulesPage />} />
            <Route path="/family-business" element={<FamilyBusinessPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/donate" element={<DonationPage />} />
            <Route path="/shipping-policy" element={<ShippingPolicy />} />
            <Route path="/returns-policy" element={<ReturnsPolicy />} />
            <Route path="*" element={
              <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                  <h1 className="text-6xl font-bold mb-4">404</h1>
                  <p className="text-xl text-muted-foreground mb-8">Page not found</p>
                  <a href="/" className="gradient-gold text-foreground px-8 py-3 rounded-xl font-semibold hover:shadow-gold hover:scale-105 transition-all duration-200 active:scale-[0.98] inline-block">
                    Back to home
                  </a>
                </div>
              </div>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}

export default App;
