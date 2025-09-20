import { motion } from 'framer-motion';
import { Star, MapPin, Clock } from 'lucide-react';
import { Card } from './ui/card';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Abdullah',
    location: 'Kuala Lumpur',
    rating: 5,
    text: 'THEFMSMKT jagung terbaik yang pernah saya rasa! Rasa Chocolate mereka sungguh addictive. Delivery cepat dan jagung masih crispy sampai rumah.',
    date: '2 hari lalu',
    avatar: '👩🏻‍💼',
    orderCount: 23
  },
  {
    id: 2,
    name: 'Ahmad Rizal',
    location: 'Petaling Jaya',
    rating: 5,
    text: 'Street food gourmet yang authentic! Cheddar Cheese flavor dia memang next level. Service pun excellent, highly recommended!',
    date: '5 hari lalu',
    avatar: '👨🏻‍💻',
    orderCount: 15
  },
  {
    id: 3,
    name: 'Lisa Tan',
    location: 'Shah Alam',
    rating: 5,
    text: 'Susu Pekat variant dia remind me of childhood memories. Quality consistent dan packaging eco-friendly. Love the brand!',
    date: '1 minggu lalu',
    avatar: '👩🏻‍🎨',
    orderCount: 31
  },
  {
    id: 4,
    name: 'Farid Hassan',
    location: 'Subang Jaya',
    rating: 5,
    text: 'Caramel corn yang paling sedap! Live tracking feature memang helpful. THEFMSMKT memang game changer dalam industry ni.',
    date: '1 minggu lalu',
    avatar: '👨🏻‍🍳',
    orderCount: 42
  }
];

export function TestimonialsSection() {
  return (
    <section className="py-20 px-4 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl font-bold mb-4">
          Apa Kata <span className="text-[var(--neon-green)]">Customer</span> Kami
        </h2>
        <p className="text-[var(--neutral-400)] text-lg max-w-2xl mx-auto">
          Ribuan customer yang puas dengan kualiti dan service THEFMSMKT. 
          Dengar sendiri pengalaman mereka!
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Card className="p-6 h-full hover:border-[var(--neon-green)]/30 transition-all duration-300 group hover:shadow-lg hover:shadow-[var(--neon-green)]/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-2xl">{testimonial.avatar}</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-white group-hover:text-[var(--neon-green)] transition-colors">
                    {testimonial.name}
                  </h4>
                  <div className="flex items-center gap-1 text-sm text-[var(--neutral-400)]">
                    <MapPin className="w-3 h-3" />
                    {testimonial.location}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-[var(--neon-green)] text-[var(--neon-green)]"
                  />
                ))}
              </div>

              <p className="text-[var(--neutral-300)] text-sm leading-relaxed mb-4">
                "{testimonial.text}"
              </p>

              <div className="flex items-center justify-between text-xs text-[var(--neutral-500)]">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {testimonial.date}
                </div>
                <div className="px-2 py-1 bg-[var(--neutral-800)] rounded-full">
                  {testimonial.orderCount} orders
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-center mt-12"
      >
        <div className="inline-flex items-center gap-4 p-6 bg-[var(--neutral-900)] rounded-2xl border border-[var(--neutral-800)]">
          <div className="flex items-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-5 h-5 fill-[var(--neon-green)] text-[var(--neon-green)]"
                />
              ))}
            </div>
            <span className="text-2xl font-bold text-[var(--neon-green)]">4.9</span>
          </div>
          <div className="h-8 w-px bg-[var(--neutral-700)]" />
          <div className="text-left">
            <p className="text-white font-semibold">2,347+ Reviews</p>
            <p className="text-[var(--neutral-400)] text-sm">Average rating dari semua platform</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
