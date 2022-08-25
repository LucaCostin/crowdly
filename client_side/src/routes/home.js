import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Layout, Row, Col, Typography, Divider } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';

import { getPosts, setCurrentPage } from '../redux/postProvider';
import PostComp from '../components/postComp';
import PostCard from '../components/postCard';

const { Title } = Typography;

const Home = () => {
    const [noMore, setNoMore] = useState(true);
    const { post, posts, loading, currPage, totalPosts } = useSelector((state) => ({ ...state.post }));
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getPosts(currPage));
    },[post, currPage])

/**
 * If the number of posts in the posts array is equal to the total number of posts, then set the noMore
 * variable to false. Otherwise, dispatch the setCurrentPage function with the current page plus one.
 */
  const fetchData = () => {
    if (posts.length === totalPosts) {
        setNoMore(false);
    } else dispatch(setCurrentPage(currPage + 1));
  }

  const title_styles = {
    textAlign: 'center',
    marginTop:15,
    marginBottom: 15,
  }

  return (
    <Layout>
      <Row justify="center">
        <Divider>
          Latest Posts
        </Divider>
        <Col xs={24} sm={18} md={15} lg={12} xl={10}>
          <PostComp />
        </Col>
      </Row>
      <Row justify="center" style={title_styles}>
        {loading?(
          <></>
        ):(
          posts?.length === 0 &&(
            <Title level={5}>No posts found</Title>
           )
        )}
        <Col xs={24} sm={18} md={15} lg={12} xl={10}>
        <InfiniteScroll
          dataLength={posts.length}
          next={fetchData}
          hasMore={noMore}
          loader={<h4>Loading...</h4>}
          endMessage={
            <p style={{ textAlign: 'center' }}>
              <b>You have seen it all!</b>
            </p>
          }
        >
          { posts && posts.map(post => (
            <Col key={post._id}  >
              <PostCard post={post}/>
            </Col>
          ))}
        </InfiniteScroll>
        </Col>
      </Row>
    </Layout>
  )
}

export default Home
