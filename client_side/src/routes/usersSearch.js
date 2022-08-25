import React, { useEffect } from 'react';
import { useSelector, useDispatch} from 'react-redux';
import { Row, Col, Typography, Divider } from 'antd';

import UserCard from '../components/userCard';
import { cleanUsersFound } from '../redux/userProvider';

const { Title } = Typography;

const UsersSearch = () => {
    const { users, loading } = useSelector((state) => ({ ...state.user }));
    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
            dispatch(cleanUsersFound());
        }
    },[]);

    const title_styles = {
        textAlign: 'center',
        marginTop:15,
        marginBottom: 15,
    }

    return (
        <>
            <Divider>Users Found</Divider>
            <Row style={title_styles} justify="center">
                {loading?(
                    <Title level={5}>Loading users...</Title>
                        ):(
                    users?.length === 0 &&(
                     <Title level={5}>No users found</Title>
                    )
                 )}
            </Row>
            <Row justify="center">
                <Col xs={24} sm={18} md={15} lg={12} xl={10}>
                    {users && users.map(user => (
                    <Col key={user._id}>
                        <UserCard user={user} hasEdit={false}/>
                    </Col>
                    ))}
                </Col>
            </Row>
        </>
    )
};

export default UsersSearch;
