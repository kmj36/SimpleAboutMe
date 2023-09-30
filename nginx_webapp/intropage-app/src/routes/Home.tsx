import {useEffect, useState} from 'react';
import {Stack, Paper} from '@mui/material';
import axios from 'axios';

function Home()
{
    interface Post {
        postid: number,
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

    useEffect(() => {
        const result = axios.get('http://127.0.0.1:8000/api/v1/post/');
        result.then((response) => {
            setPostjson(response.data);
        }).catch((error) => {
            console.log(error);
        });
    }, []);

    return (
        <div id="Home">
            <Stack
            direction="column"
            justifyContent="flex-start"
            alignItems="stretch"
            spacing={0.5}
            >
                {postjson.posts?.map((post, index) => {
                    return(
                        <Paper key={index} elevation={2}>
                        <h2>{post.title}</h2>
                        <p>{post.userid}</p>
                        <p>{post.created_at}</p>
                        <p>{post.content}</p>
                        </Paper>
                    );
                })}
            </Stack>
        </div>
    );
}

export default Home;