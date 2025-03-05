import React from 'react';
import Nav from './components/Nav/Nav';
import Books from './components/Books/Books';
import Issue from './components/Issue/Issue';
import Return from './components/Return/Return';
import Search from './components/search/search';
import Member from './components/AddMember/Member'
import AddBook from './components/AddBook/AddBook'
import Bill from './components/BillProcess/Bill'
import './App.css';
import {Route, Redirect, Switch} from 'react-router-dom';

class App extends React.Component {

  render(){
    return (
      <div className="App">
        <Nav />
        <Switch>
          <Route path='/' exact strict component={Books}/>
          <Route path='/issue' exact strict component={Issue}/>
          <Route path='/add-member' exact strict component={Member}/>
          <Route path='/add-book' exact strict component={AddBook}/>
          <Route path='/return' exact strict component={Return}/>
          <Route path='/bill' exact strict component={Bill}/>
          <Redirect from='*' to='/'/>
        </Switch>
      </div>
    );
  }
}

export default App;
