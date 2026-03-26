import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const About = () => {
  const teamMembers = [
    {
      name: 'Family Reunion Committee',
      role: 'Planning Team',
      bio: 'Our committee is working together to organize a meaningful reunion experience that brings the Sumlin family closer, honors our elders, and creates lasting memories for the next generation.',
      image: '/placeholder-family-member.jpg'
    },
    {
      name: 'Family Historians',
      role: 'Legacy & Heritage',
      bio: 'This group helps preserve the stories, roots, and traditions that define the Sumlin family. Their work keeps our history visible and helps pass it forward with pride.',
      image: '/placeholder-family-member.jpg'
    },
    {
      name: 'Event Support Team',
      role: 'Hospitality & Coordination',
      bio: 'From communication to logistics, this team helps make sure the reunion runs smoothly and that every family member feels welcomed, informed, and connected throughout the event.',
      image: '/placeholder-family-member.jpg'
    }
  ];

  return (
    <>
      <Helmet>
        <title>About the Reunion | Sumlin Family Reunion 2026</title>
        <meta
          name="description"
          content="Learn more about the Sumlin Family Reunion 2026, our purpose, our legacy, and the family members helping bring this gathering to life."
        />
      </Helmet>

      <div className="bg-white">
        <header className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl font-light tracking-tight text-gray-900 mb-4"
            >
              Our reunion story
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto"
            >
              The Sumlin Family Reunion is a time to come together, honor where we come from,
              and strengthen the bond that carries us forward. This gathering is about family,
              memory, culture, and the legacy we continue to build together.
            </motion.p>
          </div>
        </header>

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <img
                  className="rounded-2xl w-full h-full object-cover aspect-[4/3]"
                  alt="Sumlin family gathering"
                  src="https://horizons-cdn.hostinger.com/6ddbc4c1-b479-4ef4-be4a-ff36b8b1842e/b21b2d1ea8690c7803645629877d22a3.jpg"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <h2 className="text-4xl font-light text-gray-900">Why we gather</h2>
                <p className="mt-4 text-lg text-gray-600">
                  Our reunion is more than an event. It is a chance to reconnect across
                  generations, celebrate our shared history, and make space for new memories.
                  It brings family together in one place with love, pride, and purpose.
                </p>
                <p className="mt-4 text-lg text-gray-600">
                  We gather to honor those who came before us, uplift those who are here now,
                  and invest in the generations still coming. Every conversation, photo,
                  activity, and shared moment adds to the story of the Sumlin family.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-4xl font-light text-gray-900">The people behind the reunion</h2>
              <p className="mt-4 text-lg text-gray-600">
                The family members helping make this gathering possible.
              </p>
            </div>

            <div className="mt-12 grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <img
                    className="mx-auto h-40 w-40 rounded-full object-cover bg-gray-200"
                    src={member.image}
                    alt={`${member.name} placeholder`}
                  />
                  <h3 className="mt-6 text-xl font-medium text-gray-900">{member.name}</h3>
                  <p className="text-gray-600">{member.role}</p>
                  <p className="mt-2 text-gray-500 max-w-xs mx-auto">{member.bio}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-light text-gray-900">Be part of the legacy</h2>
            <p className="mt-4 text-lg text-gray-600">
              Join us as we celebrate family, honor our roots, and create new memories together.
              Register for the reunion, support the family raffle, and help us make this gathering
              meaningful for every generation.
            </p>

            <div className="mt-8 flex justify-center gap-4 flex-wrap">
              <Link to="/family-legacy">
                <Button className="bg-gray-900 text-white hover:bg-gray-800 rounded-full px-8 py-3">
                  Support the reunion
                </Button>
              </Link>

              <Link to="/contact">
                <Button variant="outline" className="rounded-full px-8 py-3">
                  Contact us
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default About;