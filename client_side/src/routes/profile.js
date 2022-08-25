import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Layout, Row, Col, Typography, Divider } from 'antd';
import { useParams } from 'react-router-dom';

import { getPostsByUser, cleanUserPosts } from '../redux/postProvider';
import { getUser } from '../redux/userProvider';
import PostCard from '../components/postCard';
import UserCard from '../components/userCard';

const { Title } = Typography;

const Profile = () => {
    // Fetch data from redux store
    const { userPosts, loading} = useSelector((state) => ({ ...state.post }));
    const { account, _loading } = useSelector((state) => ({ ...state.user}));
    const { user } = useSelector((state) => ({ ...state.auth }));

    const dispatch = useDispatch();
    const { username } = useParams();

    // Dispatch redux actions when component is mounted or username is changed
    useEffect(() => {
        dispatch(getPostsByUser(username));
        dispatch(getUser(username));
    },[username]);

    useEffect(() => {
        return () => {
        dispatch(cleanUserPosts())
        }
    },[])

    const title_styles = {
        textAlign: 'center',
        marginTop:15,
        marginBottom: 15,
    }

    const userName = user?.result?._id === account?.user?._id ? 'Your ' : `${account?.user?.name}'s `;

    return (
        <Layout>
            <Row justify="center">
                <Divider>
                    {_loading ? (''):(userName)} Profile
                </Divider>
                {_loading?(
                    <Title level={5}>Loading profile...</Title>
                ):(
                account?.user &&
                    <Col xs={24} sm={18} md={15} lg={12} xl={10}>
                        <UserCard user={account?.user} hasEdit={true}/>
                    </Col>
                )}
            </Row>
            <Row justify="center" style={title_styles}>
                <Col xs={24} sm={18} md={15} lg={12} xl={10}>
                {loading?(
                    <Title level={5}>Loading posts...</Title>
                ):(
                userPosts?.length === 0 &&(
                    <Title level={5}>No posts found</Title>
                )
                )}
                { userPosts && userPosts.map(post => (
                    <Col key={post._id} >
                        <PostCard post={post}/>
                    </Col>
                ))}
                </Col>
            </Row>
        </Layout>
    )
}

export default Profile;
