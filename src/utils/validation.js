import { gameConfig } from '../config/gameConfig';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[+()\-\s0-9]{7,20}$/;

export function validateClaim(form) {
  const errors = {};
  const age = Number(form.age);

  if (!form.fullName.trim()) errors.fullName = 'Enter your full name.';
  if (!form.age || Number.isNaN(age)) errors.age = 'Enter a valid age.';
  else if (age < gameConfig.minAge || age > gameConfig.maxAge) errors.age = `Age must be between ${gameConfig.minAge} and ${gameConfig.maxAge}.`;
  if (!phonePattern.test(form.phone.trim())) errors.phone = 'Enter a valid phone number.';
  if (!emailPattern.test(form.email.trim())) errors.email = 'Enter a valid email address.';
  if (!form.country) errors.country = 'Select your country.';
  if (!form.region.trim()) errors.region = 'Enter or select your location.';
  if (!form.city.trim()) errors.city = 'Enter your city.';
  if (!form.confirmed) errors.confirmed = 'Please confirm your information.';

  return errors;
}
