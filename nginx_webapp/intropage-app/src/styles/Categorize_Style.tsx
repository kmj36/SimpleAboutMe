import styled from 'styled-components';
import {
    Box,
    Typography,
    Grid
} from '@mui/material';

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
    background-color: ${getRandomBannerColors()};
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