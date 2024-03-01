import * as S from '../styles/PostControl_Style';
import { useState, useEffect } from 'react';
import { CallAPI, Posts_APIResponse, isPostsAPIResponse, Post_APIResponse } from '../funcs/CallAPI';
import { Box, Button } from '@mui/material';
import { ExitToApp, Delete } from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

function PostControl()
{
    const [Posts, setPosts] = useState({} as Posts_APIResponse);
    const [isPostin, setisPostin] = useState(false);
    const [selectedPostid, setselectedPostid] = useState(0);

    const handleGetPosts = () => {
        (async () => {
            const posts = await CallAPI({APIType:"PostList", Method:"GET"});
            if(isPostsAPIResponse(posts))
                setPosts(posts);
        })();
    }

    const handleDeletePost = () => {
        window.confirm("정말 게시물을 삭제하시겠습니까?") &&
        (async () => {
            const res = await CallAPI({APIType:"PostDetail", Method:"DELETE", Name:`${selectedPostid}`}) as Post_APIResponse;
            if(res.code === 200)
            {
                alert(res.detail);
                handleGetPosts();
                setisPostin(false);
            }
        }
        )();
    }

    const handleRowClick = (e : any) => {
        setselectedPostid(e.row.postid);
        setisPostin(true);
    }

    const Postcolumns : GridColDef[] = [
        { field: 'postid', headerName: 'ID', width: 200 },
        { field: 'userid', headerName: 'User', width: 200 },
        { field: 'categoryid', headerName: 'Category', width: 200 },
        { field: 'title', headerName: 'Title', width: 250 },
        { field: 'created_at', headerName: 'Created At', width: 250 },
        { field: 'views', headerName: 'Views', width: 100 },
        { field: 'is_secret', headerName: 'Secret', width: 100 },
    ];

    useEffect(() => {
        handleGetPosts();
    }, []);

    return(
        <S.PostControlBox>
            <DataGrid
                rows={Posts?.posts?.length > 0 ? Posts.posts: []}
                onRowClick={handleRowClick}
                columns={Postcolumns}
                getRowId={(row) => row.postid}
                initialState={{
                    pagination: {
                        paginationModel: {
                        pageSize: 10,
                        },
                    },
                }}
                pageSizeOptions={[10]}
                style={{ marginTop: 10, display: isPostin ? "none" : "block" }}
            />
            <S.PostPreviewBox style={{ display: isPostin ? "block" : "none" }}>
                <S.PostTopBox>
                    <Button variant="contained" onClick={() => setisPostin(false)} startIcon={<ExitToApp />}>Return</Button>
                    <Button variant="contained" style={{marginLeft: '10px'}} onClick={handleDeletePost} startIcon={<Delete />}>Delete</Button>
                </S.PostTopBox>
                <Box>
                    <h1>{Posts?.posts?.find(post => post.postid===selectedPostid)?.title}</h1>
                    <p>{Posts?.posts?.find(post => post.postid===selectedPostid)?.content}</p>
                </Box>
            </S.PostPreviewBox>
        </S.PostControlBox>
    );
}

export default PostControl;