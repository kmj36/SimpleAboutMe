import styled from 'styled-components';
import {
    Box,
    Typography,
    Grid
} from '@mui/material';

export const CategoryBlock = styled(Box)`
`;

export const SectionBanner = styled(Box)`
    height: 18rem;
    background-image: url("/categories.jpg");
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

export const CategoriesGridContainer = styled(Grid)`
    justify-content: center;
`;

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