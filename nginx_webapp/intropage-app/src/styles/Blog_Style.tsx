import { Box, Container, Button, Paper, Stack, Typography } from '@mui/material';
import {createTheme} from '@mui/material/styles';
import styled from 'styled-components';

export const theme = createTheme();

theme.typography.h4 = {
    fontSize: '2.5rem',
    '@media (max-width:1023px)': {
    /* 타블렛 */
        fontSize: '2rem',
    },
    '@media (max-width:767px)': {
    /* 모바일 */
        fontSize: '1.5rem',
    }
};

theme.typography.h5 = {
    fontSize: '1.5rem',
    fontWeight: 600,
    '@media (max-width:1023px)': {
    /* 타블렛 */
        fontSize: '1.2rem',
    },
    '@media (max-width:767px)': {
    /* 모바일 */
        fontSize: '1rem',
    }
};

theme.typography.h6 = {
    fontSize: '1.2rem',
    fontWeight: 600,
    '@media (max-width:1023px)': {
    /* 타블렛 */
        fontSize: '1rem',
    },
    '@media (max-width:767px)': {
    /* 모바일 */
        fontSize: '0.8rem',
    }
};

export const BlogBox = styled.div`
`

export const SectionBanner = styled.div`
    height: 300px;
    background-color: #f5f5f5;
    background-image: url("studio.jpg");
    object-fit: cover;
    
    @media screen and (max-width:1023px) {
        height: 400px;
    }

    @media screen and (max-width:767px) {
        height: 400px;
    }
`

export const AdvancedSearchContainer = styled(Container)`
    height: 100%;
`;

export const AdvancedSearchBox = styled(Box)`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    justify-content: center;
    align-items: center;
    height: 100%;
`;

export const AdvancedSearchWrapper = styled(Box)`
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 2rem;
    padding-top: 10px;
`;

export const AdvancedSearchPaper = styled(Paper)`
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;

    @media screen and (max-width:1023px) {
        flex-direction: column;
    }

    @media screen and (max-width:767px) {
        flex-direction: column;
    }
`;

export const AdvancedSearchOptionWrapper = styled(Box)`
    display: flex;
    width: 100%;
    padding-top: 5px;
`;

export const AdvancedSearchInputButton = styled(Button)`
    padding-left: 5px;
`;

export const SectionPosts = styled(Box)`
    display: flex;
    flex-direction: column;
    width: 100%;
    padding-top: 40px;
    padding-bottom: 20px;
`;

export const PostSearchBox = styled(Box)`
    display: flex;
    flex-direction: row;
    width: 100%;

    @media screen and (max-width:1023px) {
        flex-direction: column;
    }

    @media screen and (max-width:767px) {
        flex-direction: column;
    }
`;

export const PostPaper = styled(Paper)`
    display: flex;
    flex-direction: row;
    align-items: center;

    @media screen and (max-width:1023px) {
        flex-direction: column;
    }

    @media screen and (max-width:767px) {
        flex-direction: column;
    }
`;

export const PostImageBox = styled(Box)`
    width: 300px;
    min-width: 300px;
    height: 200px;
    padding: 5px;

    @media screen and (max-width:1023px) {
        width: 100%;
        min-width: inherit;
    }

    @media screen and (max-width:767px) {
        width: 100%;
        min-width: inherit;
    }
`;

export const PostImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

export const PostInfoBox = styled(Box)`
    display: flex;
    flex-grow: 1;
    flex-direction: column;

    @media screen and (max-width:1023px) {
        padding: 5px;
        width: calc(100% - 5px);
    }

    @media screen and (max-width:767px) {
        padding: 5px;
        width: calc(100% - 5px);
    }
`;

export const PostStack = styled(Stack)`
    width: 100%;
`;

export const PostInfoCategoryBox = styled(Box)`
    padding-top: 10px;
`;

export const PostInfoTypography = styled(Typography)`
    width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
`;

export const PostInfoTagsBox = styled(Box)`
    margin-top: auto;
    width: 100%;
`;

export const PostInfoDateBox = styled(Box)`
`;

export const PostInfoDateTypography = styled(Typography)`
`;

export const PostInfoAuthorBox = styled(Box)`
`;

export const PostInfoAuthorTypography = styled(Typography)`
    padding-bottom: 10px;
`;

export const PostInfoTitleBox = styled(Box)`
    padding-top: 10px;
`;

export const PostInfoContentBox = styled(Box)`
    padding-top: 5px;
`;

export const PostInfoTagsTypography = styled(Typography)`
    width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
`;

export const PostInfoContentTypography = styled(Typography)`
    width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
`;

export const PostClassifyBox = styled(Box)`
    display: flex;
    min-width: 250px;

    @media screen and (max-width:1023px) {
        display: none;
    }

    @media screen and (max-width:767px) {
        display: none;
    }
`;

export const PostClassifyWrapper = styled(Box)`
    display: flex;
    flex-direction: column;
    height: 100%;
    flex-grow: 1;
`;

export const PostCategorySelectStack = styled(Stack)`
`;

export const PostPaginationBox = styled(Box)`
    display: flex;
    width: 100%;
    justify-content: center;
    padding-top: 20px;
    padding-bottom: 10px;
`;

export const PostSelectedCategoryBox = styled(Box)`
    display: none;
    flex-direction: column;

    @media screen and (max-width:1023px) {
        display: flex;
    }

    @media screen and (max-width:767px) {

    }
`;