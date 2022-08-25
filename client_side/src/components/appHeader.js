import { React, useState } from 'react';
import { useNavigate} from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Layout, Menu, Input, Col, Avatar} from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import decode from 'jwt-decode';

import { logOut } from '../redux/authProvider';
import { searchUser } from '../redux/userProvider';
import { OnLinkHover } from './common';


const { Header } = Layout;
const { Search } = Input;

const Brand = styled.a`
	float: left;
	cursor: pointer;
	${OnLinkHover}
`
const Log = styled.a`
	float: right;
	cursor: pointer;
	${OnLinkHover}
`

const AppHeader = () => {
	/* Get current path */
	const pathname = window.location.pathname;

	/* The `path` variable is used to set the `selectedKeys` of the `Menu` component. The `pathname`
	variable is the current path. The `path` variable is set to the current path if the path is `/` or
	the path without the first character if the path is not `/`. */
	const path = pathname === '/'? '/' : pathname.substr(1);

	const [item, setItem] = useState(path);
	const [search, setSearch] = useState('');

	/* Get the user from Redux store */
	const { user } = useSelector((state) => ({ ...state.auth }));

	const navigate = useNavigate();
	const dispatch = useDispatch();

	/* Checking if the token is expired. If it is, it logs the user out. */
	const token = user?.token;
	if(token){
		const decodedToken = decode(token);
		if(decodedToken.exp * 1000 < new Date().getTime()){
			dispatch(logOut());
		};
	};

    /**
     * `onClick` is a function that takes an item as an argument and sets the item to the key of the item.
     * The function then replaces the `/` in the key with an empty string and navigates to the path.
     * The path is used to navigate to the item.
     */
	const onClick = (item) => {
		setItem(item.key);
		const path = item.key.replace('/', '');
		navigate(`/${path}`);
	};

	const onSearch = (e) => {
		if(search) {
			setItem('')
			dispatch(searchUser(search));
			navigate(`/search?searchQuery=${search}`);
			setSearch('');
		}else {
			navigate('/');
		};
	};

	const loggedItems = [
		{
			key: '/',
			label: 'Home',
			icon: <HomeOutlined/>
		},
		{
			key: `/profile/${user?.result?.username}`,
			label: user?.result?.name,
			icon: <Avatar src={user?.result?.avatar[0]?.thumbUrl}/>
		},
	];

	const notLoggedItems = [
		{
			key: '/',
			label: 'Home',
			icon: <HomeOutlined/>
		},
	];

	const headerStart = {
		display: 'flex',
		gap: '15px'
	}

    return (
			user?.result?._id? (
			<Header style={{ position: 'sticky', zIndex: 1, width: '100%', background: '#fff', display:'flex', gap:'15px', flexDirection: 'row'}}>
				<Col xs={15} sm={7} md={7} lg={7} xl={7} style={headerStart}>
					<Brand onClick={() => {
						setItem('/');
						navigate('/')
					}}>
						Crowdly
					</Brand>
					<Search placeholder="search for users" onSearch={onSearch} value={search} onChange={e => setSearch(e.target.value)}
					onPressEnter={onSearch} style={{width:'auto', marginTop:'auto', marginBottom:'auto'}}/>
				</Col>
				<Col xs={5} sm={10} md={10} lg={10} xl={10}>
					<Menu
						onClick={onClick}
						items={loggedItems}
						mode='horizontal'
						selectedKeys={[item]}
						theme="light"
						style={{ lineHeight: '64px', width: '100%', justifyContent: 'center'}}
					/>
				</Col>
				<Col xs={4} sm={7} md={7} lg={7} xl={7}>
					<Log onClick={() => {
						dispatch(logOut());
						navigate('/');
						setItem('/');
					}}>
						Logout
					</Log>
				</Col>
			</ Header>):(
			<Header style={{ position: 'sticky', zIndex: 1, width: '100%', background: '#fff', display:'flex', gap:'15px', flexDirection: 'row'}}>
				<Col xs={15} sm={7} md={7} lg={7} xl={6} style={headerStart}>
					<Brand onClick={() => {
						setItem('/');
						navigate('/')
					}}>
						Crowdly
					</Brand>
					<Search placeholder="search for users" onSearch={onSearch} value={search} onChange={ e => setSearch(e.target.value)}
					onPressEnter={onSearch} style={{width:200, marginTop:'auto', marginBottom:'auto'}}/>
				</Col>
				<Col xs={5} sm={10} md={10} lg={10} xl={11}>
					<Menu
						onClick={onClick}
						items={notLoggedItems}
						mode='horizontal'
						selectedKeys={[item]}
						theme="light"
						style={{ lineHeight: '64px', width: '100%', justifyContent: 'center', paddingLeft:'30px'}}
					/>
				</Col>
				<Col xs={4} sm={7} md={7} lg={7} xl={7}>
					<Log onClick={() => {
						navigate('/login');
						setItem('');
						}}>
						Login
					</Log>
				</Col>
			</ Header>)
	)
};

export default AppHeader;
