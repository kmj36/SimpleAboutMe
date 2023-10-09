import styled from 'styled-components';
import { Fade } from '@material-ui/core';

const LoadingBox = styled.div`
    display: block;
    width: 100%;
    height: 100%;
    position: fixed;
    background-image: url("/loading.gif");
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100px 100px;
    background-color: #F1F2F3;
    z-index: 1000;
`;

function Loading(props: any) {
    return (
        <div>
            <Fade in={props.isload} timeout={500}>
                <LoadingBox />
            </Fade>
            {props.children}
        </div>
    );
};

export default Loading;