import * as S from '../styles/Portfolio_Style'
import { Slide, Grow, Container, Grid, Button, Typography } from '@mui/material';
import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import emailjs from '@emailjs/browser';
import { Link } from 'react-router-dom';
import { CallAPI, Posts_APIResponse, isPostsAPIResponse } from '../funcs/CallAPI';

function Portfolio()
{
    const [postdata, setPostdata] = useState({} as Posts_APIResponse);

    const expression = /[-a-zA-Z0-9@:%._~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_.~#?&//=]*)?/gi;
    const regex = new RegExp(expression);

    const handleImageError : React.ReactEventHandler<HTMLImageElement> = useCallback((event : React.SyntheticEvent<HTMLImageElement, Event>) => {
        event.currentTarget.src = "/No_Image.jpg"
    }, []);

    const form = useRef<HTMLFormElement>(null);
            
    const sendEmail = useCallback((event : React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if(form.current)
        {
            if(typeof process.env.REACT_APP_EMAILJS_SERVICE_ID === 'string' &&
            typeof process.env.REACT_APP_EMAILJS_TEMPLATE_ID === 'string' &&
            typeof process.env.REACT_APP_EMAILJS_PUBLIC_KEY === 'string')
            {
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
    }, []);

    useEffect(() =>  {
        (async () => {
            const posts = await CallAPI({APIType:"PostList", Method:"GET", Query:"categoryid=[Project]&order=review"});
            if(isPostsAPIResponse(posts))
                setPostdata(posts); 
        })();
    }, []);

    return (
        <S.PortfolioBox>
            <S.SectionBanner>
                <Slide in={true}>
                    <S.BannerBox>
                        <S.BannerTypography variant="h4">
                            My Portfolio
                        </S.BannerTypography>
                        <S.BannerTypographySubTitle variant="h6" color="gray">
                            My Job is Cybersecurity Specialist.
                        </S.BannerTypographySubTitle>
                    </S.BannerBox>
                </Slide>
            </S.SectionBanner>
            <S.SectionFeatured>
                <Grow in={true} timeout={1600}>
                    <Container maxWidth="xl" sx={useMemo(() =>({ height: '100%' }), [])}>
                        <S.FeaturedBox>
                            <S.FeaturedTitleBox>
                                <S.FeaturedTitleTypography variant="h4">
                                    Projects
                                </S.FeaturedTitleTypography>
                            </S.FeaturedTitleBox>
                            <S.FeaturedProjectsBox>
                                <Grid container spacing={3} sx={useMemo(() =>({paddingTop: '20px', paddingBottom: '40px'}), [])}>
                                    {
                                        [0,1,2].map((value) => {
                                            return (
                                                <S.FeaturedGrid item xs={12} sm={12} md={4}>
                                                    <S.ProjectImageBox>
                                                        <Link to={postdata?.posts?.at(value) ? '/post/' + postdata.posts[value].postid : '/portfolio'}>
                                                            <S.ProjectImage src={postdata?.posts?.at(value) && regex.test(postdata.posts[value].thumbnailurl) ? postdata.posts[value].thumbnailurl : "/No_Image.jpg"} onError={handleImageError}/>
                                                            <S.ImageOverlayGradient />
                                                            <S.ProjectDetailBox>
                                                                <S.ProjectDetail>
                                                                    <S.ProjectDetailTitleTypography variant='h5'>{postdata?.posts?.at(value) ? "Project." + postdata.posts[value].title : "Empty Project"}</S.ProjectDetailTitleTypography>
                                                                    <S.ProjectDetailContentTypography variant='body1'>{postdata?.posts?.at(value) ? postdata.posts[value].content : "Empty Content"}</S.ProjectDetailContentTypography>
                                                                </S.ProjectDetail>
                                                            </S.ProjectDetailBox>
                                                        </Link>
                                                    </S.ProjectImageBox>
                                                </S.FeaturedGrid>
                                            );
                                        })
                                    }
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
                                    inputProps={useMemo(() =>({ maxLength: 30 }), [])}
                                    required
                                />
                            </S.ContactTitleBox>
                            <S.ContactMessageBox>
                                <S.ContactTextField name="contact_message" inputProps={useMemo(() =>({ maxLength: 2000 }), [])} placeholder="Type Contents. (Max 2000)" required multiline/>
                            </S.ContactMessageBox>
                            <S.ContactSubmitBox>
                                <Button variant="contained" type="submit">Contact</Button>
                            </S.ContactSubmitBox>
                        </S.ContactForm>
                    </S.ContactContainer>
                </S.ContactBox>
            </S.SectionContact>
        </S.PortfolioBox>
    );
}

export default Portfolio;