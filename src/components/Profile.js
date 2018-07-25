import React from "react";

class Profile extends React.Component {
  goToHome = e => {
    e.preventDefault();
    this.props.history.push(`/`);
  };
  render() {
    return (
      <div>
        <footer>
          <button onClick={this.goToHome}>Home</button>
          <button>Report an Incident</button>
          <button>My Profile</button>
        </footer>
      </div>
    );
  }
}

export default Profile;
