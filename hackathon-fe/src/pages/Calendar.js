import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import * as friendsService from '../utilities/friends-service';
// import styles from '../styles/Calendar.module.css';
import 'react-calendar/dist/Calendar.css';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

const CalendarPage = () => {
  const navigate = useNavigate();
  const [birthdays, setBirthdays] = useState(null);
  const [currentView, setCurrentView] = useState('month');
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
        const matchingBirthdays = birthdays[formattedDate] || [];
    
        return matchingBirthdays.length > 0 ? (
          <div>
            {matchingBirthdays.map((friend) => (
              <div
                key={friend._id}
                onClick={() => navigate(`/friend/${friend._id}`)}
              >
                {friend.name}'s birthday
              </div>
            ))}
          </div>
        ) : null;
    }
    else return null;
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
      <div>
        <h2>Calendar View</h2>
        <Calendar
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
      </div>
      <Footer />
    </>
  );
};

export default CalendarPage;
