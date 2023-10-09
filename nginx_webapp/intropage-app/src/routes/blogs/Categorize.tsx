import { useState, useEffect } from 'react';
import axios from 'axios';
import { Paper, Grow, Box, Typography, Grid } from '@material-ui/core';
import { Stack } from '@mui/material';
import Divider from '@mui/material/Divider';
import styled from 'styled-components';

const CategoryBlock = styled.div`
    margin: 10px;
`;

const PostBlock = styled.div`
`;

function Categorize({setLoading} : {setLoading: any})
{
    interface Category {
        categoryid: number;
        userid: string;
        categoryname: string;
        categorydescription: string;
        created_at: string;
        updated_at: string;
    }

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
    }

    interface APIResponse_Categories extends APIResponse  {
        categories: Category[];
    }

    interface APIResponse_Posts extends APIResponse {
        posts: Post[];
    }

    const [category, setCategory] = useState({} as APIResponse_Categories);
    const [post, setPost] = useState({} as APIResponse_Posts);

    useEffect(() => {
        (async () => {
            setLoading(true);
            const response = await axios.get('http://127.0.0.1:8000/api/v1/category/');
            setCategory(response.data);
            setLoading(false);
        })();
        
    }, []);

    return (
        <CategoryBlock>
            
        </CategoryBlock>
    );
}

export default Categorize;