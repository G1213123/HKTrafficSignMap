"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollAnimation() {
  const pathname = usePathname();

  useEffect(() => {
    const initCommonScrollAnimations = () => {
      const observerOptions = {
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px'
      };
      
      const observer = new IntersectionObserver(function(entries) {
          entries.forEach(entry => {
              if (entry.isIntersecting) {
                  entry.target.classList.add('visible');
              }
          });
      }, observerOptions);
  
      // Define selectors for elements that should animate on each page
      let animatedSelectors = [
          // Common elements across all pages
          '.feature-card',
          '.step-card', 
          '.demo-item',
          '.demo-container',
          '.about-visual',
          '.svg-gallery',
          
          // About page specific
          '.about-intro-section',
          '.timeline-item',
          '.timeline',
          '.about-detailed',
          '.intro-image',
          '.timeline-image',
          
          // Getting Started page specific
          '.tutorial-section',
          '.video-placeholder',
          '.image-placeholder',
          '.tips-section',
          '.tip-item',
          '.steps-grid > div',
          
          // Changelog page specific
          '.changelog-entry',
          '.changelog-intro',
          '.changelog-cta',
          '.version-tag',
          
          // Posters page specific
          '.poster-card',
          '.poster-grid',
  
          // General content sections
          '.section-title',
          '.section-subtitle',
          '.hero-content',
          '.content-section',
          '.cta-section',
          '.footer-section',
          
          // Map page specific
          '.map-sidebar',
          '.map-container'
      ];
  
      // Find all elements that match any of the selectors
      const animatedElements = document.querySelectorAll(animatedSelectors.join(', '));
      
      animatedElements.forEach(el => {
          el.classList.add('fade-in');
          observer.observe(el);
      });
    };

    // Run animation logic on initial load and route changes
    // We use a small timeout to ensure DOM is ready
    const timer = setTimeout(() => {
      initCommonScrollAnimations();
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
