import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { skillsStringToArray } from './SkillChipsInput';

export default function SkillChipsDisplay({ skills, size = 'small', max }) {
  const list = skillsStringToArray(skills);
  if (!list.length) return null;
  const shown = max ? list.slice(0, max) : list;
  const remaining = max ? list.length - shown.length : 0;

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
      {shown.map((skill) => (
        <Chip key={skill} label={skill} size={size} variant="outlined" color="primary" />
      ))}
      {remaining > 0 && <Chip label={`+${remaining}`} size={size} variant="outlined" />}
    </Box>
  );
}
