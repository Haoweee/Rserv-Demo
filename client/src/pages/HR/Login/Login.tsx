import { useLogin } from '../../../hooks/HR/useLogin';
import Input from '../../../components/Input/Input';
import Button from '../../../components/Button/Button';
import styles from './Login.module.scss';

export default function Login() {
  const {
    validateAndLogin,
    error,
    emailAddress,
    setEmailAddress,
    password,
    setPassword,
    emailError,
    passwordError,
  } = useLogin();

  return (
    <div className={styles.login}>
      <div className={styles.login__form}>
        <h1>Login</h1>

        {/* Email Input */}
        <Input
          label="Email"
          type="text"
          value={emailAddress}
          onChange={e => setEmailAddress(e.target.value)}
          className={styles['form-item']}
        />
        <div className="text-red-500 text-sm" style={{ height: '1.5rem' }}>
          {emailError}
        </div>

        {/* Password Input */}
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className={styles['form-item']}
        />
        <div className="text-red-500 text-sm" style={{ height: '1.5rem' }}>
          {passwordError}
        </div>

        {/* Login Button */}
        <Button onClick={validateAndLogin} className={styles['form-button']}>
          Login
        </Button>

        <div className="text-red-500 text-sm" style={{ height: '0.5rem' }}>
          {error && <p className="text-center">{error}</p>}
        </div>
      </div>
    </div>
  );
}
