import { useEffect, useState, useRef, Fragment } from 'react';
import { Link } from 'react-router-dom';
import {
    Divider,
    Paper,
    Typography,
    Container,
    Box,
    Slide,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Chip,
    TextField,
    InputAdornment,
    Button,
    Grow,
    Stack
} from '@mui/material';
import { Search, Send, DateRange } from '@material-ui/icons';
import styled from 'styled-components';
import Footer from '../components/Footer';

const SectionBanner = styled(Box)`
    display: flex;
    justify-content: center;
    align-items: flex-start;
    flex-direction: column;
    width: 100%;
    height: 20rem;
    background-image: url("startup.jpg");
    color: white;
`;

const HomeBannerBox = styled(Box)`
    /* 데스크탑 */
    display: flex;
    flex-direction: row;
    width: 100%;

    @media screen and (max-width:1023px) {
    /* 타블렛 */
        flex-direction: column;
    }

    @media screen and (max-width:767px) {
    /* 모바일 */
        flex-direction: column;
    }
`;

const HomeTitleBox = styled(Box)`
    display: flex;
    max-width: 500px;
    flex-direction: column;
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    margin: 5px;

    @media screen and (max-width:1023px) {
    /* 타블렛 */
        max-width: 100%;
    }

    @media screen and (max-width:767px) {
    /* 모바일 */
        max-width: 100%;
    }
`;

const HomeBannerSearchBox = styled(Box)`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    justify-content: center;
    margin: 5px;
    Button {
        margin: 5px;
        margin-left: auto;
        width: 100px;
        @media screen and (max-width:1023px) {
        /* 타블렛 */
            display: none;
        }
    
        @media screen and (max-width:767px) {
        /* 모바일 */
            display: none;
        }
    }
`;

const Title = styled(Typography)`
    width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
`;

const SubTitle = styled(Typography)`
    width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
    display: -webkit-box;
    -webkit-line-clamp: 7;
    -webkit-box-orient: vertical;
    
    @media screen and (max-width:1023px) {
    /* 타블렛 */
        -webkit-line-clamp: 5;
    }

    @media screen and (max-width:767px) {
    /* 모바일 */
        -webkit-line-clamp: 5;
    }
`;

const SectionPopular = styled(Box)`
    display: flex;
    padding-top: 50px;
`;

const HomeTopBox = styled(Box)`
    display: flex;
    justify-content: space-between;
`;

const HomeTopImageBox = styled(Box)`
    width: 60%;
    height: 512px;
    position: relative;
    border-radius: 10px;

    @media screen and (max-width:1023px) {
    /* 타블렛 */
        width: 100%;
        height: 448px;
    }

    @media screen and (max-width:767px) {
    /* 모바일 */
        width: 100%;
        height: 384px;
    }
`;

const HomeTopImageTitleWrapper = styled(Box)`
    display: flex;
    align-items: flex-end;
    position: absolute;
    width: 100%;
    height: 100%;
`;

const HomeTopImageTitleBox = styled(Box)`
    width: 100%;
    padding-bottom: 60px;
    padding-left: 50px;
    padding-right: 50px;
    border-radius: 10px;
`;

const HomeTopImageTitleTypography = styled(Typography)`
    width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    padding-top: 10px;
`;

const HomeTopImageTitleDate = styled(Box)`
    width: 100%;
    display: flex;
    padding-top: 10px;
`;

const HomeTopImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: absolute;
    border-radius: 10px;
`;

const HomeTopImageOverlayGradient = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%);
    border-radius: 10px;
`;

const HomeTopCardsBox = styled(Box)`
    display: flex;
    width: 384px;
    height: 512px;
    @media screen and (max-width:1023px) {
    /* 타블렛 */
        display: none;
    }

    @media screen and (max-width:767px) {
    /* 모바일 */
        display: none;
    }
`;

const TopCardCategoryBox = styled(Box)`
    width: 100%;
`;

const HomeTopStack = styled(Stack)`
    width: 100%;
`;

const HomeTopPaper = styled(Paper)`
    height: 128px;
`;

const TopCardTagsBox = styled(Box)`
    margin-left: 5px;
`;

const TopCardTypography = styled(Typography)`
    width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
`;

const SectionBlog = styled(Box)`
    display: flex;
    padding-top: 50px;
    padding-bottom: 50px;
`;

const BlogBox = styled(Box)`
    display: flex;
    justify-content: space-between;
`;

function Home({setLoading} : {setLoading: any})
{
    const containerRef = useRef(null);

    useEffect(() =>  {
        (async () => {
            setLoading(true);
            setLoading(false);
        })();
    }, []);

    return (
        <Box ref={containerRef}>
            <Slide in={true} container={containerRef.current} timeout={600}>
                <SectionBanner>
                    <Container>
                        <HomeBannerBox>
                            <HomeTitleBox>
                                <Title variant="h4">Lorem ipsum dolor</Title>
                                <SubTitle variant="subtitle1">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                                </SubTitle>
                            </HomeTitleBox>
                            <HomeBannerSearchBox>
                                <Paper>
                                    <Box sx={{ display: "flex", height: "100%"}}>
                                        <TextField
                                            id="input-with-icon-textfield"
                                            placeholder="Post Search"
                                            InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                <Search/>
                                                </InputAdornment>
                                            ),
                                            }}
                                            sx={{ width: "100%" }}
                                            color="primary"
                                            variant="standard"
                                        />
                                    </Box>
                                </Paper>
                                <Button variant="contained" endIcon={<Send />}>
                                    Search
                                </Button>
                            </HomeBannerSearchBox>
                        </HomeBannerBox>
                    </Container>
                </SectionBanner>
            </Slide>
            <SectionPopular>
                <Grow in={true} timeout={1200}>
                    <Container>
                        <HomeTopBox>
                            <HomeTopImageBox>
                                <HomeTopImage src="No_Image.jpg" />
                                <HomeTopImageOverlayGradient />
                                <HomeTopImageTitleWrapper>
                                    <HomeTopImageTitleBox>
                                        <Chip label="Example" variant='outlined'/>
                                        <HomeTopImageTitleTypography variant='h4' color="white">
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
                                        </HomeTopImageTitleTypography>
                                        <HomeTopImageTitleDate>
                                            <Typography variant='h5' color="white">
                                                <DateRange style={{width: "27px", height: "27px", paddingRight: 5}} />
                                                2023-10-09 / 12:00:12
                                            </Typography>
                                        </HomeTopImageTitleDate>
                                    </HomeTopImageTitleBox>
                                </HomeTopImageTitleWrapper>
                            </HomeTopImageBox>
                            <HomeTopCardsBox>
                                <HomeTopStack spacing={4}>
                                    <HomeTopPaper elevation={0}>
                                        <TopCardCategoryBox>
                                            <Chip label="Example" />
                                        </TopCardCategoryBox>
                                        <TopCardTypography variant='h5'>
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit
                                        </TopCardTypography>
                                        <TopCardTagsBox>
                                            <Typography variant='subtitle1' color="gray">
                                                #Lorem #ipsum #dolor #sit #amet
                                            </Typography>
                                        </TopCardTagsBox>
                                    </HomeTopPaper>
                                    <Divider/>
                                    <HomeTopPaper  elevation={0}>
                                        <TopCardCategoryBox>
                                            <Chip label="Example" />
                                        </TopCardCategoryBox>
                                        <TopCardTypography variant='h5'>
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit
                                        </TopCardTypography>
                                        <TopCardTagsBox>
                                            <Typography variant='subtitle1' color="gray">
                                                #Lorem #ipsum #dolor #sit #amet
                                            </Typography>
                                        </TopCardTagsBox>
                                    </HomeTopPaper>
                                    <Divider/>
                                    <HomeTopPaper elevation={0}>
                                        <TopCardCategoryBox>
                                            <Chip label="Example" />
                                        </TopCardCategoryBox>
                                        <TopCardTypography variant='h5'>
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit
                                        </TopCardTypography>
                                        <TopCardTagsBox>
                                            <Typography variant='subtitle1' color="gray">
                                                #Lorem #ipsum #dolor #sit #amet
                                            </Typography>
                                        </TopCardTagsBox>
                                    </HomeTopPaper>
                                </HomeTopStack>
                            </HomeTopCardsBox>
                        </HomeTopBox>
                    </Container>
                </Grow>
            </SectionPopular>
            <SectionBlog>
                <Grow in={true} timeout={1800}>
                    <Container>
                        <BlogBox>
                            <Typography variant='h5'>
                                Latest Posts
                            </Typography>
                        </BlogBox>
                    </Container>
                </Grow>
            </SectionBlog>
            <Footer />
        </Box>
    );
}

export default Home;