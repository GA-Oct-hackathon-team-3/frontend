import { useNavigate } from 'react-router-dom';
import styles from '../../styles/Header.module.css';

import HeaderImg from '../../assets/images/presentlyLogo.png';
const Header = () => {
  const navigate = useNavigate();

  return (
    <header className={styles.app_header} style={{ width: '100vw' }}>
      <img
        src={HeaderImg}
        alt="Presently"
        className={styles['headerLogo']}
        onClick={() => navigate('/friends')}
      />
    </header>
  );
};

export default Header;
