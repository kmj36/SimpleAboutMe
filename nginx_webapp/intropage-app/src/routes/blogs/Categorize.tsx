import { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Grid, Container, Paper, Slide } from '@mui/material';
import styled from 'styled-components';

function getRandom(min : number, max : number) : number
{
	return Math.floor(Math.random() * (max - min + 1) + min);
}

const palettes : string[] = ['#12FC99' , '#FCB312', '#12DDFC', '#FC7A12', '#449AA7'];

const paleetes_card : string[] = ['#56DAF0', '#F062A5', '#4AF0AB', '#F08732', '#3EF041'];

const CategoryBlock = styled(Box)`
`;

const SectionBanner = styled(Box)`
    height: 18rem;
    background-color: ${palettes[getRandom(0,4)]};
`;

const BannerBox = styled(Box)`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
`;

const BannerTypography = styled(Typography)``;

const SectionCategoryGrid = styled(Box)`
    padding-top: 20px;
`;

const CategoriesGridBox = styled(Box)``;

const CategoriesGridContainer = styled(Grid)``;

const CategoriesGrid = styled(Grid)``;

const CategoryBox = styled(Box)``;

const CategoryTitleBox = styled(Box)`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100px;
`;

const CategorySubTitleBox = styled(Box)`
    padding-left: 10px;
    padding-right: 10px;
    height: 60px;
`;

function Categorize({setLoading} : {setLoading: any})
{
    interface Category {
        categoryid: string;
        userid: string;
        categorydescription: string;
        created_at: string;
        updated_at: string;
    }

    interface APIResponse {
        code: number;
        status: string;
        detail: string;
        message: string;
        request_time: string;
    }

    interface APIResponse_Categories extends APIResponse  {
        categories: Category[];
    }

    const [category, setCategory] = useState({} as APIResponse_Categories);

    useEffect(() => {
        (async () => {
            setLoading(true);
            const response = await axios.get('http://127.0.0.1:8000/api/v1/category/');
            setCategory(response.data);
            setLoading(false);
        })();
        
    }, []);

    return (
        <CategoryBlock>
            <SectionBanner>
                <Slide in={true} >
                    <BannerBox>
                        <BannerTypography variant='h3'>
                            Post Categories
                        </BannerTypography>
                    </BannerBox>
                </Slide>
            </SectionBanner>
            <SectionCategoryGrid>
                <Container maxWidth="xl">
                    <CategoriesGridBox>
                        <CategoriesGridContainer container spacing={1}>
                            {category.categories?.map((item, index) => (
                                <CategoriesGrid item key={index} xs={2.4}>
                                    <Paper>
                                        <CategoryBox>
                                            <CategoryTitleBox sx={{ backgroundColor : paleetes_card[getRandom(0,4)] }}>
                                                <Typography variant='h4'>{item.categoryid}</Typography>
                                            </CategoryTitleBox>
                                            <CategorySubTitleBox>
                                                <Typography variant='subtitle1'>{item.categorydescription === null || item.categorydescription === "" ? item.categoryid : item.categorydescription}</Typography>
                                            </CategorySubTitleBox>
                                        </CategoryBox>
                                    </Paper>
                                </CategoriesGrid>
                            ))}
                        </CategoriesGridContainer>
                    </CategoriesGridBox>
                </Container>
            </SectionCategoryGrid>
        </CategoryBlock>
    );
}

export default Categorize;