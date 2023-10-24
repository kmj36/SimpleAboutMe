import axios, { AxiosResponse } from 'axios';

interface Token {
    refresh: string;
    access: string;
}

interface UserDetail {
    userid: string,
    is_superuser: boolean,
    password: string,
    nickname: string,
    email: string,
    created_at: string,
    updated_at: string,
    last_login: string,
    is_active: boolean,
    is_admin: boolean,
    is_reported: boolean,
    is_banned: boolean,
    groups: string[],
    user_permissions: string[]
}

interface UserNormal {
    userid: string;
    nickname: string;
    email: string;
    created_at: string;
    updated_at: string;
    last_login?: string;
    is_active: boolean;
    is_admin: boolean;
}

interface APIResponse {
    code?: number | string;
    status?: string;
    detail?: string;
    message?: string;
    request_time?: string;
}

interface Tag {
    tagid: string;
    created_at: string;
    updated_at: string;
    userid: string;
}

interface Category {
    categoryid: string;
    categorydescription: string;
    created_at: string;
    updated_at: string;
    userid: string;
}

interface Post {
    postid: number;
    thumbnailurl: string;
    title: string;
    content: string;
    views: number;
    created_at: string;
    updated_at: string;
    published_at: string;
    is_published: boolean;
    secret_password: string;
    is_secret: boolean;
    userid: string;
    categoryid: string;
    tagid: string[];
}

interface Comment {
    commentid: number;
    content: string;
    created_at: string;
    updated_at: string;
    is_secret: boolean;
    postid: number;
    userid: string;
}

export interface Auth_APIResponse extends APIResponse {
    token?: string[];
}
export const isAuthAPIResponse = (obj : any): obj is Auth_APIResponse => "token" in obj;

export interface Register_APIResponse extends Omit<APIResponse, 'detail'> {
    detail?: string | {
        userid? : string[];
        password? : string[];
        nickname? : string[];
        email? : string[];
    };
    user?: UserNormal;
    token?: Token;
}
export const isRegisterAPIResponse = (obj : any): obj is Register_APIResponse => "detail" in obj && "user" in obj && "token" in obj;

export interface Login_APIResponse extends APIResponse {
    user?: UserNormal;
    token?: Token;
}
export const isLoginAPIResponse = (obj : any): obj is Login_APIResponse => "user" in obj && "token" in obj;

export interface Logout_APIResponse extends APIResponse {
    refresh?: string[];
}
export const isLogoutAPIResponse = (obj : any): obj is Logout_APIResponse => "refresh" in obj;

export interface Refresh_APIResponse extends APIResponse {
    refresh?: string[];
}
export const isRefreshAPIResponse = (obj : any): obj is Refresh_APIResponse => "refresh" in obj;

export interface Users_APIResponse extends APIResponse {
    users: UserDetail[];
}
export const isUsersAPIResponse = (obj : any): obj is Users_APIResponse => "users" in obj;

export interface User_APIResponse extends APIResponse {
    user: UserNormal;
}
export const isUserAPIResponse = (obj : any): obj is User_APIResponse => "user" in obj;

export interface Tags_APIResponse extends APIResponse {
    tags: Tag[];
}
export const isTagsAPIResponse = (obj : any): obj is Tags_APIResponse => "tags" in obj;

export interface Tag_APIResponse extends APIResponse {
    tag: Tag;
}
export const isTagAPIResponse = (obj : any): obj is Tag_APIResponse => "tag" in obj;

export interface Categories_APIResponse extends APIResponse {
    categories: Category[];
}
export const isCategoriesAPIResponse = (obj : any): obj is Categories_APIResponse => "categories" in obj;

export interface Category_APIResponse extends APIResponse {
    category: Category;
}
export const isCategoryAPIResponse = (obj : any): obj is Category_APIResponse => "category" in obj;

export interface Posts_APIResponse extends APIResponse {
    posts: Post[];
}
export const isPostsAPIResponse = (obj : any): obj is Posts_APIResponse => "posts" in obj;

export interface Post_APIResponse extends APIResponse {
    post: Post;
}
export const isPostAPIResponse = (obj : any): obj is Post_APIResponse => "post" in obj;

export interface Comments_APIResponse extends APIResponse {
    comments: Comment[];
}
export const isCommentsAPIResponse = (obj : any): obj is Comments_APIResponse => "comments" in obj;

export interface Comment_APIResponse extends APIResponse {
    comment: Comment;
}
export const isCommentAPIResponse = (obj : any): obj is Comment_APIResponse => "comment" in obj;

const baseURL_v1 = 'http://127.0.0.1:8000/api/v1';

export async function CallAPI({
    APIType,
    Method,
    Query,
    Body,
    Name,
}: {
    APIType: "Auth" | "Register" | "Login" | "Logout" | "Refresh" | "UserList" | "TagList" | "CategoryList" | "PostList" | "CommentList" | "UserDetail" | "TagDetail" | "CategoryDetail" | "PostDetail" | "CommentDetail";
    Method: "GET" | "POST" | "DELETE" | "PUT";
    Query?: string;
    Body?: object;
    Name?: string;
}): Promise<Auth_APIResponse | Register_APIResponse | Login_APIResponse | Logout_APIResponse | Refresh_APIResponse | Users_APIResponse | User_APIResponse | Tags_APIResponse | Tag_APIResponse | Categories_APIResponse | Category_APIResponse | Posts_APIResponse | Post_APIResponse | Comments_APIResponse | Comment_APIResponse>
{
    const apiEndpoints: Record<string, string> = {
        Auth: '/auth/',
        Register: '/auth/register/',
        Login: '/auth/login/',
        Logout: '/auth/logout/',
        Refresh: '/auth/refresh/',

        UserList: Query ? `/user/?${Query}` : '/user/',
        UserDetail: Name ? `/user/${Name}/` : '/user/',

        TagList: Query ? `/tag/?${Query}` : '/tag/',
        TagDetail: Name ? `/tag/${Name}/` : '/tag/',

        CategoryList: Query ? `/category/?${Query}` : '/category/',
        CategoryDetail: Name ? `/category/${Name}/` : '/category/',

        PostList: Query ? `/post/?${Query}` : '/post/',
        PostDetail: Name ? `/post/${Name}/` : '/post/',

        CommentList: Query ? `/comment/?${Query}` : '/comment/',
        CommentDetail: Name ? `/comment/${Name}/` : '/comment/',
      };

    try {
        const config = {
            method: Method, // Use the specified HTTP method
            url: `${baseURL_v1}${apiEndpoints[APIType]}`,
            data: Body ? Body : {}
        };
    
        const response: AxiosResponse = await axios(config);

        // Axios 반환 데이터 처리
        switch (APIType) {
            // API타입 추가시 아래에 추가
            case 'Auth':
                return response.data as Auth_APIResponse;
            case 'Register':
                return response.data as Register_APIResponse;
            case 'Login':
                return response.data as Login_APIResponse;
            case 'Logout':
                return response.data as Logout_APIResponse;
            case 'Refresh':
                return response.data as Refresh_APIResponse;
            case 'UserList':
                return response.data as Users_APIResponse;
            case 'UserDetail':
                return response.data as User_APIResponse;
            case 'TagList':
                return response.data as Tags_APIResponse;
            case 'TagDetail':
                return response.data as Tag_APIResponse;
            case 'CategoryList':
                return response.data as Categories_APIResponse;
            case 'CategoryDetail':
                return response.data as Category_APIResponse;
            case 'PostList':
                return response.data as Posts_APIResponse;
            case 'PostDetail':
                return response.data as Post_APIResponse;
            case 'CommentList':
                return response.data as Comments_APIResponse;
            case 'CommentDetail':
                return response.data as Comment_APIResponse;
            default:
                throw new Error(`Unsupported APIType: ${APIType}`);
        }
    } catch (error : any) {
        throw new Error(`API request failed: ${error.message}`);
    }
}