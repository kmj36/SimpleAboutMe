import {
    Paper,
    Typography,
    Box,
    Grid,
    Stack
} from '@mui/material';
import { createTheme } from '@mui/material/styles';

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

export const SectionBanner = styled(Box)`
    display: flex;
    justify-content: center;
    align-items: flex-start;
    flex-direction: column;
    width: 100%;
    height: 20rem;
    background-image: url("startup.jpg");
    color: white;
`;

export const HomeBannerBox = styled(Box)`
    /* 데스크탑 */
    display: flex;
    flex-direction: row;
    width: 100%;

    @media screen and (max-width:1023px) {
    /* 타블렛 */
        flex-direction: column;
    }

    @media screen and (max-width:767px) {
    /* 모바일 */
        flex-direction: column;
    }
`;

export const HomeTitleBox = styled(Box)`
    display: flex;
    max-width: 500px;
    flex-direction: column;
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    margin: 5px;

    @media screen and (max-width:1023px) {
    /* 타블렛 */
        max-width: 100%;
    }

    @media screen and (max-width:767px) {
    /* 모바일 */
        max-width: 100%;
    }
`;

export const HomeBannerSearchBox = styled(Box)`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    justify-content: center;
    margin: 5px;
    Button {
        margin: 5px;
        margin-left: auto;
        width: 100px;
        @media screen and (max-width:1023px) {
        /* 타블렛 */
            display: none;
        }
    
        @media screen and (max-width:767px) {
        /* 모바일 */
            display: none;
        }
    }
`;

export const Title = styled(Typography)`
    width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
`;

export const SubTitle = styled(Typography)`
    width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
    display: -webkit-box;
    -webkit-line-clamp: 7;
    -webkit-box-orient: vertical;
    
    @media screen and (max-width:1023px) {
    /* 타블렛 */
        -webkit-line-clamp: 5;
    }

    @media screen and (max-width:767px) {
    /* 모바일 */
        -webkit-line-clamp: 5;
    }
`;

export const SectionPopular = styled(Box)`
    display: flex;
    padding-top: 50px;
`;

export const HomeTopBox = styled(Box)`
    display: flex;
    justify-content: space-between;
`;

export const HomeTopImageBox = styled(Box)`
    width: 60%;
    height: 512px;
    position: relative;
    border-radius: 10px;

    @media screen and (max-width:1023px) {
    /* 타블렛 */
        width: 100%;
        height: 448px;
    }

    @media screen and (max-width:767px) {
    /* 모바일 */
        width: 100%;
        height: 384px;
    }
`;

export const HomeTopImageTitleWrapper = styled(Box)`
    display: flex;
    align-items: flex-end;
    position: absolute;
    width: 100%;
    height: 100%;
`;

export const HomeTopImageTitleBox = styled(Box)`
    width: 100%;
    padding-bottom: 60px;
    padding-left: 50px;
    padding-right: 50px;
    border-radius: 10px;
`;

export const HomeTopImageTitleTypography = styled(Typography)`
    width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    padding-top: 10px;
`;

export const HomeTopImageTitleDate = styled(Box)`
    width: 100%;
    display: flex;
    padding-top: 10px;
`;

export const HomeTopImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: absolute;
    border-radius: 10px;
`;

export const ImageOverlayGradient = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%);
    border-radius: 10px;
`;

export const HomeTopCardsBox = styled(Box)`
    display: flex;
    width: 384px;
    height: 512px;
    @media screen and (max-width:1023px) {
    /* 타블렛 */
        display: none;
    }

    @media screen and (max-width:767px) {
    /* 모바일 */
        display: none;
    }
`;

export const TopCardCategoryBox = styled(Box)`
    width: 100%;
`;

export const HomeTopStack = styled(Stack)`
    width: 100%;
`;

export const HomeTopPaper = styled(Paper)`
    height: 128px;
`;

export const TopCardTagsBox = styled(Box)`
    margin-left: 5px;
`;

export const TopCardTypography = styled(Typography)`
    width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
`;

export const SectionBlog = styled(Box)`
    display: flex;
    padding-top: 50px;
    padding-bottom: 50px;
`;

export const BlogBox = styled(Box)`
    display: flex;
    flex-direction: column;
`;

export const BlogBoxTypography = styled(Typography)`
    width: 100%;
    padding-bottom: 10px;
`;

export const BlogBoxGrid = styled(Grid)`
    padding-left: 10px;
    padding-right: 10px;
`;

export const BlogBoxGridPaper = styled(Paper)`
    width: 100%;
    height: 418px;
    @media screen and (max-width:1023px) {
    /* 타블렛 */
        height: 336px;
    }

    @media screen and (max-width:767px) {
    /* 모바일 */
        height: 324px;
    }
`;

export const BlogBoxGridPaperTopImageBox = styled(Box)`
    width: 100%;
    height: 208px;
    @media screen and (max-width:1023px) {
    /* 타블렛 */
        height: 144px;
    }

    @media screen and (max-width:767px) {
    /* 모바일 */
        height: 144px;
    }
`;

export const BlogBoxGridPaperTopImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 5px;
`;

export const BlogBoxGridPaperTitle = styled(Box)`
    width: 100%;
    padding: 5px;
`;

export const BlogBoxGridPaperTitleTypography = styled(Typography)`
    width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
`;

export const BlogBoxGridPaperContent = styled(Box)`
    width: 100%;
    padding: 5px;
`;

export const BlogBoxGridPaperContentTypography = styled(Typography)`
    width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
`;

export const BlogBoxGridPaperDateBox = styled(Box)`
    width: 100%;
    padding: 5px;
`;

export const BlogBoxGridPaperDateTypography = styled(Typography)`
    width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
`;

export const SectionFeatured = styled(Box)`
    display: flex;
    margin-top: 100px;
    padding-top: 200px;
    padding-bottom: 200px;
    background-color: #335147;
`;

export const SectionSNS = styled(Box)`
    display: flex;
    padding-top: 50px;
    padding-bottom: 50px;
`;

export const FeaturedTitleTypography = styled(Typography)`
    width: 100%;
    text-align: center;
`;

export const FeaturedGrid = styled(Grid)`
    padding-top: 50px;
`;

export const FeaturedGridPaper = styled(Paper)`
    width: 100%;
    height: 320px;
    position: relative;

    @media screen and (max-width:1023px) {
        height: 256px;
    }

    @media screen and (max-width:767px) {
        height: 192px;
    }
`;

export const FeaturedGridImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: absolute;
    border-radius: 10px;
`;

export const FeaturedTitleBox = styled(Box)`
    display: flex;
    position: absolute;
    width: 100%;
    height: 100%;
    align-items: flex-end;
`;

export const FeaturedTitleBoxWrapper = styled(Box)`
    width: 100%;
    padding-bottom: 20px;
    padding-left: 25px;
    padding-right: 25px;

    @media screen and (max-width:1023px) {
        padding-bottom: 10px;
        padding-left: 15px;
        padding-right: 15px;
    }

    @media screen and (max-width:767px) {
        padding-bottom: 10px;
        padding-left: 15px;
        padding-right: 15px;
    }
`;

export const FeaturedGridTitleTypography = styled(Typography)`
    width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    color: white;
`;

export const FeaturedGridTitleDate = styled(Box)`
    width: 100%;
    display: flex;
    padding-top: 5px;
`;

export const SNSBox = styled(Box)`
    display: flex;
    flex-direction: row;
`;