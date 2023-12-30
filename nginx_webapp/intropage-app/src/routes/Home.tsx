import { useEffect, useRef, useState } from 'react';
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
import Footer from '../components/Footer';
import { useAppDispatch } from '../redux/hooks';
import { loading, done } from '../redux/feature/LoadingReducer';
import { CallAPI, Posts_APIResponse, isPostsAPIResponse } from '../funcs/CallAPI';

function Home()
{
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const containerRef = useRef(null);
    const featuredRef = useRef(null);
    const SearchRef = useRef<HTMLInputElement | null>(null);
    const timeout : number = 600;
    const [postdata, setPostdata] = useState({} as Posts_APIResponse);

    const expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
    const regex = new RegExp(expression);

    const handleImageError = (e : any) => {
        e.target.src = "/No_Image.jpg"
    }

    const handleOnSearchEnter = (e : any) => {
        if(e.keyCode===13)
        {
            const searchValue = SearchRef?.current?.value;
            if (searchValue !== null && typeof searchValue == 'string')
                navigate(`/search?t=${encodeURIComponent(searchValue)}`);
        }
    }

    const handleOnSearchButton = (e : any) => {
        const searchValue = SearchRef?.current?.value;
        if (searchValue !== null && typeof searchValue == 'string')
            navigate(`/search?t=${encodeURIComponent(searchValue)}`);
    }

    useEffect(() =>  {
        (async () => {
            dispatch(loading());
            const posts = await CallAPI({APIType:"PostList", Method:"GET", Query:"order=review"});
            if(isPostsAPIResponse(posts))
                setPostdata(posts); 
            dispatch(done());
        })();
    }, []);

    return (
        <Box ref={containerRef}>
            <ThemeProvider theme={S.theme}>
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
                                        <Box sx={{ display: "flex", height: "100%"}}>
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
                                                sx={{ width: "100%" }}
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
                                    <Link to={postdata?.posts ? "/post/" + postdata.posts[0].postid : "/"} style={{ textDecoration: 'none', color: 'black' }}>
                                        <S.HomeTopImage src={postdata?.posts && regex.test(postdata.posts[0]?.thumbnailurl) ? postdata.posts[0]?.thumbnailurl : "No_Image.jpg"} onError={handleImageError}/>
                                        <S.ImageOverlayGradient />
                                        <S.HomeTopImageTitleWrapper>
                                            <S.HomeTopImageTitleBox>
                                                <Chip label={postdata?.posts && postdata.posts[0]?.categoryid != null && postdata.posts[0]?.categoryid !== "" ? postdata.posts[0]?.categoryid : "No Set"} sx={{ color: 'white' }}/>
                                                <S.HomeTopImageTitleTypography variant='h4' color="white">
                                                    {postdata?.posts ? postdata.posts[0]?.title : ""}
                                                </S.HomeTopImageTitleTypography>
                                                <S.HomeTopImageTitleDate>
                                                    <Typography variant='h5' color="white">
                                                        <DateRange style={{width: "27px", height: "27px", paddingRight: 5}} />
                                                        {postdata?.posts ? postdata.posts[0]?.created_at.substring(0, 10) + ' / ' + postdata.posts[0]?.created_at.substring(11, 19) : ""}
                                                    </Typography>
                                                </S.HomeTopImageTitleDate>
                                            </S.HomeTopImageTitleBox>
                                        </S.HomeTopImageTitleWrapper>
                                    </Link>
                                </S.HomeTopImageBox>
                                <S.HomeTopCardsBox>
                                    <S.HomeTopStack spacing={4}>
                                        <S.HomeTopPaper elevation={0}>
                                            <Link to={postdata?.posts ? "/post/" + postdata.posts[1].postid : "/"} style={{ textDecoration: 'none', color: 'black' }}>
                                                <S.TopCardCategoryBox>
                                                <Chip label={postdata?.posts && postdata.posts[1]?.categoryid != null && postdata.posts[1]?.categoryid !== "" ? postdata.posts[1]?.categoryid : "No Set"}/>
                                                </S.TopCardCategoryBox>
                                                <S.TopCardTypography variant='h5'>
                                                    {postdata?.posts ? postdata.posts[1]?.title : ""}
                                                </S.TopCardTypography>
                                                <S.TopCardTagsBox>
                                                    <Typography variant='subtitle1' color="gray">
                                                        {postdata?.posts && postdata.posts[1]?.tagid.length > 0 ? postdata.posts[1]?.tagid.map((tag) => ("#" + tag + " ")) : "#NoTag"}
                                                    </Typography>
                                                </S.TopCardTagsBox>
                                            </Link>
                                        </S.HomeTopPaper>
                                        <Divider/>
                                        <S.HomeTopPaper  elevation={0}>
                                            <Link to={postdata?.posts ? "/post/" + postdata.posts[2].postid : "/"} style={{ textDecoration: 'none', color: 'black' }}>
                                                <S.TopCardCategoryBox>
                                                <Chip label={postdata?.posts && postdata.posts[2]?.categoryid != null && postdata.posts[2]?.categoryid !== "" ? postdata.posts[2]?.categoryid : "No Set"}/>
                                                </S.TopCardCategoryBox>
                                                <S.TopCardTypography variant='h5'>
                                                    {postdata?.posts ? postdata.posts[2]?.title : ""}
                                                </S.TopCardTypography>
                                                <S.TopCardTagsBox>
                                                    <Typography variant='subtitle1' color="gray">
                                                    {postdata?.posts && postdata.posts[2]?.tagid.length > 0 ? postdata.posts[2]?.tagid.map((tag) => ("#" + tag + " ")) : "#NoTag"}
                                                    </Typography>
                                                </S.TopCardTagsBox>
                                            </Link>
                                        </S.HomeTopPaper>
                                        <Divider/>
                                        <S.HomeTopPaper elevation={0}>
                                            <Link to={postdata?.posts ? "/post/" + postdata.posts[3].postid : "/"} style={{ textDecoration: 'none', color: 'black' }}>
                                                <S.TopCardCategoryBox>
                                                <Chip label={postdata?.posts && postdata.posts[3]?.categoryid != null && postdata.posts[3]?.categoryid !== "" ? postdata.posts[3]?.categoryid : "No Set"}/>
                                                </S.TopCardCategoryBox>
                                                <S.TopCardTypography variant='h5'>
                                                    {postdata?.posts ? postdata.posts[3]?.title : ""}
                                                </S.TopCardTypography>
                                                <S.TopCardTagsBox>
                                                    <Typography variant='subtitle1' color="gray">
                                                        {postdata?.posts && postdata.posts[3]?.tagid.length > 0 ? postdata.posts[3]?.tagid.map((tag) => ("#" + tag + " ")) : "#NoTag"}
                                                    </Typography>
                                                </S.TopCardTagsBox>
                                            </Link>
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
                                    ) )
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
                                <Link to='https://github.com/kmj36' style={{ textDecoration: 'none', color: 'black' }}><GitHub/></Link>
                                <RssFeed color="disabled"/>
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