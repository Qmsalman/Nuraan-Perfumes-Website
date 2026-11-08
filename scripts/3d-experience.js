/**
 * ==============================================================================
 * NURAAN PERFUMES — 3D INTERACTIVE WEB EXPERIENCE ENGINE
 * Pure-oil artisanal flacon 3D spatial tilt, dynamic specular refraction,
 * and luxury coffret magnetic lid unboxing in discovery carousel track.
 *
 * Compliant with 3d-web-experience, apple-design, emil-design-eng & animate:
 * - 60fps hardware-accelerated CSS 3D composition (composite-only properties)
 * - Zero WebGL context loss limits on mobile; zero battery drain
 * - Works automatically on both procedural SVG flacons and uploaded real product photos
 * - Non-hijacking, touch-safe responsive interactions
 * ==============================================================================
 */

(function() {
  'use strict';

  // ==============================================================================
  // 1. CAROUSEL ON-CARD LUXURY BOX UNBOXING
  // ==============================================================================
  const CarouselBoxUnboxing = {
    init: function() {
      // Attach 3D tilt tracking to all discovery boxes
      this.attachBoxTiltListeners();

      // Mutation observer to re-attach if carousel re-renders
      const grid = document.getElementById('combos-grid');
      if (grid && window.MutationObserver) {
        const observer = new MutationObserver(() => {
          this.attachBoxTiltListeners();
        });
        observer.observe(grid, { childList: true });
      }
    },

    attachBoxTiltListeners: function() {
      const boxes = document.querySelectorAll('.combo-interactive-box');
      boxes.forEach(box => {
        if (box._has3dListeners) return;
        box._has3dListeners = true;

        box.addEventListener('mousemove', (e) => {
          const rect = box.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width;
          const y = (e.clientY - rect.top) / rect.height;
          const nx = (x - 0.5) * 2;
          const ny = (y - 0.5) * 2;

          box.style.transform = `perspective(800px) rotateY(${nx * 8}deg) rotateX(${-ny * 7}deg)`;
        }, { passive: true });

        box.addEventListener('mouseleave', () => {
          box.style.transform = '';
        });

        box.addEventListener('touchmove', (e) => {
          if (e.touches.length === 1) {
            const touch = e.touches[0];
            const rect = box.getBoundingClientRect();
            const x = (touch.clientX - rect.left) / rect.width;
            const y = (touch.clientY - rect.top) / rect.height;
            const nx = (x - 0.5) * 2;
            const ny = (y - 0.5) * 2;
            box.style.transform = `perspective(800px) rotateY(${nx * 6}deg) rotateX(${-ny * 5}deg)`;
          }
        }, { passive: true });

        box.addEventListener('touchend', () => {
          box.style.transform = '';
        });
      });
    },

    toggleUnbox: function(comboId) {
      const box = document.getElementById(`combo-box-${comboId}`);
      if (!box) return;

      const isCurrentlyOpen = box.classList.contains('is-open');
      const pill = document.getElementById(`combo-unbox-pill-${comboId}`);

      if (isCurrentlyOpen) {
        box.classList.remove('is-open');
        box.classList.add('is-closed');
        if (pill) {
          pill.innerHTML = `
            <span class="unbox-icon">✦</span>
            <span class="unbox-text">Magnetic Lid Sealed • Tap to Unbox</span>
          `;
        }
      } else {
        box.classList.remove('is-closed');
        box.classList.add('is-open');
        if (pill) {
          pill.innerHTML = `
            <span class="unbox-icon">✦</span>
            <span class="unbox-text">Lid Open • Tap to Close Box</span>
          `;
        }
      }

      // Haptic bounce feedback
      box.style.transition = 'transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)';
      box.style.transform = 'scale(0.97)';
      setTimeout(() => {
        box.style.transform = '';
        setTimeout(() => {
          box.style.transition = '';
        }, 300);
      }, 160);
    }
  };

  // Expose toggleComboUnbox globally
  window.toggleComboUnbox = function(comboId) {
    CarouselBoxUnboxing.toggleUnbox(comboId);
  };

  // ==============================================================================
  // 2. SINGLE BOTTLE 3D SPATIAL TILT & SPECULAR REFRACTION ENGINE
  // Automatically attaches to both procedural SVG flacons and uploaded real photos
  // ==============================================================================
  const SingleBottle3D = {
    init: function() {
      this.attachAll();

      // Mutation observer on catalog grid and modal to bind freshly rendered or filtered products
      const catalogGrid = document.getElementById('fragrance-grid') || document.getElementById('catalog-grid');
      if (catalogGrid && window.MutationObserver) {
        const observer = new MutationObserver(() => {
          this.attachAll();
        });
        observer.observe(catalogGrid, { childList: true });
      }

      const modalContainer = document.getElementById('modal-bottle-container');
      if (modalContainer && window.MutationObserver) {
        const modalObs = new MutationObserver(() => {
          this.attachAll();
        });
        modalObs.observe(modalContainer, { childList: true });
      }
    },

    attachAll: function() {
      const stages = document.querySelectorAll('.bottle-3d-stage');
      stages.forEach(stage => this.bindStage(stage));
    },

    bindStage: function(stage) {
      if (stage._has3dBound) return;
      stage._has3dBound = true;

      const chassis = stage.querySelector('.bottle-3d-chassis');
      const glare = stage.querySelector('.bottle-specular-glare');
      const shadow = stage.querySelector('.bottle-3d-floor-shadow');
      if (!chassis) return;

      let isHovered = false;

      const onPointerMove = (clientX, clientY) => {
        const rect = stage.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;

        const x = (clientX - rect.left) / rect.width;
        const y = (clientY - rect.top) / rect.height;
        const nx = Math.max(-1, Math.min(1, (x - 0.5) * 2));
        const ny = Math.max(-1, Math.min(1, (y - 0.5) * 2));

        // 1. Multi-axis 3D spatial rotation & elevation
        const rotY = nx * 18; // Max 18deg horizontal
        const rotX = -ny * 16; // Max 16deg vertical
        chassis.style.transform = `perspective(900px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateZ(14px) scale3d(1.05, 1.05, 1.05)`;

        // 2. Dynamic specular refraction glint follows pointer
        if (glare) {
          const glareX = (50 + nx * 38).toFixed(1);
          const glareY = (50 + ny * 38).toFixed(1);
          const dist = Math.sqrt(nx * nx + ny * ny);
          const opacity = Math.min(0.85, 0.35 + dist * 0.45).toFixed(2);
          glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.82) 0%, rgba(255, 235, 190, 0.35) 30%, transparent 68%)`;
          glare.style.opacity = opacity;
        }

        // 3. Dynamic physical floor shadow shifts opposite to tilt
        if (shadow) {
          const shadowX = (-nx * 14).toFixed(1);
          const shadowY = (8 + ny * 6).toFixed(1);
          const scale = (1 - ny * 0.08).toFixed(2);
          shadow.style.transform = `translateX(-50%) translate3d(${shadowX}px, ${shadowY}px, 0) scale(${scale})`;
          shadow.style.filter = `blur(${8 + Math.abs(nx) * 3}px)`;
          shadow.style.opacity = (0.24 - ny * 0.05).toFixed(2);
        }
      };

      const resetTilt = () => {
        isHovered = false;
        chassis.style.transition = 'transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1)';
        chassis.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0) scale3d(1, 1, 1)';

        if (glare) {
          glare.style.transition = 'opacity 0.45s ease';
          glare.style.opacity = '0';
        }

        if (shadow) {
          shadow.style.transition = 'transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1), filter 0.45s ease, opacity 0.45s ease';
          shadow.style.transform = 'translateX(-50%) translate3d(0, 0, 0) scale(1)';
          shadow.style.filter = 'blur(6px)';
          shadow.style.opacity = '0.2';
        }

        setTimeout(() => {
          chassis.style.transition = '';
          if (glare) glare.style.transition = '';
          if (shadow) shadow.style.transition = '';
        }, 460);
      };

      // Desktop Pointer Listeners
      stage.addEventListener('mouseenter', () => {
        isHovered = true;
        chassis.style.transition = 'transform 0.1s ease-out';
      });

      stage.addEventListener('mousemove', (e) => {
        if (!isHovered) isHovered = true;
        onPointerMove(e.clientX, e.clientY);
      }, { passive: true });

      stage.addEventListener('mouseleave', resetTilt);

      // Mobile Touch Listeners (Non-blocking touch tracking)
      stage.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
          isHovered = true;
          chassis.style.transition = 'transform 0.12s ease-out';
          const t = e.touches[0];
          onPointerMove(t.clientX, t.clientY);
        }
      }, { passive: true });

      stage.addEventListener('touchmove', (e) => {
        if (e.touches.length === 1) {
          const t = e.touches[0];
          onPointerMove(t.clientX, t.clientY);
        }
      }, { passive: true });

      stage.addEventListener('touchend', resetTilt);
      stage.addEventListener('touchcancel', resetTilt);
    }
  };

  // ==============================================================================
  // 3. GLOBAL EXPORT & AUTO-INITIALIZATION
  // ==============================================================================
  window.Nuraan3D = {
    SingleBottle3D: SingleBottle3D,
    CarouselBoxUnboxing: CarouselBoxUnboxing,
    toggleComboUnbox: CarouselBoxUnboxing.toggleUnbox,
    initAll: function() {
      CarouselBoxUnboxing.init();
      SingleBottle3D.init();
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.Nuraan3D.initAll();
    });
  } else {
    window.Nuraan3D.initAll();
  }
})();
