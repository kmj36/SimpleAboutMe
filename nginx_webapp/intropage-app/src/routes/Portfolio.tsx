import * as S from '../styles/Portfolio_Style'
import Footer from '../components/Footer'
import { Slide, Grow, Container, Grid, TextField } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useAppDispatch } from '../redux/hooks';
import { loading, done } from '../redux/feature/LoadingReducer';
import { CallAPI, Posts_APIResponse, isPostsAPIResponse } from '../funcs/CallAPI';

function Portfolio()
{
    const dispatch = useAppDispatch();
    const [postdata, setPostdata] = useState({} as Posts_APIResponse);

    useEffect(() =>  {
        (async () => {
            dispatch(loading());
            const posts = await CallAPI({APIType:"PostList", Method:"GET", Query:"categoryid=[Project]&order=review"});
            if(isPostsAPIResponse(posts))
                setPostdata(posts); 
            dispatch(done());
        })();
    }, []);

    return (
        <S.PortfolioBox>
            <S.SectionBanner>
                <Slide in={true}>
                    <S.BannerBox>
                        <S.BannerTypography variant="h4">
                            Hello, My Name is Kim MinJe.
                        </S.BannerTypography>
                        <S.BannerTypographySubTitle variant="h6" color="gray">
                            My Job is Cybersecurity Specialist.
                        </S.BannerTypographySubTitle>
                    </S.BannerBox>
                </Slide>
            </S.SectionBanner>
            <S.SectionFeatured>
                <Grow in={true} timeout={1600}>
                    <Container maxWidth="xl" sx={{ height: '100%' }}>
                        <S.FeaturedBox>
                            <S.FeaturedTitleBox>
                                <S.FeaturedTitleTypography variant="h4">
                                    My Projects
                                </S.FeaturedTitleTypography>
                            </S.FeaturedTitleBox>
                            <S.FeaturedProjectsBox>
                                <Grid container spacing={5} sx={{paddingTop: '20px', paddingBottom: '40px'}}>
                                    <S.FeaturedGrid item xs={12} sm={12} md={4}>
                                        <S.ProjectImageBox>
                                            <S.ProjectImage src="No_Image.jpg"/>
                                            <S.ImageOverlayGradient />
                                            <S.ProjectDetailBox>
                                                <S.ProjectDetail>
                                                    <S.ProjectDetailTitleTypography variant='h5'>Project. {'Title'}</S.ProjectDetailTitleTypography>
                                                    <S.ProjectDetailContentTypography variant='body1'>Content</S.ProjectDetailContentTypography>
                                                </S.ProjectDetail>
                                            </S.ProjectDetailBox>
                                        </S.ProjectImageBox>
                                    </S.FeaturedGrid>
                                    <S.FeaturedGrid item xs={12} sm={12} md={4}>
                                        <S.ProjectImageBox>
                                            <S.ProjectImage src="No_Image.jpg"/>
                                            <S.ImageOverlayGradient />
                                            <S.ProjectDetailBox>
                                                <S.ProjectDetail>
                                                    <S.ProjectDetailTitleTypography variant='h5'>Project. {'Title'}</S.ProjectDetailTitleTypography>
                                                    <S.ProjectDetailContentTypography variant='body1'>Content</S.ProjectDetailContentTypography>
                                                </S.ProjectDetail>
                                            </S.ProjectDetailBox>
                                        </S.ProjectImageBox>
                                    </S.FeaturedGrid>
                                    <S.FeaturedGrid item xs={12} sm={12} md={4}>
                                        <S.ProjectImageBox>
                                            <S.ProjectImage src="No_Image.jpg"/>
                                            <S.ImageOverlayGradient />
                                            <S.ProjectDetailBox>
                                                <S.ProjectDetail>
                                                    <S.ProjectDetailTitleTypography variant='h5'>Project. {'Title'}</S.ProjectDetailTitleTypography>
                                                    <S.ProjectDetailContentTypography variant='body1'>Content</S.ProjectDetailContentTypography>
                                                </S.ProjectDetail>
                                            </S.ProjectDetailBox>
                                        </S.ProjectImageBox>
                                    </S.FeaturedGrid>
                                </Grid>
                            </S.FeaturedProjectsBox>
                        </S.FeaturedBox>
                    </Container>
                </Grow>
            </S.SectionFeatured>
            <S.SectionContact>
                <S.ContactBox>
                    <S.ContactTitle>
                        <S.ContactTypography variant="h4">
                            Contact Me
                        </S.ContactTypography>
                    </S.ContactTitle>
                    <S.ContactFormBox>
                        <S.ContactContainer maxWidth="sm">
                            <S.ContactEmailBox>
                                <TextField id="standard-basic" label="Email" variant="outlined" sx={{ width: 'calc( 100% - 20px )' }} inputProps={{ maxLength: 65536 }}/>
                            </S.ContactEmailBox>
                            <S.ContactNameBox>
                                <TextField id="standard-basic" label="Name" variant="outlined" sx={{ width: 'calc( 100% - 20px )' }} inputProps={{ maxLength: 200 }}/>
                            </S.ContactNameBox>
                            <S.ContactMessageBox>
                                <TextField id="standard-basic" label="Message" variant="standard" multiline sx={{ width: '100%' }} inputProps={{ maxLength: 2000 }}/>
                            </S.ContactMessageBox>
                            <S.ContactSubmitBox>
                                <S.ContactSubmitButton variant="contained">
                                    Submit
                                </S.ContactSubmitButton>
                            </S.ContactSubmitBox>
                        </S.ContactContainer>
                    </S.ContactFormBox>
                </S.ContactBox>
            </S.SectionContact>
            <Footer/>
        </S.PortfolioBox>
    );
}

export default Portfolio;