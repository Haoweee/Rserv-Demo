import styles from './Policies.module.scss';

export default function PrivacyPolicy() {
  return (
    <div className={styles.policies__container}>
      <div className={styles.policies__title}>
        <h1 className={styles.title}>Privacy Policy</h1>
      </div>
      <div className={styles.policies__content}>
        <p>
          We value your privacy and are committed to protecting your personal information. This
          Privacy Policy explains how we collect, use, and safeguard your information when you use
          our services.
        </p>
        <br />
        <h2>Information We Collect</h2>
        <p>
          We may collect personal information such as your name, email address, phone number, and
          any other details you provide directly to us when using our services.
        </p>
        <br />
        <h2>How We Use Your Information</h2>
        <p>Your information may be used to:</p>
        <ul>
          <li>Provide and maintain our services.</li>
          <li>Send you updates, notifications, or promotional materials.</li>
          <li>Improve user experience and functionality.</li>
          <li>Comply with legal obligations.</li>
        </ul>
        <br />
        <h2>Sharing Your Information</h2>
        <p>
          We do not share your personal information with third parties except as required by law or
          with your explicit consent.
        </p>
        <br />
        <h2>Your Rights</h2>
        <p>
          You have the right to access, modify, or delete your personal information at any time.
          Please contact us at <span className={styles.email_link}>maisondelumiere@gmail.com</span>{' '}
          for assistance.
        </p>
        <br />
        <h2>Changes to This Privacy Policy</h2>
        <p>
          We reserve the right to update this Privacy Policy at any time. Changes will be effective
          immediately upon posting.
        </p>
        <br />
        <p>
          If you have any questions about this Privacy Policy, please contact us at{' '}
          <span className={styles.email_link}>maisondelumiere@gmail.com</span>.
        </p>
      </div>
    </div>
  );
}
