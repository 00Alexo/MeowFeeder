import React from 'react';
import { ParallaxLayer } from '@react-spring/parallax';
import { motion } from 'framer-motion';

const HowItWorks = ({ fadeIn, iconVariants }) => {
  return (
    <ParallaxLayer
      offset={2}
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
          <span className="bg-meow-pink text-white text-lg px-6 py-2 rounded-full uppercase tracking-wider shadow-sm">How It Works</span>
          <h2 className="section-title text-5xl font-bold mt-6 mb-6">Simple Steps to Happy Cats</h2>
          <p className="text-text-tertiary text-xl max-w-3xl mx-auto">
            Get started with MeowFeeder in just three simple steps and give your cat the care they deserve.
          </p>
        </motion.div>

        {/* Steps section */}
        <div className="relative">
          {/* Timeline line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-meow-pink/30 transform -translate-x-1/2"></div>

          {/* Step 1 */}
          <motion.div 
            className="flex flex-col md:flex-row items-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeIn}
          >
            <div className="md:w-1/2 md:pr-16 text-right">
              <h3 className="text-meow-pink text-3xl font-bold mb-4">Set Up Your Device</h3>
              <p className="text-text-tertiary text-xl">Connect your MeowFeeder to WiFi and register it with your account in minutes.</p>
            </div>
            <motion.div 
              className="rounded-full bg-meow-pink text-white h-16 w-16 flex items-center justify-center font-bold text-2xl my-4 md:my-0 z-10 shadow-lg"
              variants={iconVariants}
            >
              1
            </motion.div>
            <div className="md:w-1/2 md:pl-16">
              <div className="bg-white p-6 rounded-xl shadow-lg border border-meow-pink/20">
                <span className="text-4xl mb-4 block">📱</span>
                <p className="text-text-tertiary">Download our app and follow the easy setup wizard to get your feeder online.</p>
              </div>
            </div>
          </motion.div>

          {/* Step 2 */}
          <motion.div 
            className="flex flex-col md:flex-row-reverse items-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeIn}
          >
            <div className="md:w-1/2 md:pl-16 text-left">
              <h3 className="text-meow-mint text-3xl font-bold mb-4">Create Feeding Schedule</h3>
              <p className="text-text-tertiary text-xl">Set custom feeding times that match your cat's routine and dietary needs.</p>
            </div>
            <motion.div 
              className="rounded-full bg-meow-mint text-white h-16 w-16 flex items-center justify-center font-bold text-2xl my-4 md:my-0 z-10 shadow-lg"
              variants={iconVariants}
            >
              2
            </motion.div>
            <div className="md:w-1/2 md:pr-16">
              <div className="bg-white p-6 rounded-xl shadow-lg border border-meow-mint/20">
                <span className="text-4xl mb-4 block">⏰</span>
                <p className="text-text-tertiary">Choose meal times, portion sizes, and frequency to keep your cat healthy and satisfied.</p>
              </div>
            </div>
          </motion.div>

          {/* Step 3 */}
          <motion.div 
            className="flex flex-col md:flex-row items-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeIn}
          >
            <div className="md:w-1/2 md:pr-16 text-right">
              <h3 className="text-meow-beige text-3xl font-bold mb-4">Monitor & Enjoy</h3>
              <p className="text-text-tertiary text-xl">Track your cat's eating habits and enjoy peace of mind knowing they're well-fed.</p>
            </div>
            <motion.div 
              className="rounded-full bg-meow-beige text-white h-16 w-16 flex items-center justify-center font-bold text-2xl my-4 md:my-0 z-10 shadow-lg"
              variants={iconVariants}
            >
              3
            </motion.div>
            <div className="md:w-1/2 md:pl-16">
              <div className="bg-white p-6 rounded-xl shadow-lg border border-meow-beige/20">
                <span className="text-4xl mb-4 block">🐱</span>
                <p className="text-text-tertiary">View feeding history, and adjust settings anytime from your phone.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </ParallaxLayer>
  );
};

export default HowItWorks;
