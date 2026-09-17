export const FIELD_LIMITS = {
  companyName: 80,
  position: 80,
  contactName: 60,
  contactNumber: 20,
  contactEmail: 100,
  note: 500,
};

const PHONE_PATTERN = /^[0-9+\-\s()]{6,20}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateInterviewForm(formData) {
  const errors = {};

  if (!formData.companyName?.trim()) {
    errors.companyName = 'Company name is required.';
  } else if (formData.companyName.length > FIELD_LIMITS.companyName) {
    errors.companyName = `Keep it under ${FIELD_LIMITS.companyName} characters.`;
  }

  if (!formData.position?.trim()) {
    errors.position = 'Position is required.';
  } else if (formData.position.length > FIELD_LIMITS.position) {
    errors.position = `Keep it under ${FIELD_LIMITS.position} characters.`;
  }

  if (formData.contactNumber && !PHONE_PATTERN.test(formData.contactNumber.trim())) {
    errors.contactNumber = 'Enter a valid phone number.';
  }

  if (formData.contactName && formData.contactName.length > FIELD_LIMITS.contactName) {
    errors.contactName = `Keep it under ${FIELD_LIMITS.contactName} characters.`;
  }

  if (formData.contactEmail && !EMAIL_PATTERN.test(formData.contactEmail.trim())) {
    errors.contactEmail = 'Enter a valid email address.';
  } else if (formData.contactEmail && formData.contactEmail.length > FIELD_LIMITS.contactEmail) {
    errors.contactEmail = `Keep it under ${FIELD_LIMITS.contactEmail} characters.`;
  }

  return errors;
}
