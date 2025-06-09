import { useState } from 'react';

export const usePolicies = () => {
  const [policies, setPolicies] = useState<boolean>(false);
  const [conditions, setConditions] = useState<boolean>(false);

  const handleOpenPolicy = () => {
    setPolicies(true);
  };

  const handleOpenConditions = () => {
    setConditions(true);
  };

  const handleClosePolicy = () => {
    setPolicies(false);
  };

  const handleCloseConditions = () => {
    setConditions(false);
  };

  return {
    policies,
    conditions,
    handleOpenPolicy,
    handleOpenConditions,
    handleClosePolicy,
    handleCloseConditions,
  };
};
