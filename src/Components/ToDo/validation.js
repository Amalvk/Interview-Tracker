export const FIELD_LIMITS = {
  title: 100,
  description: 500,
};

export function validateTodoForm(formData) {
  const errors = {};

  if (!formData.title?.trim()) {
    errors.title = 'Title is required.';
  } else if (formData.title.length > FIELD_LIMITS.title) {
    errors.title = `Keep it under ${FIELD_LIMITS.title} characters.`;
  }

  if (formData.description && formData.description.length > FIELD_LIMITS.description) {
    errors.description = `Keep it under ${FIELD_LIMITS.description} characters.`;
  }

  return errors;
}
