import styled from 'styled-components';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
    Box,
    Container,
    Slide,
    Grow,
    Button,
    Paper,
    TextField,
    InputAdornment,
    Select,
    InputLabel,
    FormControl,
    MenuItem,
    ListItemText,
    Checkbox,
    Stack,
    Chip,
    Typography,
    Divider,
    Pagination
} from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Search, Send } from '@material-ui/icons';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const BlogBox = styled.div`
`

const SectionBanner = styled.div`
    height: 300px;
    background-color: #f5f5f5;
    background-image: url("studio.jpg");
    object-fit: cover;
`

const AdvancedSearchContainer = styled(Container)`
    height: 100%;
`;

const AdvancedSearchBox = styled(Box)`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    justify-content: center;
    align-items: center;
    height: 100%;
`;

const AdvancedSearchWrapper = styled(Box)`
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 2rem;
    padding-top: 10px;
`;

const AdvancedSearchPaper = styled(Paper)`
    display: flex;
    width: 100%;
    height: 100%;
`;

const AdvancedSearchOptionWrapper = styled(Box)`
    display: flex;
    width: 100%;
    padding-top: 5px;
`;

const AdvancedSearchInputButton = styled(Button)`
    padding-left: 5px;
`;

const SectionPosts = styled(Box)`
    display: flex;
    flex-direction: column;
    width: 100%;
    padding-top: 40px;
    padding-bottom: 20px;
`;

const PostSearchBox = styled(Box)`
    display: flex;
    flex-direction: row;
    width: 100%;
`;

const PostPaper = styled(Paper)`
    display: flex;
    flex-direction: row;
    align-items: center;
`;

const PostImageBox = styled(Box)`
    width: 300px;
    min-width: 300px;
    height: 200px;
    padding: 5px;
`;

const PostImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

const PostInfoBox = styled(Box)`
    display: flex;
    flex-grow: 1;
    flex-direction: column;
`;

const PostStack = styled(Stack)`
    width: 100%;
`;

const PostInfoCategoryBox = styled(Box)`
    padding-top: 10px;
`;

const PostInfoTypography = styled(Typography)`
    width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
`;

const PostInfoTagsBox = styled(Box)`
    margin-top: auto;
    width: 100%;
`;

const PostInfoTitleBox = styled(Box)`
    padding-top: 10px;
`;

const PostInfoContentBox = styled(Box)`
    padding-top: 5px;
`;

const PostInfoTagsTypography = styled(Typography)`
    width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
`;

const PostInfoContentTypography = styled(Typography)`
    width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
`;

const PostClassifyBox = styled(Box)`
    display: flex;
    min-width: 250px;
`;

const PostClassifyWrapper = styled(Box)`
    display: flex;
    flex-direction: column;
    height: 100%;
    flex-grow: 1;
`;

const PostCategorySelectStack = styled(Stack)`
`;

const PostPaginationBox = styled(Box)`
    display: flex;
    width: 100%;
    justify-content: center;
    padding-top: 20px;
    padding-bottom: 10px;
`;

function Blog({setLoading} : {setLoading: any})
{
    interface Post {
        postid: number,
        thumbnailurl: string,
        title: string,
        content: string,
        created_at: string,
        updated_at: string,
        published_at: string | null,
        is_published: boolean,
        secret_password: string | null,
        is_secret: boolean,
        userid: string,
        categoryid: number | null,
        tagid: number[]
    }

    interface APIResponse {
        code: number;
        status: string;
        detail: string;
        message: string;
        request_time: string;
        posts: Post[];
    }

    const [postjson, setPostjson] = useState({} as APIResponse);
    const [selectCategoryName, setselectCategoryName] = useState<string>("");
    const [selectTagName, setSelectTagName] = useState<string[]>([]);
    const [selectCategoryBarName, setselectCategoryBarName] = useState<string>("");
    const [datevalue, setDateValue] = useState<string>("");
    const BlogRef = useRef(null);
    const timeout = 600;

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
    PaperProps: {
        style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
        },
    },
    };

    const names = [
        'None',
        'Oliver Hansen',
        'Van Henry',
        'April Tucker',
        'Ralph Hubbard',
        'Omar Alexander',
        'Carlos Abbott',
        'Miriam Wagner',
        'Bradley Wilkerson',
        'Virginia Andrews',
        'Kelly Snyder',
    ];

    const theme = createTheme();

    theme.typography.h4 = {
        fontSize: '2.5rem',
        '@media (max-width:1023px)': {
        /* 타블렛 */
            fontSize: '2rem',
        },
        '@media (max-width:767px)': {
        /* 모바일 */
            fontSize: '1.5rem',
        }
    };

    theme.typography.h5 = {
        fontSize: '1.5rem',
        fontWeight: 600,
        '@media (max-width:1023px)': {
        /* 타블렛 */
            fontSize: '1.2rem',
        },
        '@media (max-width:767px)': {
        /* 모바일 */
            fontSize: '1rem',
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
    
    const handleImageError = (e : any) => {
        e.target.src = "/No_Image.jpg"
    }

    const handleCategory = (e: any) => {
        if(e.target.value === "None")
        {
            setselectCategoryName("")
            return
        }
        setselectCategoryName(e.target.value)
    }

    const handleSelectTag = (e : any) => {
        const { target: { value } } = e;
        setSelectTagName(typeof value === 'string' ? value.split(',') : value);
    }

    const handleSelectCategory = (target: string) => {
        if(target===selectCategoryBarName)
        {
            setselectCategoryBarName("");
            return;
        }
        setselectCategoryBarName(target);
    }

    const expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
    const regex = new RegExp(expression);

    useEffect(() =>  {
        (async () => {
            setLoading(true);
            const getjson = await axios.get("http://127.0.0.1:8000/api/v1/post/");
            setPostjson(getjson.data);
            setLoading(false);
        })();
    }, []);

    return (
        <BlogBox ref={BlogRef}>
            <ThemeProvider theme={theme}>
                <Slide in={true} container={BlogRef.current} timeout={timeout}>
                    <SectionBanner>
                        <AdvancedSearchContainer maxWidth="md">
                            <AdvancedSearchBox>
                                <AdvancedSearchWrapper>
                                    <AdvancedSearchPaper>
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
                                            style={{ width: "100%" }}
                                            color="primary"
                                            variant="standard"
                                        />
                                    </AdvancedSearchPaper>
                                    <AdvancedSearchInputButton variant="contained" endIcon={<Send />} sx={{ marginLeft: 1 }}>
                                        Search
                                    </AdvancedSearchInputButton>
                                </AdvancedSearchWrapper>
                                <AdvancedSearchOptionWrapper>
                                    <AdvancedSearchPaper>
                                        <FormControl variant="filled" sx={{ m: 1 }}>
                                            <TextField id="outlined-basic" label="UserID" variant="outlined" />
                                        </FormControl>
                                        <FormControl variant="filled" sx={{ m: 1, minWidth: 160 }}>
                                            <InputLabel id="select-Category-label">Categories</InputLabel>
                                            <Select
                                            labelId="select-Category-label"
                                            id="Category"
                                            value={selectCategoryName}
                                            onChange={handleCategory}
                                            label="Categories"
                                            renderValue={(selected) => (selected)}
                                            MenuProps={MenuProps}
                                            >
                                            {names.map((name) => (
                                                <MenuItem key={name} value={name}>
                                                    <ListItemText primary={name} />
                                                </MenuItem>
                                            ))}
                                            </Select>
                                        </FormControl>
                                        <FormControl variant="filled" sx={{ m: 1, minWidth: 140 }}>
                                            <InputLabel id="select-Tags-label">Tags</InputLabel>
                                            <Select
                                            labelId="select-Tags-label"
                                            id="Tag"
                                            multiple
                                            value={selectTagName}
                                            onChange={handleSelectTag}
                                            label="Tags"
                                            renderValue={(selected) => (selected.length + ' Selected.')}
                                            MenuProps={MenuProps}
                                            >
                                            {names.map((name) => (
                                                <MenuItem key={name} value={name}>
                                                    <Checkbox checked={selectTagName.indexOf(name) > -1} />
                                                    <ListItemText primary={name} />
                                                </MenuItem>
                                            ))}
                                            </Select>
                                        </FormControl>
                                        <FormControl>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DemoContainer components={['DatePicker']}>
                                                    <DatePicker
                                                        value={datevalue}
                                                        onChange={(newValue : any) => setDateValue(newValue)}
                                                        label={"year, month and day"}
                                                        views={['year', 'month', 'day']}
                                                    />
                                                </DemoContainer>                 
                                            </LocalizationProvider>
                                        </FormControl>
                                    </AdvancedSearchPaper>
                                </AdvancedSearchOptionWrapper>
                            </AdvancedSearchBox>
                        </AdvancedSearchContainer>
                    </SectionBanner>
                </Slide>
                <Container maxWidth="lg">
                    <SectionPosts>
                        <PostSearchBox>
                            <PostStack spacing={2}>
                                {postjson.posts?.map((post, index) => (
                                    <Grow
                                    in={true}
                                    >
                                        <PostPaper key={index}>
                                            <PostImageBox>
                                                <PostImage src={regex.test(post.thumbnailurl) ? post.thumbnailurl : "No_image.jpg"} onError={handleImageError} />
                                            </PostImageBox>
                                            <PostInfoBox>
                                                <PostInfoCategoryBox>
                                                    <Chip label={post.categoryid} />
                                                </PostInfoCategoryBox>
                                                <PostInfoTitleBox>
                                                    <PostInfoTypography variant='h5'>
                                                        {post.title}
                                                    </PostInfoTypography>
                                                </PostInfoTitleBox>
                                                <PostInfoContentBox>
                                                    <PostInfoContentTypography variant='subtitle1'>
                                                        {post.content}
                                                    </PostInfoContentTypography>
                                                </PostInfoContentBox>
                                                <PostInfoTagsBox>
                                                    <PostInfoTagsTypography variant='subtitle1' color="gray">
                                                        #Lorem #ipsum #dolor #sit #amet
                                                    </PostInfoTagsTypography>
                                                </PostInfoTagsBox>
                                            </PostInfoBox>
                                        </PostPaper>
                                    </Grow>
                                ))}
                            </PostStack>
                            <PostClassifyBox>
                                <Divider orientation="vertical" flexItem sx={{ marginLeft: 1, marginRight: 1}}/>
                                <PostClassifyWrapper>
                                    <PostCategorySelectStack>
                                        <Chip label="Categories"/>
                                        {names.map((name) => (
                                            <MenuItem key={name} value={name} divider={true} onClick={() => handleSelectCategory(name)}>
                                                <Checkbox checked={name===selectCategoryBarName}/>
                                                <ListItemText primary={name} />
                                            </MenuItem>
                                        ))}
                                    </PostCategorySelectStack>
                                </PostClassifyWrapper>
                                <Divider orientation="vertical" flexItem sx={{ marginLeft: 1, marginRight: 1}}/>
                            </PostClassifyBox>
                        </PostSearchBox>
                        <PostPaginationBox>
                            <Pagination count={10} variant="outlined" color="primary" size="large" sx = {{ width: "auto"}}/>
                        </PostPaginationBox>
                    </SectionPosts>
                </Container>
            </ThemeProvider>
        </BlogBox>
    );
}

export default Blog;