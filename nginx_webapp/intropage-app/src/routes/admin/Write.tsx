import { Editor as ToastEditor } from '@toast-ui/react-editor';
import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import '@toast-ui/editor/dist/toastui-editor.css';
import * as S from '../../styles/admin/Write_Style';
import { Button, Select, MenuItem, SelectChangeEvent, Typography, FormControlLabel, Checkbox } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import { Image } from '@material-ui/icons';
import { CallAPI, isCategoriesAPIResponse, Categories_APIResponse, isTagsAPIResponse, Tags_APIResponse, ImageUpload_APIResponse, Posts_APIResponse } from '../../funcs/CallAPI';

function Write()
{
    const [categoryList, setCategoryList] = useState({} as Categories_APIResponse);
    const [tagList, setTagList] = useState({} as Tags_APIResponse);
    const [publish, setPublish] = useState<boolean>(true);
    const [secret, setSecret] = useState<boolean>(false);
    const [passworddialogopen, setPassworddialogopen] = useState(false);
    const [thumbnaildialogopen, setThumbnailDialogOpen] = useState(false);

    const [titlevalue, setTitleValue] = useState<string>("");
    const [contentvalue, setContentValue] = useState<string | undefined>("");
    const [categoryvalue, setCategoryValue] = useState<string>("None");
    const [tagSelected, settagSelected] = useState<string[]>([]);
    const editorRef = useRef<ToastEditor>(null);
    const [secretpassword, setSecretpassword] = useState<string[]>(["", ""]);
    const [thumbnail, setThumbnail] = useState<string>("");

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

    const handleClose = useCallback(() => {
        setPassworddialogopen(false);
        setThumbnailDialogOpen(false);
        if(secretpassword[0] !== secretpassword[1])
            setSecretpassword(["", ""])
    }, [secretpassword]);

    const handleEnterPassword = useCallback(() => {
        if(secretpassword[0] !== secretpassword[1])
        {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }
        setPassworddialogopen(false);
    }, [secretpassword]);

    const handleThumbnailEnter = useCallback(() => { // 이미지 파일 확장자 검사 추가
        if(!thumbnail.match(/(.*?)\.(jpg|jpeg|png|gif|bmp|tif|tiff)$/))
        {
            alert("이미지 파일이 아닙니다.");
            return;
        }
        setThumbnailDialogOpen(false);
    }, [thumbnail]);

    const handleChangeTag = useCallback((event: SelectChangeEvent<typeof tagSelected>) => {
        const {
          target: { value },
        } = event;
        settagSelected(
          // On autofill we get a the stringified value.
          typeof value === 'string' ? value.split(',') : value,
        );
    }, []);

    const handleClearClick = useCallback(() => {
        if(window.confirm("선택한 태그를 모두 지우시겠습니까?"))
            settagSelected([]);
    }, []);

    const handleSend = useCallback(() => {
        if(!window.confirm("게시물을 전송하시겠습니까?"))
            return;

        if(titlevalue === "")
        {
            alert("제목을 입력해주세요.");
            return;
        }
        if(contentvalue === "" || contentvalue === undefined)
        {
            alert("내용을 입력해주세요.");
            return;
        }
        if(secret && secretpassword[1] === "")
        {
            alert("비밀번호를 입력해주세요.");
            return;
        }
        const body = {
            "thumbnailurl": thumbnail,
            "title": titlevalue,
            "content": contentvalue,
            "is_published": publish,
            "is_secret": secret,
            "secret_password": secretpassword[1],
            "categoryid": categoryvalue === "None" ? "" : categoryvalue,
            "tagid": tagSelected,
        };
        (async () => {
            const response = await CallAPI({APIType:"PostList", Method:"POST", Body: body}) as Posts_APIResponse;
            if(response.status === "Success")
            {
                alert("게시물을 성공적으로 작성하였습니다.");
                window.location.href = "/";
            }
            else
                alert("게시물 작성에 실패하였습니다.");
        })();
    }, [categoryvalue, contentvalue, publish, secret, secretpassword, tagSelected, thumbnail, titlevalue]);

    const handleSelectCategory = useCallback((e : SelectChangeEvent<string>) => {
        setCategoryValue(e.target.value as string);
    }, []);

    const handleSetThumbnailDialogOpen = useCallback(() => {
        setThumbnailDialogOpen(true);
    }, []);

    const handleSetTitleValue = useCallback((e : React.ChangeEvent<HTMLInputElement>) => {
        setTitleValue(e.currentTarget.value);
    }, []);

    const handlesetContentValue = useCallback(() => {
        setContentValue(editorRef.current?.getInstance().getMarkdown());
    }, []);

    const handleSetPublish = useCallback(() => {
        setPublish(!publish);
    }, [publish]);

    const handleSetSecret = useCallback(() => {
        setSecret(!secret);
    }, [secret]);

    const handleSetPasswordDialogOpen = useCallback(() => {
        setPassworddialogopen(true);
    }, []);

    const handleSetThumbnail = useCallback((e : React.ChangeEvent<HTMLInputElement>) => {
        setThumbnail(e.currentTarget.value);
    }, []);

    const handleSetPasswordOne = useCallback((e : React.ChangeEvent<HTMLInputElement>) => {
        setSecretpassword([e.currentTarget.value, secretpassword[1]]);
    }, [secretpassword]);

    const handleSetPasswordTwo = useCallback((e : React.ChangeEvent<HTMLInputElement>) => {
        setSecretpassword([secretpassword[0], e.currentTarget.value]);
    }, [secretpassword]);

    const handleClearSecretPassword = useCallback(() => {
        setSecretpassword(["", ""])
    }, []);

    useEffect(() =>  {
        (async () => {
            const categories = await CallAPI({APIType:"CategoryList", Method:"GET"});
            const tags = await CallAPI({APIType:"TagList", Method:"GET"});
            if(isCategoriesAPIResponse(categories))
                setCategoryList(categories);
            if(isTagsAPIResponse(tags))
                setTagList(tags);
        })();
    }, []);
    return (
        <S.WriteBox>
            <S.TitleBox>
                <Image style={useMemo(() => ({ marginLeft: 5 }), [])} onClick={handleSetThumbnailDialogOpen}/>
                <S.InputTitle placeholder='Title' value={titlevalue} onChange={handleSetTitleValue} maxLength={128}></S.InputTitle>
            </S.TitleBox>
            <ToastEditor
                initialValue=" "
                previewStyle="vertical"
                height="600px"
                initialEditType="wysiwyg"
                useCommandShortcut={false}
                placeholder='Content'
                ref={editorRef}
                onChange={handlesetContentValue}
                hooks={{
                    addImageBlobHook: async (blob, callback) => {
                        const formData = new FormData();
                        formData.append('image', blob);
                        const imageurl = await CallAPI({APIType:"ImageUpload", Method:"POST", Body: formData}) as ImageUpload_APIResponse;
                        callback(process.env.REACT_APP_API_HOST+":"+process.env.REACT_APP_API_PORT+'/api/v1'+imageurl.image.url);
                        return false;
                    },
                }}
            />
            <S.EnterBox>
                <S.SpecificBox style={useMemo(()=>({ paddingBottom: 5 }), [])}>
                    <Typography variant="h6" sx={useMemo(() => ({ marginLeft: 1 }), [])}>Categories</Typography>
                    <Select
                        id="Categories_Box"
                        displayEmpty
                        sx={useMemo(() => ({ minWidth: 200, marginLeft: 2, marginRight: 3 }), [])}
                        MenuProps={MenuProps}
                        value={categoryvalue}
                        onChange={handleSelectCategory}
                    >
                        <MenuItem value="None">
                            {"• None"}
                        </MenuItem>
                        {categoryList?.categories?.map((category, index) => (
                            <MenuItem key={index} value={category.categoryid}>{"• " + category.categoryid}</MenuItem>
                        ))}
                    </Select>
                </S.SpecificBox>
                <S.SpecificBox style={useMemo(()=>({ paddingBottom: 5 }), [])}>
                    <Typography variant="h6" sx={useMemo(() => ({ marginLeft: 1 }), [])}>Tags</Typography>
                    <Select
                        id="Tags_Box"
                        multiple
                        value={tagSelected}
                        onChange={handleChangeTag}
                        sx={useMemo(()=>({ minWidth: 200, marginLeft: 2, marginRight: 3}), [])}
                        MenuProps={MenuProps}
                    >
                        {tagList?.tags?.map((tag, index) => (
                            <MenuItem key={index} value={tag.tagid}>{"• " + tag.tagid}</MenuItem>
                        ))}
                    </Select>
                    <Button variant="outlined" onClick={handleClearClick} color="error" startIcon={<DeleteIcon />}>Clear</Button>
                </S.SpecificBox>
                <FormControlLabel control={<Checkbox defaultChecked value={publish} color="success" onChange={handleSetPublish}/>} label="Publish" sx={useMemo(()=>({ marginLeft: 1 }), [])}/>
                <FormControlLabel disabled={secretpassword[1] !== ""} control={<Checkbox value={secret} onChange={handleSetSecret}/>} label="Secret" sx={useMemo(()=>({ marginLeft: 1 }), [])}/>
                {secret ? secretpassword[1] === "" ? <Button variant="outlined" onClick={handleSetPasswordDialogOpen}>Set Password</Button> : <Button variant="contained" onClick={handleSetPasswordDialogOpen}>Set Password</Button> : <></>}
                <Button variant="contained" disabled={secret && secretpassword[1] === ""} sx={useMemo(()=>({ marginLeft:'auto' }), [])} endIcon={<SendIcon />} onClick={handleSend}>Send</Button>
            </S.EnterBox>
            <Dialog open={thumbnaildialogopen} onClose={handleClose}>
                <DialogTitle>Thumbnail</DialogTitle>
                    <DialogContent>
                    <DialogContentText>
                        게시물 썸네일 설정을 위해 이미지 경로를 입력해주세요.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="thumbnail"
                        label="Location"
                        type="text"
                        fullWidth
                        value={thumbnail}
                        onChange={handleSetThumbnail}
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>취소</Button>
                    <Button onClick={handleThumbnailEnter}>확인</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={passworddialogopen} onClose={handleClose}>
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
                        value={secretpassword[0]}
                        onChange={handleSetPasswordOne}
                    />
                    <TextField
                        margin="dense"
                        id="postPassword2"
                        label="Type Password Again"
                        type="password"
                        fullWidth
                        variant="standard"
                        value={secretpassword[1]}
                        onChange={handleSetPasswordTwo}
                    />
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={handleClearSecretPassword}>Clear</Button>
                    <Button onClick={handleClose}>취소</Button>
                    <Button onClick={handleEnterPassword}>확인</Button>
                </DialogActions>
            </Dialog>
        </S.WriteBox>
    );
}

export default Write;