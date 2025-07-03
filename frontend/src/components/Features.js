import React from 'react';
import { ParallaxLayer } from '@react-spring/parallax';
import { motion } from 'framer-motion';
import { FaRobot, FaCalendarAlt, FaWifi, FaChartLine, FaGamepad, FaShieldAlt } from 'react-icons/fa';

const Features = ({ fadeIn, staggerContainer, featureCardVariants, iconVariants }) => {
  return (
    <ParallaxLayer
      offset={1}
      speed={0.6}
      factor={1}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div className="max-w-6xl w-full px-8 py-16 content-section relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeIn}
        >
          <span className="bg-meow-pink text-white text-lg px-6 py-2 rounded-full uppercase tracking-wider shadow-sm">Features</span>
          <h2 className="section-title text-5xl font-bold mt-6 mb-6">Smart Feeding Solutions</h2>
          <p className="text-text-tertiary text-xl max-w-3xl mx-auto">
            Our MeowFeeder provides everything you need to keep your feline friend happy and well-fed, even when you're away.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          <motion.div 
            className="bg-white rounded-xl p-8 hover:shadow-xl transition duration-300 border border-meow-pink/20"
            variants={featureCardVariants}
            whileHover="hover"
          >
            <motion.div 
              className="h-16 w-16 rounded-lg bg-meow-pink flex items-center justify-center mb-6 shadow-sm"
              variants={iconVariants}
            >
              <FaRobot className="text-2xl text-white" />
            </motion.div>
            <h3 className="text-xl font-bold text-text-primary mb-4">Automated Feeding</h3>
            <p className="text-text-tertiary leading-relaxed">
              Smart automated feeding system that dispenses the right amount of food at the right time.
            </p>
          </motion.div>

          <motion.div 
            className="bg-white rounded-xl p-8 hover:shadow-xl transition duration-300 border border-meow-mint/20"
            variants={featureCardVariants}
            whileHover="hover"
          >
            <motion.div 
              className="h-16 w-16 rounded-lg bg-meow-mint flex items-center justify-center mb-6 shadow-sm"
              variants={iconVariants}
            >
              <FaCalendarAlt className="text-2xl text-white" />
            </motion.div>
            <h3 className="text-xl font-bold text-text-primary mb-4">Custom Schedules</h3>
            <p className="text-text-tertiary leading-relaxed">
              Set multiple feeding times throughout the day to match your cat's eating habits.
            </p>
          </motion.div>

          <motion.div 
            className="bg-white rounded-xl p-8 hover:shadow-xl transition duration-300 border border-meow-beige/20"
            variants={featureCardVariants}
            whileHover="hover"
          >
            <motion.div 
              className="h-16 w-16 rounded-lg bg-meow-beige flex items-center justify-center mb-6 shadow-sm"
              variants={iconVariants}
            >
              <FaWifi className="text-2xl text-white" />
            </motion.div>
            <h3 className="text-xl font-bold text-text-primary mb-4">WiFi Connected</h3>
            <p className="text-text-tertiary leading-relaxed">
              Control your feeder remotely from anywhere using our mobile app or web dashboard.
            </p>
          </motion.div>

          <motion.div 
            className="bg-white rounded-xl p-8 hover:shadow-xl transition duration-300 border border-meow-pink/20"
            variants={featureCardVariants}
            whileHover="hover"
          >
            <motion.div 
              className="h-16 w-16 rounded-lg bg-meow-pink flex items-center justify-center mb-6 shadow-sm"
              variants={iconVariants}
            >
              <FaChartLine className="text-2xl text-white" />
            </motion.div>
            <h3 className="text-xl font-bold text-text-primary mb-4">Feeding Analytics</h3>
            <p className="text-text-tertiary leading-relaxed">
              SOON...
            </p>
          </motion.div>

          <motion.div 
            className="bg-white rounded-xl p-8 hover:shadow-xl transition duration-300 border border-meow-mint/20"
            variants={featureCardVariants}
            whileHover="hover"
          >
            <motion.div 
              className="h-16 w-16 rounded-lg bg-meow-mint flex items-center justify-center mb-6 shadow-sm"
              variants={iconVariants}
            >
              <FaGamepad className="text-2xl text-white" />
            </motion.div>
            <h3 className="text-xl font-bold text-text-primary mb-4">Remote Controller</h3>
            <p className="text-text-tertiary leading-relaxed">
              Use the physical remote controller to manually feed your cat without needing your phone.
            </p>
          </motion.div>

          <motion.div 
            className="bg-white rounded-xl p-8 hover:shadow-xl transition duration-300 border border-meow-beige/20"
            variants={featureCardVariants}
            whileHover="hover"
          >
            <motion.div 
              className="h-16 w-16 rounded-lg bg-meow-beige flex items-center justify-center mb-6 shadow-sm"
              variants={iconVariants}
            >
              <FaShieldAlt className="text-2xl text-white" />
            </motion.div>
            <h3 className="text-xl font-bold text-text-primary mb-4">Safe & Secure</h3>
            <p className="text-text-tertiary leading-relaxed">
              Built with pet-safe materials and secure connections to keep your furry friend safe.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </ParallaxLayer>
  );
};

export default Features;
