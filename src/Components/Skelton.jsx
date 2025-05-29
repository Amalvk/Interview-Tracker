import * as React from 'react';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

export default function CommonSkeleton() {
    return (
        <Box >
            <Skeleton height={150} animation="wave" />
            <Skeleton height={150} animation="wave" />
        </Box>

    );
}
