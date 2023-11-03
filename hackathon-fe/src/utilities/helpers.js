export function daysUntilBirthday(dob) {
  const birthday = new Date(dob);
  const currentDate = new Date();

  birthday.setFullYear(currentDate.getFullYear());

  // If the next birthday is before the current date, set it to next year
  if (birthday < currentDate)
    birthday.setFullYear(currentDate.getFullYear() + 1);

  // Calculate the time difference in milliseconds
  const timeDifference = birthday - currentDate;

  // Convert milliseconds to days
  const days = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

  if (days > 365) return 0;
  return days;
}


export function splitDOB(dob) {
  const array = dob.split("-");
  const dobObject = {
    year: array[0],
    month: numericMonthToString([array[1]]),
    day: array[2],
  };
  return dobObject;
}

function numericMonthToString(month) {
  const monthString = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  if (month >= 1 && month <= 12) {
    return monthString[month - 1];
  } else {
    return "Invalid Month";
  }
}

export function getCurrentDate() {
  const currentDate = new Date();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  const formattedDate = `${month}-${day}`;
  return formattedDate;
}

export function getCurrentMonth() {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  return currentMonth;
}

export function getNumericMonthFromBirthday(birthday) {
  // Split the input string by hyphen (-) and convert it to an array
  const dateParts = birthday.split('-');

  if (dateParts.length !== 3) {
    // Ensure the input has the correct format
    return "Invalid input format";
  }

  const year = parseInt(dateParts[0], 10);
  const month = parseInt(dateParts[1], 10);
  const day = parseInt(dateParts[2], 10);

  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    // Check for valid numbers
    return "Invalid date format";
  }

  // Return the numeric month (1 for January, 2 for February, and so on)
  return month;
}

export function hasBirthdayPassed(dateOfBirth) {
  // Create Date objects for the date of birth and the current date
  const dob = new Date(dateOfBirth);
  const currentDate = new Date();

  // Compare the month and day
  if (
    dob.getMonth() < currentDate.getMonth() ||
    (dob.getMonth() === currentDate.getMonth() && dob.getDate() <= currentDate.getDate())
  ) {
    return true; // Birthday has passed
  } else {
    return false; // Birthday has not passed
  }
}



export function calculateAge(dateOfBirth) {
  const dob = new Date(dateOfBirth);
  const currentDate = new Date();

  const years = currentDate.getFullYear() - dob.getFullYear();

  // Check if the birthday for this year has occurred or not
  if (
    currentDate.getMonth() < dob.getMonth() ||
    (currentDate.getMonth() === dob.getMonth() &&
      currentDate.getDate() < dob.getDate())
  ) {
    return years - 1; // Subtract 1 if the birthday hasn't occurred yet this year
  }

  return years;
}

export function profileFormValidation(profileInput) {
  if (!profileInput.name || !profileInput.dob || !profileInput.gender)
    return false;
  else return true;
}

export function profileDobValidation(dateOfBirth) {
  const dob = new Date(dateOfBirth);
  const currentDate = new Date();
  if (dob > currentDate) return false;
  else return true;
}


