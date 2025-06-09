import { useEffect } from 'react';

const WithStripeScript = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    if (!document.querySelector('script[src="https://js.stripe.com/v3/"]')) {
      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3/';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return <>{children}</>;
};

export default WithStripeScript;
