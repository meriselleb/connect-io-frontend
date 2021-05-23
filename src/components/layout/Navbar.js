import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import MyButton from '../../util/MyButton';
import PostPost from '../post/PostPost';
import Notifications from './Notifications';
// Material UI
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
// Icons
import HomeIcon from '@material-ui/icons/Home';
import withStyles from '@material-ui/core/styles/withStyles';
import { withRouter } from "react-router-dom";
import defaultProfileImage from '../../images/no-img.png'
import dayjs from 'dayjs';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import { search } from '../../redux/actions/dataActions.js'

const styles = (theme) => ({
  ...theme,
  profile: {
    ...theme.profile,
    display: 'inline-block',
    verticalAlign: 'middle',
  },
  image: {
    border: '0px solid blue',
    borderRadius: '50%',
    width: 64,
    height: 64,
    position: 'absolute',
    right: 48,
    top: -32,
    '&:hover': {
      border: '3px solid steelblue',
      top: -35,
      right: 45,
      cursor: 'pointer',
    }
  },
  imageSearch: {
    border: '0px solid blue',
    borderRadius: '50%',
    width: 48,
    height: 48,
  },
  searchResult: {
    '&:hover': {
      cursor: 'pointer',
    },
    
    margin: 6,
  }
});

const SearchResult = (data, i, styles, history) => {
  function onClick(e) {
    switch(data.type) {
      case 'user':
        history.push(`/users/${data.handle}`)
        break;
    }
  }

  switch(data.type) {
    case 'user':
      const {
        imageUrl,
        handle,
        createdAt,
      } = data;

      return (
        <div className={styles.searchResult} key={i} onClick={onClick}>
          <div className={styles.profile}>
            <div className="image-wrapper">
              <img src={(imageUrl === '' || !imageUrl) ? defaultProfileImage : imageUrl} alt="profile" className={styles.imageSearch} onClick={() => null} name={handle}/>
            </div>
          </div>
          <div style={{verticalAlign: 'middle', display: 'inline-block', marginLeft: 24}}>
            {handle}
          </div>
          <hr style={{opacity: 0.3}}/>
        </div>
      )
    case 'post':
      return (
        <div className={styles.searchResult} key={i}>

        </div>
      )
  }


}

class Navbar extends Component {
  constructor() {
    super()
    this.onClickProfileImage = this.onClickProfileImage.bind(this);
    this.onSearch = this.onSearch.bind(this);
    
    this.state = {
      searchText: '',
    }
    
    this.timer = setTimeout(() => null, 1);
    this.searchBar = null;
  }
  
  onClickProfileImage(e) {
    this.props.history.push(`/users/${e.target.name}`);
  }
  
  onSearch(e) {
    clearTimeout(this.timer);
    
    var val = e.target.value;

    if (e.target.value != this.state.searchText) {
      this.setState({
        searchText: e.target.value,
      })
      
      if (e.target.value != '') {
        this.timer = setTimeout(() => {
          this.props.search(val);
        }, 500)
      }
    }
  }

  render() {
    const { authenticated, searchResults } = this.props;
    const { imageUrl, handle } = this.props.user;
    const { searchText } = this.state;

    return (
      <Fragment>
        <AppBar>
          <Toolbar className="nav-container" style={{width: "100%", height: 72 }}>
            {authenticated ? (
              <Fragment>
                <form onSubmit={this.handleSubmit} style={{width: 'calc(100% - 300px)'}} ref={r => this.searchBar = r} autoComplete='off'>
                  <TextField
                    name="searchTerm"
                    type="text"
                    placeholder="Search..."
                    // value={this.state.searchText}
                    onChange={this.onSearch}
                    fullWidth
                  />
                </form>

                <div style={{textAlign: 'right', width: 'calc(200px)', marginRight: 120 }}>
                <PostPost />
                <Link to="/">
                  <MyButton tip="Home">
                    <HomeIcon />
                  </MyButton>
                </Link>
                <Notifications />
                </div>
                <div className={this.props.classes.profile}>
                  <div className="image-wrapper">
                    <img src={(imageUrl === '' || !imageUrl) ? defaultProfileImage : imageUrl} alt="profile" className={this.props.classes.image} onClick={this.onClickProfileImage} name={handle}/>
                  </div>
                </div>
              </Fragment>
            ) : (
              <Fragment>
                <Button color="inherit" component={Link} to="/login">
                  Login
                </Button>
                <Button color="inherit" component={Link} to="/">
                  Home
                </Button>
                <Button color="inherit" component={Link} to="/signup">
                  Sign up
                </Button>
              </Fragment>
            )}
          </Toolbar>
        </AppBar>
        
        <div style={{
          position: 'absolute',
          top: 64,
          left: 12,
          backgroundColor: 'white',
          width: 'calc(100% - 300px',
          border: '1px solid #ddd',
          zIndex: 100,
          padding: (searchText === '' || searchResults.length === 0) ? 0 : 6,
          paddingTop: (searchText === '' || searchResults.length === 0) ? 0 : 20,
        }}>
          {
            (searchText !== '' && searchResults.length > 0) 
              ? searchResults.map((r, i) => SearchResult(r, i, this.props.classes, this.props.history)).slice(0, 10)
              : null
          }
        </div>

        {/* <Menu
          anchorEl={this.searchBar}
          open={searchText !== '' && searchResults.length > 0}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          transformOrigin={{ vertical: "top", horizontal: "center" }}
          // onClose={this.handleClose}
          // onEntered={this.onMenuOpened}
        >
          {
            searchResults.map((r, i) => SearchResult(r, i, this.props.classes, this.props.history)).slice(0, 10)
          }
        </Menu> */}
      </Fragment>
    );
  }
}

Navbar.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  search: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  authenticated: state.user.authenticated,
  user: state.user,
  searchResults: state.data.searchResults,
});

export default connect(mapStateToProps, {search})(withStyles(styles)(withRouter(Navbar)));
