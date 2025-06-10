import { useRegister } from '../../../hooks/HR/useRegister';
import Input from '../../../components/Input/Input';
import Button from '../../../components/Button/Button';
import styles from '../Login/Login.module.scss';

export default function SignUp() {
  const {
    error,
    success,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    emailAddress,
    setEmailAddress,
    password,
    setPassword,
    passwordVerify,
    setPasswordVerify,
    firstNameError,
    lastNameError,
    emailError,
    passwordError,
    passwordVerifyError,
    validateAndRegister,
  } = useRegister();

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-60px)] px-4 py-8">
      <div className="w-full max-w-md shadow-lg rounded-xl p-6 space-y-4">
        <h2 className="text-center text-xl font-semibold text-gray-800">Add Admin</h2>
        <div className={styles.register__form}>
          <Input
            label="First Name"
            type="text"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            inputClassName="text-gray-800 placeholder-gray-400"
            className={styles['form-item']}
          />

          <p className="text-red-500 text-sm min-h-[1.25rem]">{firstNameError}</p>

          <Input
            label="Last Name"
            type="text"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            className={styles['form-item']}
          />
          <p className="text-red-500 text-sm min-h-[1.25rem]">{lastNameError}</p>

          <Input
            label="Email Address"
            type="text"
            value={emailAddress}
            onChange={e => setEmailAddress(e.target.value)}
            className={styles['form-item']}
          />
          <p className="text-red-500 text-sm min-h-[1.25rem]">{emailError}</p>

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className={styles['form-item']}
          />
          <p className="text-red-500 text-sm min-h-[1.25rem]">{passwordError}</p>

          <Input
            label="Confirm Password"
            type="password"
            value={passwordVerify}
            onChange={e => setPasswordVerify(e.target.value)}
            className={styles['form-item']}
          />
          <p className="text-red-500 text-sm min-h-[1.25rem]">{passwordVerifyError}</p>

          <Button
            onClick={validateAndRegister}
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
          >
            Register
          </Button>

          <p className="text-center text-red-500 text-sm min-h-[1rem]">{error}</p>
          <p className="text-center text-green-600 text-sm min-h-[1rem]">{success}</p>
        </div>
      </div>
    </div>
  );
}
