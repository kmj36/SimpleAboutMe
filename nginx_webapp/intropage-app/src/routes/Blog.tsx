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
    Menu,
    MenuItem,
    List,
    ListItem,
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
import { Dayjs } from 'dayjs';
import 'dayjs/locale/ko';
import { Search, Send } from '@material-ui/icons';
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import * as S from '../styles/Blog_Style';
import { CallAPI, Posts_APIResponse, isPostsAPIResponse, Categories_APIResponse, isCategoriesAPIResponse, Tags_APIResponse, isTagsAPIResponse } from '../funcs/CallAPI';
import { Link, useNavigate } from 'react-router-dom';

function Blog()
{
    const navigate = useNavigate();
    const [postjson, setPostjson] = useState({} as Posts_APIResponse);
    const [categoriesjson, setCategoriesjson] = useState({} as Categories_APIResponse);
    const [tagsjson, setTagsjson] = useState({} as Tags_APIResponse);

    const [paginationIndex, setPaginationIndex] = useState<number>(0);
    const [pagesize, setPagesize] = useState<number>(0);

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const [inputuserid, setInputuserid] = useState<string>("");
    const [selectCategoryBarName, setselectCategoryBarName] = useState<string>("");
    const [selectCategoryName, setselectCategoryName] = useState<string>("");
    const [selectTagName, setSelectTagName] = useState<string[]>([]);
    const [datevalue, setDateValue] = useState<Dayjs | null>();
    const SearchRef = useRef<HTMLInputElement | null>(null);
    const BlogRef = useRef(null);
    const timeout = 600;

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const expression = /[-a-zA-Z0-9@:%._~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_.~#?&//=]*)?/gi;
    const regex = new RegExp(expression);
    const pagemax = 4;
    const MenuProps = {
    PaperProps: {
        style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
        },
    },
    };

    const handleCategory = useCallback((e: any) => { 
        if(e.target.value === "None")
            return;
        setselectCategoryName(e.target.value);
    }, []);

    const handleSelectTag = useCallback((e : any) => {
        const { target: { value } } = e;
        setSelectTagName(typeof value === 'string' ? value.split(',') : value);
    }, []);

    const handleSelectCategory = useCallback((target: string) => {
        setPaginationIndex(0);
        if(target===selectCategoryBarName)
            setselectCategoryBarName("");
        else
            setselectCategoryBarName(target);
        setPagesize(postjson?.posts?.filter((post) => {
            if(target===post.categoryid || target===selectCategoryBarName)
                return true;
            else
                return false;
        }).length);
    }, [postjson?.posts, selectCategoryBarName]);

    const handleImageError : React.ReactEventHandler<HTMLImageElement> = useCallback((event : React.SyntheticEvent<HTMLImageElement, Event>) => {
        event.currentTarget.src = "/No_Image.jpg"
    }, []);

    const handlePagination = useCallback((event: React.ChangeEvent<unknown>, page: number) => {
        setPaginationIndex(page-1);
    }, []);

    const handleOnSearchEnter : React.KeyboardEventHandler<HTMLDivElement> = useCallback((event : React.KeyboardEvent<HTMLDivElement>) => {
        if(event.key === 'Enter')
        {
            var query = "";
            const inputtitle = SearchRef?.current?.value;
            if (typeof inputtitle == 'string')
                query += `t=${encodeURIComponent(inputtitle)}&`;

            if (typeof inputuserid == 'string' && inputuserid !== "")
                query += `u=${encodeURIComponent(inputuserid)}&`;

            if (typeof selectCategoryName == 'string' && selectCategoryName !== "")
                query += `c=${encodeURIComponent(selectCategoryName)}&`;

            if (selectTagName.length > 0 && Array.isArray(selectTagName))
                query += `ag=${encodeURIComponent(selectTagName.join(', '))}&`;
            
            if (datevalue !== undefined && datevalue !== null)
            {
                const date = datevalue?.format("YYYY-MM-DD");
                query += `d=${encodeURIComponent(date)}`;
            }

            navigate(`/search?${query}`);
        }
    }, [datevalue, inputuserid, navigate, selectCategoryName, selectTagName]);

    const handleOnSearchButton : React.MouseEventHandler<HTMLButtonElement> = useCallback((e : React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        var query = "";
        const inputtitle = SearchRef?.current?.value;
        if (typeof inputtitle == 'string')
            query += `t=${encodeURIComponent(inputtitle)}&`;

        if (typeof inputuserid == 'string' && inputuserid !== "")
            query += `u=${encodeURIComponent(inputuserid)}&`;

        if (typeof selectCategoryName == 'string' && selectCategoryName !== "")
            query += `c=${encodeURIComponent(selectCategoryName)}&`;

        if (selectTagName.length > 0 && Array.isArray(selectTagName))
            query += `ag=${encodeURIComponent(selectTagName.join(', '))}&`;
        
        if (datevalue !== undefined && datevalue !== null)
        {
            const date = datevalue?.format("YYYY-MM-DD");
            query += `d=${encodeURIComponent(date)}`;
        }

        navigate(`/search?${query}`);
    }, [datevalue, inputuserid, navigate, selectCategoryName, selectTagName]);

    const handleOnUseridInput : React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = useCallback((event : React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setInputuserid(event.currentTarget.value);
    }, []); 

    const handleClickListItem : React.MouseEventHandler<HTMLDivElement> = useCallback((event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    }, []);

    const handleClose = useCallback(() => {
        setAnchorEl(null);
    }, []);

    useEffect(() =>  {
        (async () => {
            const postlist = await CallAPI({APIType: "PostList", Query:"order=recent", Method: "GET"});
            const categorieslist = await CallAPI({APIType: "CategoryList", Method: "GET"});
            const tagslist = await CallAPI({APIType: "TagList", Method: "GET"});
            if(isPostsAPIResponse(postlist))
            {
                setPostjson(postlist);
                setPagesize(postlist?.posts?.length);
            }
            if(isCategoriesAPIResponse(categorieslist))
                setCategoriesjson(categorieslist);
            if(isTagsAPIResponse(tagslist))
                setTagsjson(tagslist);
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
                                            inputRef={SearchRef}
                                            onKeyDown={handleOnSearchEnter}
                                            InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                <Search/>
                                                </InputAdornment>
                                            ),
                                            }}
                                            style={useMemo(()=>({ width: "100%" }), [])}
                                            color="primary"
                                            variant="standard"
                                        />
                                    </S.AdvancedSearchPaper>
                                    <S.AdvancedSearchInputButton variant="contained" endIcon={<Send />} sx={useMemo(()=>({ marginLeft: 1 }), [])} onClick={handleOnSearchButton}>
                                        Search
                                    </S.AdvancedSearchInputButton>
                                </S.AdvancedSearchWrapper>
                                <S.AdvancedSearchOptionWrapper>
                                    <S.AdvancedSearchPaper>
                                        <FormControl variant="filled" sx={useMemo(()=>({ m: 1 }), [])}>
                                            <TextField id="outlined-basic" value={inputuserid} onChange={handleOnUseridInput} label="UserID" variant="outlined" />
                                        </FormControl>
                                        <FormControl variant="filled" sx={useMemo(()=>({ m: 1, minWidth: 160 }), [])}>
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
                                            {categoriesjson?.categories?.length > 0 ?
                                            categoriesjson.categories.map((category, index) => (
                                                <MenuItem key={index} value={category.categoryid}>
                                                    <ListItemText primary={category.categoryid} />
                                                </MenuItem>
                                            )) : <MenuItem value="None">{"None"}</MenuItem>}
                                            </Select>
                                        </FormControl>
                                        <FormControl variant="filled" sx={useMemo(()=>({ m: 1, minWidth: 140 }), [])}>
                                            <InputLabel id="select-Tags-label">Tags (OR)</InputLabel>
                                            <Select
                                            labelId="select-Tags-label"
                                            id="Tag"
                                            multiple
                                            value={selectTagName}
                                            onChange={handleSelectTag}
                                            label="Tags (OR)"
                                            renderValue={(selected) => (selected.length + ' Selected.')}
                                            MenuProps={MenuProps}
                                            >
                                            {tagsjson?.tags?.map((tag, index) => (
                                                <MenuItem key={index} value={tag.tagid}>
                                                    <Checkbox checked={selectTagName.indexOf(tag.tagid) > -1} />
                                                    <ListItemText primary={tag.tagid} />
                                                </MenuItem>
                                            ))}
                                            </Select>
                                        </FormControl>
                                        <FormControl>
                                            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
                                                <DemoContainer components={['DatePicker']} sx={{padding: 1}}>
                                                    <DatePicker
                                                        value={datevalue}
                                                        format={"YYYY-MM-DD"}
                                                        onChange={(newValue : any) => setDateValue(newValue)}
                                                        label={"Date"}
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
                            <S.PostSelectedCategoryBox>
                                <Divider flexItem sx={useMemo(()=>({ width: '100%', marginTop: 1, marginBottom: 1 }), [])}/>
                                <List
                                    component="nav"
                                    aria-label="Selected category"
                                    sx={useMemo(()=>({ bgcolor: 'background.paper' }), [])}
                                >
                                    <ListItem
                                    button
                                    id="lock-button"
                                    aria-haspopup="listbox"
                                    aria-controls="lock-menu"
                                    aria-label="Selected Category"
                                    aria-expanded={open ? 'true' : undefined}
                                    onClick={handleClickListItem}
                                    >
                                    <ListItemText
                                        primary="Selected Category"
                                        secondary={selectCategoryBarName === "" ? 'All' : selectCategoryBarName}
                                    />
                                    </ListItem>
                                </List>
                                <Menu
                                    id="lock-menu"
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                    MenuListProps={{
                                    'aria-labelledby': 'lock-button',
                                    role: 'listbox',
                                    }}
                                >
                                    {categoriesjson?.categories?.map((category, index) => (
                                    <MenuItem
                                        key={index}
                                        selected={category.categoryid===selectCategoryBarName}
                                        onClick={() => handleSelectCategory(category.categoryid)}
                                    >
                                        {category?.categoryid}
                                    </MenuItem>
                                    ))}
                                </Menu>
                                <Divider flexItem sx={useMemo(()=>({ width: '100%', marginTop: 1, marginBottom: 1 }), [])}/>
                            </S.PostSelectedCategoryBox>
                            <S.PostStack spacing={2}>
                                {postjson?.posts?.length > 0 ?
                                postjson.posts.filter((post) => {
                                    if(selectCategoryBarName === "" || selectCategoryBarName === post.categoryid)
                                        return true;
                                    else
                                        return false;
                                })?.slice(0+(pagemax*paginationIndex),pagemax+(pagemax*paginationIndex))?.map((post, index) => (
                                    <Grow
                                    in={true}
                                    >
                                        <Link key={index} to={"/post/" + post.postid} style={{ textDecoration: 'none', color: 'black' }}>
                                            <S.PostPaper>
                                                <S.PostImageBox>
                                                    <S.PostImage src={typeof post.thumbnailurl == 'string' && regex.test(post.thumbnailurl) ? post.thumbnailurl : "/No_Image.jpg"} onError={handleImageError} />
                                                </S.PostImageBox>
                                                <S.PostInfoBox>
                                                    <S.PostInfoCategoryBox>
                                                        <Chip label={post.categoryid === "" || post.categoryid === null ? "No Set" : post.categoryid} />
                                                    </S.PostInfoCategoryBox>
                                                    <S.PostInfoTitleBox>
                                                        <S.PostInfoTypography variant='h5'>
                                                            {post.title}
                                                        </S.PostInfoTypography>
                                                    </S.PostInfoTitleBox>
                                                    <S.PostInfoContentBox>
                                                        <S.PostInfoContentTypography variant='subtitle2'>
                                                            {post.content}
                                                        </S.PostInfoContentTypography>
                                                    </S.PostInfoContentBox>
                                                    <S.PostInfoTagsBox>
                                                        <S.PostInfoTagsTypography variant='subtitle1' color="gray">
                                                            {post.tagid.length > 0 ? post.tagid?.map((tag) => (`#${tag} `)) : "#NoTag"}
                                                        </S.PostInfoTagsTypography>
                                                    </S.PostInfoTagsBox>
                                                    <S.PostInfoDateBox>
                                                        <S.PostInfoDateTypography variant='subtitle2'>
                                                            {post.created_at?.slice(0, 19)?.replace(/[T.]/g, ' / ')}
                                                        </S.PostInfoDateTypography>
                                                    </S.PostInfoDateBox>
                                                    <S.PostInfoAuthorBox>
                                                        <S.PostInfoAuthorTypography variant='subtitle2'>
                                                            Author: {post.userid}
                                                        </S.PostInfoAuthorTypography>
                                                    </S.PostInfoAuthorBox>
                                                </S.PostInfoBox>
                                            </S.PostPaper>
                                        </Link>
                                    </Grow>
                                )) :
                                <S.PostPaper>
                                    <S.PostImageBox>
                                        <S.PostImage src="/No_Image.jpg"/>
                                    </S.PostImageBox>
                                    <S.PostInfoBox>
                                        <S.PostInfoCategoryBox>
                                            <Chip label="No Set"/>
                                        </S.PostInfoCategoryBox>
                                        <S.PostInfoTitleBox>
                                            <S.PostInfoTypography variant='h5'>
                                                Empty Post
                                            </S.PostInfoTypography>
                                        </S.PostInfoTitleBox>
                                        <S.PostInfoContentBox>
                                            <S.PostInfoContentTypography variant='subtitle2'>
                                                Empty Content
                                            </S.PostInfoContentTypography>
                                        </S.PostInfoContentBox>
                                        <S.PostInfoTagsBox>
                                            <S.PostInfoTagsTypography variant='subtitle1' color="gray">
                                                #NoTag
                                            </S.PostInfoTagsTypography>
                                        </S.PostInfoTagsBox>
                                        <S.PostInfoDateBox>
                                            <S.PostInfoDateTypography variant='subtitle2'>
                                                Empty Date
                                            </S.PostInfoDateTypography>
                                        </S.PostInfoDateBox>
                                        <S.PostInfoAuthorBox>
                                            <S.PostInfoAuthorTypography variant='subtitle2'>
                                                Author: Empty Author
                                            </S.PostInfoAuthorTypography>
                                        </S.PostInfoAuthorBox>
                                    </S.PostInfoBox>
                                </S.PostPaper>
                            }
                            </S.PostStack>
                            <S.PostClassifyBox>
                                <Divider orientation="vertical" flexItem sx={useMemo(()=>({ marginLeft: 1, marginRight: 1}), [])}/>
                                <S.PostClassifyWrapper>
                                    <S.PostCategorySelectStack>
                                        <Chip label="Categories"/>
                                        {categoriesjson?.categories?.length > 0 ?
                                        categoriesjson.categories.map((category, index) => (
                                            <MenuItem key={index} value={category.categoryid} divider={true} onClick={() => handleSelectCategory(category.categoryid)}>
                                                <Checkbox checked={category.categoryid===selectCategoryBarName}/>
                                                <ListItemText primary={category.categoryid} />
                                            </MenuItem>
                                        )) : <MenuItem value="None">{"None"}</MenuItem>}
                                    </S.PostCategorySelectStack>
                                </S.PostClassifyWrapper>
                                <Divider orientation="vertical" flexItem sx={useMemo(()=>({ marginLeft: 1, marginRight: 1}), [])}/>
                            </S.PostClassifyBox>
                        </S.PostSearchBox>
                        <S.PostPaginationBox>
                            <Pagination page={paginationIndex+1} onChange={handlePagination} count={Math.ceil(pagesize / 4)} variant="outlined" color="primary" size="large" sx={useMemo(()=>({ width: "auto"}), [])}/>
                        </S.PostPaginationBox>
                    </S.SectionPosts>
                </Container>
            </ThemeProvider>
        </S.BlogBox>
    );
}

export default Blog;