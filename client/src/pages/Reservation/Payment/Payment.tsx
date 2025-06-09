import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from './PaymentForm/PaymentForm';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY!);

export default function ReservationFlow() {
  const location = useLocation();
  const navigate = useNavigate();

  const { clientSecret, reservationData } = location.state || {};

  useEffect(() => {
    if (!clientSecret) {
      navigate('/', { replace: true });
    }
  }, [clientSecret, navigate]);

  if (!clientSecret) {
    return null;
  }

  const reservationDataWithSecret = { ...reservationData, clientSecret };

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <PaymentForm reservationData={reservationDataWithSecret} />
    </Elements>
  );
}
