// Task component - represents a single todo item
TaskEntity = React.createClass({
  propTypes: {
    // This component gets the task to display through a React prop.
    // We can use propTypes to indicate it is required
  //  tas1: React.PropTypes.object.isRequired
  task1: React.PropTypes.object.isRequired,
    showPrivateButton: React.PropTypes.bool.isRequired
  },

  toggleChecked() {
   // Set the checked property to the opposite of its current value
  // TaskDB.update(this.props.value._id, {
  //   $set: {checked: ! this.props.value.checked}
  // });

   Meteor.call("setChecked", this.props.value._id, ! this.props.value.checked);
 },

 deleteThisTask() {
   //TaskDB.remove(this.props.value._id);

    Meteor.call("removeTask", this.props.value._id);
 },
 togglePrivate() {
    Meteor.call("setPrivate", this.props.value._id, ! this.props.value.private);
  },
 render() {


   // Give tasks a different className when they are checked off,
   // so that we can style them nicely in CSS
  // const taskClassName = this.props.value.checked ? "checked" : "";

   const taskClassName = (this.props.value.checked ? "checked" : "") + " " +
    (this.props.value.private ? "private" : "");

   return (
     <li className={taskClassName}>
       <button className="delete" onClick={this.deleteThisTask}>
         &times;
       </button>

       <input
         type="checkbox"
         readOnly={true}
         checked={this.props.value.checked}
         onClick={this.toggleChecked} />

         { this.props.showPrivateButton ? (
              <button className="toggle-private" onClick={this.togglePrivate}>
                { this.props.value.private ? "Private" : "Public" }
              </button>
            ) : ''}


         <span className="text">
            <strong>{this.props.value.username}</strong>: {this.props.value.text}
          </span>
     </li>
   );
  }
});
