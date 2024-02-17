import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
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
import { CallAPI, Posts_APIResponse, isPostsAPIResponse } from '../funcs/CallAPI';
import { createTheme } from '@mui/material/styles';

export const theme = createTheme();
theme.typography.h4 = {
    fontSize: '2.5rem',
    '@media (max-width:1023px)': {
    /* 타블렛 */
        fontSize: '2.1rem',
    },
    '@media (max-width:767px)': {
    /* 모바일 */
        fontSize: '1.9rem',
    }
};
theme.typography.h5 = {
    fontSize: '1.6rem',
    fontWeight: 600,
    '@media (max-width:1023px)': {
    /* 타블렛 */
        fontSize: '1.3rem',
    },
    '@media (max-width:767px)': {
    /* 모바일 */
        fontSize: '1.3rem',
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

function Home()
{
    const githuburl = "https://github.com/kmj36";
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const featuredRef = useRef(null);
    const SearchRef = useRef<HTMLInputElement | null>(null);
    const timeout : number = 600;
    const [postdata, setPostdata] = useState({} as Posts_APIResponse);

    const expression = /[-a-zA-Z0-9@:%._~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_.~#?&//=]*)?/gi;
    const regex = new RegExp(expression);

    const handleImageError : React.ReactEventHandler<HTMLImageElement> = useCallback((e : React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.src = "/No_Image.jpg"
    }, []);

    const handleOnSearchEnter : React.KeyboardEventHandler<HTMLDivElement> = useCallback((e : React.KeyboardEvent<HTMLDivElement>) => {
        if(e.key==='Enter')
        {
            const searchValue = SearchRef?.current?.value;
            if (searchValue !== null && typeof searchValue == 'string')
                navigate(`/search?t=${encodeURIComponent(searchValue)}`);
        }
    }, [navigate]);

    const handleOnSearchButton : React.MouseEventHandler<HTMLButtonElement> = useCallback((e : React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const searchValue = SearchRef?.current?.value;
        if (searchValue !== null && typeof searchValue == 'string')
            navigate(`/search?t=${encodeURIComponent(searchValue)}`);
    }, [navigate]);

    useEffect(() =>  {
        (async () => {
            const posts = await CallAPI({APIType:"PostList", Method:"GET", Query:"order=review"});
            if(isPostsAPIResponse(posts))
                setPostdata(posts); 
        })();
    }, []);

    return (
        <Box ref={containerRef}>
            <ThemeProvider theme={theme}>
                <S.SectionBanner>
                    <Slide in={true} container={containerRef.current} timeout={timeout}>
                        <Container>
                            <S.HomeBannerBox>
                                <S.HomeTitleBox>
                                    <S.Title variant="h4"><S.TitleImg src="/portlog.png" alt="portlog"/></S.Title>
                                    <S.SubTitle variant="subtitle1">
                                        이곳은 새로운 항해을 시작하는 곳입니다. PortLog는 다양한 주제와 관심사에 대한 정보, 아이디어 등을 제공합니다. 흥미로운 이야기를 제공하고, 함께 성장하며, 새로운 시각과 지식을 수출할 것입니다.
                                    </S.SubTitle>
                                </S.HomeTitleBox>
                                <S.HomeBannerSearchBox>
                                    <Paper>
                                        <Box sx={useMemo(() => ({ display: "flex", height: "100%"}), [])}>
                                            <TextField
                                                id="input-with-icon-textfield"
                                                placeholder="게시물 검색"
                                                onKeyDown={handleOnSearchEnter}
                                                inputRef={SearchRef}
                                                InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                    <Search/>
                                                    </InputAdornment>
                                                ),
                                                }}
                                                sx={useMemo(() => ({ width: "100%" }), [])}
                                                color="primary"
                                                variant="standard"
                                            />
                                        </Box>
                                    </Paper>
                                    <Button variant="contained" endIcon={<Send />} onClick={handleOnSearchButton}>
                                        검색
                                    </Button>
                                </S.HomeBannerSearchBox>
                            </S.HomeBannerBox>
                        </Container>
                    </Slide>
                </S.SectionBanner>
                <S.SectionPopular>
                    <Grow in={true} timeout={timeout}>
                        <Container>
                            <S.HomeTopBox>
                                <S.HomeTopImageBox>
                                    <Link to={postdata.posts?.at(0) ? "/post/" + postdata.posts[0].postid : "/"} style={useMemo(() => ({ textDecoration: 'none', color: 'black' }), [])}>
                                        <S.HomeTopImage src={postdata?.posts?.at(0) && regex.test(postdata.posts[0].thumbnailurl) ? postdata.posts[0].thumbnailurl : "No_Image.jpg"} onError={handleImageError}/>
                                        <S.ImageOverlayGradient />
                                        <S.HomeTopImageTitleWrapper>
                                            <S.HomeTopImageTitleBox>
                                                <Chip label={postdata.posts?.at(0)?.categoryid != null ? postdata.posts[0].categoryid : "No Set"} sx={useMemo(() => ({ color: 'white' }), [])}/>
                                                <S.HomeTopImageTitleTypography variant='h4' color="white">
                                                    {postdata?.posts?.at(0) ? postdata.posts[0].title : "Empty Placeholder."}
                                                </S.HomeTopImageTitleTypography>
                                                <S.HomeTopImageTitleDate>
                                                    <Typography variant='h5' color="white">
                                                        <DateRange style={useMemo(() => ({width: "27px", height: "27px", paddingRight: 5}), [])} />
                                                        {postdata.posts?.at(0)?.created_at ? postdata.posts[0].created_at.substring(0, 10) + ' / ' + postdata.posts[0].created_at.substring(11, 19) : "Empty Date."}
                                                    </Typography>
                                                </S.HomeTopImageTitleDate>
                                            </S.HomeTopImageTitleBox>
                                        </S.HomeTopImageTitleWrapper>
                                    </Link>
                                </S.HomeTopImageBox>
                                <S.HomeTopCardsBox>
                                <S.HomeTopStack spacing={4}>
                                    {[0,1,2].map((_, index) => (
                                        <S.HomeTopPaper elevation={0}>
                                            <Link to={postdata?.posts?.at(index) ? "/post/" + postdata.posts[index].postid : "/"} style={{ textDecoration: 'none', color: 'black' }}>
                                                <S.TopCardCategoryBox>
                                                <Chip label={postdata?.posts?.at(index) && postdata.posts[index].categoryid != null ? postdata.posts[index].categoryid : "No Set"}/>
                                                </S.TopCardCategoryBox>
                                                <S.TopCardTypography variant='h5'>
                                                    {postdata?.posts?.at(index) ? postdata.posts[index].title : "Empty Placeholder."}
                                                </S.TopCardTypography>
                                                <S.TopCardTagsBox>
                                                    <Typography variant='subtitle1' color="gray">
                                                        {postdata?.posts?.at(index) && postdata.posts[index].tagid.length > 0 ? postdata.posts[index].tagid.map((tag) => (`#${tag} `)) : "#NoTag"}
                                                    </Typography>
                                                </S.TopCardTagsBox>
                                            </Link>
                                            <Divider/>
                                        </S.HomeTopPaper>
                                    ))}
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
                                    postdata?.posts?.length > 0 ?
                                    postdata?.posts?.slice().sort((a,b) => (new Date(b.created_at).getTime() - new Date(a.created_at).getTime())).slice( 0,6 ).map( (value, index) => (
                                        <Grid key={index} item xs={12} sm={4} md={4}>
                                            <S.BlogBoxGridPaper elevation={1}>
                                                <Link to={'/post/'+ value.postid} style={{ textDecoration: 'none', color: 'black' }}>
                                                    <S.BlogBoxGridPaperTopImageBox>
                                                        <S.BlogBoxGridPaperTopImage src={regex.test(value.thumbnailurl) ? value.thumbnailurl : "No_Image.jpg"} onError={handleImageError} />
                                                    </S.BlogBoxGridPaperTopImageBox>
                                                    <S.BlogBoxGridChipBox>
                                                        <Chip label={value.categoryid != null && value.categoryid !== "" ? value.categoryid : "No Set"}/>
                                                    </S.BlogBoxGridChipBox>
                                                    <S.BlogBoxGridPaperTitle>
                                                        <S.BlogBoxGridPaperTitleTypography variant='h5'>
                                                            {value.title}
                                                        </S.BlogBoxGridPaperTitleTypography>
                                                    </S.BlogBoxGridPaperTitle>
                                                    <S.BlogBoxGridPaperDateBox>
                                                        <S.BlogBoxGridPaperDateTypography variant='subtitle1' color="gray">
                                                            {value.created_at.slice(0, 19).replace(/[T.]/g, ' / ')}
                                                        </S.BlogBoxGridPaperDateTypography>
                                                    </S.BlogBoxGridPaperDateBox>
                                                    <S.BlogBoxGridPaperContent>
                                                        <S.BlogBoxGridPaperContentTypography variant='subtitle2'>
                                                            {value.content}
                                                        </S.BlogBoxGridPaperContentTypography>
                                                    </S.BlogBoxGridPaperContent>
                                                </Link>
                                            </S.BlogBoxGridPaper>
                                        </Grid>
                                    ))
                                    :
                                    <Grid item xs={12} sm={12} md={12}>
                                        <S.BlogBoxGridPaper elevation={1}>
                                            <Link to="/" style={{ textDecoration: 'none', color: 'black' }}>
                                                <S.BlogBoxGridPaperTopImageBox>
                                                    <S.BlogBoxGridPaperTopImage src="No_Image.jpg"/>
                                                </S.BlogBoxGridPaperTopImageBox>
                                                <S.BlogBoxGridChipBox>
                                                    <Chip label="No Set"/>
                                                </S.BlogBoxGridChipBox>
                                                <S.BlogBoxGridPaperTitle>
                                                    <S.BlogBoxGridPaperTitleTypography variant='h5'>
                                                        Empty Placeholder.
                                                    </S.BlogBoxGridPaperTitleTypography>
                                                </S.BlogBoxGridPaperTitle>
                                                <S.BlogBoxGridPaperDateBox>
                                                    <S.BlogBoxGridPaperDateTypography variant='subtitle1' color="gray">
                                                        Empty Date.
                                                    </S.BlogBoxGridPaperDateTypography>
                                                </S.BlogBoxGridPaperDateBox>
                                                <S.BlogBoxGridPaperContent>
                                                    <S.BlogBoxGridPaperContentTypography variant='subtitle2'>
                                                        Empty Content.
                                                    </S.BlogBoxGridPaperContentTypography>
                                                </S.BlogBoxGridPaperContent>
                                            </Link>
                                        </S.BlogBoxGridPaper>
                                    </Grid>
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
                                    postdata?.posts?.length > 0 ?
                                    postdata?.posts?.slice().sort((a,b) => (b.views - a.views)).slice(0, 3).map((value, index) => (
                                        <Slide in={true} direction="up" timeout={timeout} container={featuredRef.current}>
                                            <Grid key={index} item xs={12} sm={4} md={4}>
                                                <S.FeaturedGridPaper sx={{ borderRadius: '10px' }}>
                                                    <Link to={'/post/' + value.postid} style={{ textDecoration: 'none', color: 'black' }}>
                                                        <S.FeaturedGridImage src={regex.test(value.thumbnailurl) ? value.thumbnailurl : "No_Image.jpg"} onError={handleImageError} />
                                                        <S.ImageOverlayGradient />
                                                        <S.FeaturedTitleBox>
                                                            <S.FeaturedTitleBoxWrapper>
                                                                <Chip label={value.categoryid != null && value.categoryid !== "" ? value.categoryid : "No Set"}/>
                                                                <S.FeaturedGridTitleTypography variant='h5'>
                                                                    {value.title}
                                                                </S.FeaturedGridTitleTypography>
                                                                <S.FeaturedGridTitleDate>
                                                                    <Typography variant='h6' color="white">
                                                                        <DateRange style={{width: "24px", height: "24px", paddingRight: 5}} />
                                                                        {value.created_at.slice(0, 19).replace(/[T.]/g, ' / ')}
                                                                    </Typography>
                                                                </S.FeaturedGridTitleDate>
                                                            </S.FeaturedTitleBoxWrapper>
                                                        </S.FeaturedTitleBox>
                                                    </Link>
                                                </S.FeaturedGridPaper>
                                            </Grid>
                                        </Slide>
                                    ))
                                    :
                                    <Grid item xs={12} sm={12} md={12}>
                                        <S.FeaturedGridPaper sx={{ borderRadius: '10px' }}>
                                            <Link to="/" style={{ textDecoration: 'none', color: 'black' }}>
                                                <S.FeaturedGridImage src="No_Image.jpg"/>
                                                <S.ImageOverlayGradient />
                                                <S.FeaturedTitleBox>
                                                    <S.FeaturedTitleBoxWrapper>
                                                        <Chip label="No Set"/>
                                                        <S.FeaturedGridTitleTypography variant='h5'>
                                                            Empty Placeholder.
                                                        </S.FeaturedGridTitleTypography>
                                                        <S.FeaturedGridTitleDate>
                                                            <Typography variant='h6' color="white">
                                                                <DateRange style={{width: "24px", height: "24px", paddingRight: 5}} />
                                                                Empty Date.
                                                            </Typography>
                                                        </S.FeaturedGridTitleDate>
                                                    </S.FeaturedTitleBoxWrapper>
                                                </S.FeaturedTitleBox>
                                            </Link>
                                        </S.FeaturedGridPaper>
                                    </Grid>
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
                                <Link to={githuburl} style={useMemo(() => ({ textDecoration: 'none', color: 'black' }), [])}><GitHub/></Link>
                                <RssFeed color="disabled"/>
                                <YouTube color="disabled"/>
                            </S.SNSBox>
                        </Container>
                    </Grow>
                </S.SectionSNS>
            </ThemeProvider>
        </Box>
    );
}

export default Home;