import React from 'react';
import { ParallaxLayer } from '@react-spring/parallax';
import { motion } from 'framer-motion';
import { FaHeart, FaClock, FaWifi } from 'react-icons/fa';

const Hero = ({ fadeIn, staggerContainer, iconVariants }) => {
  return (
    <ParallaxLayer
      offset={0}
      speed={0.5}
      factor={1}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '70px',
      }}
    >
      <motion.div 
        className="text-center max-w-5xl px-8 py-12 relative z-10"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.div className="flex justify-center mb-8" variants={iconVariants}>
          <div className="h-24 w-24 bg-white rounded-xl flex items-center justify-center shadow-lg border-2 border-meow-pink">
            <span className="text-6xl">🐾</span>
          </div>
        </motion.div>
        
        <motion.h1 
          className="text-meow-pink text-6xl font-bold mb-6 tracking-wide"
          variants={fadeIn}
        >
          MeowFeeder
        </motion.h1>
        
        <motion.p 
          className="text-text-secondary text-2xl mb-8 mx-auto max-w-3xl"
          variants={fadeIn}
        >
          Smart feeding made simple. Never worry about your cat's meals again with our automated feeding system.
        </motion.p>

        <motion.div 
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10"
          variants={staggerContainer}
        >
          <motion.div 
            className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg"
            variants={fadeIn}
          >
            <FaHeart className="text-4xl text-meow-pink mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-text-primary mb-2">Care & Love</h3>
            <p className="text-text-tertiary">Show your cat love even when you're away</p>
          </motion.div>

          <motion.div 
            className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg"
            variants={fadeIn}
          >
            <FaClock className="text-4xl text-meow-mint mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-text-primary mb-2">Scheduled Feeding</h3>
            <p className="text-text-tertiary">Set custom feeding times for your feline friend</p>
          </motion.div>

          <motion.div 
            className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg"
            variants={fadeIn}
          >
            <FaWifi className="text-4xl text-meow-beige mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-text-primary mb-2">Remote Control</h3>
            <p className="text-text-tertiary">Control your feeder from anywhere with WiFi</p>
          </motion.div>
        </motion.div>
      </motion.div>
    </ParallaxLayer>
  );
};

export default Hero;