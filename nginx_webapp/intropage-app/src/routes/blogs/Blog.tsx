import {ThemeProvider} from '@mui/material/styles';
import {
    Container,
    Slide,
    Grow,
    TextField,
    InputAdornment,
    Select,
    InputLabel,
    FormControl,
    MenuItem,
    ListItemText,
    Checkbox,
    Chip,
    Divider,
    Pagination
} from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Search, Send } from '@material-ui/icons';
import { useState, useEffect, useRef } from 'react';
import * as S from '../../styles/Blog_Style';
import { CallAPI, Posts_APIResponse, isPostsAPIResponse } from '../../funcs/CallAPI';
import { useAppDispatch } from '../../redux/hooks';
import { loading, done } from '../../redux/feature/LoadingReducer';

function Blog()
{
    const dispatch = useAppDispatch();
    const [postjson, setPostjson] = useState({} as Posts_APIResponse);
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

    const handleImageError = (e : any) => {
        e.target.src = "/No_Image.jpg"
    }

    useEffect(() =>  {
        (async () => {
            dispatch(loading());
            const postlist = await CallAPI({APIType: "PostList", Method: "GET"});
            if(isPostsAPIResponse(postlist))
                setPostjson(postlist);
            dispatch(done());
        })();
    }, []);

    return (
        <S.BlogBox ref={BlogRef}>
            <ThemeProvider theme={S.theme}>
                <Slide in={true} container={BlogRef.current} timeout={timeout}>
                    <S.SectionBanner>
                        <S.AdvancedSearchContainer maxWidth="md">
                            <S.AdvancedSearchBox>
                                <S.AdvancedSearchWrapper>
                                    <S.AdvancedSearchPaper>
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
                                    </S.AdvancedSearchPaper>
                                    <S.AdvancedSearchInputButton variant="contained" endIcon={<Send />} sx={{ marginLeft: 1 }}>
                                        Search
                                    </S.AdvancedSearchInputButton>
                                </S.AdvancedSearchWrapper>
                                <S.AdvancedSearchOptionWrapper>
                                    <S.AdvancedSearchPaper>
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
                                    </S.AdvancedSearchPaper>
                                </S.AdvancedSearchOptionWrapper>
                            </S.AdvancedSearchBox>
                        </S.AdvancedSearchContainer>
                    </S.SectionBanner>
                </Slide>
                <Container maxWidth="lg">
                    <S.SectionPosts>
                        <S.PostSearchBox>
                            <S.PostStack spacing={2}>
                                {postjson.posts?.map((post, index) => (
                                    <Grow
                                    in={true}
                                    >
                                        <S.PostPaper key={index}>
                                            <S.PostImageBox>
                                                <S.PostImage src={typeof post.thumbnailurl == 'string' && regex.test(post.thumbnailurl) ? post.thumbnailurl : "No_image.jpg"} onError={handleImageError} />
                                            </S.PostImageBox>
                                            <S.PostInfoBox>
                                                <S.PostInfoCategoryBox>
                                                    <Chip label={post.categoryid} />
                                                </S.PostInfoCategoryBox>
                                                <S.PostInfoTitleBox>
                                                    <S.PostInfoTypography variant='h5'>
                                                        {post.title}
                                                    </S.PostInfoTypography>
                                                </S.PostInfoTitleBox>
                                                <S.PostInfoContentBox>
                                                    <S.PostInfoContentTypography variant='subtitle1'>
                                                        {post.content}
                                                    </S.PostInfoContentTypography>
                                                </S.PostInfoContentBox>
                                                <S.PostInfoTagsBox>
                                                    <S.PostInfoTagsTypography variant='subtitle1' color="gray">
                                                        #Lorem #ipsum #dolor #sit #amet
                                                    </S.PostInfoTagsTypography>
                                                </S.PostInfoTagsBox>
                                            </S.PostInfoBox>
                                        </S.PostPaper>
                                    </Grow>
                                ))}
                            </S.PostStack>
                            <S.PostClassifyBox>
                                <Divider orientation="vertical" flexItem sx={{ marginLeft: 1, marginRight: 1}}/>
                                <S.PostClassifyWrapper>
                                    <S.PostCategorySelectStack>
                                        <Chip label="Categories"/>
                                        {names.map((name) => (
                                            <MenuItem key={name} value={name} divider={true} onClick={() => handleSelectCategory(name)}>
                                                <Checkbox checked={name===selectCategoryBarName}/>
                                                <ListItemText primary={name} />
                                            </MenuItem>
                                        ))}
                                    </S.PostCategorySelectStack>
                                </S.PostClassifyWrapper>
                                <Divider orientation="vertical" flexItem sx={{ marginLeft: 1, marginRight: 1}}/>
                            </S.PostClassifyBox>
                        </S.PostSearchBox>
                        <S.PostPaginationBox>
                            <Pagination count={10} variant="outlined" color="primary" size="large" sx = {{ width: "auto"}}/>
                        </S.PostPaginationBox>
                    </S.SectionPosts>
                </Container>
            </ThemeProvider>
        </S.BlogBox>
    );
}

export default Blog;