import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import { useAppDispatch } from '../../redux/hooks';
import { loading, done } from '../../redux/feature/LoadingReducer';

function NotFound()
{
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() =>  {
        (async () => {
            dispatch(loading());
            dispatch(done());
        })();
    }, []);

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