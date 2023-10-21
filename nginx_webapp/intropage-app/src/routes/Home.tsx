import { useEffect, useRef } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import {
    Divider,
    Paper,
    Typography,
    Container,
    Box,
    Slide,
    Grid,
    Chip,
    TextField,
    InputAdornment,
    Button,
    Grow,
} from '@mui/material';
import { Search, Send, DateRange, Facebook, Instagram, Twitter, GitHub, RssFeed, YouTube } from '@material-ui/icons';
import * as S from '../styles/Home_Style';
import Footer from '../components/Footer';
import { useAppDispatch } from '../redux/hooks';
import { loading, done } from '../redux/feature/LoadingReducer';

function Home()
{
    const dispatch = useAppDispatch();
    const containerRef = useRef(null);
    const featuredRef = useRef(null);
    const timeout : number = 600;

    useEffect(() =>  {
        (async () => {
            dispatch(loading());
            dispatch(done());
        })();
    }, []);

    return (
        <Box ref={containerRef}>
            <ThemeProvider theme={S.theme}>
                <Slide in={true} container={containerRef.current} timeout={timeout}>
                    <S.SectionBanner>
                        <Container>
                            <S.HomeBannerBox>
                                <S.HomeTitleBox>
                                    <S.Title variant="h4">Lorem ipsum dolor</S.Title>
                                    <S.SubTitle variant="subtitle1">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                                    </S.SubTitle>
                                </S.HomeTitleBox>
                                <S.HomeBannerSearchBox>
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
                                </S.HomeBannerSearchBox>
                            </S.HomeBannerBox>
                        </Container>
                    </S.SectionBanner>
                </Slide>
                <S.SectionPopular>
                    <Grow in={true} timeout={timeout}>
                        <Container>
                            <S.HomeTopBox>
                                <S.HomeTopImageBox>
                                    <S.HomeTopImage src="No_Image.jpg" />
                                    <S.ImageOverlayGradient />
                                    <S.HomeTopImageTitleWrapper>
                                        <S.HomeTopImageTitleBox>
                                            <Chip label="Example" variant='outlined'/>
                                            <S.HomeTopImageTitleTypography variant='h4' color="white">
                                                Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
                                            </S.HomeTopImageTitleTypography>
                                            <S.HomeTopImageTitleDate>
                                                <Typography variant='h5' color="white">
                                                    <DateRange style={{width: "27px", height: "27px", paddingRight: 5}} />
                                                    2023-10-09 / 12:00:12
                                                </Typography>
                                            </S.HomeTopImageTitleDate>
                                        </S.HomeTopImageTitleBox>
                                    </S.HomeTopImageTitleWrapper>
                                </S.HomeTopImageBox>
                                <S.HomeTopCardsBox>
                                    <S.HomeTopStack spacing={4}>
                                        <S.HomeTopPaper elevation={0}>
                                            <S.TopCardCategoryBox>
                                                <Chip label="Example" />
                                            </S.TopCardCategoryBox>
                                            <S.TopCardTypography variant='h5'>
                                                Lorem ipsum dolor sit amet, consectetur adipiscing elit
                                            </S.TopCardTypography>
                                            <S.TopCardTagsBox>
                                                <Typography variant='subtitle1' color="gray">
                                                    #Lorem #ipsum #dolor #sit #amet
                                                </Typography>
                                            </S.TopCardTagsBox>
                                        </S.HomeTopPaper>
                                        <Divider/>
                                        <S.HomeTopPaper  elevation={0}>
                                            <S.TopCardCategoryBox>
                                                <Chip label="Example" />
                                            </S.TopCardCategoryBox>
                                            <S.TopCardTypography variant='h5'>
                                                Lorem ipsum dolor sit amet, consectetur adipiscing elit
                                            </S.TopCardTypography>
                                            <S.TopCardTagsBox>
                                                <Typography variant='subtitle1' color="gray">
                                                    #Lorem #ipsum #dolor #sit #amet
                                                </Typography>
                                            </S.TopCardTagsBox>
                                        </S.HomeTopPaper>
                                        <Divider/>
                                        <S.HomeTopPaper elevation={0}>
                                            <S.TopCardCategoryBox>
                                                <Chip label="Example" />
                                            </S.TopCardCategoryBox>
                                            <S.TopCardTypography variant='h5'>
                                                Lorem ipsum dolor sit amet, consectetur adipiscing elit
                                            </S.TopCardTypography>
                                            <S.TopCardTagsBox>
                                                <Typography variant='subtitle1' color="gray">
                                                    #Lorem #ipsum #dolor #sit #amet
                                                </Typography>
                                            </S.TopCardTagsBox>
                                        </S.HomeTopPaper>
                                    </S.HomeTopStack>
                                </S.HomeTopCardsBox>
                            </S.HomeTopBox>
                        </Container>
                    </Grow>
                </S.SectionPopular>
                <S.SectionBlog>
                    <Grow in={true} timeout={timeout}>
                        <Container>
                            <S.BlogBox>
                                <S.BlogBoxTypography variant='h5'>
                                    Latest Posts
                                </S.BlogBoxTypography>
                                <S.BlogBoxGrid container spacing={3}>
                                {
                                    [1,2,3,4,5,6].map((value) => (
                                        <Grid key={value} item xs={4}>
                                            <S.BlogBoxGridPaper elevation={1}>
                                                <S.BlogBoxGridPaperTopImageBox>
                                                    <S.BlogBoxGridPaperTopImage src="No_Image.jpg" />
                                                </S.BlogBoxGridPaperTopImageBox>
                                                <S.BlogBoxGridPaperTitle>
                                                    <S.BlogBoxGridPaperTitleTypography variant='h5'>
                                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit
                                                    </S.BlogBoxGridPaperTitleTypography>
                                                </S.BlogBoxGridPaperTitle>
                                                <S.BlogBoxGridPaperDateBox>
                                                    <S.BlogBoxGridPaperDateTypography variant='subtitle1' color="gray">
                                                        2023-10-09 / 12:00:12
                                                    </S.BlogBoxGridPaperDateTypography>
                                                </S.BlogBoxGridPaperDateBox>
                                                <S.BlogBoxGridPaperContent>
                                                    <S.BlogBoxGridPaperContentTypography variant='subtitle1'>
                                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                                    </S.BlogBoxGridPaperContentTypography>
                                                </S.BlogBoxGridPaperContent>
                                            </S.BlogBoxGridPaper>
                                        </Grid>
                                    ))
                                }
                                </S.BlogBoxGrid>
                            </S.BlogBox>
                        </Container>
                    </Grow>
                </S.SectionBlog>
                <S.SectionFeatured ref={featuredRef}>
                    <Grow in={true} timeout={timeout}>
                        <Container>
                            <Divider/>
                            <S.FeaturedTitleTypography variant='h4'>
                                Featured Posts
                            </S.FeaturedTitleTypography>
                            <Divider/>
                            <S.FeaturedGrid container spacing={3}>
                                {
                                    [1,2,3].map((value) => (
                                        <Slide in={true} direction="up" timeout={timeout} container={featuredRef.current}>
                                            <Grid key={value} item xs={4}>
                                                <S.FeaturedGridPaper sx={{ borderRadius: '10px' }}>
                                                    <S.FeaturedGridImage src="No_Image.jpg" alt="NoImage"/>
                                                    <S.ImageOverlayGradient />
                                                    <S.FeaturedTitleBox>
                                                        <S.FeaturedTitleBoxWrapper>
                                                            <Chip label="Example"/>
                                                            <S.FeaturedGridTitleTypography variant='h5'>
                                                                Lorem ipsum dolor sit amet, consectetur adipiscing elit
                                                            </S.FeaturedGridTitleTypography>
                                                            <S.FeaturedGridTitleDate>
                                                                <Typography variant='h6' color="white">
                                                                    <DateRange style={{width: "24px", height: "24px", paddingRight: 5}} />
                                                                    2023-10-09 / 12:00:12
                                                                </Typography>
                                                            </S.FeaturedGridTitleDate>
                                                        </S.FeaturedTitleBoxWrapper>
                                                    </S.FeaturedTitleBox>
                                                </S.FeaturedGridPaper>
                                            </Grid>
                                        </Slide>
                                    ))
                                }
                            </S.FeaturedGrid>
                        </Container>
                    </Grow>
                </S.SectionFeatured>
                <S.SectionSNS>
                    <Grow in={true} timeout={timeout}>
                        <Container>
                            <S.SNSBox>
                                <Facebook color="disabled"/>
                                <Instagram color="disabled"/>
                                <Twitter color="disabled"/>
                                <GitHub/>
                                <RssFeed/>
                                <YouTube color="disabled"/>
                            </S.SNSBox>
                        </Container>
                    </Grow>
                </S.SectionSNS>
            </ThemeProvider>
            <Footer />
        </Box>
    );
}

export default Home;