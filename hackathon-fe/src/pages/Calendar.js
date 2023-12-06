import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import * as friendsService from '../utilities/friends-service';
import styles from '../styles/Calendar.module.css';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import CalendarFriendItem from '../components/CalendarFriendItem';

const CalendarPage = () => {
  const navigate = useNavigate();
  const [birthdays, setBirthdays] = useState(null);
  const [currentView, setCurrentView] = useState('month');
  const [selectedDate, setSelectedDate] = useState('');
  const currentDate = new Date();

  useEffect(() => {
    const fetchBirthdays = async () => {
      const birthdayData = await friendsService.getBirthdays();
      if (birthdayData && !birthdayData.message) setBirthdays(birthdayData);
    };
    fetchBirthdays();
  }, []);

  const tileContent = ({ date }) => {
    if (birthdays) {
      const formattedDate = date
        .toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' })
        .replace(/\//g, '-');
  
      if (birthdays[formattedDate]) {
        return (
          <div onClick={(evt) => {evt.stopPropagation(); setSelectedDate(formattedDate)}}>
            🥳 View Details
          </div>
        );
      }
      else return null;
    }
    else return null;
    }
  
  const renderFriendLinks = (date) => {
    const matchingBirthdays = birthdays[date] || [];
    return (
      matchingBirthdays.length > 0 ? (
        <div className={styles['birthday-section']}>
            <h2>Current Birthdays...</h2>
          {matchingBirthdays.map((friend) => (
            <CalendarFriendItem id={friend._id} name={friend.name} photo={friend.photo} dob={friend.dob} />
          ))}
        </div>
      ) : 'No birthdays on this date'
    );
  };
  
  

  const handleViewChange = (newView) => {
    if (newView === 'decade') {
      // If the user tries to change to a decade view, keep the current month view.
      setCurrentView('month');
    } else {
      setCurrentView(newView);
    }
  };

  return (
    <>
      <Header />
      <div className={styles['calendar-container']}>
        <div className={styles['content-container']}>
        <h1>Calendar View</h1>
        <Calendar className={styles['react-calendar']}
          tileContent={tileContent}
          minDate={
            new Date(
              currentDate.getFullYear() - 1,
              currentDate.getMonth(),
              currentDate.getDate()
            )
          }
          maxDate={
            new Date(
              currentDate.getFullYear() + 1,
              currentDate.getMonth(),
              currentDate.getDate()
            )
          }
          view={currentView}
          onViewChange={handleViewChange}
        />
        {selectedDate && renderFriendLinks(selectedDate)}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CalendarPage;
