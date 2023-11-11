import styled from 'styled-components';
import { createTheme } from '@mui/material/styles';
import {
    Box,
    Typography,
    Grid
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

export function getRandomBannerColors() : string
{
	return palettes[Math.floor(Math.random() * 5)];
}

export function getRandomCardColors() : string
{
	return paleetes_card[Math.floor(Math.random() * 5)];
}

export const palettes : string[] = ['#12FC99' , '#FCB312', '#12DDFC', '#FC7A12', '#449AA7'];

export const paleetes_card : string[] = ['#56DAF0', '#F062A5', '#4AF0AB', '#F08732', '#3EF041'];

export const CategoryBlock = styled(Box)`
`;

export const SectionBanner = styled(Box)`
    height: 18rem;
    background-image: url('categories.jpg');
    background-size: cover;
`;

export const BannerBox = styled(Box)`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
`;

export const BannerTypography = styled(Typography)``;

export const SectionCategoryGrid = styled(Box)`
    padding-top: 20px;
`;

export const CategoriesGridBox = styled(Box)``;

export const CategoriesGridContainer = styled(Grid)``;

export const CategoriesGrid = styled(Grid)``;

export const CategoryBox = styled(Box)``;

export const CategoryTitleBox = styled(Box)`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100px;
`;

export const CategorySubTitleBox = styled(Box)`
    padding-left: 10px;
    padding-right: 10px;
    height: 60px;
`;

export const CategorySubTitleTypography = styled(Typography)`
    width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
`;