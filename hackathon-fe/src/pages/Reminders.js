import { useState } from 'react';

import Notifications from '../components/Reminders/Notifications';
import Manage from '../components/Reminders/Manage';
import Header from '../components/Header';
import Footer from '../components/Footer';

import styles from '../styles/Reminders.module.css';

const Reminders = () => {
  const [activeTab, setActiveTab] = useState('reminders');

  return (
    <>
      <Header />
      <div className={styles['reminders-container']}>
        <div className={styles['content-container']}>
          <h1>Reminders</h1>
          <div className={styles['tab-container']}>
            <span
              onClick={() => setActiveTab('reminders')}
              className={activeTab === 'reminders' ? styles['active-tab'] : ''}
            >
              View Notifications
            </span>
            <span
              onClick={() => setActiveTab('manage')}
              className={activeTab === 'manage' ? styles['active-tab'] : ''}
            >
              Manage Preferences
            </span>
          </div>
        </div>

        {activeTab === 'reminders' ? <Notifications /> : <Manage />}
      </div>
      <Footer />
    </>
  );
};

export default Reminders;
