import { useState } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

// Skills are persisted as a comma-separated string (existing data model),
// this component just gives the user a tag-based editing experience on top of it.
export function skillsStringToArray(value) {
  if (!value) return [];
  return String(value)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

export function skillsArrayToString(arr) {
  return arr.join(', ');
}

export default function SkillChipsInput({ value, onChange, error, helperText }) {
  const skills = skillsStringToArray(value);
  const [draft, setDraft] = useState('');

  const commitDraft = () => {
    const next = draft.trim();
    if (!next) return;
    if (skills.some((s) => s.toLowerCase() === next.toLowerCase())) {
      setDraft('');
      return;
    }
    onChange(skillsArrayToString([...skills, next]));
    setDraft('');
  };

  const removeSkill = (skill) => {
    onChange(skillsArrayToString(skills.filter((s) => s !== skill)));
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ',') {
              e.preventDefault();
              commitDraft();
            }
          }}
          placeholder="e.g. React, TypeScript, Next.js"
          size="small"
          fullWidth
          error={error}
          inputProps={{ maxLength: 40 }}
        />
        <Button variant="outlined" size="small" onClick={commitDraft} sx={{ flexShrink: 0 }}>
          + Add
        </Button>
      </Box>
      {helperText && (
        <Box sx={{ mt: 0.5, fontSize: 12, color: error ? 'error.main' : 'text.secondary' }}>
          {helperText}
        </Box>
      )}
      {skills.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1.5 }}>
          {skills.map((skill) => (
            <Chip
              key={skill}
              label={skill}
              size="small"
              onDelete={() => removeSkill(skill)}
              color="primary"
              variant="outlined"
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
