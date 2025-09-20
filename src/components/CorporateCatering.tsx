import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Users, 
  Calendar, 
  Clock, 
  MapPin, 
  Calculator,
  FileText,
  Phone,
  Mail,
  CheckCircle,
  Star,
  Package,
  Truck,
  Shield,
  Plus,
  Minus
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Calendar as CalendarComponent } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { toast } from 'sonner';

interface CateringPackage {
  id: string;
  name: string;
  description: string;
  minGuests: number;
  maxGuests: number;
  pricePerPerson: number;
  items: string[];
  features: string[];
  popular: boolean;
}

interface CateringOrder {
  package: CateringPackage;
  guestCount: number;
  eventDate: Date;
  eventTime: string;
  location: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  specialRequests: string;
  additionalServices: string[];
}

const cateringPackages: CateringPackage[] = [
  {
    id: 'corporate-basic',
    name: 'Corporate Basic',
    description: 'Perfect for small office gatherings and meetings',
    minGuests: 10,
    maxGuests: 30,
    pricePerPerson: 12.90,
    items: [
      '2 varieties of THEFMSMKT corn (Chocolate & Cheddar)',
      'Bottled water',
      'Napkins and serving utensils',
      'Basic setup service'
    ],
    features: [
      'Free delivery within KL',
      'Setup included',
      'Eco-friendly packaging'
    ],
    popular: false
  },
  {
    id: 'corporate-premium',
    name: 'Corporate Premium',
    description: 'Ideal for company events and celebrations',
    minGuests: 25,
    maxGuests: 100,
    pricePerPerson: 18.90,
    items: [
      '4 varieties of THEFMSMKT corn (All flavors)',
      'Fresh fruit platter',
      'Assorted beverages',
      'Premium presentation setup',
      'Dedicated service staff'
    ],
    features: [
      'Free delivery within Klang Valley',
      'Professional setup & cleanup',
      'Real-time order tracking',
      'Customizable menu options'
    ],
    popular: true
  },
  {
    id: 'corporate-deluxe',
    name: 'Corporate Deluxe',
    description: 'Ultimate catering experience for large corporate events',
    minGuests: 50,
    maxGuests: 300,
    pricePerPerson: 25.90,
    items: [
      '4 varieties of THEFMSMKT corn (All flavors)',
      'Gourmet side dishes',
      'Premium beverage selection',
      'Fresh fruit & dessert station',
      'Complete table setup',
      'Professional catering team',
      'Live cooking station (optional)'
    ],
    features: [
      'Free delivery nationwide',
      'Full-service catering team',
      'Custom branding options',
      'Event coordination support',
      '24/7 customer support',
      'Flexible payment terms'
    ],
    popular: false
  }
];

const additionalServices = [
  { id: 'custom-branding', name: 'Custom Branding & Packaging', price: 299 },
  { id: 'live-cooking', name: 'Live Cooking Station', price: 499 },
  { id: 'extended-service', name: 'Extended Service Hours', price: 199 },
  { id: 'dietary-accommodations', name: 'Special Dietary Accommodations', price: 149 },
  { id: 'photography', name: 'Event Photography', price: 399 },
  { id: 'cleanup-service', name: 'Extended Cleanup Service', price: 129 }
];

export function CorporateCatering() {
  const [step, setStep] = useState<'packages' | 'details' | 'summary' | 'confirmation'>('packages');
  const [selectedPackage, setSelectedPackage] = useState<CateringPackage | null>(null);
  const [order, setOrder] = useState<Partial<CateringOrder>>({
    guestCount: 20,
    eventTime: '12:00',
    additionalServices: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const handlePackageSelect = (pkg: CateringPackage) => {
    setSelectedPackage(pkg);
    setOrder(prev => ({
      ...prev,
      package: pkg,
      guestCount: Math.max(prev.guestCount || pkg.minGuests, pkg.minGuests)
    }));
    setStep('details');
  };

  const calculateTotal = () => {
    if (!selectedPackage || !order.guestCount) return 0;
    
    const packageTotal = selectedPackage.pricePerPerson * order.guestCount;
    const servicesTotal = (order.additionalServices || []).reduce((total, serviceId) => {
      const service = additionalServices.find(s => s.id === serviceId);
      return total + (service?.price || 0);
    }, 0);
    
    return packageTotal + servicesTotal;
  };

  const handleSubmitOrder = async () => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In production, send order to your backend
      const cateringOrder = {
        ...order,
        package: selectedPackage,
        total: calculateTotal(),
        timestamp: new Date().toISOString()
      };
      
      console.log('Corporate catering order:', cateringOrder);
      
      setStep('confirmation');
      toast.success('Corporate catering request submitted successfully!');
    } catch (error) {
      console.error('Error submitting catering order:', error);
      toast.error('Failed to submit catering request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleAdditionalService = (serviceId: string) => {
    setOrder(prev => ({
      ...prev,
      additionalServices: prev.additionalServices?.includes(serviceId)
        ? prev.additionalServices.filter(id => id !== serviceId)
        : [...(prev.additionalServices || []), serviceId]
    }));
  };

  const renderPackageSelection = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">Corporate Catering Packages</h2>
        <p className="text-[var(--neutral-400)] max-w-2xl mx-auto">
          Elevate your corporate events with THEFMSMKT's premium gourmet corn catering. 
          Perfect for meetings, celebrations, and special occasions.
        </p>
      </div>

      {/* Package Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4 text-center bg-[var(--neutral-800)] border-[var(--neutral-700)]">
          <Truck className="w-8 h-8 text-[var(--neon-green)] mx-auto mb-2" />
          <h4 className="font-medium text-white mb-1">Free Delivery</h4>
          <p className="text-xs text-[var(--neutral-400)]">Within Klang Valley</p>
        </Card>
        <Card className="p-4 text-center bg-[var(--neutral-800)] border-[var(--neutral-700)]">
          <Shield className="w-8 h-8 text-[var(--neon-green)] mx-auto mb-2" />
          <h4 className="font-medium text-white mb-1">Quality Assured</h4>
          <p className="text-xs text-[var(--neutral-400)]">Fresh & premium</p>
        </Card>
        <Card className="p-4 text-center bg-[var(--neutral-800)] border-[var(--neutral-700)]">
          <Users className="w-8 h-8 text-[var(--neon-green)] mx-auto mb-2" />
          <h4 className="font-medium text-white mb-1">Professional Service</h4>
          <p className="text-xs text-[var(--neutral-400)]">Dedicated team</p>
        </Card>
        <Card className="p-4 text-center bg-[var(--neutral-800)] border-[var(--neutral-700)]">
          <Clock className="w-8 h-8 text-[var(--neon-green)] mx-auto mb-2" />
          <h4 className="font-medium text-white mb-1">On-Time Delivery</h4>
          <p className="text-xs text-[var(--neutral-400)]">Guaranteed punctual</p>
        </Card>
      </div>

      {/* Package Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {cateringPackages.map((pkg) => (
          <motion.div
            key={pkg.id}
            whileHover={{ scale: 1.02 }}
            className="relative"
          >
            {pkg.popular && (
              <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-10 bg-[var(--neon-green)] text-black">
                <Star className="w-3 h-3 mr-1" />
                Most Popular
              </Badge>
            )}
            
            <Card className={`p-6 h-full ${pkg.popular ? 'border-[var(--neon-green)] bg-[var(--neon-green)]/5' : 'border-[var(--neutral-700)]'}`}>
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2">{pkg.name}</h3>
                <p className="text-[var(--neutral-400)] text-sm mb-4">{pkg.description}</p>
                <div className="text-center">
                  <span className="text-3xl font-bold text-[var(--neon-green)]">
                    RM {pkg.pricePerPerson.toFixed(2)}
                  </span>
                  <span className="text-[var(--neutral-400)]">/person</span>
                </div>
                <p className="text-xs text-[var(--neutral-500)] mt-1">
                  {pkg.minGuests}-{pkg.maxGuests} guests
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="font-medium text-white mb-2 flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Includes:
                  </h4>
                  <ul className="space-y-1 text-sm">
                    {pkg.items.map((item, index) => (
                      <li key={index} className="text-[var(--neutral-400)] flex items-start gap-2">
                        <CheckCircle className="w-3 h-3 text-[var(--neon-green)] mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-white mb-2">Features:</h4>
                  <ul className="space-y-1 text-sm">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="text-[var(--neutral-400)] flex items-start gap-2">
                        <CheckCircle className="w-3 h-3 text-[var(--neon-green)] mt-0.5 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <Button
                onClick={() => handlePackageSelect(pkg)}
                className={`w-full ${pkg.popular 
                  ? 'bg-[var(--neon-green)] text-black hover:bg-[var(--neon-green)]/90' 
                  : 'bg-[var(--neutral-800)] text-white hover:bg-[var(--neutral-700)]'
                }`}
              >
                Select Package
              </Button>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Contact Information */}
      <Card className="p-6 bg-[var(--neutral-800)] border-[var(--neutral-700)]">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-white mb-2">Need a Custom Solution?</h3>
          <p className="text-[var(--neutral-400)] mb-4">
            Contact our corporate catering specialists for customized packages and enterprise solutions.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex items-center gap-2 text-[var(--neutral-300)]">
              <Phone className="w-4 h-4" />
              <span>+60 3-1234-5678</span>
            </div>
            <div className="flex items-center gap-2 text-[var(--neutral-300)]">
              <Mail className="w-4 h-4" />
              <span>catering@thefmsmkt.com</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderOrderDetails = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Event Details</h2>
        <Button
          onClick={() => setStep('packages')}
          variant="outline"
          size="sm"
          className="border-[var(--neutral-700)]"
        >
          Change Package
        </Button>
      </div>

      {/* Selected Package Summary */}
      {selectedPackage && (
        <Card className="p-4 bg-[var(--neon-green)]/5 border-[var(--neon-green)]/20">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-white">{selectedPackage.name}</h3>
              <p className="text-sm text-[var(--neutral-400)]">{selectedPackage.description}</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-[var(--neon-green)]">
                RM {selectedPackage.pricePerPerson.toFixed(2)}/person
              </div>
              <div className="text-xs text-[var(--neutral-400)]">
                {selectedPackage.minGuests}-{selectedPackage.maxGuests} guests
              </div>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Event Information */}
        <Card className="p-6">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Event Information
          </h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="guestCount">Number of Guests</Label>
              <div className="flex items-center gap-2 mt-1">
                <Button
                  onClick={() => setOrder(prev => ({
                    ...prev,
                    guestCount: Math.max((prev.guestCount || 0) - 5, selectedPackage?.minGuests || 10)
                  }))}
                  variant="outline"
                  size="sm"
                  className="p-2"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <Input
                  id="guestCount"
                  type="number"
                  value={order.guestCount || ''}
                  onChange={(e) => setOrder(prev => ({
                    ...prev,
                    guestCount: Math.max(parseInt(e.target.value) || 0, selectedPackage?.minGuests || 10)
                  }))}
                  min={selectedPackage?.minGuests}
                  max={selectedPackage?.maxGuests}
                  className="text-center"
                />
                <Button
                  onClick={() => setOrder(prev => ({
                    ...prev,
                    guestCount: Math.min((prev.guestCount || 0) + 5, selectedPackage?.maxGuests || 300)
                  }))}
                  variant="outline"
                  size="sm"
                  className="p-2"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-[var(--neutral-500)] mt-1">
                Range: {selectedPackage?.minGuests}-{selectedPackage?.maxGuests} guests
              </p>
            </div>

            <div>
              <Label htmlFor="eventDate">Event Date</Label>
              <Popover open={showCalendar} onOpenChange={setShowCalendar}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal border-[var(--neutral-700)]"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {order.eventDate ? order.eventDate.toDateString() : 'Select date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={order.eventDate}
                    onSelect={(date) => {
                      setOrder(prev => ({ ...prev, eventDate: date }));
                      setShowCalendar(false);
                    }}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label htmlFor="eventTime">Event Time</Label>
              <Select value={order.eventTime} onValueChange={(value) => setOrder(prev => ({ ...prev, eventTime: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }, (_, i) => {
                    const hour = i.toString().padStart(2, '0');
                    return (
                      <SelectItem key={`${hour}:00`} value={`${hour}:00`}>
                        {`${hour}:00`}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="location">Event Location</Label>
              <Input
                id="location"
                placeholder="Enter full address"
                value={order.location || ''}
                onChange={(e) => setOrder(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>
          </div>
        </Card>

        {/* Company Information */}
        <Card className="p-6">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Company Information
          </h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                placeholder="Your company name"
                value={order.companyName || ''}
                onChange={(e) => setOrder(prev => ({ ...prev, companyName: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="contactPerson">Contact Person</Label>
              <Input
                id="contactPerson"
                placeholder="Your full name"
                value={order.contactPerson || ''}
                onChange={(e) => setOrder(prev => ({ ...prev, contactPerson: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={order.email || ''}
                onChange={(e) => setOrder(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="+60 12-345-6789"
                value={order.phone || ''}
                onChange={(e) => setOrder(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="specialRequests">Special Requests</Label>
              <Textarea
                id="specialRequests"
                placeholder="Any special dietary requirements, setup preferences, or additional notes..."
                value={order.specialRequests || ''}
                onChange={(e) => setOrder(prev => ({ ...prev, specialRequests: e.target.value }))}
                rows={3}
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Additional Services */}
      <Card className="p-6">
        <h3 className="font-semibold text-white mb-4">Additional Services</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {additionalServices.map((service) => (
            <div
              key={service.id}
              className={`
                p-4 rounded-lg border cursor-pointer transition-all
                ${order.additionalServices?.includes(service.id)
                  ? 'border-[var(--neon-green)] bg-[var(--neon-green)]/5'
                  : 'border-[var(--neutral-700)] hover:border-[var(--neutral-600)]'
                }
              `}
              onClick={() => toggleAdditionalService(service.id)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-white">{service.name}</h4>
                  <p className="text-sm text-[var(--neon-green)]">+RM {service.price}</p>
                </div>
                <div className={`
                  w-5 h-5 rounded border-2 flex items-center justify-center
                  ${order.additionalServices?.includes(service.id)
                    ? 'border-[var(--neon-green)] bg-[var(--neon-green)]'
                    : 'border-[var(--neutral-600)]'
                  }
                `}>
                  {order.additionalServices?.includes(service.id) && (
                    <CheckCircle className="w-3 h-3 text-black" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Total and Action */}
      <Card className="p-6 bg-[var(--neutral-800)] border-[var(--neutral-700)]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white">Estimated Total</h3>
            <p className="text-sm text-[var(--neutral-400)]">
              {order.guestCount} guests × RM {selectedPackage?.pricePerPerson.toFixed(2)}
              {(order.additionalServices?.length || 0) > 0 && ' + additional services'}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-[var(--neon-green)]">
              RM {calculateTotal().toFixed(2)}
            </div>
            <p className="text-xs text-[var(--neutral-500)]">Final quote will be provided</p>
          </div>
        </div>
        
        <Button
          onClick={() => setStep('summary')}
          className="w-full bg-[var(--neon-green)] text-black hover:bg-[var(--neon-green)]/90"
          disabled={!order.companyName || !order.contactPerson || !order.email || !order.eventDate}
        >
          Review Order
        </Button>
      </Card>
    </div>
  );

  const renderOrderSummary = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Order Summary</h2>
        <Button
          onClick={() => setStep('details')}
          variant="outline"
          size="sm"
          className="border-[var(--neutral-700)]"
        >
          Edit Details
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Details */}
        <Card className="p-6">
          <h3 className="font-semibold text-white mb-4">Order Details</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-[var(--neutral-400)]">Package:</span>
              <span className="text-white font-medium">{selectedPackage?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--neutral-400)]">Guests:</span>
              <span className="text-white">{order.guestCount} people</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--neutral-400)]">Event Date:</span>
              <span className="text-white">{order.eventDate?.toDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--neutral-400)]">Event Time:</span>
              <span className="text-white">{order.eventTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--neutral-400)]">Location:</span>
              <span className="text-white text-right max-w-48 truncate" title={order.location}>
                {order.location}
              </span>
            </div>
          </div>
        </Card>

        {/* Company Details */}
        <Card className="p-6">
          <h3 className="font-semibold text-white mb-4">Company Details</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-[var(--neutral-400)]">Company:</span>
              <span className="text-white">{order.companyName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--neutral-400)]">Contact:</span>
              <span className="text-white">{order.contactPerson}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--neutral-400)]">Email:</span>
              <span className="text-white">{order.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--neutral-400)]">Phone:</span>
              <span className="text-white">{order.phone}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Additional Services */}
      {(order.additionalServices?.length || 0) > 0 && (
        <Card className="p-6">
          <h3 className="font-semibold text-white mb-4">Additional Services</h3>
          <div className="space-y-2">
            {order.additionalServices?.map((serviceId) => {
              const service = additionalServices.find(s => s.id === serviceId);
              return service ? (
                <div key={serviceId} className="flex justify-between text-sm">
                  <span className="text-[var(--neutral-400)]">{service.name}</span>
                  <span className="text-white">+RM {service.price}</span>
                </div>
              ) : null;
            })}
          </div>
        </Card>
      )}

      {/* Special Requests */}
      {order.specialRequests && (
        <Card className="p-6">
          <h3 className="font-semibold text-white mb-4">Special Requests</h3>
          <p className="text-[var(--neutral-400)] text-sm">{order.specialRequests}</p>
        </Card>
      )}

      {/* Total and Submit */}
      <Card className="p-6 bg-[var(--neon-green)]/5 border-[var(--neon-green)]/20">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-white mb-2">Estimated Total</h3>
          <div className="text-3xl font-bold text-[var(--neon-green)]">
            RM {calculateTotal().toFixed(2)}
          </div>
          <p className="text-sm text-[var(--neutral-400)] mt-2">
            * Final pricing will be confirmed based on specific requirements
          </p>
        </div>

        <Button
          onClick={handleSubmitOrder}
          disabled={isSubmitting}
          className="w-full bg-[var(--neon-green)] text-black hover:bg-[var(--neon-green)]/90"
        >
          {isSubmitting ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-black border-t-transparent rounded-full mr-2"
              />
              Submitting Request...
            </>
          ) : (
            'Submit Catering Request'
          )}
        </Button>
      </Card>
    </div>
  );

  const renderConfirmation = () => (
    <div className="text-center space-y-6 py-8">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.6 }}
      >
        <CheckCircle className="w-20 h-20 text-[var(--neon-green)] mx-auto mb-4" />
      </motion.div>
      
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Request Submitted Successfully!</h2>
        <p className="text-[var(--neutral-400)] max-w-md mx-auto">
          Thank you for choosing THEFMSMKT Corporate Catering. Our team will contact you within 24 hours to confirm details and provide a final quote.
        </p>
      </div>

      <Card className="p-6 bg-[var(--neutral-800)] border-[var(--neutral-700)] max-w-md mx-auto">
        <h3 className="font-semibold text-white mb-3">What's Next?</h3>
        <div className="space-y-2 text-sm text-left">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[var(--neon-green)] rounded-full"></div>
            <span className="text-[var(--neutral-400)]">Review and confirmation call within 24 hours</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[var(--neon-green)] rounded-full"></div>
            <span className="text-[var(--neutral-400)]">Final quote and contract preparation</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[var(--neon-green)] rounded-full"></div>
            <span className="text-[var(--neutral-400)]">Event preparation and delivery coordination</span>
          </div>
        </div>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          onClick={() => {
            setStep('packages');
            setSelectedPackage(null);
            setOrder({ guestCount: 20, eventTime: '12:00', additionalServices: [] });
          }}
          variant="outline"
          className="border-[var(--neutral-700)]"
        >
          New Catering Request
        </Button>
        <Button
          onClick={() => window.location.href = 'tel:+60312345678'}
          className="bg-[var(--neon-green)] text-black hover:bg-[var(--neon-green)]/90"
        >
          Call Us Now
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--brand-black)] py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {['packages', 'details', 'summary', 'confirmation'].map((stepName, index) => (
              <div key={stepName} className="flex items-center">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${(step === stepName || (['details', 'summary', 'confirmation'].includes(step) && index < ['packages', 'details', 'summary', 'confirmation'].indexOf(step)))
                    ? 'bg-[var(--neon-green)] text-black' 
                    : 'bg-[var(--neutral-800)] text-[var(--neutral-400)]'
                  }
                `}>
                  {index + 1}
                </div>
                {index < 3 && (
                  <div className={`
                    w-12 h-0.5 mx-2
                    ${(['details', 'summary', 'confirmation'].includes(step) && index < ['packages', 'details', 'summary', 'confirmation'].indexOf(step))
                      ? 'bg-[var(--neon-green)]' 
                      : 'bg-[var(--neutral-800)]'
                    }
                  `} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {step === 'packages' && renderPackageSelection()}
            {step === 'details' && renderOrderDetails()}
            {step === 'summary' && renderOrderSummary()}
            {step === 'confirmation' && renderConfirmation()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
