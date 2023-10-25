import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAppDispatch } from '../../redux/hooks';
import { loading, done } from '../../redux/feature/LoadingReducer';
import { CallAPI, Posts_APIResponse, isPostsAPIResponse } from "../../funcs/CallAPI";
function Search()
{
    const [searchjson, setSearchjson] = useState({} as Posts_APIResponse)
    const [searchParams] = useSearchParams();
    const searchvalue = searchParams.get('v');
    const dispatch = useAppDispatch();

    useEffect(() =>  {
        (async () => {
            dispatch(loading());
            if(typeof searchvalue == 'string')
            {
                const posts = await CallAPI({APIType:"PostList", Method:"GET", Query:`title=${encodeURIComponent(searchvalue)}`});
                if(isPostsAPIResponse(posts))
                    setSearchjson(posts);
            }
            dispatch(done());
        })();
    }, [])
    
    return (
        <div id="Search">
            {searchjson?.posts?.length.toString()}
        </div>
    );
}

export default Search;