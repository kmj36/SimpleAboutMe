import styled from 'styled-components';
import { Box, Typography } from '@material-ui/core';

export const ControlBox = styled(Box)`
    display: flex;
    flex-direction: row;
`;

export const LeftBarBox = styled(Box)`
    width: 20rem;
    min-height: calc( 100vh - 132px );
    border: 5px;
    background-color: rgba(0, 0, 0, 0.08);
`;

export const BarWrapper = styled(Box)`
    padding: 20px;
`;

export const BoardBox = styled(Box)`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
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
    align-items: center;
`;

export const BoardMainBox = styled(Box)`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
`;