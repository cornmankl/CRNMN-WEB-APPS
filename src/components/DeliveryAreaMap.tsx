import { motion } from 'framer-motion';
import { MapPin, Clock, Truck, CheckCircle, AlertCircle } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { useState } from 'react';

const deliveryAreas = [
  {
    area: 'Kuala Lumpur',
    zones: ['KLCC', 'Bukit Bintang', 'Chow Kit', 'Sentul', 'Titiwangsa'],
    deliveryTime: '15-25 min',
    fee: 'RM 3.90',
    status: 'active',
    orders: 1247
  },
  {
    area: 'Petaling Jaya',
    zones: ['SS2', 'SS15', 'Kelana Jaya', 'Damansara', 'Sunway'],
    deliveryTime: '20-30 min',
    fee: 'RM 4.90',
    status: 'active',
    orders: 892
  },
  {
    area: 'Shah Alam',
    zones: ['Sec 7', 'Sec 13', 'Sec 24', 'Alam Impian', 'Kota Kemuning'],
    deliveryTime: '25-35 min',
    fee: 'RM 5.90',
    status: 'active',
    orders: 654
  },
  {
    area: 'Subang Jaya',
    zones: ['SS12', 'SS13', 'SS15', 'USJ', 'Bandar Sunway'],
    deliveryTime: '20-30 min',
    fee: 'RM 4.90',
    status: 'active',
    orders: 723
  },
  {
    area: 'Ampang',
    zones: ['Ampang Point', 'Pandan Indah', 'Taman Shamelin'],
    deliveryTime: '25-35 min',
    fee: 'RM 5.90',
    status: 'limited',
    orders: 234
  },
  {
    area: 'Cyberjaya',
    zones: ['Cyberjaya', 'Putrajaya'],
    deliveryTime: 'Coming Soon',
    fee: 'TBA',
    status: 'coming-soon',
    orders: 0
  }
];

export function DeliveryAreaMap() {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [searchZone, setSearchZone] = useState('');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'limited':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'coming-soon':
        return <Clock className="w-4 h-4 text-[var(--neutral-500)]" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'limited':
        return 'Limited Hours';
      case 'coming-soon':
        return 'Coming Soon';
      default:
        return '';
    }
  };

  const filteredAreas = deliveryAreas.filter(area =>
    area.area.toLowerCase().includes(searchZone.toLowerCase()) ||
    area.zones.some(zone => zone.toLowerCase().includes(searchZone.toLowerCase()))
  );

  return (
    <section className="py-20 px-4 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-bold mb-4">
          Coverage Area <span className="text-[var(--neon-green)]">THEFMSMKT</span>
        </h2>
        <p className="text-[var(--neutral-400)] text-lg max-w-2xl mx-auto mb-8">
          Kami deliver ke area-area utama dalam Klang Valley. 
          Check area anda sekarang!
        </p>

        {/* Search Zone */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--neutral-400)]" />
            <input
              type="text"
              placeholder="Cari area atau zon anda..."
              value={searchZone}
              onChange={(e) => setSearchZone(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[var(--neutral-900)] border border-[var(--neutral-800)] rounded-xl focus:border-[var(--neon-green)] focus:outline-none transition-colors"
            />
          </div>
        </div>
      </motion.div>

      {/* Delivery Stats */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
      >
        <Card className="p-6 text-center border-[var(--neutral-800)]">
          <div className="w-16 h-16 bg-[var(--neon-green)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-[var(--neon-green)]" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">25+</h3>
          <p className="text-[var(--neutral-400)]">Areas Covered</p>
        </Card>

        <Card className="p-6 text-center border-[var(--neutral-800)]">
          <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-blue-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">15min</h3>
          <p className="text-[var(--neutral-400)]">Average Delivery</p>
        </Card>

        <Card className="p-6 text-center border-[var(--neutral-800)]">
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Truck className="w-8 h-8 text-green-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">3,750+</h3>
          <p className="text-[var(--neutral-400)]">Successful Deliveries</p>
        </Card>
      </motion.div>

      {/* Delivery Areas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAreas.map((area, index) => (
          <motion.div
            key={area.area}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Card 
              className={`p-6 cursor-pointer transition-all duration-300 hover:border-[var(--neon-green)]/50 hover:shadow-lg hover:shadow-[var(--neon-green)]/10 ${
                selectedArea === area.area ? 'border-[var(--neon-green)] shadow-lg shadow-[var(--neon-green)]/10' : 'border-[var(--neutral-800)]'
              }`}
              onClick={() => setSelectedArea(selectedArea === area.area ? null : area.area)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-white">{area.area}</h3>
                    {getStatusIcon(area.status)}
                  </div>
                  <p className="text-sm text-[var(--neutral-400)]">
                    {getStatusText(area.status)}
                  </p>
                </div>

                {area.status === 'active' && (
                  <div className="text-right">
                    <p className="text-[var(--neon-green)] font-bold">{area.deliveryTime}</p>
                    <p className="text-sm text-[var(--neutral-400)]">{area.fee}</p>
                  </div>
                )}
              </div>

              {selectedArea === area.area && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-[var(--neutral-800)] pt-4 mt-4"
                >
                  <h4 className="font-semibold text-white mb-2">Covered Zones:</h4>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {area.zones.map((zone) => (
                      <span
                        key={zone}
                        className="px-3 py-1 bg-[var(--neutral-800)] text-sm rounded-full text-[var(--neutral-300)]"
                      >
                        {zone}
                      </span>
                    ))}
                  </div>
                  
                  {area.orders > 0 && (
                    <p className="text-sm text-[var(--neutral-400)] mb-3">
                      {area.orders.toLocaleString()} orders delivered this month
                    </p>
                  )}

                  {area.status === 'active' && (
                    <Button className="w-full bg-[var(--neon-green)] text-black hover:bg-[var(--neon-green)]/90">
                      Order ke {area.area}
                    </Button>
                  )}

                  {area.status === 'coming-soon' && (
                    <Button variant="outline" className="w-full border-[var(--neutral-600)] text-[var(--neutral-400)]" disabled>
                      Notify Me When Available
                    </Button>
                  )}
                </motion.div>
              )}

              {area.status === 'limited' && (
                <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <p className="text-sm text-yellow-400">
                    ⚠️ Limited service hours: 11AM - 9PM only
                  </p>
                </div>
              )}
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredAreas.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <MapPin className="w-16 h-16 text-[var(--neutral-600)] mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-[var(--neutral-400)] mb-2">
            Area tidak dijumpai
          </h3>
          <p className="text-[var(--neutral-500)]">
            Cuba cari dengan nama area atau zon yang lain
          </p>
        </motion.div>
      )}

      {/* Coverage Expansion Notice */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-12 text-center"
      >
        <Card className="p-8 bg-gradient-to-r from-[var(--neutral-900)] to-[var(--neutral-800)] border-[var(--neutral-700)]">
          <h3 className="text-2xl font-bold text-white mb-4">
            Area anda tidak dalam senarai?
          </h3>
          <p className="text-[var(--neutral-400)] mb-6 max-w-2xl mx-auto">
            Kami sentiasa expand coverage area! Request area anda dan kami akan prioritize 
            berdasarkan demand. Be the first to know bila kami sampai area anda.
          </p>
          <Button className="bg-[var(--neon-green)] text-black hover:bg-[var(--neon-green)]/90 px-8 py-3">
            Request My Area
          </Button>
        </Card>
      </motion.div>
    </section>
  );
}
