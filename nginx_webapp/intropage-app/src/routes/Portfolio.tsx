import * as S from '../styles/Portfolio_Style'
import Footer from '../components/Footer'
import { Slide, Grow, Container, Grid, TextField } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../redux/hooks';
import { loading, done } from '../redux/feature/LoadingReducer';
import { CallAPI, Posts_APIResponse, isPostsAPIResponse } from '../funcs/CallAPI';

function Portfolio()
{
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [postdata, setPostdata] = useState({} as Posts_APIResponse);

    const expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
    const regex = new RegExp(expression);

    const handleImageError = (e : any) => {
        e.target.src = "/No_Image.jpg"
    }

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
                                <Grid container spacing={3} sx={{paddingTop: '20px', paddingBottom: '40px'}}>
                                    <S.FeaturedGrid item xs={12} sm={12} md={4}>
                                        <Link to={'/post/' + postdata?.posts?.at(0)?.postid}>
                                            <S.ProjectImageBox>
                                                <S.ProjectImage src={postdata?.posts && regex.test(postdata.posts[0]?.thumbnailurl) ? postdata.posts[0]?.thumbnailurl : "No_Image.jpg"} onError={handleImageError}/>
                                                <S.ImageOverlayGradient />
                                                <S.ProjectDetailBox>
                                                    <S.ProjectDetail>
                                                        <S.ProjectDetailTitleTypography variant='h5'>Project. {postdata?.posts?.at(0)?.title}</S.ProjectDetailTitleTypography>
                                                        <S.ProjectDetailContentTypography variant='body1'>{postdata?.posts?.at(0)?.content}</S.ProjectDetailContentTypography>
                                                    </S.ProjectDetail>
                                                </S.ProjectDetailBox>
                                            </S.ProjectImageBox>
                                        </Link>
                                    </S.FeaturedGrid>
                                    <S.FeaturedGrid item xs={12} sm={12} md={4}>
                                        <Link to={'/post/' + postdata?.posts?.at(1)?.postid}>
                                            <S.ProjectImageBox>
                                                <S.ProjectImage src={postdata?.posts && regex.test(postdata.posts[1]?.thumbnailurl) ? postdata.posts[1]?.thumbnailurl : "No_Image.jpg"} onError={handleImageError}/>
                                                <S.ImageOverlayGradient />
                                                <S.ProjectDetailBox>
                                                    <S.ProjectDetail>
                                                        <S.ProjectDetailTitleTypography variant='h5'>Project. {postdata?.posts?.at(1)?.title}</S.ProjectDetailTitleTypography>
                                                        <S.ProjectDetailContentTypography variant='body1'>{postdata?.posts?.at(1)?.content}</S.ProjectDetailContentTypography>
                                                    </S.ProjectDetail>
                                                </S.ProjectDetailBox>
                                            </S.ProjectImageBox>
                                        </Link>
                                    </S.FeaturedGrid>
                                    <S.FeaturedGrid item xs={12} sm={12} md={4}>
                                        <Link to={'/post/' + postdata?.posts?.at(2)?.postid}>
                                            <S.ProjectImageBox>
                                                <S.ProjectImage src={postdata?.posts && regex.test(postdata.posts[2]?.thumbnailurl) ? postdata.posts[2]?.thumbnailurl : "No_Image.jpg"} onError={handleImageError}/>
                                                <S.ImageOverlayGradient />
                                                <S.ProjectDetailBox>
                                                    <S.ProjectDetail>
                                                        <S.ProjectDetailTitleTypography variant='h5'>Project. {postdata?.posts?.at(2)?.title}</S.ProjectDetailTitleTypography>
                                                        <S.ProjectDetailContentTypography variant='body1'>{postdata?.posts?.at(2)?.content}</S.ProjectDetailContentTypography>
                                                    </S.ProjectDetail>
                                                </S.ProjectDetailBox>
                                            </S.ProjectImageBox>
                                        </Link>
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