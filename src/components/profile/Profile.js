import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import EditDetails from './EditDetails';
import MyButton from '../../util/MyButton';
import ProfileSkeleton from '../../util/ProfileSkeleton';
// Material UI
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import MuiLink from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
// Icons
import LocationOn from '@material-ui/icons/LocationOn';
import LinkIcon from '@material-ui/icons/Link';
import CalendarToday from '@material-ui/icons/CalendarToday';
import EditIcon from '@material-ui/icons/Edit';
import KeyboardReturn from '@material-ui/icons/KeyboardReturn';
// Redux
import { connect } from 'react-redux';
import { logoutUser, uploadImage, sendFriendRequest } from '../../redux/actions/userActions';
import defaultProfileImage from '../../images/no-img.png'

const styles = (theme) => ({
  ...theme
});

class Profile extends Component {
  constructor() {
    super();
    this.onSendRequest = this.onSendRequest.bind(this);
  }

  componentDidMount() {
  }
  
  onSendRequest(e) {
    this.props.sendFriendRequest(this.props.user.id);
  }

  handleImageChange = (event) => {
    const image = event.target.files[0];
    const formData = new FormData();
    formData.append('image', image, image.name);
    this.props.uploadImage(formData);
  };
  handleEditPicture = () => {
    const fileInput = document.getElementById('imageInput');
    fileInput.click();
  };
  handleLogout = () => {
    this.props.logoutUser();
  };
  render() {
    try {
      const loggedInHandle = this.props.userLoggedIn.handle;
      console.log(this.props.userLoggedIn);

      const {
        classes,
        user: {
          id,
          credentials: { handle, createdAt, imageUrl, bio, website, location },
          loading,
          authenticated
        }
      } = this.props;

      var isFriend = false;
      var isSent = false;
      
      for (var i = 0; i < this.props.userLoggedIn.connections.length; ++i) {
        if (id === this.props.userLoggedIn.connections[i].toUserId) {
          isFriend = true;
        }
      }
      
      for (var i = 0; i < this.props.userLoggedIn.fromRequests.length; ++i) {
        if (id === this.props.userLoggedIn.fromRequests[i].toUserId) {
          isSent = true;
        }
      }
      console.log(this.props.user);

      let profileMarkup = !loading ? (
        (this.props.user) ? (
          <Paper className={classes.paper}>
            <div className={classes.profile}>
              <div className="image-wrapper">
                <img src={(imageUrl === '' || !imageUrl) ? defaultProfileImage : imageUrl} alt="profile" className="profile-image" />
                
                {
                  (handle === loggedInHandle)
                    ? (
                        <Fragment>
                          <input
                            type="file"
                            id="imageInput"
                            hidden="hidden"
                            onChange={this.handleImageChange}
                          />
                          <MyButton
                            tip="Edit profile picture"
                            onClick={this.handleEditPicture}
                            btnClassName="button"
                          >
                            <EditIcon color="primary" />
                          </MyButton>
                        </Fragment>
                      )
                    : null
                }
              </div>
              <hr />
              <div className="profile-details">
                <MuiLink
                  component={Link}
                  to={`/users/${handle}`}
                  color="primary"
                  variant="h5"
                >
                  @{handle}
                </MuiLink>
                <hr />
                <div dangerouslySetInnerHTML={{ __html: "<Typography variant=\"body2\">" + bio + "</Typography>" }} />
                <hr />
                {location && (
                  <Fragment>
                    <LocationOn color="primary" /> <span>{location}</span>
                    <hr />
                  </Fragment>
                )}
                {website && (
                  <Fragment>
                    <LinkIcon color="primary" />
                    <a href={website} target="_blank" rel="noopener noreferrer">
                      {' '}
                      {website}
                    </a>
                    <hr />
                  </Fragment>
                )}
                <CalendarToday color="primary" />{' '}
                <span>Joined {dayjs(createdAt).format('MMM YYYY')}</span>
              </div>

              {
                (handle === loggedInHandle)
                  ? (
                      <Fragment>
                        <MyButton tip="Logout" onClick={this.handleLogout}>
                          <KeyboardReturn color="primary" />
                        </MyButton>
                      </Fragment>
                    )
                  : null
              }

              {
                (handle === loggedInHandle)
                  ? <EditDetails />
                  : null
              }
              
              <div style={{textAlign: 'center', marginTop: 24 }}>
              {
                (handle === loggedInHandle)
                  ? null
                  : (isFriend)
                      ?  <Button variant="contained" disabled> Connected </Button>
                      : (this.props.userLoggedIn.reputation > 0)
                          ?  (isSent)
                              ?  <Button variant="contained" disabled> Friend Request Sent </Button>
                              : <Button variant="contained" color="primary" onClick={this.onSendRequest}> Send Friend Request </Button>
                          :  <Button variant="contained" disabled> Friend Request Unavailable </Button>
              }
              </div>
            </div>
          </Paper>
        ) : (
          <Paper className={classes.paper}>
            <Typography variant="body2" align="center">
              No profile found, please login again
            </Typography>
            <div className={classes.buttons}>
              <Button
                variant="contained"
                color="primary"
                component={Link}
                to="/login"
              >
                Login
              </Button>
              <Button
                variant="contained"
                color="secondary"
                component={Link}
                to="/signup"
              >
                Signup
              </Button>
            </div>
          </Paper>
        )
      ) : (
        <ProfileSkeleton />
      );

      return profileMarkup;
    }
    catch(err) { 
      return <div></div>
    }
  }
}

const mapStateToProps = (state) => ({
  userLoggedIn: state.user,
});

const mapActionsToProps = { logoutUser, uploadImage, sendFriendRequest };

Profile.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  uploadImage: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(Profile));
