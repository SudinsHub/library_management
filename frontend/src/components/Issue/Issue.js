import React from 'react';
import './Issue.css';

class Issue extends React.Component {
    state = {
        successMessage: '',
        errorMessage: '',
    };

    issueBook = () => {
        const memberId = parseInt(document.getElementById('member_id').value, 10);
        const bookId = parseInt(document.getElementById('book_id').value, 10);
        const returnDate = document.getElementById('return_date').value;

        // Validate the input
        if (isNaN(memberId) || isNaN(bookId) || !returnDate) {
            this.setState({
                errorMessage: 'All fields are required and must be valid!',
                successMessage: '',
            });
            return;
        }

        // API request to borrow a book
        fetch('/api/borrow', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                member_id: memberId,
                book_id: bookId,
                return_date: returnDate,
            }),
        })
            .then((res) => {
                if (res.ok) {
                    this.setState({ successMessage: 'Book issued successfully!', errorMessage: '' });
                } else {
                    this.setState({ errorMessage: 'Failed to issue book.', successMessage: '' });
                }
            })
            .catch((err) => {
                console.error('Error:', err);
                this.setState({ errorMessage: 'An error occurred. Please try again.', successMessage: '' });
            });
    };

    render() {
        return (
            <div id="issue" className="text-center">
                <h2>Issue Book</h2>
                <div className="form-group">
                    <input
                        className="form-control sel"
                        type="number"
                        placeholder="Enter Member ID"
                        id="member_id"
                        min="1"
                    />
                </div>
                <div className="form-group">
                    <input
                        className="form-control sel"
                        type="number"
                        placeholder="Enter Book ID"
                        id="book_id"
                        min="1"
                    />
                </div>
                <div className="form-group">
                    <input
                        className="form-control sel"
                        type="date"
                        placeholder="Enter Return Date"
                        id="return_date"
                    />
                </div>
                <button className="btn btn-success" onClick={this.issueBook}>
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

export default Issue;
