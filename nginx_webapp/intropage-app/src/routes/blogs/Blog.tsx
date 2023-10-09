import styled from 'styled-components';
import { Container } from '@material-ui/core';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Stack, Card, Typography, Grow, Box, Divider, Chip } from '@mui/material';
import axios from 'axios';

const BlogBox = styled.div`
    margin: 5px;
`

const ImgBlock = styled.img`
    width: 200px;
    height: 150px;
    margin: 5px;
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
    
    const handleImageError = (e : any) => {
        e.target.src = "/No_Image.jpg"
    }

    const expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
    const regex = new RegExp(expression);

    useEffect(() =>  {
        (async () => {
            setLoading(true);
            const result = await axios.get('http://127.0.0.1:8000/api/v1/post/');
            setPostjson(result.data);
            setLoading(false);
        })();
    }, []);

    return (
        <Container style={{ paddingTop: "72px" }}>
            <BlogBox>
            <Stack
                direction="column"
                justifyContent="flex-start"
                alignItems="stretch"
                spacing={1}
                >
                <Divider><Chip label="LATEST"/></Divider>
                    {postjson.posts?.map((post, index) => {
                        if(post.is_published === false)
                        {
                            return;
                        }
                        return(
                            <Grow key={index} in={true} style={{ transformOrigin: '0 0 0' }} timeout={500 + (100 * index)}>
                                <Link to={`/post/${post.postid}`} style={{ textDecoration: 'none' }}>
                                    <Card sx={{ display: "flex" }}>
                                        <Box sx={{ display: "flex"}}>
                                            <ImgBlock
                                            src={regex.test(post.thumbnailurl) ? post.thumbnailurl : "/No_Image.jpg"}
                                            onError={handleImageError}
                                            />
                                        </Box>
                                        <Box sx={{ display: "flex", flexDirection: "column"}}>
                                            <Typography variant="h5" component="div" sx={{
                                                width: "100%",
                                                height: "60px",
                                                textOverflow: "ellipsis",
                                                overflow: "hidden",
                                                wordBreak: "break-all",
                                                display: "-webkit-box",
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: "vertical",
                                            }}>
                                                {post.title}
                                            </Typography>
                                            <Typography variant="subtitle2" color="textSecondary">{post.created_at.substring(0, 10)} / {post.created_at.substring(11, 19)}</Typography>
                                            <Typography variant="body2" component="div" color="text.secondary" sx={{
                                                width: "100%",
                                                height: "80px",
                                                textOverflow: "ellipsis",
                                                overflow: "hidden",
                                                wordBreak: "break-all",
                                                display: "-webkit-box",
                                                WebkitLineClamp: 4,
                                                WebkitBoxOrient: "vertical",
                                            }}>
                                                {post.content}
                                            </Typography>
                                        </Box>
                                    </Card>
                                </Link>
                            </Grow>
                        );
                    })}
                </Stack>
            </BlogBox>
        </Container>
    );
}

export default Blog;