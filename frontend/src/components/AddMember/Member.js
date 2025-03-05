import React from 'react';
import './Member.css';

class Member extends React.Component {
    state = {
        successMessage: '',
        errorMessage: ''
    };

    addMember = () => {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;

        // Validate the input
        if (!name || !email) {
            this.setState({ errorMessage: 'Name and Email are required!', successMessage: '' });
            return;
        }

        // API request to add member
        fetch('/api/addMember', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: name.trim(),
                email: email.trim(),
                phone: phone.trim(),
            }),
        })
            .then((res) => {
                if (res.ok) {
                    this.setState({ successMessage: 'Member added/updated successfully!', errorMessage: '' });
                } else {
                    this.setState({ errorMessage: 'Failed to add/update member.', successMessage: '' });
                }
            })
            .catch((err) => {
                console.error('Error:', err);
                this.setState({ errorMessage: 'An error occurred. Please try again.', successMessage: '' });
            });
    };

    render() {
        return (
            <div id="member" className="text-center">
                <h2>Add/Update Member</h2>
                <div className="form-group">
                    <input
                        className="form-control sel"
                        type="text"
                        placeholder="Enter Name"
                        id="name"
                    />
                </div>
                <div className="form-group">
                    <input
                        className="form-control sel"
                        type="email"
                        placeholder="Enter Email"
                        id="email"
                    />
                </div>
                <div className="form-group">
                    <input
                        className="form-control sel"
                        type="text"
                        placeholder="Enter Phone (Optional)"
                        id="phone"
                    />
                </div>
                <button className="btn btn-success" onClick={this.addMember}>
                    Submit
                </button>
                <br />
                <br />
                {this.state.successMessage && (
                    <div className="alert alert-success">{this.state.successMessage}</div>
                )}
                {this.state.errorMessage && (
                    <div className="alert alert-danger">{this.state.errorMessage}</div>
                )}
            </div>
        );
    }
}

export default Member;
