import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import { useStripePayment } from '../../../../hooks/Reservation/useStripePayment';
import { Checkbox } from '../../../../components/Checkbox/checkbox';
import { useNavigateToHome } from '../../../../hooks/Reservation/useNavigateToHome';
import NavigationButtons from '../../../../components/NavigationButtons/NavigationButtons';
import Modal from '../../../../components/Modal/Modal';
import Summary from '../Summary/Summary';
import styles from './PaymentForm.module.scss';

export default function PaymentForm({ reservationData }: { reservationData: any }) {
  const navigate = useNavigate();
  const { handleNavigateToHome } = useNavigateToHome();
  const {
    showModal,
    cardHolderName,
    setCardHolderName,
    handleFormSubmit,
    errorMessage,
    isChecked,
    setIsChecked,
    cardHolderError,
    cardNumberError,
    expiryError,
    cvcError,
    setCardHolderError,
    setCardNumberError,
    setExpiryError,
    setCvcError,
    setCardNumberComplete,
    setExpiryComplete,
    setCvcComplete,
    setErrorMessage,
  } = useStripePayment(reservationData);

  const elementStyle = {
    base: {
      color: '#fff',
      fontSize: '15px',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  };

  return (
    <motion.div
      className={styles.paymentForm__container}
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.4 }}
    >
      <div className={styles.paymentForm}>
        {/* Left Side */}
        <div className={styles.left__paymentForm}>
          <div className={styles.paymentNote}>
            <span>
              <strong>Note:</strong> Deposit of $100 is required to reserve
            </span>
          </div>

          {/* Card Holder Name */}
          <div className={styles.relativeContainer}>
            <label className={styles.paymentForm__label}>
              Cardholder Name:
              <input
                type="text"
                value={cardHolderName}
                onChange={e => {
                  setCardHolderName(e.target.value);
                  if (e.target.value.trim() !== '') {
                    setCardHolderError('');
                  }
                }}
                placeholder="Cardholder Name"
                required
                className={styles.paymentForm__input}
              />
            </label>
            {cardHolderError && <p className={styles.error}>{cardHolderError}</p>}
          </div>

          {/* Card Number */}
          <div className={styles.relativeContainer}>
            <label className={styles.paymentForm__label}>
              Card Number:
              <div className={styles.paymentForm__input}>
                <CardNumberElement
                  options={{ style: elementStyle }}
                  onChange={event => {
                    if (event.error) {
                      setCardNumberError(event.error.message);
                    } else {
                      setCardNumberError('');
                    }
                    setCardNumberComplete(event.complete);
                  }}
                />
              </div>
            </label>
            {cardNumberError && <p className={styles.error}>{cardNumberError}</p>}
          </div>

          {/* Expiration Date and CVC */}
          <div className={styles.expiryDate__cvc}>
            <div className={styles.relativeContainer}>
              <label className={styles.paymentForm__label}>
                Expiration Date:
                <div className={styles.paymentForm__input}>
                  <CardExpiryElement
                    options={{ style: elementStyle }}
                    onChange={event => {
                      if (event.error) {
                        setExpiryError(event.error.message);
                      } else {
                        setExpiryError('');
                      }
                      setExpiryComplete(event.complete);
                    }}
                  />
                </div>
              </label>
              {expiryError && <p className={styles.error}>{expiryError}</p>}
            </div>
            <div className={styles.relativeContainer}>
              <label className={styles.paymentForm__label}>
                Security Code:
                <div className={styles.paymentForm__input}>
                  <CardCvcElement
                    options={{ style: elementStyle }}
                    onChange={event => {
                      if (event.error) {
                        setCvcError(event.error.message);
                      } else {
                        setCvcError('');
                      }
                      setCvcComplete(event.complete);
                    }}
                  />
                </div>
              </label>
              {cvcError && <p className={styles.error}>{cvcError}</p>}
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className={styles.right__paymentForm}>
          <Summary reservationData={reservationData} />
          <div className={styles.termsAndConditionsContainer}>
            <div className={styles.termsAndConditions}>
              <Checkbox
                checked={isChecked}
                onCheckedChange={checked => {
                  const isCheckedValue = Boolean(checked);
                  setIsChecked(isCheckedValue);

                  // Clear the error message if the checkbox is checked
                  if (isCheckedValue) {
                    setErrorMessage('');
                  }
                }}
              />

              <span>Terms and Conditions</span>
            </div>
            {errorMessage && <p className={styles.error}>{errorMessage}</p>}
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className={styles.navigationButtons}>
        <NavigationButtons
          navigateNext={handleFormSubmit}
          handleNavigateToHome={handleNavigateToHome}
          placeholder="Reserve"
        />
      </div>

      <>
        {showModal && (
          <Modal
            first={false}
            title="Session Expired"
            message="Your session has expired. Please log in again."
            onConfirm={() => navigate('/', { replace: true })}
          />
        )}
      </>
    </motion.div>
  );
}
