import { Phone, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

interface EmergencyButtonProps {
  onClick?: () => void;
  className?: string;
}

export function EmergencyButton({ onClick, className = '' }: EmergencyButtonProps) {
  const { t } = useTranslation();

  const handleEmergencyClick = () => {
    // In a real app, this would trigger emergency services
    if (onClick) {
      onClick();
    } else {
      // Default emergency action - could dial emergency number
      window.location.href = 'tel:108'; // 108 is India's emergency number
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleEmergencyClick}
      className={`btn-emergency w-full flex items-center justify-center gap-3 ${className}`}
      aria-label={t('emergencyCall')}
    >
      <div className="relative">
        <Phone className="h-6 w-6" />
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [1, 0.7, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-1 -right-1"
        >
          <AlertTriangle className="h-4 w-4 text-yellow-300" />
        </motion.div>
      </div>
      <span className="text-rural-lg font-semibold">{t('emergency')}</span>
    </motion.button>
  );
}