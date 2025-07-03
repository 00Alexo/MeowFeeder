import React from 'react';
import { ParallaxLayer } from '@react-spring/parallax';
import { motion } from 'framer-motion';
import { FaMap, FaGlobeEurope } from 'react-icons/fa';

const Resources = ({ fadeIn }) => {
  return (
    <ParallaxLayer
      offset={3}
      speed={0.6}
      factor={1}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div className="z-50 relative max-w-6xl w-full px-8 py-20 content-section">
        <motion.div 
          className="text-center mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeIn}
        >
          <span className="bg-[#5F5FDF] text-white text-lg px-6 py-2 rounded-full uppercase tracking-wider shadow-sm mb-6 inline-block">Categorii</span>
          <h2 className="section-title text-6xl font-bold mt-6 mb-8">Resurse Educaționale Complete</h2>
          <p className="text-[#8697C4] text-2xl max-w-3xl mx-auto">
            Accesează materiale didactice de calitate, adaptate programei de Bacalaureat la Geografie
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.2 }
            }
          }}
        >
          {/* Card 1: România */}
          <motion.div 
            className="bg-gradient-to-tr from-[#f5f7ff] to-white rounded-xl border border-[#ADBBDA] overflow-hidden shadow-lg"
            variants={fadeIn}
            whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
          >
            <div className="p-8">
              <div className="rounded-full bg-[#EDE8F5] w-16 h-16 flex items-center justify-center mb-6">
                <FaMap className="h-8 w-8 text-[#5F5FDF]" />
              </div>
              <h3 className="text-2xl font-bold text-[#5F5FDF] mb-4">Geografia României</h3>
              <p className="text-[#8697C4] mb-6">Studiu complet al reliefului, rețelei hidrografice, climei, resurselor și economiei României.</p>
              <ul className="text-[#8697C4]">
                <li className="mb-2 flex items-start">
                  <span className="text-[#5F5FDF] mr-2">✓</span> Relief și unități majore
                </li>
                <li className="mb-2 flex items-start">
                  <span className="text-[#5F5FDF] mr-2">✓</span> Hidrografie și climă
                </li>
                <li className="mb-2 flex items-start">
                  <span className="text-[#5F5FDF] mr-2">✓</span> Resurse naturale
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Card 2: Europa */}
          <motion.div 
            className="bg-gradient-to-br from-[#5F5FDF] to-[#4747A9] rounded-xl overflow-hidden shadow-xl"
            variants={fadeIn}
            whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
          >
            <div className="p-8">
              <div className="rounded-full bg-white bg-opacity-20 w-16 h-16 flex items-center justify-center mb-6">
                <FaGlobeEurope className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Geografia Europei</h3>
              <p className="text-[#EDE8F5] opacity-90 mb-6">Materiale detaliate despre geografia fizică și economică a continentului european.</p>
              <ul className="text-[#EDE8F5] opacity-90">
                <li className="mb-2 flex items-start">
                  <span className="text-white mr-2">✓</span> Țări și capitale
                </li>
                <li className="mb-2 flex items-start">
                  <span className="text-white mr-2">✓</span> Regiuni geografice
                </li>
                <li className="mb-2 flex items-start">
                  <span className="text-white mr-2">✓</span> Uniunea Europeană
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Card 3: Geografia Mondială */}
          <motion.div 
            className="bg-gradient-to-tr from-[#f5f7ff] to-white rounded-xl border border-[#ADBBDA] overflow-hidden shadow-lg"
            variants={fadeIn}
            whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
          >
            <div className="p-8">
              <div className="rounded-full bg-[#EDE8F5] w-16 h-16 flex items-center justify-center mb-6">
                <FaGlobeEurope className="h-8 w-8 text-[#5F5FDF]" />
              </div>
              <h3 className="text-2xl font-bold text-[#5F5FDF] mb-4">Geografia Mondială</h3>
              <p className="text-[#8697C4] mb-6">Explorează marile regiuni geografice ale lumii și fenomenele globale actuale.</p>
              <ul className="text-[#8697C4]">
                <li className="mb-2 flex items-start">
                  <span className="text-[#5F5FDF] mr-2">✓</span> Megalopolisuri mondiale
                </li>
                <li className="mb-2 flex items-start">
                  <span className="text-[#5F5FDF] mr-2">✓</span> Schimbări climatice
                </li>
                <li className="mb-2 flex items-start">
                  <span className="text-[#5F5FDF] mr-2">✓</span> Zone de conflict geopolitic
                </li>
              </ul>
            </div>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="mt-16 flex flex-col items-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeIn}
        >
          <p className="text-[#8697C4] text-xl max-w-3xl mx-auto mb-8 text-center"> 
            Pregătește-te pentru Bacalaureat cu cele mai bune resurse educaționale!
            Înregistrează-te pentru a avea acces la toate materialele noastre.
          </p>
        </motion.div>
      </div>
    </ParallaxLayer>
  );
};

export default Resources;