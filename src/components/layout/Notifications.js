import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import PropTypes from 'prop-types';
// Material UI
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
// Icons
import NotificationsIcon from '@material-ui/icons/Notifications';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ChatIcon from '@material-ui/icons/Chat';
// Redux
import { connect } from 'react-redux';
import { markNotificationsRead, acceptFriendRequest, declineFriendRequest } from '../../redux/actions/userActions';
import defaultProfileImage from '../../images/no-img.png'
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';

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
    marginRight: 6,
  },
  searchResult: {
    '&:hover': {
      cursor: 'pointer',
    },
    
    margin: 6,
  }
});

class Notifications extends Component {
  constructor() {
    super();
    this.onAcceptFriendRequest = this.onAcceptFriendRequest.bind(this);
    this.onDeclineFriendRequest = this.onDeclineFriendRequest.bind(this);

  }
  state = {
    anchorEl: null
  };
  handleOpen = (event) => {
    this.setState({ anchorEl: event.target });
  };
  handleClose = () => {
    this.setState({ anchorEl: null });
  };
  onMenuOpened = () => {
    let unreadNotificationsIds = this.props.notifications
      .filter((not) => !not.read)
      .map((not) => not.notificationId);
    // this.props.markNotificationsRead(unreadNotificationsIds);
  };

  onAcceptFriendRequest(id) {
    this.props.acceptFriendRequest(id);
  }

  onDeclineFriendRequest(id) {
    this.props.declineFriendRequest(id);
  }

  render() {
    const notifications = this.props.notifications;
    const anchorEl = this.state.anchorEl;

    dayjs.extend(relativeTime);

    let notificationsIcon;
    if (notifications && notifications.length > 0) {
      notifications.filter((not) => not.read === false).length > 0
        ? (notificationsIcon = (
            <Badge
              badgeContent={
                notifications.filter((not) => not.read === false).length
              }
              color="secondary"
            >
              <NotificationsIcon />
            </Badge>
          ))
        : (notificationsIcon = <NotificationsIcon />);
    } else {
      notificationsIcon = <NotificationsIcon />;
    }
    
    const styles = this.props.classes;

    let notificationsMarkup =
      notifications && notifications.length > 0 ? (
        notifications.map((not) => {
          // const verb = not.type === 'like' ? 'liked' : 'commented on';
          // const time = dayjs(not.createdAt).fromNow();
          // const iconColor = not.read ? 'primary' : 'secondary';
          // const icon =
          //   not.type === 'like' ? (
          //     <FavoriteIcon color={iconColor} style={{ marginRight: 10 }} />
          //   ) : (
          //     <ChatIcon color={iconColor} style={{ marginRight: 10 }} />
          //   );

          // return (
          //   <MenuItem key={not.createdAt} onClick={this.handleClose}>
          //     {icon}
          //     <Typography
          //       component={Link}
          //       color="default"
          //       variant="body1"
          //       to={`/users/${not.recipient}/post/${not.postId}`}
          //     >
          //       {not.sender} {verb} Your Post {time}
          //     </Typography>
          //   </MenuItem>
          // );
          
          const {
            imageUrl,
            handle,
            id,
          } = not;

          return (
            <MenuItem key={not.id}>
              <div className={styles.profile}>
                <div className="image-wrapper">
                  <img src={(imageUrl === '' || !imageUrl) ? defaultProfileImage : imageUrl} alt="profile" className={styles.imageSearch} onClick={() => null} name={handle}/>
                </div>
              </div>

              <Typography
                component={Link}
                color="primary"
                variant="body1"
                to={`/users/${handle}`}
              >
                {handle} 
              </Typography>
              &nbsp;sent you a friend request.
              <Button color='primary' onClick={() => this.onAcceptFriendRequest(id)}>Accept</Button>
              <Button color='secondary' onClick={() => this.declineFriendRequest(id)}>Decline</Button>
            </MenuItem>
          )
        })
      ) : (
        <MenuItem onClick={this.handleClose}>
          You have no notifications yet
        </MenuItem>
      );
    return (
      <Fragment>
        <Tooltip placement="top" title="Notifications">
          <IconButton
            aria-owns={anchorEl ? 'simple-menu' : undefined}
            aria-haspopup="true"
            onClick={this.handleOpen}
          >
            {notificationsIcon}
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
          onEntered={this.onMenuOpened}
        >
          {notificationsMarkup}
        </Menu>
      </Fragment>
    );
  }
}

Notifications.propTypes = {
  markNotificationsRead: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  notifications: (state.user.toRequests) ? state.user.toRequests : [],
});

export default connect(
  mapStateToProps,
  { markNotificationsRead, acceptFriendRequest, declineFriendRequest }
)(withStyles(styles)(Notifications));
