export const isValidEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@(tothenew\.com|gmail\.com)$/;
    return regex.test(email);
  };