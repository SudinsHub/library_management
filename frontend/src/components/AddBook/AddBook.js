import React from 'react';
import './AddBook.css';

class Book extends React.Component {
    state = {
        successMessage: '',
        errorMessage: '',
    };

    addBook = () => {
        const title = document.getElementById('title').value;
        const author = document.getElementById('author').value;
        const copies = parseInt(document.getElementById('copies').value, 10);
        const publicationYear = parseInt(document.getElementById('publication_year').value, 10);
        const category = document.getElementById('category').value;

        // Validate the input
        if (!title || isNaN(copies) || isNaN(publicationYear) || !category) {
            this.setState({
                errorMessage: 'All fields are required and must be valid!',
                successMessage: '',
            });
            return;
        }

        // API request to add/update book
        fetch('/api/addBook', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: title.trim(),
                author: author.trim(),
                copies,
                publication_year: publicationYear,
                category: category.trim(),
            }),
        })
            .then((res) => {
                if (res.ok) {
                    this.setState({ successMessage: 'Book added/updated successfully!', errorMessage: '' });
                } else {
                    this.setState({ errorMessage: 'Failed to add/update book.', successMessage: '' });
                }
            })
            .catch((err) => {
                console.error('Error:', err);
                this.setState({ errorMessage: 'An error occurred. Please try again.', successMessage: '' });
            });
    };

    render() {
        return (
            <div id="book" className="text-center">
                <h2>Add/Update Book</h2>
                <div className="form-group">
                    <input
                        className="form-control sel"
                        type="text"
                        placeholder="Enter Book Title"
                        id="title"
                    />
                </div>
                <div className="form-group">
                    <input
                        className="form-control sel"
                        type="text"
                        placeholder="Enter Book Author"
                        id="author"
                    />
                </div>
                <div className="form-group">
                    <input
                        className="form-control sel"
                        type="number"
                        placeholder="Enter Number of Copies"
                        id="copies"
                        min="1"
                    />
                </div>
                <div className="form-group">
                    <input
                        className="form-control sel"
                        type="number"
                        placeholder="Enter Publication Year"
                        id="publication_year"
                        min="2000"
                        max={new Date().getFullYear()}
                    />
                </div>
                <div className="form-group">
                    <input
                        className="form-control sel"
                        type="text"
                        placeholder="Enter Category"
                        id="category"
                    />
                </div>
                <button className="btn btn-success" onClick={this.addBook}>
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

export default Book;
