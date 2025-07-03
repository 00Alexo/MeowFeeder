import React from 'react';
import { ParallaxLayer } from '@react-spring/parallax';
import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';

const Background = ({ stars, shapes, floatingOrbs, floatingLines, colors }) => {
  return (
    <>
      {/* Background with unified gradient - lighter theme */}
      <ParallaxLayer
        offset={0}
        speed={0}
        factor={4}
        style={{ 
          background: `linear-gradient(to bottom, ${colors.lightBg} 0%, #ffffff 50%, ${colors.lightBg} 100%)`
        }}
      />
      
      {/* Glowing accent background elements - lighter versions */}
      <ParallaxLayer
        offset={0}
        speed={0.1}
        factor={4}
      >
        <div className="absolute top-[15%] left-[10%] w-96 h-96 rounded-full bg-[#7091E6] opacity-[0.07] blur-[100px]" />
        <div className="absolute top-[60%] right-[15%] w-[500px] h-[500px] rounded-full bg-[#3D52A0] opacity-[0.05] blur-[120px]" />
        <div className="absolute top-[160%] left-[20%] w-[600px] h-[600px] rounded-full bg-[#ADBBDA] opacity-[0.08] blur-[150px]" />
        <div className="absolute top-[260%] right-[5%] w-96 h-96 rounded-full bg-[#7091E6] opacity-[0.07] blur-[100px]" />
      </ParallaxLayer>
      
      {/* Decorative stars - spans all pages */}
      <ParallaxLayer offset={0} speed={0.1} factor={4}>
        {stars.map((star, i) => (
          <div 
            key={i}
            className="star" 
            style={{
              fontSize: star.fontSize,
              left: star.left,
              top: star.top,
              '--duration': star.animationDuration
            }}
          >
            <FaStar />
          </div>
        ))}
      </ParallaxLayer> 
      
      {/* Floating shapes with motion */}
      <ParallaxLayer offset={0} speed={0.2} factor={4}>
        {shapes.map((shape, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: shape.opacity,
              y: [0, Math.random() > 0.5 ? 25 : -25, 0],
            }}
            transition={{ 
              opacity: { duration: 2, delay: i * 0.1 },
              y: { duration: 20, repeat: Infinity, ease: "linear" }
            }}
            style={{
              position: 'absolute',
              left: shape.left,
              top: shape.top,
              transform: `rotate(${shape.rotate})`,
              width: shape.width,
              height: shape.height,
              borderRadius: shape.borderRadius,
              background: shape.background,
            }}
          />
        ))}
      </ParallaxLayer>
      
      {/* Floating Orbs Layer */}
      <ParallaxLayer offset={0} speed={0.15} factor={4}>
        {floatingOrbs.map((orb, i) => (
          <div 
            key={i}
            style={{
              position: 'absolute',
              left: orb.left,
              top: orb.top,
              width: orb.size,
              height: orb.size,
              backgroundColor: orb.color,
              opacity: orb.opacity,
              borderRadius: '50%',
              filter: `blur(${orb.blur})`,
              animation: `float ${orb.animationDuration} infinite ease-in-out`
            }}
          />
        ))}
      </ParallaxLayer>

      {/* Flowing Lines Layer */}
      <ParallaxLayer offset={0} speed={0.2} factor={4}>
        {floatingLines.map((line, i) => (
          <div 
            key={i}
            style={{
              position: 'absolute',
              left: line.left,
              top: line.top,
              width: line.width,
              height: line.height,
              backgroundColor: line.color,
              opacity: line.opacity,
              transform: `rotate(${line.rotate})`,
              animation: `flow ${line.animationDuration} infinite ease-in-out`,
              '--min-opacity': line.opacity * 0.5,
              '--max-opacity': line.opacity * 1.5,
              '--rotate': line.rotate
            }}
          />
        ))}
      </ParallaxLayer>
    </>
  );
};

export default Background;