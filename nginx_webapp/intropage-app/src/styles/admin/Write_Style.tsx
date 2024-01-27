import styled from 'styled-components';
import { Box } from '@material-ui/core';

export const WriteBox = styled(Box)`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
`;

export const InputTitle = styled.input`
    font-size: 30px;
    height: 50px;
    padding-left: 10px;
    border: none;
    outline: none;
    flex-grow: 1;
`;

export const EnterBox = styled(Box)`
    display: flex;
    align-items: center;
    margin-top: 10px;
    margin-right: 20px;
`;

export const TitleBox = styled(Box)`
    display: flex;
    flex-direction: row;
    align-items: center;
`;

export const SpecificBox = styled(Box)`
    display: flex;
    flex-direction: row;
    align-items: center;
`;