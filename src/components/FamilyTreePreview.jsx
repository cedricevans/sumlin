import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, MapPin, Users, BookOpen } from 'lucide-react';

const PORTRAIT =
  'https://horizons-cdn.hostinger.com/6ddbc4c1-b479-4ef4-be4a-ff36b8b1842e/4e13b087f02f8b089679f220666f2c15.png';

const gen2 = [
  { name: 'William Sumlin',               birth: '1881', location: 'Rivertown, GA' },
  { name: 'Wright Sumlin',                birth: '1882', location: 'Rivertown, GA' },
  { name: 'Charley Sumlin',               birth: '1883', location: 'Palmetto, GA' },
  { name: 'Lunie Sumlin',                 birth: null,   location: 'Rivertown, GA' },
  { name: 'Cordelia Sumlin Souders',      birth: '1886', location: 'Palmetto, GA' },
  { name: 'Geneva Sumlin Elder Jones',    birth: '1889', location: 'Palmetto, GA' },
  { name: 'Oscar Sumlin',                 birth: '1890', location: 'Palmetto, GA' },
  { name: 'Minnie Sumlin',               birth: null,   location: null, died: true },
  { name: 'Margaret Sumlin Wynn',         birth: '1894', location: 'Douglas County, GA' },
  { name: 'Ethel Sumlin Spears',          birth: '1894', location: 'Palmetto, GA' },
  { name: 'Marie Sumlin Vance Taylor',    birth: '1896', location: 'Palmetto, GA' },
  { name: 'Erma Sumlin Cranford',         birth: '1897', location: 'Palmetto, GA' },
  { name: 'Matthew Sumlin',              birth: null,   location: null },
  { name: 'Jessie Sumlin Hines Williams', birth: '1901', location: 'Palmetto, GA' },
  { name: 'John Sumlin',                 birth: null,   location: null },
];

const gen3 = [
  { name: 'Asberry Sumlin',       birth: 'Jul 17, 1908',  location: 'Palmetto, GA' },
  { name: 'Carrie McClearin',     birth: 'Dec 24, 1910',  location: 'Palmetto, GA' },
  { name: 'Ada Lee Hutson',       birth: 'Jan 11, 1913',  location: 'Palmetto, GA' },
  { name: 'Opal Merritt',         birth: 'Mar 15, 1915',  location: 'Palmetto, GA' },
  { name: 'Wright Sumlin',        birth: 'Feb 22, 1915',  location: 'Palmetto, GA' },
  { name: 'John Wynn',            birth: 'Apr 12, 1917',  location: 'Fairborn, GA' },
  { name: 'Mary Cranford',        birth: 'May 13, 1917',  location: 'Palmetto, GA' },
  { name: 'Celester Blake',       birth: 'Apr 5, 1918',   location: 'Douglasville, GA' },
  { name: 'Mark J. Cranford',     birth: 'Jun 9, 1919',   location: 'Palmetto, GA' },
  { name: 'Lewis Sumlin',         birth: 'Jun 13, 1919',  location: 'Palmetto, GA' },
  { name: 'Mary S. Jones',        birth: 'Mar 15, 1920',  location: 'Chicago, IL' },
  { name: 'Ruby Vance',           birth: 'Jul 29, 1920',  location: 'Douglasville, GA' },
  { name: 'Eloise Webster',       birth: 'Nov 10, 1920',  location: 'Palmetto, GA' },
  { name: 'Gussie Lee Vann',      birth: 'Sep 25, 1921',  location: 'Palmetto, GA' },
  { name: 'Oscar Cranford',       birth: 'Aug 30, 1922',  location: 'Palmetto, GA' },
  { name: 'Thomas Sumlin',        birth: 'Nov 7, 1922',   location: 'Palmetto, GA' },
  { name: 'James Wynn',           birth: 'May 20, 1923',  location: 'Dayton, OH' },
  { name: 'Oliver Sumlin',        birth: 'Jul 2, 1923',   location: 'Dayton, OH' },
  { name: 'Cordelia Kelly',       birth: 'Jul 17, 1923',  location: 'Palmetto, GA' },
  { name: 'Margaret Peterson',    birth: 'Nov 14, 1923',  location: 'Palmetto, GA' },
  { name: 'Anthony Spears',       birth: 'Jun 6, 1924',   location: 'Chicago, IL' },
  { name: 'M. Lucille A. France', birth: 'Jun 20, 1925',  location: 'Palmetto, GA' },
  { name: 'Eugenia Adams',        birth: 'Oct 13, 1926',  location: 'Palmetto, GA' },
  { name: 'Bernice I. Sumlin',    birth: 'Nov 29, 1926',  location: 'Dayton, OH' },
  { name: 'Cassie Dunson',        birth: 'Aug 20, 1928',  location: 'Palmetto, GA' },
  { name: 'Louise V. Bellamy',    birth: 'Oct 3, 1928',   location: 'Memphis, TN' },
  { name: 'William Souders',      birth: 'Feb 23, 1929',  location: 'Dayton, OH' },
  { name: 'Richard Spears',       birth: 'Jul 16, 1929',  location: 'Chicago, IL' },
  { name: 'Willis A. Wynn',       birth: 'Aug 6, 1929',   location: 'Dayton, OH' },
  { name: 'Matthew Cranford',     birth: 'Feb 25, 1931',  location: 'Palmetto, GA' },
  { name: 'Charles Cranford',     birth: 'Mar 17, 1934',  location: 'Palmetto, GA' },
  { name: 'M. Jewel Ray',         birth: 'Apr 16, 1934',  location: 'Detroit, MI' },
  { name: 'Curtis Cranford',      birth: 'Apr 30, 1935',  location: 'Palmetto, GA' },
  { name: 'Myrtice Cranford',     birth: 'Apr 30, 1935',  location: 'Palmetto, GA' },
];

/* ── vertical connector ── */
function Connector() {
  return (
    <div className="flex justify-center my-1">
      <div className="w-0.5 h-8 bg-gradient-to-b from-rose-800 to-amber-700" />
    </div>
  );
}

/* ── Gen 2 card ── */
function Gen2Card({ person, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04, duration: 0.4 }}
      className={`relative flex items-start gap-4 p-4 rounded-2xl border-2
        ${person.died
          ? 'bg-gradient-to-br from-violet-50 to-indigo-50 border-violet-300 shadow-md shadow-violet-100'
          : 'bg-white border-rose-200 shadow-md hover:border-rose-500 hover:shadow-lg transition-all duration-200'
        }`}
    >
      {/* left connector bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl ${person.died ? 'bg-gradient-to-b from-violet-400 to-indigo-500' : 'bg-gradient-to-b from-rose-800 to-amber-700'}`} />

      {/* avatar */}
      <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white shadow-md
        ${person.died ? 'bg-gradient-to-br from-violet-500 to-indigo-600' : 'bg-gradient-to-br from-rose-900 to-amber-800'}`}>
        {person.name.charAt(0)}
      </div>

      {/* info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className={`text-base font-bold leading-snug ${person.died ? 'text-stone-500' : 'text-stone-900'}`}>
            {person.name}
          </p>
          {person.died && (
            <span title="Deceased" className="text-lg">🕊️</span>
          )}
        </div>
        {person.died
          ? <p className="text-sm text-violet-400 italic mt-0.5 font-medium">Died at age 3</p>
          : (
            <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1">
              {person.birth && (
                <span className="text-sm text-rose-700 font-medium">Born {person.birth}</span>
              )}
              {person.location && (
                <span className="text-sm text-stone-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" />{person.location}
                </span>
              )}
            </div>
          )
        }
      </div>
    </motion.div>
  );
}

/* ── Gen 3 card ── */
function Gen3Card({ person, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.02, duration: 0.3 }}
      className="bg-white border-2 border-amber-200 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-amber-400 transition-all duration-200"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-800 to-orange-900 flex items-center justify-center text-white font-bold text-base flex-shrink-0">
          {person.name.charAt(0)}
        </div>
        <p className="text-base font-bold text-stone-900 leading-tight">{person.name}</p>
      </div>
      <p className="text-sm text-amber-700 font-medium">{person.birth}</p>
      <p className="text-sm text-stone-500 flex items-center gap-1 mt-0.5">
        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />{person.location}
      </p>
    </motion.div>
  );
}

/* ── Gen label badge ── */
function GenBadge({ label, count }) {
  return (
    <div className="flex items-center justify-center gap-3 my-6">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-rose-300" />
      <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-rose-950 to-amber-900 text-white shadow-lg">
        <Users className="w-5 h-5" />
        <span className="text-base font-bold">{label}</span>
        {count && <span className="bg-white/20 text-white text-sm font-semibold px-2 py-0.5 rounded-full">{count}</span>}
      </div>
      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-amber-300" />
    </div>
  );
}

export default function FamilyTreePreview() {
  const [showGen3, setShowGen3] = useState(false);

  return (
    <div className="w-full max-w-4xl mx-auto">

      {/* ── Gen 1 Root ── */}
      <GenBadge label="1st Generation" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="overflow-hidden rounded-3xl shadow-2xl border-2 border-rose-200"
      >
        {/* Two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Left col — portrait with overlay stats + story */}
          <div className="flex flex-col bg-white">
            {/* Portrait with overlay */}
            <div className="relative w-full flex-shrink-0" style={{ minHeight: '220px' }}>
              <img
                src="https://horizons-cdn.hostinger.com/6ddbc4c1-b479-4ef4-be4a-ff36b8b1842e/4e13b087f02f8b089679f220666f2c15.png"
                alt="Mark and Lydia Sumlin"
                className="w-full object-cover object-top"
                style={{ maxHeight: '220px' }}
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-rose-950/60" />
              {/* Stats text over overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                <h3 className="text-white font-bold text-xl leading-tight drop-shadow">Mark &amp; Lydia Sumlin</h3>
                <p className="text-rose-200 text-sm mt-1 drop-shadow">Married 1880 · Rivertown, Georgia</p>
                <div className="flex justify-center gap-6 mt-3">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-amber-300">15</p>
                    <p className="text-xs text-rose-200 uppercase tracking-wider mt-0.5">Children</p>
                  </div>
                  <div className="w-px bg-white/30" />
                  <div className="text-center">
                    <p className="text-2xl font-bold text-amber-300">34</p>
                    <p className="text-xs text-rose-200 uppercase tracking-wider mt-0.5">Grandchildren</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Story text */}
            <div className="p-6 md:p-8">
              <div className="space-y-4 text-base leading-relaxed text-stone-700">
                <p>
                  Mark Sumlin was born to Charles and Martha Wilson Sumlin in Carrollton,
                  Georgia, one of eight children. Lydia Jackson came from Douglasville,
                  Georgia, one of fourteen children born to Berry and Judy Jackson. The
                  young couple married in 1880 and made their home in Rivertown, Georgia.
                </p>
                <p>
                  Mark served the community as an AME minister and farmer. Lydia devoted
                  herself to others as a nurse and midwife — her name appears on the birth
                  certificates of several grandchildren, a quiet testament to the lives she
                  helped bring into the world. Her brother Taylor Jackson served as a
                  schoolteacher in Palmetto, where many of those grandchildren received
                  their education.
                </p>
                <p>
                  Together they raised fifteen children — seven sons and eight daughters.
                  All but one reached adulthood; their daughter Minnie passed away at the
                  age of three.
                </p>
              </div>
            </div>
          </div>

          {/* Right col — family tree image */}
          <div className="bg-white border-l border-rose-100">
            <img
              src="/family_tree.png"
              alt="Sumlin family tree"
              className="w-full h-auto"
            />
          </div>
        </div>

        {/* Full-width quote bar across the bottom */}
        <div className="bg-rose-950 px-6 py-4 text-center col-span-2">
          <p className="text-base italic text-amber-200 font-medium">
            &ldquo;The past is our heritage, the present is our responsibility, and the future is our grand destiny.&rdquo;
          </p>
        </div>
      </motion.div>

      <Connector />

      {/* ── Gen 2 ── */}
      <GenBadge label="2nd Generation · Children" count="15" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pl-2">
        {gen2.map((person, i) => (
          <Gen2Card key={person.name} person={person} index={i} />
        ))}
      </div>

      <Connector />

      {/* ── Gen 3 toggle ── */}
      <div className="flex justify-center mt-4">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowGen3(!showGen3)}
          className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-900 to-rose-900 text-white text-lg font-bold shadow-xl hover:shadow-2xl transition-shadow duration-200"
        >
          <Users className="w-6 h-6" />
          {showGen3 ? 'Hide' : 'Show'} Grandchildren — 3rd Generation
          {showGen3 ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
        </motion.button>
      </div>

      {/* ── Gen 3 grid ── */}
      <AnimatePresence>
        {showGen3 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
            className="overflow-hidden"
          >
            <GenBadge label="3rd Generation · Grandchildren" count="34" />

            <div className="bg-amber-50/70 border-2 border-amber-200 rounded-3xl p-6">
              <p className="text-center text-base text-amber-800 font-semibold mb-5 italic">
                Grandchildren of Mark &amp; Lydia Sumlin · Listed in Order of Birth
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {gen3.map((person, i) => (
                  <Gen3Card key={person.name} person={person} index={i} />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CTA ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="flex flex-col items-center gap-3 mt-10 px-4"
      >
        <p className="text-sm md:text-base text-stone-500 italic text-center">
          The Sumlin family history spans <strong className="text-stone-700">7 generations</strong> — explore the complete legacy
        </p>
        <Link
          to="/family-legacy"
          className="w-full sm:w-auto text-center inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl border-2 border-rose-900 text-rose-900 text-base md:text-lg font-bold hover:bg-rose-900 hover:text-white transition-all duration-200 shadow-md"
        >
          <BookOpen className="w-5 h-5 flex-shrink-0" />
          Our Legacy
        </Link>
      </motion.div>
    </div>
  );
}
