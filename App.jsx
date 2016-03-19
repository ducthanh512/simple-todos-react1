// App component - represents the whole app
App = React.createClass({

  // This mixin makes the getMeteorData method work
  mixins: [ReactMeteorData],
  getInitialState() {
     return {
       hideCompleted: false,
       testso1 : 88
     }
   },
  // Loads items from the Tasks collection and puts them on this.data.tasks
  getMeteorData() {
    let query = {};

    if (this.state.hideCompleted) {
      // If hide completed is checked, filter tasks
      query = {checked: false};
    }
  //  alert('query: '+ query.length());
    return {

      taskMap: TaskDB.find(query, {sort: {createdAt: -1}}).fetch(),
      incompleteCount: TaskDB.find({checked: {$ne: true}}).count(),
      currentUser: Meteor.user(),
      testso2 : 99
    };
  },

  renderTask1s() {
    // Get tasks from this.data.tasks
    return this.data.taskMap.map((task) => {
    //  return <TaskEntity key={task._id} value={task} />;

    const currentUserId = this.data.currentUser && this.data.currentUser._id;
    const showPrivateButton = task.owner === currentUserId;

    return <TaskEntity
      key={task._id}
      value={task}
      showPrivateButton={showPrivateButton} />;

      });
    },

    handleSubmit(event) {
      event.preventDefault();

      // Find the text field via the React ref
      var text = React.findDOMNode(this.refs.textInput).value.trim();

  //    TaskDB.insert({
  //      text: text,
  //      createdAt: new Date(),            // current time
  //owner: Meteor.userId(),           // _id of logged in user
  //username: Meteor.user().username  // username of logged in user
    //  });

      Meteor.call("addTask", text);

      // Clear form
      React.findDOMNode(this.refs.textInput).value = "";
    },

    toggleHideCompleted() {
      this.setState({
        hideCompleted: ! this.state.hideCompleted
      });
    },
 testso3:77,
    render() {
      return (
        <div className="container">
              <header>
              <h1>Todo List ({this.data.incompleteCount}{this.data.testso2}{this.state.testso1})</h1>
                  <label className="hide-completed">
                             <input
                               type="checkbox"
                               readOnly={true}
                               checked={this.state.hideCompleted}
                               onClick={this.toggleHideCompleted} />
                             Hide Completed Tasks
                           </label>
                   <AccountsUIWrapper />
                     { this.data.currentUser ?
                <form className="new-task" onSubmit={this.handleSubmit} >
                  <input
                    type="text"
                    ref="textInput"
                    placeholder="Type to add new tasks" />
                </form> : ''
              }
            </header>

        <ul>
          {this.renderTask1s()}
        </ul>
      </div>
    );
  }
});
