import { useState, useEffect, useCallback } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { Typography, Container, Paper, Slide } from '@mui/material';
import * as S from '../styles/Categorize_Style';
import { CallAPI, Categories_APIResponse, isCategoriesAPIResponse } from '../funcs/CallAPI';
import { createTheme } from '@mui/material/styles';

function Categorize()
{
    const [category, setCategory] = useState({} as Categories_APIResponse);
    const theme = createTheme();

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

    const getRandomCardColors = useCallback(() => {
        const paleetes_card = ['#56DAF0', '#F062A5', '#4AF0AB', '#F08732', '#3EF041'];
        return paleetes_card[Math.floor(Math.random() * 5)];
    }, []);

    useEffect(() => {
        (async () => {
            const res = await CallAPI({APIType: "CategoryList", Method: "GET"});
            if(isCategoriesAPIResponse(res))
                setCategory(res);
        })();
        
    }, []);

    return (
        <S.CategoryBlock>
            <ThemeProvider theme={theme}>
                <S.SectionBanner>
                    <Slide in={true} >
                        <S.BannerBox>
                            <S.BannerTypography variant='h3' color='white'>
                                Categories
                            </S.BannerTypography>
                        </S.BannerBox>
                    </Slide>
                </S.SectionBanner>
                <S.SectionCategoryGrid>
                    <Container maxWidth="xl">
                        <S.CategoriesGridBox>
                            <S.CategoriesGridContainer container spacing={1}>
                                {category?.categories?.length > 0 ?
                                category.categories.map((item, index) => (
                                    <S.CategoriesGrid item key={index} xs={12} sm={8} md={4}>
                                        <Paper>3
                                            <Link to={`/search?c=${item.categoryid}`} style={{ textDecoration: 'none', color: 'black' }}>
                                                <S.CategoryBox>
                                                    <S.CategoryTitleBox sx={{ backgroundColor : getRandomCardColors() }}>
                                                        <Typography variant='h5'>{item.categoryid}</Typography>
                                                    </S.CategoryTitleBox>
                                                    <S.CategorySubTitleBox>
                                                        <S.CategorySubTitleTypography variant='subtitle1'>{item.categorydescription === null || item.categorydescription === "" ? item.categoryid : item.categorydescription}</S.CategorySubTitleTypography>
                                                    </S.CategorySubTitleBox>
                                                </S.CategoryBox>
                                            </Link>
                                        </Paper>
                                    </S.CategoriesGrid>
                                )) : 
                                    <S.CategoriesGrid item xs={12} sm={8} md={4}>
                                        <Paper>
                                            <S.CategoryBox>
                                                <S.CategoryTitleBox sx={{ backgroundColor : getRandomCardColors() }}>
                                                    <Typography variant='h5'>Empty Category</Typography>
                                                </S.CategoryTitleBox>
                                                <S.CategorySubTitleBox>
                                                    <S.CategorySubTitleTypography variant='subtitle1'>Empty SubTitle</S.CategorySubTitleTypography>
                                                </S.CategorySubTitleBox>
                                            </S.CategoryBox>
                                        </Paper>
                                    </S.CategoriesGrid>
                                }
                            </S.CategoriesGridContainer>
                        </S.CategoriesGridBox>
                    </Container>
                </S.SectionCategoryGrid>
            </ThemeProvider>
        </S.CategoryBlock>
    );
}

export default Categorize;