import styled from 'styled-components';
import { Box, Typography } from '@material-ui/core';

export const ControlBox = styled(Box)`
    display: flex;
    flex-direction: row;
`;

export const LeftBarBox = styled(Box)`
    width: 20rem;
    height: calc( 100vh - 132px );
    border: 5px;
    background-color: rgba(0, 0, 0, 0.08);
`;

export const BarWrapper = styled(Box)`
    padding: 20px;
`;

export const BoardBox = styled(Box)`
    width: calc( 100% - 20rem );
`;

export const TopTitleBar = styled(Box)`
    display: flex;
    padding-top: 10px;
    padding-bottom: 10px;
    padding-left: 15px;
    height: 50px;
    background-color: rgba(0, 0, 0, 0.08);
`;

export const TopTitleTypography = styled(Typography)`
    display: flex;
    height: 100%;
    align-items: center;
`;