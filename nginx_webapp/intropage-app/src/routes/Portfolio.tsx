import * as S from '../styles/Portfolio_Style'
import Footer from '../components/Footer'
import { Slide, Grow, Container, Grid, Button, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../redux/hooks';
import { loading, done } from '../redux/feature/LoadingReducer';
import { CallAPI, Posts_APIResponse, isPostsAPIResponse } from '../funcs/CallAPI';

function Portfolio()
{
    const dispatch = useAppDispatch();
    const [postdata, setPostdata] = useState({} as Posts_APIResponse);

    const expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
    const regex = new RegExp(expression);

    const handleImageError = (e : any) => {
        e.target.src = "/No_Image.jpg"
    }

    const form = useRef<HTMLFormElement>(null);
            
    const sendEmail = (event : React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if(form.current)
        {
            alert(1);
            if(typeof process.env.REACT_APP_EMAILJS_SERVICE_ID === 'string' &&
            typeof process.env.REACT_APP_EMAILJS_TEMPLATE_ID === 'string' &&
            typeof process.env.REACT_APP_EMAILJS_PUBLIC_KEY === 'string')
            {
                alert(2);
                emailjs.sendForm(process.env.REACT_APP_EMAILJS_SERVICE_ID, process.env.REACT_APP_EMAILJS_TEMPLATE_ID, form.current, process.env.REACT_APP_EMAILJS_PUBLIC_KEY).then(
                    result => {
                        alert("성공적으로 이메일이 전송되었습니다.");
                        form.current?.reset();
                    },
                    error => {
                        console.log(error.text);
                        alert("이메일이 전송이 실패되었습니다.");
                    },
                );
            }
        }
    };

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
                        <Typography variant="h4">
                            Contact Me
                        </Typography>
                    </S.ContactTitle>
                    <S.ContactContainer maxWidth="md">
                        <S.ContactForm ref={form} onSubmit={sendEmail}>
                            <S.ContactEmailBox>
                                <S.ContactEmailTextField type="email" name="contact_useremail" placeholder="example@email.com" required />
                            </S.ContactEmailBox>
                            <S.ContactTitleBox>
                                <S.ContactTitleTextField
                                    type="text"
                                    name="contact_title"
                                    placeholder="Type Email Title. (Max 30)"
                                    inputProps={{ maxLength: 30 }}
                                    required
                                />
                            </S.ContactTitleBox>
                            <S.ContactMessageBox>
                                <S.ContactTextField name="contact_message" inputProps={{ maxLength: 2000 }} placeholder="Type Contents. (Max 2000)" required multiline/>
                            </S.ContactMessageBox>
                            <S.ContactSubmitBox>
                                <Button variant="contained" type="submit">Contact</Button>
                            </S.ContactSubmitBox>
                        </S.ContactForm>
                    </S.ContactContainer>
                </S.ContactBox>
            </S.SectionContact>
            <Footer/>
        </S.PortfolioBox>
    );
}

export default Portfolio;