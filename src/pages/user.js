import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Post from '../components/post/Post';
import StaticProfile from '../components/profile/StaticProfile';
import Profile from '../components/profile/Profile';
import Grid from '@material-ui/core/Grid';

import PostSkeleton from '../util/PostSkeleton';
import ProfileSkeleton from '../util/ProfileSkeleton';

import { connect } from 'react-redux';
import { getUserData } from '../redux/actions/dataActions';

class user extends Component {
  state = {
    profile: {
      posts: null
    },
    postIdParam: null
  };

  componentDidMount() {
    const handle = this.props.match.params.handle;
    const postId = this.props.match.params.postId;

    if (postId) this.setState({ postIdParam: postId });

    this.props.getUserData(handle);
  }

  render() {
    const { posts, loading, user } = this.props.data;
    const { postIdParam } = this.state;
    
    const postsMarkup = loading ? (
      <PostSkeleton />
    ) : (posts === null || posts.length == 0) ? (
      <p>No posts from this user</p>
    ) : !postIdParam ? (
      posts.map((post) => <Post key={post.postId} post={post} />)
    ) : (
      posts.map((post) => {
        if (post.postId !== postIdParam)
          return <Post key={post.postId} post={post} />;
        else 
          return <Post key={post.postId} post={post} openDialog />;
      })
    );

    return (
      <Grid container spacing={16}>
        <Grid item sm={8} xs={12}>
          {postsMarkup}
        </Grid>
        <Grid item sm={4} xs={12}>
          {this.state.profile === null ? (
            <ProfileSkeleton />
          ) : (
            <Profile user={user} />
          )}
        </Grid>
      </Grid>
    );
  }
}

user.propTypes = {
  getUserData: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  data: state.data
});

export default connect(
  mapStateToProps,
  { getUserData }
)(user);
