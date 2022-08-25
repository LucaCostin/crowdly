import React, { useEffect, useState } from 'react';
import { Card, Avatar, Image, Divider, Layout, Row, Col, Comment, Input,
					Form, Button, List, Tooltip } from 'antd';
import { LikeOutlined, LikeFilled, DeleteOutlined} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import moment from 'moment';
import { toast } from 'react-toastify';

import { getPost, createComment } from '../redux/postProvider';
import EditPost from '../components/editPost';
import { deletePost, likePost, cleanPost } from '../redux/postProvider';

const { Meta } = Card;
const { TextArea } = Input;

const SinglePost = () => {
	const [comment, setComment] = useState();
	const [value, setValue] = useState('');

  	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { post } = useSelector((state) => ({ ...state.post}));
	const { user } = useSelector((state) => ({ ...state.auth }));
	const { id } = useParams();

	const { imageList, contains, name, datePosted, comments, loading, avatar, likes } = post;
	const postId = id;

/* A hook that is called when the component is mounted. It is used to fetch the post from the database. */
	useEffect(() => {
		dispatch(getPost(id));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	},[id]);

/* A hook that is called when the component is unmounted. It is used to clean the post from the redux
store. */
	useEffect(() => {
		return () => {
			dispatch(cleanPost())
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	},[]);

	useEffect(() => {
		comment && dispatch(createComment({ id, comment }));
		setComment();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [comment]);

	const handleDelete = (e) => {
		if(window.confirm('Are you sure you want to delete this post?')) {
			dispatch(deletePost({ postId, toast }));
			navigate('/');
		}
	};

	const handleLike = (e) => {
		user ? (
			dispatch(likePost({ postId }))
		) : (
			navigate('/login')
		)	
	}

	const loggedUser = user?.result?._id === post?.user;

	const handleChange = (e) => {
		setValue(e.target.value);
	};

	const handleSubmit = () => {
		if(!value) return;
		setValue('');
		setComment({
			name: user?.result?.name,
			contains: value,
		});
		
	};

	const LikeButton = () => {
		if(likes?.length > 0) {
			return likes.find(like => like.user === user?.result?._id) ? (
				<Button  onClick={handleLike} icon={<LikeFilled />}>
	 				{likes.length > 2 ? (
						 <Tooltip title={`You and ${likes.length-1} liked this post`}>
							 {likes.length} Likes
						 </Tooltip>
					 ):(
						`${likes.length} Like${likes.length > 1 ? 's' : ''}`
					 )}
	 			</Button>
			):(
				<Button onClick={handleLike} icon={<LikeOutlined />}>
					{likes.length} {likes.length === 1 ? 'Like' : 'Likes'}
				</Button>
			)
		}
		return(
			<Button onClick={handleLike} icon={<LikeOutlined />}>
				Like
			</Button>
		)
	};	

	const actions = loggedUser? ([
		<LikeButton />,
		<Tooltip title={'Delete post'}>
			<DeleteOutlined key='delete' onClick={handleDelete} />
		</Tooltip>,
		<EditPost post={post}/>
	]):([
		<LikeButton />,
	]);
	
	const CommentList = ({ comments }) => (
		<List
			dataSource={comments}
			header={`${comments.length} ${comments.length > 1 ? 'replies' : 'reply'}`}
			itemLayout="horizontal"
			renderItem={(props) => <Comment 
									author={props.name}
									avatar= {<Avatar src={props.avatar} alt="avatar" />}
									content={props.contains}
									datetime={moment(props.datePosted).fromNow()} />}
		/>
	);

	let _post;
	if(!post) _post = <p style={{alignContent: 'center'}}>Loading post..</p>

	else {
		_post = (
			<>
				<Divider>Single Post</Divider>
				<Layout >
				<Row justify="center">
					{imageList?.[0] && <Col flex={7} style={{height:'90vh'}}>
						<Image preview={false} src={imageList?.[0]?.thumbUrl} style={{ objectFit:'cover',height:'100%'}} />
					</Col>
					}	
					<Col flex={3}  xs={24} sm={18} md={15} lg={12} xl={12}>
						<Card
							actions={actions}
						>
							<Meta 
								avatar={<Avatar src={avatar} size="large"/>}
								title={name}
								description={moment(datePosted).fromNow()}
							/>
							<Divider />
							{contains}
						</Card>
						{comments?.length > 0 && <CommentList comments={comments} />}
						{user?.result?._id && <Comment
							avatar={<Avatar src={user?.result?.avatar[0]?.thumbUrl} alt="avatar" />}
							content={
								<>
									<Form.Item>
										<TextArea rows={4} onChange={handleChange} value={value} />
									</Form.Item>
									<Form.Item>
										<Button htmlType="submit" loading={loading} onClick={handleSubmit} type="primary">
											Add Comment
											</Button>
									</Form.Item>
								</>
							}
					/>}
					</Col>
				</Row>
				</Layout>
			</>
		)
	}
  return (
		_post
  )
}

export default SinglePost;
