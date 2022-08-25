import React from 'react';
import { Card, Avatar, Divider, Typography, Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import EditAccDetails from './editAccDetails';

const { Text } = Typography;

const DetailWrapper = styled.div`
    display: flex;
    flex-direction: column;
`

const { Meta } = Card;

const UserCard = ({ user: { name, username, accountDetails, avatar }, hasEdit}) => {
    const navigate = useNavigate();

    const handleNav = (e) => {
		navigate(`/profile/${username}`)
	};

    const edit = (
        hasEdit? (
            <Divider>
                <EditAccDetails />
            </Divider>
        ):(
            <Divider />
        )
    );

    return (
        <Card style={{ marginTop:16}} >
            <Meta
                avatar={
                <Tooltip title={"Navigate to user's profile"}>
					<Avatar size="large" src={avatar[0]?.thumbUrl} style={{cursor: 'pointer'}} onClick={handleNav}/>
				</Tooltip>
                }
                title={name}
                description={accountDetails?.description ? accountDetails?.description : null}
            />
            {edit}
            <DetailWrapper>
                <Text>Age: {accountDetails?.age ? accountDetails?.age : 'N/A'}</Text>
                <Text>City: {accountDetails?.location ? accountDetails?.location : 'N/A'}</Text>
                <Text>Gender: {accountDetails?.gender ? accountDetails?.gender : 'N/A'}</Text>
            </DetailWrapper>
        </Card>
  )
};

export default UserCard;
