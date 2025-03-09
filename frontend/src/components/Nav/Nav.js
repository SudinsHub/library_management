import React from 'react';
import './Nav.css';
import { Link } from 'react-router-dom';

class Nav extends React.Component {
    
    constructor(props) {
        super(props);
        this.update = this.update.bind(this);
    }

    state = {};

    update() {
        this.setState(this.state);
    }

    render(){
        return (
            <div id='nav'>
                <span>LIBRARY MANAGEMENT SYSTEM</span>
                <ul>
                    <li style={window.location.pathname === '/' ? {display: 'none'} : {display: 'inline-block'}}><Link to='/' onClick={this.update}>Home</Link></li>
                    <li style={window.location.pathname === '/add-member' ? {display: 'none'} : {display: 'inline-block'}}><Link to='/add-member' onClick={this.update}>Add Member</Link></li>
                    <li style={window.location.pathname === '/get-member' ? {display: 'none'} : {display: 'inline-block'}}><Link to='/get-member' onClick={this.update}>View Members</Link></li>
                    <li style={window.location.pathname === '/add-book' ? {display: 'none'} : {display: 'inline-block'}}><Link to='/add-book' onClick={this.update}>Add Book</Link></li>
                    <li style={window.location.pathname === '/issue' ? {display: 'none'} : {display: 'inline-block'}}><Link to='/issue' onClick={this.update}>Issue Book</Link></li>
                    <li style={window.location.pathname === '/return' ? {display: 'none'} : {display: 'inline-block'}}><Link to='/return' onClick={this.update}>Return Book</Link></li>
                    <li style={window.location.pathname === '/bill' ? {display: 'none'} : {display: 'inline-block'}}><Link to='/bill' onClick={this.update}>Bill Process</Link></li>
                </ul>
            </div>
        );
    }
}

export default Nav;