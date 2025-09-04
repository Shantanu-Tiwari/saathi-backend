import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// English translations only
const englishTranslations = {
  translation: {
    // Navigation & App
    appName: 'Sehat Saathi',
    appTagline: 'Your Trusted Healthcare Companion',
    
    // Landing Page
    landingHero: 'India\'s First Rural Healthcare Platform',
    landingTitle: 'Your Trusted Healthcare Companion',
    landingSubtitle: 'Get city-like treatment while sitting in the village. Consult qualified doctors from home.',
    landingSubtitleHighlight: 'Affordable, Safe and Convenient.',
    getStarted: 'Get Started Now',
    viewServices: 'View Services',
    secure: '100% Secure',
    licensedDoctors: 'Licensed Doctors',
    rating: '4.8/5 Rating',
    
    // Stats
    patientsServed: 'Patients Served',
    qualifiedDoctors: 'Qualified Doctors',
    villagesServed: 'Villages Served',
    emergencyService: 'Emergency Service',
    
    // Services
    ourServices: 'Our Services',
    servicesSubtitle: 'Modern technology with traditional care',
    teleConsultation: 'Tele-Consultation',
    teleConsultationDesc: 'Talk to doctor from home',
    appointmentBooking: 'Appointment Booking',
    appointmentBookingDesc: 'Book appointments easily',
    medicineDelivery: 'Medicine Delivery',
    medicineDeliveryDesc: 'Medicines delivered to your home',
    emergencyServiceTitle: 'Emergency Service',
    emergencyServiceDesc: '24/7 emergency assistance',
    
    // Features
    whyChoose: 'Why Choose Sehat Saathi?',
    whyChooseSubtitle: 'We have solution for all your health problems',
    hindiService: 'Service in Hindi',
    affordableRates: 'Affordable Rates',
    mobileFriendly: 'Mobile Friendly',
    support247: '24/7 Support',
    secureplatform: 'Secure Platform',
    joinNow: 'Join Now',
    
    // App Features
    mobileApp: 'Mobile App',
    mobileAppDesc: 'Anywhere, Anytime',
    videoCall: 'Video Call',
    videoCallDesc: 'Direct talk with doctor',
    instantService: 'Instant Service',
    instantServiceDesc: 'Response in 5 minutes',
    
    // Testimonials
    patientReviews: 'Patient Reviews',
    patientReviewsSubtitle: 'Stories of thousands of happy patients',
    testimonial1: 'Got treatment from home with Sehat Saathi. Excellent service.',
    testimonial2: 'Doctors are very good and explain things well.',
    testimonial3: 'Got immediate help in emergency. Thank you Sehat Saathi.',
    
    // CTA
    startHealthJourney: 'Start Your Health Journey Today',
    registerIn2Minutes: 'Register in just 2 minutes and get excellent healthcare service',
    registerNow: 'Register Now',
    
    // Footer
    firstRuralPlatform: 'India\'s First Rural Healthcare Platform',
    services: 'Services',
    contact: 'Contact',
    helpline: 'Helpline: 1800-XXX-XXXX',
    email: 'Email: help@sehatsaathi.com',
    legal: 'Legal',
    privacyPolicy: 'Privacy Policy',
    termsConditions: 'Terms & Conditions',
    refundPolicy: 'Refund Policy',
    allRightsReserved: 'All rights reserved.',
    
    // Authentication
    loginWithOTP: 'Login with OTP',
    patient: 'Patient',
    findDoctor: 'Find Doctor',
    myProfile: 'My Profile',
    noUpcomingAppointments: 'No upcoming appointments',
    healthTip1: 'Drink 8-10 glasses of water daily',
    healthTip2: 'Walk for 30 minutes daily',
    healthTip3: 'Eat meals on time',
    healthTip4: 'Get adequate sleep (7-8 hours)',
    todayAppointmentsCount: 'You have {{count}} appointments today',
    waiting: 'Waiting',
    upcoming: 'Upcoming',
    enterMobileNumber: 'Enter Mobile Number',
    sendOTP: 'Send OTP',
    enterOTP: 'Enter OTP',
    verifyOTP: 'Verify OTP',
    resendOTP: 'Resend OTP',
    otpSentTo: 'OTP sent to',
    
    // Dashboard
    welcomeBack: 'Welcome Back',
    todaysAppointments: 'Today\'s Appointments',
    quickActions: 'Quick Actions',
    emergency: 'Emergency',
    bookAppointment: 'Book Appointment',
    viewPrescriptions: 'View Prescriptions',
    findPharmacy: 'Find Pharmacy',
    healthTips: 'Health Tips',
    
    // Appointments
    appointments: 'Appointments',
    upcomingAppointments: 'Upcoming Appointments',
    pastAppointments: 'Past Appointments',
    bookNewAppointment: 'Book New Appointment',
    selectDoctor: 'Select Doctor',
    selectDate: 'Select Date',
    selectTime: 'Select Time',
    appointmentBooked: 'Appointment Booked',
    appointmentDetails: 'Appointment Details',
    
    // Doctor
    doctor: 'Doctor',
    doctors: 'Doctors',
    specialist: 'Specialist',
    generalPhysician: 'General Physician',
    pediatrician: 'Pediatrician',
    gynecologist: 'Gynecologist',
    experience: 'Experience',
    consultation: 'Consultation',
    consultationFee: 'Consultation Fee',
    available: 'Available',
    unavailable: 'Unavailable',
    
    // Pharmacy
    pharmacy: 'Pharmacy',
    medicines: 'Medicines',
    prescriptions: 'Prescriptions',
    orderMedicines: 'Order Medicines',
    homeDelivery: 'Home Delivery',
    inStock: 'In Stock',
    outOfStock: 'Out of Stock',
    
    // Emergency
    emergencyCall: 'Emergency Call',
    emergencyContact: 'Emergency Contact',
    callAmbulance: 'Call Ambulance',
    nearestHospital: 'Nearest Hospital',
    
    // Health
    symptoms: 'Symptoms',
    describe: 'Describe',
    fever: 'Fever',
    cough: 'Cough',
    headache: 'Headache',
    stomachache: 'Stomach ache',
    
    // Common actions
    submit: 'Submit',
    cancel: 'Cancel',
    confirm: 'Confirm',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    back: 'Back',
    next: 'Next',
    close: 'Close',
    
    // Status
    confirmed: 'Confirmed',
    pending: 'Pending',
    cancelled: 'Cancelled',
    completed: 'Completed',
    
    // Time
    today: 'Today',
    tomorrow: 'Tomorrow',
    yesterday: 'Yesterday',
    morning: 'Morning',
    afternoon: 'Afternoon',
    evening: 'Evening',
    night: 'Night',
    
    // Connectivity
    online: 'Online',
    offline: 'Offline',
    connecting: 'Connecting',
    connectionLost: 'Connection Lost',
    retry: 'Retry'
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: englishTranslations
    },
    fallbackLng: 'en',
    lng: 'en',
    
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;