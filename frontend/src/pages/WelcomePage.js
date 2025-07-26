import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Parallax, ParallaxLayer } from '@react-spring/parallax';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import Background from '../components/Background';
import Navigation from '../components/Navigation';
import WelcomePageMobile from './WelcomePageMobile';

const WelcomePage = () => {
  const navigate = useNavigate();
  const parallaxRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  // Check if mobile on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Track current page for navigation indicators
  useEffect(() => {
    const handleScroll = () => {
      if (parallaxRef.current && parallaxRef.current.current !== undefined) {
        setCurrentPage(Math.round(parallaxRef.current.current));
      }
    };

    // Set up interval to check scroll position
    const interval = setInterval(handleScroll, 100);
    
    return () => clearInterval(interval);
  }, []);

  // MeowFeeder color palette from tailwind config
  const colors = {
    primary: "#F4B6C2",      // meow-pink
    primaryHover: "#F29CB3", // meow-pink-hover
    secondary: "#A3D2CA",    // meow-mint
    secondaryHover: "#8BC7BE", // meow-mint-hover
    accent: "#FFE8D6",       // meow-beige
    textPrimary: "#374151",  // text-primary
    textSecondary: "#4B5563", // text-secondary
    bgPage: "#F8F9FA",       // bg-page
    bgCard: "#FFFFFF",       // bg-card
    lightBg: "#f5f7ff"
  }; 

  // Pre-compute random values for consistent rendering
  const stars = useMemo(() => [...Array(150)].map(() => ({
    fontSize: `${Math.random() * 12 + 3}px`,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 300}%`, 
    animationDuration: `${Math.random() * 4 + 2}s`
  })), []);

  const shapes = useMemo(() => [...Array(25)].map(() => {
    const baseColor = Math.random() > 0.5 ? colors.primary : colors.secondary;
    return {
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 300}%`, 
      rotate: `${Math.random() * 360}deg`,
      width: `${Math.random() * 80 + 30}px`,
      height: `${Math.random() * 80 + 30}px`,
      borderRadius: Math.random() > 0.3 ? '50%' : '20%',
      background: `${baseColor}${Math.floor(Math.random() * 40 + 20).toString(16)}`,
      opacity: Math.random() * 0.3 + 0.1
    };
  }), []);

  const floatingLines = useMemo(() => [...Array(20)].map(() => {
    return {
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 300}%`,
      width: `${Math.random() * 150 + 80}px`,
      height: `${Math.random() * 2 + 1}px`,
      rotate: `${Math.random() * 180}deg`,
      opacity: Math.random() * 0.2 + 0.05,
      color: Math.random() > 0.5 ? colors.primary : colors.secondary,
      animationDuration: `${Math.random() * 12 + 8}s`
    };
  }), []);

  // Add floating orbs - paw-print inspired
  const floatingOrbs = useMemo(() => [...Array(15)].map(() => {
    return {
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 300}%`,
      size: `${Math.random() * 120 + 60}px`,
      opacity: Math.random() * 0.15 + 0.05,
      blur: `${Math.random() * 40 + 20}px`,
      color: Math.random() > 0.5 ? colors.primary : colors.secondary,
      animationDuration: `${Math.random() * 25 + 15}s`
    };
  }), []);
  
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const featureCardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    },
    hover: {
      scale: 1.05,
      boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
      transition: { duration: 0.3 }
    }
  };
  
  const iconVariants = {
    hidden: { scale: 0 },
    visible: { 
      scale: 1,
      transition: { 
        type: "spring",
        stiffness: 260,
        damping: 20,
        duration: 0.6 
      }
    }
  };

  if (isMobile) {
    return <WelcomePageMobile />;
  }

  return (
    <div className="relative h-screen overflow-hidden">
      <style jsx>{`
        /* Hide scrollbar */
        :global(body::-webkit-scrollbar) {
          display: none;
        }

        :global(body) {
          -ms-overflow-style: none;
          scrollbar-width: none;
          background-color: ${colors.bgPage};
        }

        /* Star animation - cat-themed twinkling */
          @keyframes twinkle {
            0% { opacity: 0.3; }
            100% { opacity: 0.8; }
          }

          .star {
            position: absolute;
            animation: twinkle var(--duration) infinite alternate;
            color: ${colors.primary};
          }
          
          /* Floating orb animation - gentle cat-like movement */
          @keyframes float {
            0% { transform: translateY(0) translateX(0); }
            50% { transform: translateY(-20px) translateX(10px); }
            100% { transform: translateY(0) translateX(0); }
          }
          
          /* Line flow animation - whisker-like movement */
          @keyframes flow {
            0% { transform: translateX(-15px) rotate(var(--rotate)); opacity: var(--min-opacity); }
            50% { transform: translateX(15px) rotate(calc(var(--rotate) + 3deg)); opacity: var(--max-opacity); }
            100% { transform: translateX(-15px) rotate(var(--rotate)); opacity: var(--min-opacity); }
          }
        
        /* Content section styling */
        .content-section {
          background-color: ${colors.bgCard};
          backdrop-filter: blur(5px);
          border-radius: 16px;
          box-shadow: 0 8px 20px rgba(244, 182, 194, 0.15);
          padding: 2rem;
        }
        
        .section-title {
          background: linear-gradient(90deg, ${colors.primary}, ${colors.secondary});
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>

      <Parallax 
        ref={parallaxRef} 
        pages={4} 
        config={{ tension: 170, friction: 26 }}
      >
        <Background 
          stars={stars} 
          shapes={shapes} 
          floatingOrbs={floatingOrbs} 
          floatingLines={floatingLines}
          colors={colors}
        />
        
        <Hero 
          fadeIn={fadeIn} 
          staggerContainer={staggerContainer} 
          iconVariants={iconVariants} 
        />
        
        <Features 
          fadeIn={fadeIn} 
          staggerContainer={staggerContainer} 
          featureCardVariants={featureCardVariants} 
          iconVariants={iconVariants}
        />
        
        <HowItWorks 
          fadeIn={fadeIn} 
          iconVariants={iconVariants}
        />

        <ParallaxLayer 
          sticky={{ start: 0, end: 3 }}
          style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', paddingRight: '2rem', zIndex: 1 }}
        >
          <div className="hidden md:flex flex-col gap-4">
            {[0, 1, 2].map((page) => (
              <motion.div
                key={page}
                className={`h-4 w-4 rounded-full cursor-pointer ${currentPage === page ? 'bg-meow-pink' : 'bg-meow-mint/60'}`}
                whileHover={{ scale: 1.5 }}
                onClick={() => parallaxRef.current?.scrollTo(page)}
                style={{
                  backgroundColor: colors.primary
                }}
              />
            ))}
          </div>
        </ParallaxLayer>
      </Parallax>

      <div className="fixed bottom-10 right-10 z-[9999]">
        <Link 
          to="/sign-up" 
          className="bg-meow-pink text-white px-8 py-4 rounded-xl text-lg font-medium hover:bg-meow-pink-hover transition-all shadow-lg flex items-center group"
        >
          Get Started
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default WelcomePage;