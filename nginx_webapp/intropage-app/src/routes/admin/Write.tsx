import { Editor } from '@toast-ui/react-editor';
import { useEffect, useState } from 'react';
import '@toast-ui/editor/dist/toastui-editor.css';
import * as S from '../../styles/admin/Write_Style';
import { Button, Select, MenuItem, SelectChangeEvent, Typography, FormControlLabel, Checkbox } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import { Image } from '@material-ui/icons';
import { CallAPI, isCategoriesAPIResponse, Categories_APIResponse, isTagsAPIResponse, Tags_APIResponse } from '../../funcs/CallAPI';
import { useDispatch } from 'react-redux';
import { loading, done } from '../../redux/feature/LoadingReducer';

function Write()
{
    const dispatch = useDispatch();
    const [categoryList, setCategoryList] = useState({} as Categories_APIResponse);
    const [tagList, setTagList] = useState({} as Tags_APIResponse);
    const [tagSelected, settagSelected] = useState<string[]>([]);
    const [pulish, setPublish] = useState<boolean>(true);
    const [secret, setSecret] = useState<boolean>(false);
    const [open, setOpen] = useState(false);
    const [thumbnaildialogopen, setThumbnailDialogOpen] = useState(false);

    const handleClose = () => {
        setOpen(false);
        setThumbnailDialogOpen(false);
    };

    const handleChange = (event: SelectChangeEvent<typeof tagSelected>) => {
        const {
          target: { value },
        } = event;
        settagSelected(
          // On autofill we get a stringified value.
          typeof value === 'string' ? value.split(',') : value,
        );
    };

    const handleClearClick = () => {
        if(window.confirm("선택한 태그를 모두 지우시겠습니까?"))
            settagSelected([]);
    }

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

    useEffect(() =>  {
        (async () => {
            dispatch(loading());
            const categories = await CallAPI({APIType:"CategoryList", Method:"GET"});
            const tags = await CallAPI({APIType:"TagList", Method:"GET"});
            if(isCategoriesAPIResponse(categories))
                setCategoryList(categories);
            if(isTagsAPIResponse(tags))
                setTagList(tags);
            dispatch(done());
        })();
    }, []);
    return (
        <S.WriteBox>
            <S.TitleBox>
                <Image style={{ marginLeft: 5 }} onClick={() => setThumbnailDialogOpen(true)}/>
                <S.InputTitle placeholder='Title'></S.InputTitle>
            </S.TitleBox>
            <Editor
                initialValue=" "
                previewStyle="vertical"
                height="600px"
                initialEditType="wysiwyg"
                useCommandShortcut={false}
                placeholder='Content'
            />
            <S.EnterBox>
                <S.SpecificBox>
                    <Typography variant="h6" sx={{ marginLeft: 1 }}>Categories</Typography>
                    <Select
                        id="Categories_Box"
                        displayEmpty
                        sx={{ minWidth: 200, marginLeft: 2, marginRight: 3 }}
                        MenuProps={MenuProps}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        {categoryList?.categories?.map((category, index) => (
                            <MenuItem key={index} value={category.categoryid}>{category.categoryid}</MenuItem>
                        ))}
                    </Select>
                </S.SpecificBox>
                <S.SpecificBox>
                    <Typography variant="h6">Tags</Typography>
                    <Select
                        id="Tags_Box"
                        multiple
                        value={tagSelected}
                        onChange={handleChange}
                        sx={{ width: 300, marginLeft: 2, marginRight: 3}}
                        MenuProps={MenuProps}
                    >
                        {tagList?.tags?.map((tag, index) => (
                            <MenuItem key={index} value={tag.tagid}>{tag.tagid}</MenuItem>
                        ))}
                    </Select>
                    <Button variant="outlined" onClick={handleClearClick} color="error" startIcon={<DeleteIcon />}>Clear</Button>
                </S.SpecificBox>
                <FormControlLabel control={<Checkbox defaultChecked value={pulish} color="success" onChange={() => setPublish(!pulish)}/>} label="Publish" sx={{ marginLeft: 1 }}/>
                <FormControlLabel control={<Checkbox value={secret} onChange={() => setSecret(!secret)}/>} label="Secret"/>
                {secret ? <Button variant="outlined" onClick={() => setOpen(true)}>Set Password</Button>: <></>}
                <Button variant="contained" sx={{ marginLeft:'auto' }} endIcon={<SendIcon />}>Send</Button>
            </S.EnterBox>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Set Post Password</DialogTitle>
                    <DialogContent>
                    <DialogContentText>
                        게시물의 비밀번호를 설정하기 위해 패스워드를 입력해주세요.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="postPassword"
                        label="Password"
                        type="password"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        margin="dense"
                        id="postPassword2"
                        label="Type Password Again"
                        type="password"
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>취소</Button>
                    <Button onClick={handleClose}>확인</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={thumbnaildialogopen} onClose={handleClose}>
                <DialogTitle>Thumbnail URL</DialogTitle>
                    <DialogContent>
                    <DialogContentText>
                        게시물 썸네일 설정을 위해 URL을 입력해주세요.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="thumbnailURL"
                        label="URL"
                        type="text"
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>취소</Button>
                    <Button onClick={handleClose}>확인</Button>
                </DialogActions>
            </Dialog>
        </S.WriteBox>
    );
}

export default Write;