import React from 'react';
import './Member.css';

class Members extends React.Component {
    state = {
        header: (
            <thead id="header">
                <tr>
                    <th scope="col">Member ID</th>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Phone</th>
                    <th scope="col">Membership Status</th>
                </tr>
            </thead>
        ),
        members: [],
        searchQuery: '',
    };

    async componentDidMount() {
        await this.fetchMembers(); 
    }

    fetchMembers = async () => {
        const queryParam = this.state.searchQuery ? `?search=${this.state.searchQuery}` : '';
        await fetch(`/api/getMembers${queryParam}`)
            .then((res) => res.json())
            .then((members) => {
                const memberRows = members.map((el) => (
                    <tr key={el.member_id}>
                        <td>{el.member_id}</td>
                        <td>{el.name}</td>
                        <td>{el.email}</td>
                        <td>{el.phone}</td>
                        <td>{el.membership_status}</td>
                    </tr>
                ));
                this.setState({ members: memberRows });
            })
            .catch((err) => console.error('Error fetching members:', err));
    };
    

    handleSearchChange = (event) => {
        this.setState({ searchQuery: event.target.value });
    };
    

    render() {
        return (
            <div id="members">
                <h2 id="heading">MEMBERS LIST</h2>
                <div className="form-group">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by name..."
                        value={this.state.searchQuery}
                        onChange={this.handleSearchChange} // Just updates state
                    />

                    <button className="btn btn-success" onClick={this.fetchMembers}>
                        Search
                    </button>

                </div>
                <table id="results" className="table text-center table-hover">
                    {this.state.header}
                    <tbody>{this.state.members}</tbody>
                </table>
            </div>
        );
    }
}
export default Members