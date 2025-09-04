import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/Header';
import { 
  Heart, 
  Stethoscope, 
  Users, 
  MapPin, 
  Phone, 
  Clock, 
  Shield, 
  Star,
  CheckCircle,
  ArrowRight,
  Smartphone,
  Video,
  Calendar
} from 'lucide-react';

const LandingPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.1 } }
  };

  const scaleOnHover = {
    scale: 1.02,
    transition: { type: "spring", stiffness: 300 }
  };

  const stats = [
    { number: '10,000+', label: t('patientsServed'), icon: Users },
    { number: '500+', label: t('qualifiedDoctors'), icon: Stethoscope },
    { number: '50+', label: t('villagesServed'), icon: MapPin },
    { number: '24/7', label: t('emergencyService'), icon: Phone }
  ];

  const services = [
    {
      title: t('teleConsultation'),
      description: t('teleConsultationDesc'),
      icon: Video,
      color: 'bg-blue-500'
    },
    {
      title: t('appointmentBooking'),
      description: t('appointmentBookingDesc'),
      icon: Calendar,
      color: 'bg-green-500'
    },
    {
      title: t('medicineDelivery'),
      description: t('medicineDeliveryDesc'),
      icon: Heart,
      color: 'bg-purple-500'
    },
    {
      title: t('emergencyServiceTitle'),
      description: t('emergencyServiceDesc'),
      icon: Phone,
      color: 'bg-red-500'
    }
  ];

  const features = [
    t('hindiService'),
    t('affordableRates'),
    t('licensedDoctors'),
    t('secureplatform'),
    t('mobileFriendly'),
    t('support247')
  ];

  const testimonials = [
    {
      name: 'Ram Kumar',
      location: 'Rampur Village',
      text: t('testimonial1'),
      rating: 5
    },
    {
      name: 'Sita Devi',
      location: 'Krishnapur',
      text: t('testimonial2'),
      rating: 5
    },
    {
      name: 'Arun Sharma',
      location: 'Gopalganj',
      text: t('testimonial3'),
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <Header transparent />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-blue-600/10" />
        
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-24">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="text-center space-y-8"
          >
            <motion.div variants={fadeInUp} className="space-y-4">
              <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2">
                {t('landingHero')}
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                <span className="text-primary">{t('appName')}</span>
                <br />
                {t('landingTitle')}
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {t('landingSubtitle')}
                <br />
                <span className="text-primary font-semibold">{t('landingSubtitleHighlight')}</span>
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="h-14 px-8 text-lg font-semibold bg-gradient-to-r from-primary to-green-600 hover:from-primary-dark hover:to-green-700"
                onClick={() => navigate('/login')}
              >
                <Smartphone className="mr-2 h-5 w-5" />
                {t('getStarted')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-lg font-semibold border-2 border-primary text-primary hover:bg-primary hover:text-white"
                onClick={() => {
                  document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <Heart className="mr-2 h-5 w-5" />
                {t('viewServices')}
              </Button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-600" />
                <span>{t('secure')}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>{t('licensedDoctors')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span>{t('rating')}</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 opacity-20">
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Heart className="h-16 w-16 text-primary" />
          </motion.div>
        </div>
        
        <div className="absolute bottom-20 right-10 opacity-20">
          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Stethoscope className="h-20 w-20 text-blue-500" />
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={scaleOnHover}
                className="text-center"
              >
                <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <stat.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="text-3xl font-bold text-gray-900">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('ourServices')}
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('servicesSubtitle')}
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {services.map((service, index) => (
              <motion.div key={index} variants={fadeInUp} whileHover={scaleOnHover}>
                <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-0 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className={`${service.color} p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center`}>
                      <service.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">{service.title}</h3>
                    <p className="text-gray-600">{service.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-r from-primary/5 to-blue-600/5">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            <motion.div variants={fadeInUp} className="space-y-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {t('whyChoose')}
                </h2>
                <p className="text-xl text-gray-600">
                  {t('whyChooseSubtitle')}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </motion.div>
                ))}
              </div>

              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-green-600 hover:from-primary-dark hover:to-green-700"
                onClick={() => navigate('/login')}
              >
                {t('joinNow')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>

            <motion.div variants={fadeInUp} className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Smartphone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{t('mobileApp')}</h3>
                      <p className="text-sm text-gray-600">{t('mobileAppDesc')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="bg-green-100 p-3 rounded-full">
                      <Video className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{t('videoCall')}</h3>
                      <p className="text-sm text-gray-600">{t('videoCallDesc')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <Clock className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{t('instantService')}</h3>
                      <p className="text-sm text-gray-600">{t('instantServiceDesc')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('patientReviews')}
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-gray-600">
              {t('patientReviewsSubtitle')}
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div key={index} variants={fadeInUp} whileHover={scaleOnHover}>
                <Card className="h-full hover:shadow-lg transition-shadow duration-300 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-700 italic">"{testimonial.text}"</p>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.location}</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-blue-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="space-y-8"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-white">
              {t('startHealthJourney')}
            </motion.h2>
            
            <motion.p variants={fadeInUp} className="text-xl text-white/90">
              {t('registerIn2Minutes')}
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="h-14 px-8 text-lg font-semibold bg-white text-primary hover:bg-gray-100"
                onClick={() => navigate('/login')}
              >
                <Heart className="mr-2 h-5 w-5" />
                {t('registerNow')}
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-lg font-semibold border-2 border-white text-white hover:bg-white hover:text-primary"
                onClick={() => {
                  window.location.href = 'tel:108';
                }}
              >
                <Phone className="mr-2 h-5 w-5" />
                आपातकाल: 108
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold">{t('appName')}</h3>
              <p className="text-gray-400">
                {t('firstRuralPlatform')}
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">{t('services')}</h4>
              <ul className="space-y-2 text-gray-400">
                <li>{t('teleConsultation')}</li>
                <li>{t('appointmentBooking')}</li>
                <li>{t('medicineDelivery')}</li>
                <li>{t('emergencyServiceTitle')}</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">{t('contact')}</h4>
              <ul className="space-y-2 text-gray-400">
                <li>{t('helpline')}</li>
                <li>Emergency: 108</li>
                <li>{t('email')}</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">{t('legal')}</h4>
              <ul className="space-y-2 text-gray-400">
                <li>{t('privacyPolicy')}</li>
                <li>{t('termsConditions')}</li>
                <li>{t('refundPolicy')}</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 {t('appName')}. {t('allRightsReserved')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;