
import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';

const RaffleBasketCard = ({ 
  image, 
  title, 
  price, 
  items = [], 
  description 
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -8 }}
      transition={{ duration: 0.3 }}
      className="bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
    >
      <div className="relative overflow-hidden bg-muted">
        <img 
          src={image} 
          alt={title}
          className="w-full h-64 object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute top-4 right-4 gradient-gold text-foreground px-4 py-2 rounded-full font-bold text-lg shadow-gold">
          {price}
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-2xl font-bold mb-3 text-balance">{title}</h3>
        
        {description && (
          <p className="text-muted-foreground mb-4 leading-relaxed">
            {description}
          </p>
        )}
        
        {items.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold mb-2 text-sm uppercase tracking-wide text-muted-foreground">
              Basket includes:
            </h4>
            <ul className="space-y-1">
              {items.map((item, index) => (
                <li key={index} className="text-sm flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="mt-auto">
          <button className="w-full gradient-burgundy text-white py-3 rounded-xl font-semibold hover:shadow-burgundy hover:scale-[1.02] transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Purchase Ticket
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default RaffleBasketCard;
