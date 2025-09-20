import { ImageWithFallback } from './figma/ImageWithFallback';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { AnimatedButton } from './AnimatedButton';
import { FloatingParticles, FloatingCornIcons } from './FloatingParticles';
import { useResponsive } from '../hooks/useResponsive';
import originalCrnmnImage from 'figma:asset/e7573302acc3ed30b98153f11b3ac659cedea5ad.png';

interface HeroSectionProps {
  setActiveSection: (section: string) => void;
  addToCart: (item: any) => void;
}

export function HeroSection({ setActiveSection, addToCart }: HeroSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { isMobile, isTablet } = useResponsive();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const featuredItems = [
    {
      id: 1,
      name: 'CORNMAN Classic Cup',
      description: 'Sweet corn + butter + cheese',
      price: 'RM 7.90',
      badge: 'Most Popular',
      image: 'figma:asset/e7573302acc3ed30b98153f11b3ac659cedea5ad.png'
    },
    {
      id: 7,
      name: 'Susu Pekat Classic',
      description: 'Traditional Malaysian corn with condensed milk',
      price: 'RM 8.50',
      badge: 'Local Favorite',
      image: 'https://images.unsplash.com/photo-1736605406266-dbb985ef3325?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25kZW5zZWQlMjBtaWxrJTIwd2hpdGUlMjBjcmVhbSUyMGNvcm4lMjBzdHJlZXQlMjBmb29kJTIwZGFyayUyMGJhY2tncm91bmR8ZW58MXx8fHwxNzU2MzM2NTUxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: 6,
      name: 'Cheddar Cheese Explosion',
      description: 'Premium corn loaded with aged cheddar cheese',
      price: 'RM 10.90',
      badge: 'Cheesy Goodness',
      image: 'https://images.unsplash.com/photo-1651718543197-f567aeaa4fb0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVkZGFyJTIwY2hlZXNlJTIwY29ybiUyMGdvdXJtZXQlMjBjdXAlMjBkYXJrJTIwbW9vZHklMjBmb29kJTIwcGhvdG9ncmFwaHl8ZW58MXx8fHwxNzU2MzM2NTQ3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    },
  };

  const heroTextVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      rotateX: -15
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut'
      }
    },
  };

  const statsVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: 'backOut',
        delay: 1.2
      }
    },
  };

  return (
    <motion.div
      className="relative"
      variants={containerVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
    >
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-black via-neutral-900 to-black min-h-[80vh] flex items-center overflow-hidden">
        {/* Animated Background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--neon-green)] to-transparent opacity-5"
          animate={{
            x: ['-100%', '100%'],
            transition: { duration: 8, repeat: Infinity, ease: 'linear' }
          }}
        />

        {/* Floating Particles */}
        <FloatingParticles count={25} color="rgba(57, 255, 20, 0.05)" />
        <FloatingCornIcons count={6} />

        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 text-center">
          <motion.div
            className="mb-6"
            variants={itemVariants}
          >
            <motion.span
              className="text-sm tracking-[0.3em] neon-text font-semibold"
              animate={{
                textShadow: [
                  '0 0 5px rgba(57, 255, 20, 0.5)',
                  '0 0 10px rgba(57, 255, 20, 0.8)',
                  '0 0 5px rgba(57, 255, 20, 0.5)'
                ],
                transition: { duration: 2, repeat: Infinity }
              }}
            >
              THEFMSMKT
            </motion.span>
            <p className="text-xs text-[var(--neutral-400)] mt-1">CMNTYPLX · CORNMAN</p>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-7xl font-black mb-6"
            variants={heroTextVariants}
          >
            <motion.span
              className="neon-text block"
              animate={{
                scale: [1, 1.02, 1],
                textShadow: [
                  '0 0 20px rgba(57, 255, 20, 0.5)',
                  '0 0 30px rgba(57, 255, 20, 0.8)',
                  '0 0 20px rgba(57, 255, 20, 0.5)'
                ],
                transition: { duration: 3, repeat: Infinity }
              }}
            >
              GOURMET CORN
            </motion.span>
            <motion.span
              className="text-white block"
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { delay: 0.5, duration: 0.8 }
              }}
            >
              DELIVERED FRESH
            </motion.span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-[var(--neutral-300)] mb-8 max-w-2xl mx-auto"
            variants={itemVariants}
            initial={{ opacity: 0, y: 30 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { delay: 0.8, duration: 0.6 }
            }}
          >
            Elevated street food experiences featuring premium corn dishes with exciting new flavors.
            From traditional Malaysian Susu Pekat to indulgent Chocolate & Caramel varieties.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 40 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { delay: 1.2, duration: 0.6 }
            }}
          >
            <AnimatedButton
              variant="primary"
              size="lg"
              glow={true}
              pulse={true}
              onClick={() => setActiveSection('menu')}
              icon={<span className="material-icons">restaurant_menu</span>}
            >
              Order Now
            </AnimatedButton>

            <AnimatedButton
              variant="neon"
              size="lg"
              glow={true}
              onClick={() => setActiveSection('locations')}
              icon={<span className="material-icons">location_on</span>}
            >
              Find Locations
            </AnimatedButton>
          </motion.div>
        </div>
      </section>

      {/* Quick Stats */}
      <motion.section
        className="bg-[var(--neutral-900)] py-12 relative overflow-hidden"
        variants={itemVariants}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-[var(--neon-green)]/5 via-transparent to-[var(--neon-green)]/5"
          animate={{
            x: ['-100%', '100%'],
            transition: { duration: 12, repeat: Infinity, ease: 'linear' }
          }}
        />

        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
            variants={containerVariants}
          >
            {[
              { value: '15min', label: 'Average Delivery Time', icon: 'schedule' },
              { value: '100%', label: 'Fresh Ingredients', icon: 'eco' },
              { value: '4.9★', label: 'Customer Rating', icon: 'star' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={statsVariants}
                whileHover={{
                  scale: 1.1,
                  y: -5,
                  transition: { duration: 0.3 }
                }}
                className="group cursor-pointer"
              >
                <motion.div
                  className="text-4xl font-black neon-text mb-2 relative"
                  animate={{
                    textShadow: [
                      '0 0 10px rgba(57, 255, 20, 0.3)',
                      '0 0 20px rgba(57, 255, 20, 0.6)',
                      '0 0 10px rgba(57, 255, 20, 0.3)'
                    ],
                    transition: { duration: 2, repeat: Infinity, delay: index * 0.5 }
                  }}
                >
                  {stat.value}
                  <motion.span
                    className="material-icons absolute -top-2 -right-6 text-lg opacity-50 group-hover:opacity-100"
                    animate={{
                      rotate: [0, 10, -10, 0],
                      transition: { duration: 2, repeat: Infinity, delay: index * 0.3 }
                    }}
                  >
                    {stat.icon}
                  </motion.span>
                </motion.div>
                <p className="text-[var(--neutral-400)] group-hover:text-[var(--neutral-300)] transition-colors">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Featured Items */}
      <motion.section
        className="max-w-7xl mx-auto px-4 py-16"
        variants={itemVariants}
      >
        <motion.div
          className="text-center mb-12"
          variants={itemVariants}
        >
          <motion.h2
            className="text-3xl md:text-5xl font-extrabold neon-text mb-4"
            animate={{
              scale: [1, 1.02, 1],
              textShadow: [
                '0 0 20px rgba(57, 255, 20, 0.3)',
                '0 0 30px rgba(57, 255, 20, 0.6)',
                '0 0 20px rgba(57, 255, 20, 0.3)'
              ],
              transition: { duration: 3, repeat: Infinity }
            }}
          >
            Featured Items
          </motion.h2>
          <p className="text-[var(--neutral-400)] text-lg">Our most loved corn creations</p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-8"
          variants={containerVariants}
        >
          {featuredItems.map((item, index) => (
            <motion.div
              key={item.id}
              className="card group relative overflow-hidden"
              variants={itemVariants}
              whileHover={{
                scale: 1.05,
                y: -10,
                rotateY: 5,
                transition: { duration: 0.3 }
              }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Hover glow effect */}
              <motion.div
                className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100"
                style={{
                  background: 'linear-gradient(45deg, transparent, rgba(57, 255, 20, 0.1), transparent)',
                  filter: 'blur(20px)',
                }}
                animate={{
                  scale: [1, 1.1, 1],
                  transition: { duration: 2, repeat: Infinity }
                }}
              />

              <div className="aspect-video bg-gradient-to-br from-[var(--neutral-800)] to-[var(--neutral-900)] relative overflow-hidden">
                {item.image ? (
                  <>
                    {item.id === 1 ? (
                      <img
                        src={originalCrnmnImage}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/20"></div>
                  </>
                ) : (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <motion.span
                      className="material-icons text-6xl text-[var(--neutral-600)]"
                      animate={{
                        rotate: [0, 5, -5, 0],
                        scale: [1, 1.1, 1],
                        transition: { duration: 4, repeat: Infinity, delay: index * 0.5 }
                      }}
                    >
                      restaurant
                    </motion.span>
                  </>
                )}

                {item.badge && (
                  <motion.span
                    className="absolute top-4 left-4 text-xs px-3 py-1 rounded-full bg-opacity-90 neon-bg text-black font-semibold z-10"
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{
                      scale: 1,
                      rotate: 0,
                      transition: { delay: 0.5 + index * 0.2, type: 'spring', stiffness: 200 }
                    }}
                    whileHover={{
                      scale: 1.1,
                      boxShadow: '0 0 15px rgba(57, 255, 20, 0.5)'
                    }}
                  >
                    {item.badge}
                  </motion.span>
                )}
              </div>

              <div className="p-6">
                <motion.h3
                  className="font-bold text-xl mb-2"
                  whileHover={{ color: 'var(--neon-green)' }}
                >
                  {item.name}
                </motion.h3>
                <p className="text-[var(--neutral-400)] text-sm mb-4">{item.description}</p>
                <div className="flex items-center justify-between">
                  <motion.span
                    className="font-bold text-lg neon-text"
                    animate={{
                      textShadow: [
                        '0 0 5px rgba(57, 255, 20, 0.5)',
                        '0 0 10px rgba(57, 255, 20, 0.8)',
                        '0 0 5px rgba(57, 255, 20, 0.5)'
                      ],
                      transition: { duration: 2, repeat: Infinity, delay: index * 0.3 }
                    }}
                  >
                    {item.price}
                  </motion.span>

                  <AnimatedButton
                    variant="primary"
                    size="sm"
                    onClick={() => addToCart(item)}
                    icon={<span className="material-icons text-base">add_shopping_cart</span>}
                    bounceOnClick={true}
                  >
                    Add
                  </AnimatedButton>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="text-center mt-12"
          variants={itemVariants}
        >
          <AnimatedButton
            variant="neon"
            size="lg"
            glow={true}
            onClick={() => setActiveSection('menu')}
            icon={<span className="material-icons">menu_book</span>}
          >
            View Full Menu
          </AnimatedButton>
        </motion.div>
      </motion.section>

      {/* New Flavors Spotlight */}
      <section className="max-w-7xl mx-auto px-4 py-16 bg-gradient-to-r from-neutral-900 to-black rounded-3xl mx-4">
        <div className="text-center mb-12">
          <span className="text-sm px-4 py-2 bg-neon-green text-black rounded-full font-semibold mb-4 inline-block">
            🎉 NEW ARRIVALS
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold neon-text mb-4">Exciting New Flavors!</h2>
          <p className="text-[var(--neutral-400)] text-lg">Discover our latest corn creations inspired by Malaysian favorites and international desserts</p>
        </div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
          variants={containerVariants}
        >
          {[
            {
              icon: '🍫',
              name: 'Chocolate',
              desc: 'Rich Belgian chocolate drizzle',
              price: 'RM 9.50',
              image: 'https://images.unsplash.com/photo-1545086421-168708d4f603?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaG9jb2xhdGUlMjBkcml6emxlJTIwY29ybiUyMGN1cCUyMGdvdXJtZXQlMjBzdHJlZXQlMjBmb29kJTIwZGFyayUyMGJhY2tncm91bmR8ZW58MXx8fHwxNzU2MzM2NTQ0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
            },
            {
              icon: '🧀',
              name: 'Cheddar Cheese',
              desc: 'Aged Australian cheddar',
              price: 'RM 10.90',
              image: 'https://images.unsplash.com/photo-1651718543197-f567aeaa4fb0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVkZGFyJTIwY2hlZXNlJTIwY29ybiUyMGdvdXJtZXQlMjBjdXAlMjBkYXJrJTIwbW9vZHklMjBmb29kJTIwcGhvdG9ncmFwaHl8ZW58MXx8fHwxNzU2MzM2NTQ3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
            },
            {
              icon: '🥛',
              name: 'Susu Pekat',
              desc: 'Traditional condensed milk',
              price: 'RM 8.50',
              image: 'https://images.unsplash.com/photo-1736605406266-dbb985ef3325?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25kZW5zZWQlMjBtaWxrJTIwd2hpdGUlMjBjcmVhbSUyMGNvcm4lMjBzdHJlZXQlMjBmb29kJTIwZGFyayUyMGJhY2tncm91bmR8ZW58MXx8fHwxNzU2MzM2NTUxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
            },
            {
              icon: '🍯',
              name: 'Caramel',
              desc: 'Smooth golden caramel glaze',
              price: 'RM 9.90',
              image: 'https://images.unsplash.com/photo-1610479615051-a022c076da08?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJhbWVsJTIwc2F1Y2UlMjBnb2xkZW4lMjBjb3JuJTIwZ291cm1ldCUyMGRhcmslMjBmb29kJTIwcGhvdG9ncmFwaHl8ZW58MXx8fHwxNzU2MzM2NTU1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
            }
          ].map((flavor, index) => (
            <motion.div
              key={index}
              className="text-center p-6 rounded-2xl border border-neutral-700 group cursor-pointer relative overflow-hidden h-48"
              variants={itemVariants}
              whileHover={{
                scale: 1.05,
                y: -5,
                borderColor: 'var(--neon-green)',
                boxShadow: '0 10px 30px rgba(57, 255, 20, 0.2)',
                transition: { duration: 0.3 }
              }}
              whileTap={{ scale: 0.95 }}
              style={{
                backgroundImage: `url(${flavor.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/60 rounded-2xl"></div>

              {/* Hover glow */}
              <motion.div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100"
                style={{
                  background: 'radial-gradient(circle at center, rgba(57, 255, 20, 0.2) 0%, transparent 70%)',
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  transition: { duration: 2, repeat: Infinity }
                }}
              />

              {/* Content overlay */}
              <div className="relative z-10 h-full flex flex-col justify-center">
                <motion.div
                  className="text-4xl mb-3"
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1],
                    transition: { duration: 3, repeat: Infinity, delay: index * 0.2 }
                  }}
                >
                  {flavor.icon}
                </motion.div>

                <h3 className="font-bold mb-2 text-white group-hover:text-[var(--neon-green)] transition-colors">
                  {flavor.name}
                </h3>
                <p className="text-sm text-neutral-300 group-hover:text-white transition-colors">
                  {flavor.desc}
                </p>
                <motion.p
                  className="text-neon-green font-semibold mt-2"
                  animate={{
                    textShadow: [
                      '0 0 5px rgba(57, 255, 20, 0.3)',
                      '0 0 10px rgba(57, 255, 20, 0.6)',
                      '0 0 5px rgba(57, 255, 20, 0.3)'
                    ],
                    transition: { duration: 2, repeat: Infinity, delay: index * 0.4 }
                  }}
                >
                  {flavor.price}
                </motion.p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="text-center mt-8"
          variants={itemVariants}
        >
          <AnimatedButton
            variant="primary"
            size="lg"
            glow={true}
            pulse={true}
            onClick={() => setActiveSection('menu')}
            icon={<span className="material-icons">whatshot</span>}
          >
            Try New Flavors Now!
          </AnimatedButton>
        </motion.div>
      </section>

      {/* How It Works */}
      <motion.section
        className="bg-[var(--neutral-900)] py-16 relative overflow-hidden"
        variants={itemVariants}
      >
        <FloatingParticles count={15} color="rgba(57, 255, 20, 0.03)" />

        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            variants={itemVariants}
          >
            <motion.h2
              className="text-3xl md:text-5xl font-extrabold neon-text mb-4"
              animate={{
                textShadow: [
                  '0 0 20px rgba(57, 255, 20, 0.3)',
                  '0 0 30px rgba(57, 255, 20, 0.6)',
                  '0 0 20px rgba(57, 255, 20, 0.3)'
                ],
                transition: { duration: 3, repeat: Infinity }
              }}
            >
              How It Works
            </motion.h2>
            <p className="text-[var(--neutral-400)] text-lg">Fresh corn delivered in 3 simple steps</p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={containerVariants}
          >
            {[
              { icon: 'restaurant_menu', title: 'Choose Your Corn', desc: 'Browse our gourmet corn selection and customize your order', step: '1' },
              { icon: 'payments', title: 'Easy Payment', desc: 'Secure checkout with multiple payment options', step: '2' },
              { icon: 'delivery_dining', title: 'Fast Delivery', desc: 'Fresh corn delivered to your door in 15 minutes', step: '3' }
            ].map((step, index) => (
              <motion.div
                key={index}
                className="text-center relative"
                variants={itemVariants}
                whileHover={{
                  y: -10,
                  transition: { duration: 0.3 }
                }}
              >
                {/* Step Number */}
                <motion.div
                  className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-[var(--neon-green)] text-black text-sm font-bold flex items-center justify-center"
                  initial={{ scale: 0, rotate: 180 }}
                  animate={{
                    scale: 1,
                    rotate: 0,
                    transition: { delay: 0.5 + index * 0.3, type: 'spring', stiffness: 200 }
                  }}
                >
                  {step.step}
                </motion.div>

                <motion.div
                  className="w-16 h-16 rounded-full neon-bg text-black flex items-center justify-center mx-auto mb-4 relative"
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(57, 255, 20, 0.3)',
                      '0 0 30px rgba(57, 255, 20, 0.6)',
                      '0 0 20px rgba(57, 255, 20, 0.3)'
                    ],
                    transition: { duration: 2, repeat: Infinity, delay: index * 0.5 }
                  }}
                  whileHover={{
                    scale: 1.1,
                    rotate: 10,
                    transition: { duration: 0.3 }
                  }}
                >
                  <motion.span
                    className="material-icons text-2xl"
                    animate={{
                      rotate: [0, 5, -5, 0],
                      transition: { duration: 4, repeat: Infinity, delay: index * 0.7 }
                    }}
                  >
                    {step.icon}
                  </motion.span>
                </motion.div>

                <h3 className="font-bold text-xl mb-2">{step.title}</h3>
                <p className="text-[var(--neutral-400)]">{step.desc}</p>

                {/* Connecting Line (except for last item) */}
                {index < 2 && (
                  <motion.div
                    className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-[var(--neon-green)] to-transparent"
                    initial={{ scaleX: 0, originX: 0 }}
                    animate={{
                      scaleX: 1,
                      transition: { delay: 1.5 + index * 0.5, duration: 0.8 }
                    }}
                  />
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>
    </motion.div>
  );
}
