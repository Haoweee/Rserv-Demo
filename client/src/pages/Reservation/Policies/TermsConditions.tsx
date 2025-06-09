import styles from './Policies.module.scss';

export default function TermsConditions() {
  return (
    <div className={styles.policies__container}>
      <div className={styles.policies__title}>
        <h1 className={styles.title}>Terms & Conditions</h1>
      </div>
      <div className={styles.policies__content}>
        <p>
          Welcome to our service. By accessing or using our application, you agree to comply with
          and be bound by the following terms and conditions.
        </p>
        <br />
        <h2>1. Use of the Service</h2>
        <p>
          You agree to use the service only for lawful purposes and in accordance with these terms.
          Unauthorized use of the service may result in suspension or termination of your access.
        </p>
        <br />
        <h2>2. User Responsibilities</h2>
        <p>As a user, you are responsible for:</p>
        <ul>
          <li>Providing accurate and up-to-date information.</li>
          <li>Maintaining the confidentiality of your account credentials.</li>
          <li>Complying with all applicable laws and regulations.</li>
        </ul>
        <br />
        <h2>3. Intellectual Property</h2>
        <p>
          All content, features, and functionality provided through our service are the intellectual
          property of
          <span className={styles.restaurantName}>Maison de Lumiere</span> or its licensors.
          Unauthorized reproduction or distribution is prohibited.
        </p>
        <br />
        <h2>4. Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by law,{' '}
          <span className={styles.restaurantName}>Maison de Lumiere</span> shall not be held liable
          for any damages, losses, or liabilities arising from your use of the service.
        </p>
        <br />
        <h2>5. Modifications to the Terms</h2>
        <p>
          We reserve the right to update or modify these terms at any time. Changes will be
          effective immediately upon posting. Your continued use of the service signifies your
          acceptance of the updated terms.
        </p>
        <br />
        <h2>6. Governing Law</h2>
        <p>
          These terms shall be governed by and construed in accordance with the laws of New York.
          Any disputes shall be resolved in the courts of New York.
        </p>
        <br />
        <p>
          If you have any questions regarding these terms, please contact us at{' '}
          <span className={styles.email_link}>maisondelumiere@gmail.com</span>.
        </p>
      </div>
    </div>
  );
}
