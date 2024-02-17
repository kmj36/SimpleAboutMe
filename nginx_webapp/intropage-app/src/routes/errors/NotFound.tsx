import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';

function NotFound()
{
    const navigate = useNavigate();

    return (
        <Box id="NotFound" sx={{ display: 'flex', width: '100%', height: '85vh', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant='h1' sx={{ paddingTop: '10px', paddingBottom: '10px' }}>
                    :(
                </Typography>
                <Typography variant='h3' sx={{ paddingTop: '10px' }}>
                    Oops! Page not found.
                </Typography>
                <Typography variant='h6' color='gray' sx={{ paddingTop: '10px', paddingBottom: '10px' }}>
                    We couldn't find the page you were looking for.
                </Typography>
                <Button variant='contained' onClick={()=>navigate('/')}>
                    Return to Home
                </Button>
            </Box>
        </Box>
    );
}

export default NotFound;