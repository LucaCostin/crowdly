import React from 'react';
import { Card, Avatar, Image, Divider, Button, Tooltip } from 'antd';
import { LikeOutlined, LikeFilled, DeleteOutlined, CommentOutlined} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { toast } from 'react-toastify';

import { deletePost, likePost } from '../redux/postProvider';
import EditPost from './editPost';

const { Meta } = Card;

const PostCard = ({post: {imageList, contains, name, _id, datePosted, username, user, likes, avatar}}) => {
	const { result } = useSelector((state) => ({ ...state.auth.user }))
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const postId = _id;

	const post = {_id: _id, contains: contains, imageList: imageList, user: user};
    /**
     * If the path is not the profile page, navigate to the profile page.
     */
	const handleNav = (e) => {
		const path = window.location.pathname;
		if(path === `/profile/${username}`) return
		navigate(`/profile/${username}`)
	};

	/**
	 * If the user confirms that they want to delete the post, then dispatch the deletePost action.
	 */
	const handleDelete = (e) => {
		if(window.confirm('Are you sure you want to delete this post?')) {
			dispatch(deletePost({ postId, toast }));
		}
	};

	const handleLike = (e) => {
		result ? (
			dispatch(likePost({ postId }))
		) : (
			navigate('/login')
		)
	}

	const loggedUser = result?._id === user;

    /**
     * If the user has liked the post, show a lfiled like icon, otherwise show an empty like icon.
     * @returns The LikeButton is being returned.
     */
	const LikeButton = () => {
		if(likes?.length > 0) {
			return likes.find(like => like.user === result?._id) ? (
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

	const handleCommClick = () => {
		navigate(`/posts/${_id}`)
	}

	const actions = loggedUser? ([
		<LikeButton />,
		<Tooltip title={'Reply to post'}>
				<CommentOutlined key='comment'  onClick= {handleCommClick}/>,
		</Tooltip>,
		<Tooltip title={'Delete post'}>
			<DeleteOutlined key='delete' onClick={handleDelete} />
		</Tooltip>,
		<EditPost post={post}/>
	]):([
		<LikeButton />,
		<Tooltip title={'Reply to post'}>
				<CommentOutlined key='comment'  onClick= {handleCommClick}/>,
		</Tooltip>,
	]);

	return (
		<Card
			style={{ marginTop:16}}
			cover={
				<Image alt={ imageList?.[0]?.name }  src={ imageList?.[0]?.thumbUrl } preview = {
					imageList?.[0]?.thumbUrl ? true : false
				}/>
			}
			actions={actions}
		>
			<Meta
				avatar={
				<Tooltip title={"Navigate to user's profile"}>
					<Avatar src={avatar} size='large' style={{cursor: 'pointer'}} onClick={handleNav}/>
				</Tooltip>
				}
				title={name}
				description={moment(datePosted).fromNow()}
			/>
			 <Divider />
				{contains}
		</Card>
	)
}

export default PostCard;
