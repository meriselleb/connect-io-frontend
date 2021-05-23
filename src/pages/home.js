import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';

import Post from '../components/post/Post';
import Profile from '../components/profile/Profile';
import PostSkeleton from '../util/PostSkeleton';
import withStyles from '@material-ui/core/styles/withStyles';

import { connect } from 'react-redux';
import { getPosts } from '../redux/actions/dataActions';

import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import { withRouter } from "react-router-dom";

const styles = {
  container: {
    maxWidth: '1920px',
  },
  formControl: {
    margin: 3,
    minWidth: 120,
  },
}

class home extends Component {
  constructor() {
    super();
    this.onSelectChange = this.onSelectChange.bind(this);
    this.state = {
      selectValue: 'new',
    }
  }

  componentDidMount() {
    this.props.getPosts();
  }
  
  onSelectChange(e) {
    this.setState({
      selectValue: e.target.value,
    })
    this.props.getPosts(e.target.value, 1);
  }

  render() {
    const { posts, loading } = this.props.data;
    const { selectValue } = this.state;

    let recentPostsMarkup = !loading ? (
      posts ? posts.map((post) => <Post key={post.postId} post={post} />) : []
    ) : (
      <PostSkeleton />
    );

    return (
      <Grid container spacing={16}>
        <Grid item sm={8} xs={8}>
          <FormControl variant="outlined" className={this.props.classes.formControl}>
            <Select
              value={selectValue}
              onChange={this.onSelectChange}
            >
              <MenuItem value='new'>New</MenuItem>
              <MenuItem value='hot'>Hot</MenuItem>
            </Select>
          </FormControl>
          {recentPostsMarkup}
        </Grid>
      </Grid>
    );
  }
}

home.propTypes = {
  getPosts: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
  return ({
    data: state.data,
  })
};

export default connect(
  mapStateToProps,
  { getPosts }
)(withStyles(styles)(withRouter(home)));
