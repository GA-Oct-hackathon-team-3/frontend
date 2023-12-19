import moment from 'moment-timezone';

export const presentlyCardColors = [
  '#418BFA',
  '#f63517',
  '#FE6797',
  '#FA7F39',
  '#AF95E7',
  '#EDB600',
  '#8cb2c9',
  '#53CF85',
];

export const friendsFilter = (friends, query) => {
  return friends.filter((friend) =>
    friend.name.toLowerCase().includes(query.toLowerCase())
  );
};

export function splitDOB(dob) {
  const formattedDob = formatDate(dob);
  const array = formattedDob.split(' ');
  const dobObject = {
    day: array[0],
    month: array[1],
    year: array[2],
  };
  return dobObject;
}

export function formatDate(dateString) {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const date = new Date(dateString);
  const day = date.getUTCDate();
  const month = months[date.getUTCMonth()];
  const year = date.getUTCFullYear();

  return `${day} ${month} ${year}`;
}

export function calculateAge(dateOfBirth) {
  const dob = new Date(dateOfBirth);
  const currentDate = new Date();

  const years = currentDate.getFullYear() - dob.getFullYear();

  // check if the birthday for this year has occurred or not
  if ( currentDate.getMonth() < dob.getMonth() || (currentDate.getMonth() === dob.getMonth() && currentDate.getDate() < dob.getDate())) {
    return years - 1; // subtract 1 if the birthday hasn't occurred yet this year
  }

  return years;
}

export function getAgeAndSuffix (dob) {
    const age = calculateAge(dob); // calculates age

    // if age is between 10 and 20 (inclusive) returns 'th'
    if (age >= 10 && age <= 20) return `${age}th`;

    // finds last digit
    const lastDigit = age % 10;
    // reference of alternate suffixes
    const suffixes = { 1: 'st', 2: 'nd', 3: 'rd' }

    // returns age with the corresponding value to the last digit key, if no match, returns 'th' by default
    return `${age}${suffixes[lastDigit] || 'th'}`
}

export function validatePassword(password) {
    // check if the password is at least 8 characters in length
    if (password.length < 8) return false;
  
    // check if password contains at least one...
    const hasUppercase = /[A-Z]/.test(password); // uppercase
    const hasLowercase = /[a-z]/.test(password); // lowercase
    const hasNumber = /\d/.test(password); // number
    const hasSpecialChar = /[!@#$%^&*()_+{}[\]:;<>,.?~^-]/.test(password); // special character
  
    // return true if all conditions are met
    return hasUppercase && hasLowercase && hasNumber && hasSpecialChar;
  }  

export function validateMatch(password, confirmPassword) {
  return password === confirmPassword;
}

export function formatPartialDate(date) {
  const fullDate = formatDate(date);
  const [day, month] = fullDate.split(' ');
  return `${month} ${day}`;
}

export function profileFormValidation(profileInput) {
  if (!profileInput.name || !profileInput.dob || !profileInput.gender) return false;
  else return true;
}

export function profileDobValidation(dateOfBirth) {
  const dob = new Date(dateOfBirth);
  const currentDate = new Date();
  if (dob > currentDate) return false;
  else return true;
}

export function getTimezones() {
  return moment.tz.names();
}

export const buildGiftLink = (gift, location) => {
  if (/present/i.test(gift.giftType)) return `https://www.amazon.com/s?k=${gift.title}`;

  else if (/donation/i.test(gift.giftType)) return `https://www.google.com/search?q=${gift.title}`;
  
  else if (/experience/i.test(gift.giftType)) {
    let query = `https://www.google.com/search?q=${gift.title}`;
    if (location) query += `+near+${location}`; // uses friend location
    return query;
  }
};
