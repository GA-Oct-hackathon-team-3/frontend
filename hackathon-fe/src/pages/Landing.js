import { useNavigate, Link } from 'react-router-dom';

import mobileLanding from '../assets/images/landing/mobileLanding.png';
import presentlyLogo from '../assets/images/presentlyLogo.png';
import desktopLanding from '../assets/images/landing/desktopLanding.png';

import styles from '../styles/Landing.module.css';
import { useAuth } from '../contexts/AuthProvider';

const Landing = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  if (token) navigate('/friends');

  return (
    <section className={styles['landing-container']}>
      <div className={styles['content-container']}>
        <img
          src={presentlyLogo}
          alt="presently app logo"
          className={styles['desktopLogo']}
        />
        <img
          src={desktopLanding}
          alt="Birthday Introduction"
          className={styles['desktopIntro']}
        />
        <img
          src={mobileLanding}
          alt="Birthday Introduction"
          className={styles['mobileLogo']}
        />
        <h1>Remember the perfect gift, every time.</h1>
        <div>
          <p>
            Presently is your new best friend to help in the hunt for the
            greatest gifts ever.
          </p>
          <p>
            Get reminders to help you keep track of upcoming birthdays and
            recommendations based on your loved one's interests and hobbies.
          </p>
        </div>
        <Link to="/signup" className={styles['get-started']}>
          Get started
        </Link>
        <p>
          Already have an account?{' '}
          <Link to="/login" className={styles['log-in']}>
            Log In
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Landing;
