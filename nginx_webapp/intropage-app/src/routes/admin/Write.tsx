import { Editor as ToastEditor } from '@toast-ui/react-editor';
import { useEffect, useState, useRef } from 'react';
import '@toast-ui/editor/dist/toastui-editor.css';
import * as S from '../../styles/admin/Write_Style';
import { Button, Select, MenuItem, SelectChangeEvent, Typography, FormControlLabel, Checkbox } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import { Image } from '@material-ui/icons';
import { CallAPI, isCategoriesAPIResponse, Categories_APIResponse, isTagsAPIResponse, Tags_APIResponse, ImageUpload_APIResponse, Posts_APIResponse } from '../../funcs/CallAPI';
import { useDispatch } from 'react-redux';
import { loading, done } from '../../redux/feature/LoadingReducer';

function Write()
{
    const dispatch = useDispatch();
    const [categoryList, setCategoryList] = useState({} as Categories_APIResponse);
    const [tagList, setTagList] = useState({} as Tags_APIResponse);
    const [pulish, setPublish] = useState<boolean>(true);
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

    const handleClose = () => {
        setPassworddialogopen(false);
        setThumbnailDialogOpen(false);
        if(secretpassword[0] !== secretpassword[1])
            setSecretpassword(["", ""])
    };

    const handleEnterPassword = () => {
        if(secretpassword[0] !== secretpassword[1])
        {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }
        setPassworddialogopen(false);
    }

    const handleThumbnailEnter = () => { // 이미지 파일 확장자 검사 추가
        if(!thumbnail.match(/(.*?)\.(jpg|jpeg|png|gif|bmp|tif|tiff)$/))
        {
            alert("이미지 파일이 아닙니다.");
            return;
        }
        setThumbnailDialogOpen(false);
    }

    const handleChange = (event: SelectChangeEvent<typeof tagSelected>) => {
        const {
          target: { value },
        } = event;
        settagSelected(
          // On autofill we get a the stringified value.
          typeof value === 'string' ? value.split(',') : value,
        );
    };

    const handleClearClick = () => {
        if(window.confirm("선택한 태그를 모두 지우시겠습니까?"))
            settagSelected([]);
    }

    const handleSend = () => {
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
            "is_published": pulish,
            "is_secret": secret,
            "secret_password": secretpassword[1],
            "categoryid": categoryvalue === "None" ? "" : categoryvalue,
            "tagid": tagSelected,
        };
        (async () => {
            dispatch(loading());
            const response = await CallAPI({APIType:"PostList", Method:"POST", Body: body}) as Posts_APIResponse;
            if(response.status === "Success")
            {
                alert("게시물을 성공적으로 작성하였습니다.");
                window.location.href = "/";
            }
            else
                alert("게시물 작성에 실패하였습니다.");
            dispatch(done());
        })();
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
                <S.InputTitle placeholder='Title' value={titlevalue} onChange={(e : React.ChangeEvent<HTMLInputElement>) => setTitleValue(e.currentTarget.value)}></S.InputTitle>
            </S.TitleBox>
            <ToastEditor
                initialValue=" "
                previewStyle="vertical"
                height="600px"
                initialEditType="wysiwyg"
                useCommandShortcut={false}
                placeholder='Content'
                ref={editorRef}
                onChange={() => setContentValue(editorRef.current?.getInstance().getMarkdown())}
                hooks={{
                    addImageBlobHook: async (blob, callback) => {
                        const formData = new FormData();
                        formData.append('image', blob);
                        const imageurl = await CallAPI({APIType:"ImageUpload", Method:"POST", Body: formData}) as ImageUpload_APIResponse;
                        callback(process.env.REACT_APP_API_HOST+'/api/v1'+imageurl.image.url);
                        return false;
                    },
                }}
            />
            <S.EnterBox>
                <S.SpecificBox>
                    <Typography variant="h6" sx={{ marginLeft: 1 }}>Categories</Typography>
                    <Select
                        id="Categories_Box"
                        displayEmpty
                        sx={{ minWidth: 200, marginLeft: 2, marginRight: 3 }}
                        MenuProps={MenuProps}
                        value={categoryvalue}
                        onChange={(e : SelectChangeEvent<string>) => setCategoryValue(e.target.value as string)}
                    >
                        <MenuItem value="None">
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
                <FormControlLabel disabled={secretpassword[1] !== ""} control={<Checkbox value={secret} onChange={() => setSecret(!secret)}/>} label="Secret"/>
                {secret ? secretpassword[1] === "" ? <Button variant="outlined" onClick={() => setPassworddialogopen(true)}>Set Password</Button> : <Button variant="contained" onClick={() => setPassworddialogopen(true)}>Change Password</Button> : <></>}
                <Button variant="contained" disabled={secret && secretpassword[1] === ""} sx={{ marginLeft:'auto' }} endIcon={<SendIcon />} onClick={handleSend}>Send</Button>
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
                        onChange={(e : React.ChangeEvent<HTMLInputElement>) => setThumbnail(e.currentTarget.value)}
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
                        onChange={(e : React.ChangeEvent<HTMLInputElement>) => setSecretpassword([e.currentTarget.value, secretpassword[1]])}
                    />
                    <TextField
                        margin="dense"
                        id="postPassword2"
                        label="Type Password Again"
                        type="password"
                        fullWidth
                        variant="standard"
                        value={secretpassword[1]}
                        onChange={(e : React.ChangeEvent<HTMLInputElement>) => setSecretpassword([secretpassword[0], e.currentTarget.value])}
                    />
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={() => setSecretpassword(["", ""])}>Clear</Button>
                    <Button onClick={handleClose}>취소</Button>
                    <Button onClick={handleEnterPassword}>확인</Button>
                </DialogActions>
            </Dialog>
        </S.WriteBox>
    );
}

export default Write;