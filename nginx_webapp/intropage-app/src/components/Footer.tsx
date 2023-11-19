import { Paper, Box, Typography } from '@material-ui/core';
import styled from 'styled-components';

const CopyrightBox = styled(Box)`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
    height: 10rem;
    background-color: #f5f5f5;
`;

function Footer()
{
    return (
        <Paper style={{ width: '100%',
        bottom: 0,
        borderTop: '1px solid #eaeaea',
        marginTop: 64
        }} component="footer" square>
            <CopyrightBox>
                <Typography variant="subtitle1" color="textSecondary">
                    Copyright 2023 © kmj36 | All rights reserved
                </Typography>
            </CopyrightBox>
        </Paper>
    );
}

export default Footer;