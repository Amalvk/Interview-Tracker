import { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import ActiveInterview from './ActiveInterview';
import UncrackedInterview from './UncrackedInterview';
import Topics from './Topics';

export default function InterviewCard() {
    const [value, setValue] = useState(0);

    const handleChange = (_, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ mt: 5, mx: { xs: 2, md: 10 } }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mx: 2, borderRadius: '8px' }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    TabIndicatorProps={{
                        sx: { backgroundColor: 'brown' }  // underline color for active tab
                    }}
                    sx={{
                        background: '#fff',
                        borderRadius: '8px',
                        '& .MuiTab-root': {
                            textTransform: 'capitalize',
                            color: 'gray',  // default color for tabs
                            outline: 'none',
                            '&:focus': { outline: 'none' },
                            '&:focus-visible': { outline: 'none' },
                        },
                        '& .MuiTab-root.Mui-selected': {
                            color: 'black',  // active tab color override
                        },
                    }}
                >
                    <Tab value={0} label="Active Interview" />
                    <Tab value={1} label="Uncracked Interview" />
                    <Tab value={2} label="Topics" />
                </Tabs>
            </Box>

            <Box sx={{ m: 2 }}>
                {value === 0 && <Box ><ActiveInterview /></Box>}
                {value === 1 && <Box ><UncrackedInterview /></Box>}
                {value === 2 && <Box ><Topics /></Box>}
            </Box>


        </Box>
    );
}
