import { useState } from 'react';
import { useStripe, useElements, CardNumberElement } from '@stripe/react-stripe-js';
import { verifyReservationToken } from '../../services/Reservation/auth';
import { usePlaceReservationHold } from './usePlaceReservationHold';
import { useFinalizeReservation } from './useFinalizeReservation';

export const useStripePayment = (reservationData: any) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isReservationHeld, setIsReservationHeld] = useState(false);

  const [cardHolderName, setCardHolderName] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [cardHolderError, setCardHolderError] = useState('');
  const [cardNumberError, setCardNumberError] = useState('');
  const [expiryError, setExpiryError] = useState('');
  const [cvcError, setCvcError] = useState('');

  const [cardNumberComplete, setCardNumberComplete] = useState(false);
  const [expiryComplete, setExpiryComplete] = useState(false);
  const [cvcComplete, setCvcComplete] = useState(false);

  const stripe = useStripe();
  const elements = useElements();
  const { finalizeReservation } = useFinalizeReservation();
  const { holdReservation } = usePlaceReservationHold();

  const validateCardDetails = () => {
    let isValid = true;

    if (!cardNumberComplete) {
      setCardNumberError('Card number is invalid or incomplete.');
      isValid = false;
    } else {
      setCardNumberError('');
    }

    if (!expiryComplete) {
      setExpiryError('Expiration date is invalid or incomplete.');
      isValid = false;
    } else {
      setExpiryError('');
    }

    if (!cvcComplete) {
      setCvcError('CVC is invalid or incomplete.');
      isValid = false;
    } else {
      setCvcError('');
    }

    return isValid;
  };

  const handleFormSubmit = async () => {
    let valid = true;

    // Validate cardholder name
    if (!cardHolderName.trim()) {
      setCardHolderError('Cardholder name is required.');
      valid = false;
    } else {
      setCardHolderError('');
    }

    // Validate Terms checkbox
    if (!isChecked) {
      setErrorMessage('Please accept Terms.');
      valid = false;
    } else {
      setErrorMessage('');
    }

    // Validate card details
    if (!validateCardDetails()) {
      valid = false;
    }

    if (!valid) return;

    const tokenResponse = await verifyReservationToken();
    if (tokenResponse?.error) {
      setShowModal(true);
      return;
    }

    const { clientSecret } = reservationData;
    const cardNumberElement = elements?.getElement(CardNumberElement);

    if (!clientSecret || !stripe || !elements) {
      setErrorMessage('Stripe or client secret not initialized.');
      return;
    }

    if (!isReservationHeld) {
      try {
        await holdReservation();
        setIsReservationHeld(true);
      } catch (error) {
        setErrorMessage('Failed to place reservation hold.');
        return;
      }
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardNumberElement!,
        billing_details: {
          name: cardHolderName,
        },
      },
    });

    if (error) {
      setErrorMessage(error.message || 'An unknown error occurred.');
    } else if (paymentIntent?.status === 'succeeded') {
      finalizeReservation();
    }
  };

  return {
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
  };
};
