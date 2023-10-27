export function daysUntilBirthday(dob) {
    const birthday = new Date(dob);
    const currentDate = new Date();

    birthday.setFullYear(currentDate.getFullYear());

    // If the next birthday is before the current date, set it to next year
    if (birthday < currentDate) birthday.setFullYear(currentDate.getFullYear() + 1);

    // Calculate the time difference in milliseconds
    const timeDifference = birthday - currentDate;

    // Convert milliseconds to days
    const days = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    if (days > 365) return 0;
    return days;
  }

export function splitDOB (dob) {
    const array = dob.split('-');
    const dobObject = {
        year: array[0],
        month: numericMonthToAbbreviation([array[1]]),
        day: array[2]
    }
    return dobObject;
}

function numericMonthToAbbreviation(month) {
    const monthAbbreviations = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
  
    if (month >= 1 && month <= 12) {
      return monthAbbreviations[month - 1];
    } else {
      return "Invalid Month";
    }
  }


  export function calculateAge(dateOfBirth) {
    const dob = new Date(dateOfBirth);
    const currentDate = new Date();
    
    const years = currentDate.getFullYear() - dob.getFullYear();
    
    // Check if the birthday for this year has occurred or not
    if (currentDate.getMonth() < dob.getMonth() || (currentDate.getMonth() === dob.getMonth() && currentDate.getDate() < dob.getDate())) {
      return years - 1; // Subtract 1 if the birthday hasn't occurred yet this year
    }
    
    return years;
  }

  
