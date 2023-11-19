import { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { Typography, Container, Paper, Slide } from '@mui/material';
import * as S from '../../styles/Categorize_Style';
import { CallAPI, Categories_APIResponse, isCategoriesAPIResponse } from '../../funcs/CallAPI';
import { useAppDispatch } from '../../redux/hooks';
import { loading, done } from '../../redux/feature/LoadingReducer';
import Footer from '../../components/Footer';

function Categorize()
{
    const dispatch = useAppDispatch();
    const [category, setCategory] = useState({} as Categories_APIResponse);

    useEffect(() => {
        (async () => {
            dispatch(loading());
            const res = await CallAPI({APIType: "CategoryList", Method: "GET"});
            if(isCategoriesAPIResponse(res))
                setCategory(res);
            dispatch(done());
        })();
        
    }, []);

    return (
        <S.CategoryBlock>
            <ThemeProvider theme={S.theme}>
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
                                {category.categories?.map((item, index) => (
                                    <S.CategoriesGrid item key={index} xs={12} sm={6} md={2.4}>
                                        <Paper>
                                            <Link to={`/search?c=${item.categoryid}`} style={{ textDecoration: 'none', color: 'black' }}>
                                                <S.CategoryBox>
                                                    <S.CategoryTitleBox sx={{ backgroundColor : S.getRandomCardColors() }}>
                                                        <Typography variant='h5'>{item.categoryid}</Typography>
                                                    </S.CategoryTitleBox>
                                                    <S.CategorySubTitleBox>
                                                        <S.CategorySubTitleTypography variant='subtitle1'>{item.categorydescription === null || item.categorydescription === "" ? item.categoryid : item.categorydescription}</S.CategorySubTitleTypography>
                                                    </S.CategorySubTitleBox>
                                                </S.CategoryBox>
                                            </Link>
                                        </Paper>
                                    </S.CategoriesGrid>
                                ))}
                            </S.CategoriesGridContainer>
                        </S.CategoriesGridBox>
                    </Container>
                </S.SectionCategoryGrid>
            </ThemeProvider>
            <Footer/>
        </S.CategoryBlock>
    );
}

export default Categorize;