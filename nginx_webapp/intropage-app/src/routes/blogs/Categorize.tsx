import { useState, useEffect } from 'react';
import { Typography, Container, Paper, Slide } from '@mui/material';
import * as S from '../../styles/Categorize_Style';
import { CallAPI, Categories_APIResponse, isCategoriesAPIResponse } from '../../funcs/CallAPI';

function Categorize({setLoading} : {setLoading: any})
{
    const [category, setCategory] = useState({} as Categories_APIResponse);

    useEffect(() => {
        (async () => {
            setLoading(true);
            const res = await CallAPI({APIType: "CategoryList", Method: "GET"});
            if(isCategoriesAPIResponse(res))
                setCategory(res);
            setLoading(false);
        })();
        
    }, []);

    return (
        <S.CategoryBlock>
            <S.SectionBanner>
                <Slide in={true} >
                    <S.BannerBox>
                        <S.BannerTypography variant='h3'>
                            Post Categories
                        </S.BannerTypography>
                    </S.BannerBox>
                </Slide>
            </S.SectionBanner>
            <S.SectionCategoryGrid>
                <Container maxWidth="xl">
                    <S.CategoriesGridBox>
                        <S.CategoriesGridContainer container spacing={1}>
                            {category.categories?.map((item, index) => (
                                <S.CategoriesGrid item key={index} xs={2.4}>
                                    <Paper>
                                        <S.CategoryBox>
                                            <S.CategoryTitleBox sx={{ backgroundColor : S.getRandomCardColors() }}>
                                                <Typography variant='h4'>{item.categoryid}</Typography>
                                            </S.CategoryTitleBox>
                                            <S.CategorySubTitleBox>
                                                <Typography variant='subtitle1'>{item.categorydescription === null || item.categorydescription === "" ? item.categoryid : item.categorydescription}</Typography>
                                            </S.CategorySubTitleBox>
                                        </S.CategoryBox>
                                    </Paper>
                                </S.CategoriesGrid>
                            ))}
                        </S.CategoriesGridContainer>
                    </S.CategoriesGridBox>
                </Container>
            </S.SectionCategoryGrid>
        </S.CategoryBlock>
    );
}

export default Categorize;