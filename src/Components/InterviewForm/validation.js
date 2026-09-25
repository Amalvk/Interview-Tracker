export const FIELD_LIMITS = {
  companyName: 80,
  location: 80,
  contactName: 60,
  contactNumber: 20,
  contactEmail: 100,
  note: 500,
  platformOther: 80,
};

export const PLATFORM_OPTIONS = [
  { value: 'naukri', label: 'Naukari' },
  { value: 'indeed', label: 'Indeed' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'gmail', label: 'Gmail' },
  { value: 'portal', label: 'Company Portal' },
  { value: 'others', label: 'Others' },
];

const PHONE_PATTERN = /^[0-9+\-\s()]{6,20}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateInterviewForm(formData) {
  const errors = {};

  if (!formData.companyName?.trim()) {
    errors.companyName = 'Company name is required.';
  } else if (formData.companyName.length > FIELD_LIMITS.companyName) {
    errors.companyName = `Keep it under ${FIELD_LIMITS.companyName} characters.`;
  }

  if (formData.location && formData.location.length > FIELD_LIMITS.location) {
    errors.location = `Keep it under ${FIELD_LIMITS.location} characters.`;
  }

  if (formData.platform === 'others') {
    if (!formData.platformOther?.trim()) {
      errors.platformOther = 'Please specify the platform.';
    } else if (formData.platformOther.length > FIELD_LIMITS.platformOther) {
      errors.platformOther = `Keep it under ${FIELD_LIMITS.platformOther} characters.`;
    }
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
