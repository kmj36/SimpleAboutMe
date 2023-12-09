import styled from 'styled-components';
import { Fade } from '@material-ui/core';
import { useAppSelector } from '../redux/hooks';

const LoadingBox = styled.div`
    display: block;
    width: 100%;
    height: 100vh;
    position: fixed;
    top: 0;
    background-image: url("/loading.gif");
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100px 100px;
    background-color: #F1F2F3;
    z-index: 10000;
`;

function Loading(props: any) {
    const loading = useAppSelector((state) => state.loading.value)

    return (
        <div>
            <Fade in={loading} timeout={500}>
                <LoadingBox />
            </Fade>
            {props.children}
        </div>
    );
};

export default Loading;