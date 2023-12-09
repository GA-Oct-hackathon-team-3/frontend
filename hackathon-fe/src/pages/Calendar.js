import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import * as friendsService from '../utilities/friends-service';
import styles from '../styles/Calendar.module.css';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import CalendarFriendItem from '../components/CalendarFriendItem';
import { formatPartialDate } from '../utilities/helpers';

const CalendarPage = () => {
  const currentDate = new Date();
  const minDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
  const maxDate = new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), currentDate.getDate());

  const [birthdays, setBirthdays] = useState(null); // fetched from backend
  const [currentView, setCurrentView] = useState('month'); // controls view on calendar
  const [selectedDate, setSelectedDate] = useState(''); // selected date for view birthday section render
  const [selectedMonth, setSelectedMonth] = useState(currentDate); // stores selected month for user navigation through calendar
  const [activeDate, setActiveDate] = useState(currentDate); // controls date displayed on calendar

  useEffect(() => {
    const fetchBirthdays = async () => {
      const birthdayData = await friendsService.getBirthdays();
      // assigns state to response unless data comes back with message of no friends
      if (birthdayData && !birthdayData.message) setBirthdays(birthdayData);
    };
    fetchBirthdays();
  }, []);

  const tileContent = ({ date, view }) => {
    if (view !== 'month') return null; // removes rendering in year view
    if (!birthdays) return null;
    else { // only runs if user has friends
      if (!(date >= minDate && date <= maxDate)) return null;
      else { // only renders on active dates
        const formattedDate = date // formats date for comparison
          .toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' })
          .replace(/\//g, '-');

        if (birthdays[formattedDate]) {
          // object lookup for friends with that birthday
          return (
            // renders handler to render birthday detail section
            <div
              className={styles['view-birthdays']}
              onClick={(evt) => {
                handleSelectedDate(evt, formattedDate);
              }}
            >
              <span>View Birthdays🥳</span>
            </div>
          );
        } else return null;
      }
    }
  };

  const tileClassName = ({ date }) => {

    // adds color class to current dates day and month
    const isCurrentDay = date.toDateString() === currentDate.toDateString() ? styles['current-date'] : '';

    const isCurrentMonth = currentView === 'year' && date.getFullYear() === currentDate.getFullYear() && date.getMonth() === currentDate.getMonth()
      ? styles['current-date'] : '';


    // adds color class to selected day and month
    const isSelectedDay = date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' }).replace(/\//g, '-') === selectedDate
        ? styles['selected-date'] : '';

    const isSelectedMonth = currentView === 'year' && date.getMonth() === selectedMonth.getMonth() && date.getFullYear() === selectedMonth.getFullYear()
        ? styles['selected-date'] : '';

    return `${isCurrentDay} ${isSelectedDay} ${isCurrentMonth} ${isSelectedMonth}`;
  };

  const renderFriendLinks = (date) => {
    const matchingBirthdays = birthdays[date] || [];
    return matchingBirthdays.length > 0 ? (
      <div className={styles['birthday-section']}>
        <h2>Birthday Details for {formatPartialDate(date)}</h2>
        {matchingBirthdays.map((friend) => (
          <CalendarFriendItem
            key={friend._id}
            id={friend._id}
            name={friend.name}
            photo={friend.photo}
            dob={friend.dob}
          />
        ))}
      </div>
    ) : (
      'No birthdays on this date'
    );
  };

  const handleSelectedDate = (evt, formattedDate) => {
    evt.stopPropagation();
    // Toggle the selected date
    setSelectedDate((prev) => (prev !== formattedDate ? formattedDate : ''));
  };

  const handleViewChange = ({ action, view }) => {
    if (view === 'decade') {
      setCurrentView('month'); // removes ability to change to decade view
      setActiveDate(selectedMonth); // when navigating back to month, changes display month to previously selected month
    } else setCurrentView(view); // default to change vuew to year
  };

  const handleClickMonth = (month) => {
    setSelectedMonth(month); // updating selected month when month is clicked in year view
    setActiveDate(month); // updating display to that month
    setSelectedDate(''); // clears birthday section when month is changed
  };

  const handleActiveChange = ({ action, activeStartDate }) => {
    setActiveDate(activeStartDate);
    if (action === 'prev' || action === 'next') {
        setSelectedMonth(activeStartDate); // updating selected month when next and prev are clicked
        setSelectedDate(''); // clears birthday section when month is changed
    }
  };

  return (
    <>
      <Header />
      <div className={styles['calendar-container']}>
        <div className={styles['content-container']}>
          <h1>Calendar View</h1>
          <Calendar
            className={styles['react-calendar']}
            tileContent={tileContent}
            tileClassName={tileClassName}
            showNeighboringMonth={false}
            next2Label={null}
            prev2Label={null}
            minDate={minDate}
            maxDate={maxDate}
            view={currentView}
            onViewChange={handleViewChange}
            onClickMonth={handleClickMonth}
            activeStartDate={activeDate}
            onActiveStartDateChange={handleActiveChange}
          />
          {selectedDate && renderFriendLinks(selectedDate)}
          <br />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CalendarPage;