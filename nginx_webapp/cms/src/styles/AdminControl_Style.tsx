import styled from 'styled-components';
import { Box, Typography } from '@material-ui/core';

export const ControlBox = styled(Box)`
    display: flex;
    flex-direction: row;

    @media screen and (max-width:1405px) {
        flex-direction: column;
    }

    @media screen and (max-width:767px) {
        flex-direction: column;
    }
`;

export const LeftBarBox = styled(Box)`
    width: 20rem;
    min-height: 100vh;
    border: 5px;
    background-color: rgba(0, 0, 0, 0.08);

    @media screen and (max-width:1405px) {
        width: 100%;
        min-height: auto;
    }

    @media screen and (max-width:767px) {
        width: 100%;
        min-height: auto;
    }
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

export const LoginBox = styled(Box)`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-image: url("cyber.jpg");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-attachment: fixed;
`;

export const BackgroundCover = styled(Box)`
    display: flex;
    width: 100%;
    min-height: 100vh;
    background-color: rgba(0, 0, 0, 0.38);
    align-items: center;
    justify-content: center;
`;

export const Panel = styled(Box)`
    width: 40rem;
    background-color: white;
    border-radius: 10px;
`;

export const PanelWrapper = styled(Box)`
    display: flex;
    padding: 30px;
    flex-direction: column;
    align-items: center;
`;