import { useParams } from "react-router-dom";
import { CallAPI, Comments_APIResponse, isCommentsAPIResponse, Post_APIResponse, isPostAPIResponse } from "../../funcs/CallAPI";
import { Send } from '@material-ui/icons';
import { Divider, TextField, Button, CircularProgress, Tabs, Tab, Chip } from '@mui/material';
import { useState, useEffect, useRef } from "react";
import { ThemeProvider } from 'styled-components';
import Markdown from 'react-markdown'
import * as S from '../../styles/Page_Style';

function Page()
{
    const { pagestr } = useParams();
    const [postjson, setPostjson] = useState({} as Post_APIResponse);
    const [commentjson, setCommentjson] = useState({} as Comments_APIResponse);
    const [commentbuttonicon, setCommentbuttonicon] = useState<JSX.Element>(<Send/>);
    const [commentvalue, setCommentvalue] = useState<string>("");
    const [previewvalue, setPreviewvalue] = useState<number>(0);
    const [markdownIDList, setMarkdownIDList] = useState<string[]>([]);
    const markdownRef = useRef<HTMLDivElement>(null);

    const handleCommentSend = () => {
        if(commentvalue === "")
        {
            alert("댓글을 입력해주세요.")
            return;
        }
        (async () => {
            setCommentbuttonicon(<CircularProgress color="inherit" size={25}/>);
            await CallAPI({APIType:"CommentList", Method:"POST", Body:{
                "postid" : pagestr,
                "content" : commentvalue,
            }});
            window.location.reload();
        })();
    }

    const handleCommentInput = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setCommentvalue(event.target.value);
    }

    const handlePreviewTapChange = (event: React.SyntheticEvent, newValue: number) => {
        setPreviewvalue(newValue);
    }

    const handleIDMove = (e : any, id: string) => {
        e.preventDefault();
        if (id) {
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }

    useEffect(() => {
        (async () => {
            window.scrollTo(0,0);
            const posts = await CallAPI({APIType:"PostDetail", Method:"GET", Query:"order=review", Name:`${pagestr}`});
            const comments = await CallAPI({APIType:"CommentList", Method:"GET", Query:`postid=${pagestr}`});
            if(isPostAPIResponse(posts))
                setPostjson(posts);
            if(isCommentsAPIResponse(comments))
                setCommentjson(comments);
            if (markdownRef.current) {
                const headerElements = markdownRef.current.querySelectorAll('h1, h2, h3, h4, h5, h6');
                headerElements.forEach((value, key) => {
                    value.id = `#${value.innerHTML.replace(' ', '_')}_${key}`;
                    setMarkdownIDList(prev => [...prev, value.id]);
                });
            }
        })();
    }, []);
    return (
        <S.PageBox>
            <ThemeProvider theme={S.theme}>
                <S.SectionBanner style={{ backgroundImage: `url('${postjson?.post?.thumbnailurl}')` }}>
                    <S.ImageOverlayGradient>
                        <S.BannerTitleItemBox>
                            <S.BannerCategoryBox>
                                <S.BannerCategoryTypography variant="subtitle2">
                                    {postjson?.post?.categoryid}
                                </S.BannerCategoryTypography>
                            </S.BannerCategoryBox>
                            <S.BannerTitleBox>
                                <S.BannerTitleTypography variant="h4">
                                    {postjson?.post?.title}
                                </S.BannerTitleTypography>
                            </S.BannerTitleBox>
                            <S.BannerCreatedDateBox>
                                <S.BannerCreatedDateTypography variant="subtitle1">
                                    {`[${postjson?.post?.created_at?.slice(0, 19).replace(/[T.]/g, ' / ')}] (Author : ${postjson?.post?.userid})`}
                                </S.BannerCreatedDateTypography>
                            </S.BannerCreatedDateBox>
                            <S.BannerViewsBox>
                                <S.BannerViewsTypography>
                                    조회수: {postjson?.post?.views}
                                </S.BannerViewsTypography>
                            </S.BannerViewsBox>
                        </S.BannerTitleItemBox>
                    </S.ImageOverlayGradient>
                </S.SectionBanner>
                <S.SectionMain>
                    <S.MainContentContainer maxWidth={'lg'} sx={{ height: '100%' }}>
                        <S.MainBox>
                            <S.MainContentBox ref={markdownRef}>
                                <Markdown>
                                    {postjson?.post?.content}
                                </Markdown>
                            </S.MainContentBox>
                            <S.MainRightBarWrapper>
                                <Divider orientation="vertical" flexItem style={{marginLeft: 25, marginRight: 25}}/>
                                <S.MainRightBarBox>
                                    <Chip label="페이지 이동" sx={{ marginBottom: 2 }}/>
                                    <S.MainRightBarStack spacing={1}>
                                        {markdownIDList.map((id, index) => (
                                            <S.MainRightBarIDBox key={index}>
                                                <S.MainRightBarIDAhref href={id} onClick={(e : any) => handleIDMove(e, id)}>
                                                    {id}
                                                </S.MainRightBarIDAhref>
                                            </S.MainRightBarIDBox>
                                        ))}
                                    </S.MainRightBarStack>
                                    <Divider flexItem style={{marginTop: 25}}/>
                                </S.MainRightBarBox>
                                <Divider orientation="vertical" flexItem style={{marginLeft: 25}}/>
                            </S.MainRightBarWrapper>
                        </S.MainBox>
                        <S.MainTagBox>
                            <S.MainTagTypography variant="subtitle2" color="gray">
                                {postjson?.post?.tagid?.length > 0 ? postjson?.post?.tagid?.map((tag) => ("#" + tag + " ")) : "#NoTag"}
                            </S.MainTagTypography>
                        </S.MainTagBox>
                        <S.CommentBox>
                            <S.CommentTitleTypography>
                                댓글 {commentjson?.comments?.length}개
                            </S.CommentTitleTypography>
                            <Divider flexItem style={{marginTop: 10, marginBottom: 10}}/>
                            <S.CommentInputBox>
                                <Tabs value={previewvalue} onChange={handlePreviewTapChange}>
                                    <Tab label="입력"/>
                                    <Tab label="미리보기"/>
                                </Tabs>
                                {previewvalue ? <Markdown>{commentvalue}</Markdown>: <TextField value={commentvalue}
                                onChange={handleCommentInput}
                                id="comment-input"
                                variant="outlined"
                                multiline
                                inputProps={{ maxLength: 2000 }}
                                placeholder="댓글"
                                rows={4}
                                maxRows={4}
                                fullWidth={true}
                                helperText={postjson?.requestor}/>}
                                <S.CommentInputButtonBox>
                                    <Button variant="contained" endIcon={commentbuttonicon} onClick={handleCommentSend}>
                                        작성
                                    </Button>
                                </S.CommentInputButtonBox>
                            </S.CommentInputBox>
                            <S.CommentStack>
                                {commentjson?.comments?.map((comment) => (
                                    <S.CommentDataBox key={comment?.commentid}>
                                        <S.CommentDataInfoBox>
                                            <S.CommentUserTypography variant="h6">
                                                {comment?.userid ? comment?.userid : comment?.created_ip}
                                            </S.CommentUserTypography>
                                            <S.CommentDateTypography variant="subtitle2" color="gray">
                                                {`${comment?.created_ip ? '('+comment?.created_ip+')' : ''} 날짜: ${comment?.created_at?.slice(0, 19)?.replace(/[T.]/g, ' / ')}, 수정: ${comment?.updated_at?.slice(0, 19)?.replace(/[T.]/g, ' / ')}`}
                                            </S.CommentDateTypography>
                                        </S.CommentDataInfoBox>
                                        <Markdown>
                                            {comment?.content}
                                        </Markdown>
                                        <Divider flexItem style={{marginTop: 10}}/>
                                    </S.CommentDataBox>
                                ))}
                            </S.CommentStack>
                        </S.CommentBox>
                    </S.MainContentContainer>
                </S.SectionMain>
            </ThemeProvider>
        </S.PageBox>
    );
}

export default Page;