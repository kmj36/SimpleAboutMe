import styled from 'styled-components';
import { createTheme } from '@mui/material/styles';
import {
    Box,
    Typography,
    Container,
    Stack
} from '@mui/material';


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

export const PageBox = styled(Box)`
`;

export const SectionBanner = styled(Box)`
    height: 300px;
    background-color: #f5f5f5;
    background-size: cover;
    background-position: center; 
`;

export const ImageOverlayGradient = styled.div`
    height: 300px;
    background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%);
`;

export const BannerTitleItemBox = styled(Box)`
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    justify-content: center;
    margin-left: 100px;
    margin-right: 100px;
`;

export const BannerCategoryBox = styled(Box)`
`;

export const BannerCategoryTypography = styled(Typography)`
    color: white;
`;

export const BannerTitleBox = styled(Box)`
    padding-top: 20px;
`;

export const BannerTitleTypography = styled(Typography)`
    color: white;
`;

export const BannerCreatedDateBox = styled(Box)`
    padding-top: 30px;
`;

export const BannerCreatedDateTypography = styled(Typography)`
    color: white;
`;

export const SectionMain = styled(Box)`
    min-height: 50dvh;
`;

export const MainBox = styled(Box)`
    display: flex;
    flex-direction: row;
    height: 100%;
    min-height: 50dvh;
`;

export const MainRightBarBox = styled(Box)`
    min-width: 250px;
    padding-top: 50px;
`;

export const MainRightBarWrapper = styled(Box)`
    display: flex;

    @media screen and (max-width:1023px) {
        display: none;
    }

    @media screen and (max-width:767px) {
        display: none;
    }
`;

export const MainRightBarStack = styled(Stack)`
`;

export const MainRightBarIDBox = styled(Box)`
`;

export const MainRightBarIDAhref = styled.a`
    color: black;
    text-decoration: none;
`;

export const MainContentBox = styled(Box)`
    flex-grow: 1;
    padding-top: 50px;
`;

export const MainTagBox = styled(Box)`
    width: 100%;
`;

export const MainTagTypography = styled(Typography)`
`;

export const MainContentContainer = styled(Container)`
    min-height: 50dvh;
`;

export const MainInfoBox = styled(Box)`
`;

export const MainInfoUserIDBox = styled(Box)`
`;

export const MainInfoTypography = styled(Typography)`
`;

export const BannerViewsBox = styled(Box)`
`;

export const BannerViewsTypography = styled(Typography)`
    color: white;
`;

export const CommentBox = styled(Box)`
    display: flex;
    flex-direction: column;
    padding-top: 20px;
`;

export const CommentTitleTypography = styled(Typography)`
    width: 100%;
`;

export const CommentInputBox = styled(Box)`
    width: 100%;
`;

export const CommentInputButtonBox = styled(Box)`
    display:flex;
    width: 100%;
    justify-content: end;
`;

export const CommentDataBox = styled(Box)`
    display: flex;
    flex-direction: column;
    margin-top: 10px;
`;

export const CommentStack = styled(Stack)`
`;

export const CommentDataInfoBox = styled(Box)`
`;

export const CommentUserTypography = styled(Typography)`
`;

export const CommentDateTypography = styled(Typography)`
`;