import React from 'react';
import { Helmet } from 'react-helmet';
const ReturnsPolicy = () => {
  return <div className="container mx-auto px-4 py-12 max-w-3xl">
      <Helmet>
        <title>Site Notes | Sumlin Family</title>
        <meta name="description" content="Legacy route note for the Sumlin Family Reunion website." />
      </Helmet>
      <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-center">Site notes</h1>
      <section className="p-0">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Legacy route</h2>
        <p className="text-lg text-gray-700 mb-6">
          This older route is preserved for compatibility while the active family business and fundraiser pages move to their dedicated routes.
        </p>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">Use these pages instead</h2>
        <p className="text-lg text-gray-700 mb-6">
          Visit <a href="/family-business" className="text-blue-600 underline">/family-business</a> for service planning and <a href="/admin" className="text-blue-600 underline">/admin</a> for the operational dashboard.
        </p>
      </section>
    </div>;
};
export default ReturnsPolicy;
