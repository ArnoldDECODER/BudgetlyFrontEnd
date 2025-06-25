// Check if an email address has a valid format
export const isValidEmail = (email) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  };
  
  // Check if a password is strong enough (minimum 6 characters, includes a number)
  export const isValidPassword = (password) => {
    const pattern = /^(?=.*\d).{6,}$/;
    return pattern.test(password);
  };
  
  // Optional: validate that all fields are filled in
  export const isFormFilled = (fields) => {
    return Object.values(fields).every((val) => val.trim() !== '');
  };