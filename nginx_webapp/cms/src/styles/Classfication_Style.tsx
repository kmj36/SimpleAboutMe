import styled from 'styled-components';
import { Box } from '@material-ui/core';
import { Typography } from '@mui/material';

export const ClassficationBox = styled(Box)`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
`;

export const ClassficationList = styled(Box)`
    max-width: 300px;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    border-right: 1px solid #e0e0e0;
`;

export const ClassficationMain = styled(Box)`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
`;

export const ClassficationTitle = styled(Typography)`
    padding-top: 15px;
    padding-left: 20px;
`;

export const ClassficationTableBox = styled(Box)`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
`;

export const ClassficationTableTitle = styled(Typography)`
    padding-top: 15px;
    padding-left: 30px;
`;

export const ClassficationTableSearch = styled(Box)`
    min-height: 50px;
    display: flex;
    flex-direction: row;
    margin-left: 10px;
    margin-right: 10px;
    background-color: #EBEBEB;
`;

export const ClassficationTableItemBox = styled(Box)`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
`;

export const ClassficationCreateBox = styled(Box)`
    width: 100%;
    height: 100px;
    display: flex;
    flex-direction: row;
    align-items: center;
`;
