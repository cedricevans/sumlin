import React from 'react';
import { Helmet } from 'react-helmet';
const ShippingPolicy = () => {
  return <div className="container mx-auto px-4 py-12 max-w-3xl">
      <Helmet>
        <title>Operational Notes | Sumlin Family</title>
        <meta name="description" content="Operational notes for the Sumlin Family Reunion website." />
      </Helmet>
      <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-center">Operational notes</h1>
      <section className="p-0">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Replaced route</h2>
        <p className="text-lg text-gray-700 mb-6">
          This legacy route remains in place so older links do not break. The current fundraiser information now lives on the official rules page.
        </p>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">Current location</h2>
        <p className="text-lg text-gray-700 mb-6">
          Visit <a href="/fundraiser-rules" className="text-blue-600 underline">/fundraiser-rules</a> for fundraiser details and <a href="/family-business" className="text-blue-600 underline">/family-business</a> for the family planning hub.
        </p>
      </section>
    </div>;
};
export default ShippingPolicy;
