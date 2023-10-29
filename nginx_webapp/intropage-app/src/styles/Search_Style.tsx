import { Box, Container, Stack, Typography, Paper } from '@mui/material';
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

export const SearchBox = styled(Box)`
    width: 100%;
    height: 100%;
`;

export const SectionBanner = styled(Box)`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 20rem;
    background-color: #f5f5f5;
    background-image: url("search.jpg");
    background-size: cover;
`;

export const BannerBox = styled(Box)`
    display: flex;
    flex-direction: row;
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    margin: 5px;
    color: white;

    @media screen and (max-width:1023px) {
    /* 타블렛 */
        max-width: 100%;
    }

    @media screen and (max-width:767px) {
    /* 모바일 */
        max-width: 100%;
    }
`;

export const SearchIconBox = styled(Box)`

`;

export const SearchIcon = styled.img`

`;

export const SearchResultCountBox = styled(Box)`
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

export const SearchResultTitle = styled(Typography)`
    
`;

export const SearchResultSubTitle = styled(Typography)`

`;

export const SectionSearchResult = styled(Box)`

`;

export const SearchPostsContainer = styled(Container)`

`;

export const SearchPostStack = styled(Stack)`
    padding-top: 10px;
`;

export const SearchPostPaper = styled(Paper)`
    display: flex;
    flex-direction: row;
    align-items: center;
`;

export const SearchPostImage = styled.img`
    width: 300px;
    min-width: 300px;
    height: 200px;
    padding: 5px;
    object-fit: cover;
`;

export const SearchPostMainBox = styled(Box)`
    display: flex;
    flex-direction: column;
    padding-top: 5px;
`;

export const SearchPostTitleTypography = styled(Typography)`
    width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    padding-top: 5px;
`;

export const SearchPostContentTypography = styled(Typography)`
    width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
`;

export const SearchPostTagTypography = styled(Typography)`
    width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
`;

export const SearchPostDateBox = styled(Box)`
    display: flex;
    flex-direction: row;
`;

export const SearchPostAuthorBox = styled(Box)`
`;

export const SearchPostAuthorTypography = styled(Typography)`
`;

export const SearchPostDateIcon = styled.img`

`;

export const SearchPostDateTypography = styled(Typography)`

`;

export const PostPaginationBox = styled(Box)`
    display: flex;
    width: 100%;
    justify-content: center;
    padding-top: 20px;
    padding-bottom: 10px;
`;