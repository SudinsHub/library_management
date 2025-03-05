import React from 'react';
import './Books.css';

class Books extends React.Component {
    state = {
        header: (
            <thead id="header">
                <tr>
                    <th scope="col">Book Id</th>
                    <th scope="col">Title</th>
                    <th scope="col">Author</th>
                    <th scope="col">Publication Year</th>
                    <th scope="col">Available Copies</th>
                </tr>
            </thead>
        ),
        books: [],
        searchQuery: '',
    };

    async componentDidMount() {
        await this.fetchBooks(); // Fetch all books initially
    }

    fetchBooks = async (searchQuery = '') => {
        const queryParam = searchQuery ? `?search=${searchQuery}` : '';
        await fetch(`/api/getBooks${queryParam}`)
            .then((res) => res.json())
            .then((books) => {
                const bookRows = books.map((el) => (
                    <tr key={el.book_id}>
                        <td>{el.book_id}</td>
                        <td>{el.title}</td>
                        <td>{el.author}</td>
                        <td>{el.publication_year}</td>
                        <td>{el.available_copies}</td>
                    </tr>
                ));
                this.setState({ books: bookRows });
            })
            .catch((err) => console.error('Error fetching books:', err));
    };

    handleSearchChange = (event) => {
        const searchQuery = event.target.value;
        this.setState({ searchQuery });
        this.fetchBooks(searchQuery);
    };

    render() {
        return (
            <div id="books">
                <h2 id="heading">AVAILABLE BOOKS</h2>
                <div className="form-group">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by title..."
                        value={this.state.searchQuery}
                    />
                    <button className="btn btn-success" onClick={this.handleSearchChange}>
                        Search
                    </button>
                </div>
                <table id="results" className="table text-center table-hover">
                    {this.state.header}
                    <tbody>{this.state.books}</tbody>
                </table>
            </div>
        );
    }
}

export default Books;
