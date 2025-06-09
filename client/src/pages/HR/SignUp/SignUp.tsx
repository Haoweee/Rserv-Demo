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

// import { useRegister } from "../../../hooks/HR/useRegister";
// import Input from "../../../components/Input/Input";
// import Button from "../../../components/Button/Button";
// import styles from "../Login/Login.module.scss";

// export default function SignUp() {
//   const {
//     error,
//     success,
//     firstName,
//     setFirstName,
//     lastName,
//     setLastName,
//     emailAddress,
//     setEmailAddress,
//     password,
//     setPassword,
//     passwordVerify,
//     setPasswordVerify,
//     firstNameError,
//     lastNameError,
//     emailError,
//     passwordError,
//     passwordVerifyError,
//     validateAndRegister,
//   } = useRegister();

//   return (
//     <>
//       <h1 className="text-xl font-semibold text-center mb-4">Add Admin</h1>
//       <div className={styles.register}>
//         <div className={styles.login__form}>
//           {/* First Name Input */}
//           <Input
//             label="First Name"
//             type="text"
//             value={firstName}
//             onChange={(e) => setFirstName(e.target.value)}
//             className={styles["form-item"]}
//           />
//           <div
//             className="text-red-500 text-sm"
//             style={{ height: "1.25rem" }} // Reserved space for error
//           >
//             {firstNameError}
//           </div>

//           {/* Last Name Input */}
//           <Input
//             label="Last Name"
//             type="text"
//             value={lastName}
//             onChange={(e) => setLastName(e.target.value)}
//             className={styles["form-item"]}
//           />
//           <div
//             className="text-red-500 text-sm"
//             style={{ height: "1.25rem" }} // Reserved space for error
//           >
//             {lastNameError}
//           </div>

//           {/* Email Address Input */}
//           <Input
//             label="Email Address"
//             type="text"
//             value={emailAddress}
//             onChange={(e) => setEmailAddress(e.target.value)}
//             className={styles["form-item"]}
//           />
//           <div
//             className="text-red-500 text-sm"
//             style={{ height: "1.25rem" }} // Reserved space for error
//           >
//             {emailError}
//           </div>

//           {/* Password Input */}
//           <Input
//             label="Password"
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className={styles["form-item"]}
//           />
//           <div
//             className="text-red-500 text-sm"
//             style={{ height: "1.25rem" }} // Reserved space for error
//           >
//             {passwordError}
//           </div>

//           {/* Confirm Password Input */}
//           <Input
//             label="Confirm Password"
//             type="password"
//             value={passwordVerify}
//             onChange={(e) => setPasswordVerify(e.target.value)}
//             className={styles["form-item"]}
//           />
//           <div
//             className="text-red-500 text-sm"
//             style={{ height: "1.25rem" }} // Reserved space for error
//           >
//             {passwordVerifyError}
//           </div>

//           {/* Register Button */}
//           <Button
//             onClick={validateAndRegister}
//             className={styles["form-button"]}
//           >
//             Register
//           </Button>

//           {/* General Error Message */}
//           <div
//             className="text-red-500 text-sm"
//             style={{ height: "0.5rem" }}
//           >
//             {error && <p className="text-center">{error}</p>}
//           </div>

//           {/* Success Message */}
//           <div
//             className="text-green-500 text-sm"
//             style={{ height: "0.5rem" }}
//           >
//             {success && <p className="text-center">{success}</p>}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
