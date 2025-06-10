import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useLogin } from '../../../hooks/Reservation/useLogin';
import { usePolicies } from '../../../hooks/Reservation/usePolicies';
import PrivacyPolicy from '../Policies/PrivacyPolicy';
import TermsConditions from '../Policies/TermsConditions';
import PolicyModal from '../../../components/Modal/PolicyModal';
import Input from '../../../components/Input/Input';
import Button from '../../../components/Button/Button';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import styles from './ReservationLogin.module.scss';

export default function ReservationLogin() {
  const {
    handlePhoneNumberChange,
    handleOpenReserveForm,
    closeReserveForm,
    reserveFormOpen,
    validateAndLoginWithResult,
    phoneNumber,
    loginCodeRequested,
    loginCode,
    setLoginCode,
    phoneNumberError,
    loginCodeError,
    error,
  } = useLogin();
  const {
    policies,
    conditions,
    handleOpenPolicy,
    handleOpenConditions,
    handleClosePolicy,
    handleCloseConditions,
  } = usePolicies();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const modalParam = searchParams.get('modal');

  useEffect(() => {
    if (modalParam === 'terms') {
      handleOpenConditions();
    } else if (modalParam === 'privacy') {
      handleOpenPolicy();
    }
  }, [modalParam, handleOpenConditions, handleOpenPolicy]);

  const [overlayVisible, setOverlayVisible] = useState(true);

  const handleLoginClick = async () => {
    const success = await validateAndLoginWithResult();
    if (success) {
      setOverlayVisible(false);
      setTimeout(() => {
        closeReserveForm();
      }, 300);
    }
  };

  const handleOpen = () => {
    setOverlayVisible(false);
    handleOpenReserveForm();
  };

  return (
    <div className={styles.reservationLogin}>
      <AnimatePresence>
        {overlayVisible && (
          <motion.div
            key="overlay-text"
            className={styles.overlay_text}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          >
            <div className={styles.overlay_text_container}>
              <div>
                <span>Maison de Lumière</span>
              </div>
              <div className={styles.reserve_button}>
                <Button onClick={handleOpen} className={styles.overlay_button}>
                  <p>Reserve</p>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence onExitComplete={() => navigate('/reservation')}>
        {reserveFormOpen && (
          <>
            {/* Overlay */}
            <motion.div
              key="overlay"
              className={styles.pageOverlay}
              initial={{ y: '-100%' }}
              animate={{ y: 0 }}
              exit={{ y: '-100%' }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
            />

            {/* Login Form */}
            <motion.div
              key="form"
              className={styles.formContainer}
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut', delay: 0.2 }}
            >
              <div className={styles.form}>
                <h2>Login</h2>

                <AnimatePresence mode="wait">
                  {!loginCodeRequested && (
                    <motion.div
                      key="phone-input"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <PhoneInput
                        country={'us'}
                        value={phoneNumber}
                        onChange={handlePhoneNumberChange}
                        onlyCountries={['us', 'sg']}
                        placeholder="Mobile No."
                        containerClass={styles.phoneInput__container}
                        inputClass={styles.phoneInput__input}
                        buttonClass={styles.phoneInput__button}
                      />
                    </motion.div>
                  )}

                  {loginCodeRequested && (
                    <motion.div
                      key="code-input"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Input
                        label=""
                        placeholder="Verification Code"
                        type="text"
                        value={loginCode}
                        onChange={e => setLoginCode(e.target.value)}
                        className={styles.codeInput}
                        inputClassName={styles.loginCodeInput}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <Button onClick={handleLoginClick} className={styles.login_button}>
                  {loginCodeRequested ? 'Verify Code' : 'Send Code'}
                </Button>

                {phoneNumberError && (
                  <div className="text-red-500 text-sm mt-2 font-bold" style={{ height: '1rem' }}>
                    {phoneNumberError}
                  </div>
                )}
                {loginCodeError && (
                  <div className="text-red-500 text-sm mt-2 font-bold" style={{ height: '1rem' }}>
                    {loginCodeError}
                  </div>
                )}
                {error && (
                  <div className="text-red-500 text-sm mt-2 font-bold" style={{ height: '1rem' }}>
                    {error}
                  </div>
                )}

                <div className={styles.special_links}>
                  <div className={styles.terms}>
                    <Button onClick={handleOpenConditions}>
                      <span>Terms & Conditions</span>
                    </Button>
                  </div>
                  <div className={styles.privacy}>
                    <Button onClick={handleOpenPolicy}>
                      <span>Privacy Policy</span>
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {policies && (
        <PolicyModal onClose={handleClosePolicy}>
          <PrivacyPolicy />
        </PolicyModal>
      )}
      {conditions && (
        <PolicyModal onClose={handleCloseConditions}>
          <TermsConditions />
        </PolicyModal>
      )}
    </div>
  );
}
