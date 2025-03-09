import React from 'react';
import './Bill.css';

class Bill extends React.Component {
    state = {
        bills: [],
        memberId: '',
        errorMessage: '',
        successMessage: '',
        showModal: false,
        newBill: {
            member_id: '',
            amount: '',
            bill_type: 'Fine',
            description: '',
        },
    };

    fetchBills = () => {
        const memberId = document.getElementById('member_id').value;

        if (!memberId) {
            this.setState({ errorMessage: 'Member ID is required!', successMessage: '' });
            return;
        }

        fetch(`/api/getBills/${memberId}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.length > 0) {
                    this.setState({ bills: data, memberId, errorMessage: '', successMessage: 'Bills fetched successfully!' });
                } else {
                    this.setState({ errorMessage: 'No bills found for this member.', successMessage: '' });
                }
            })
            .catch((err) => {
                console.error('Error fetching bills:', err);
                this.setState({ errorMessage: 'An error occurred while fetching bills.', successMessage: '' });
            });
    };

    updateBillStatus = (billId, status) => {
        fetch(`/api/updateBillStatus`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bill_id: billId, status }),
        })
            .then((res) => {
                if (res.ok) {
                    this.setState((prevState) => ({
                        bills: prevState.bills.map((bill) =>
                            bill.bill_id === billId ? { ...bill, payment_status: status } : bill
                        ),
                        successMessage: `Bill status updated to "${status}" successfully!`,
                        errorMessage: '',
                    }));
                } else {
                    this.setState({ errorMessage: 'Failed to update bill status.', successMessage: '' });
                }
            })
            .catch((err) => {
                console.error('Error updating bill status:', err);
                this.setState({ errorMessage: 'An error occurred while updating bill status.', successMessage: '' });
            });
    };

    handleModalOpen = () => {
        this.setState({ showModal: true });
    };

    handleModalClose = () => {
        this.setState({ showModal: false, errorMessage: '', successMessage: '' });
    };

    handleInputChange = (e) => {
        const { name, value } = e.target;
        this.setState((prevState) => ({
            newBill: { ...prevState.newBill, [name]: value },
        }));
    };

    addNewBill = () => {
        const { newBill } = this.state;

        if (!newBill.member_id || !newBill.amount) {
            this.setState({ errorMessage: 'Member ID and amount are required!' });
            return;
        }

        fetch(`/api/addBill`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newBill),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.message) {
                    this.setState((prevState) => ({
                        bills: [
                            ...prevState.bills,
                            { bill_id: data.bill_id, ...newBill, payment_status: 'Pending' },
                        ],
                        successMessage: 'New bill added successfully!',
                        errorMessage: '',
                        showModal: false,
                        newBill: { member_id: '', amount: '', bill_type: 'Fine', description: '' },
                    }));
                }
            })
            .catch((err) => {
                console.error('Error adding bill:', err);
                this.setState({ errorMessage: 'An error occurred while adding the bill.', successMessage: '' });
            });
    };

    render() {
        return (
            <div id="bill" className="text-center">
                <h2>View Member Bills</h2>
                <div className="form-group">
                    <input
                        className="form-control sel"
                        type="number"
                        placeholder="Enter Member ID"
                        id="member_id"
                        min="1"
                    />
                </div>
                <button className="btn btn-success" onClick={this.fetchBills}>
                    Submit
                </button>
                <button className="btn btn-primary ml-2" onClick={this.handleModalOpen}>
                    New Bill
                </button>

                {this.state.errorMessage && <div className="alert alert-danger">{this.state.errorMessage}</div>}
                {this.state.successMessage && <div className="alert alert-success">{this.state.successMessage}</div>}

                {this.state.bills.length > 0 && (
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>Bill ID</th>
                                <th>Issue Date</th>
                                <th>Amount</th>
                                <th>Bill Type</th>
                                <th>Description</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.bills.map((bill) => (
                                <tr key={bill.bill_id}>
                                    <td>{bill.bill_id}</td>
                                    <td>{bill.issue_date}</td>
                                    <td>{bill.amount}</td>
                                    <td>{bill.bill_type}</td>
                                    <td>{bill.description || 'N/A'}</td>
                                    <td>{bill.payment_status}</td>
                                    <td>
                                        {bill.payment_status === 'Pending' && (
                                            <>
                                                <button className="btn btn-primary" onClick={() => this.updateBillStatus(bill.bill_id, 'Paid')}>
                                                    Paid
                                                </button>
                                                <button className="btn btn-danger" onClick={() => this.updateBillStatus(bill.bill_id, 'Cancelled')}>
                                                    Cancel
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {/* Modal for Adding New Bill */}
                {this.state.showModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h3>Add New Bill</h3>
                            <input
                                type="number"
                                name="member_id"
                                placeholder="Member ID"
                                className="form-control"
                                value={this.state.newBill.member_id}
                                onChange={this.handleInputChange}
                            />
                            <input
                                type="number"
                                name="amount"
                                placeholder="Amount"
                                className="form-control mt-2"
                                value={this.state.newBill.amount}
                                onChange={this.handleInputChange}
                            />
                            <select
                                name="bill_type"
                                className="form-control mt-2"
                                value={this.state.newBill.bill_type}
                                onChange={this.handleInputChange}
                            >
                                <option value="Fine">Fine</option>
                                <option value="Membership">Membership</option>
                                <option value="Reservation">Reservation</option>
                                <option value="Service">Service</option>
                                <option value="Other">Other</option>
                            </select>
                            <input
                                type="text"
                                name="description"
                                placeholder="Description"
                                className="form-control mt-2"
                                value={this.state.newBill.description}
                                onChange={this.handleInputChange}
                            />
                            <button className="btn btn-success mt-3" onClick={this.addNewBill}>
                                Submit
                            </button>
                            <button className="btn btn-secondary mt-3 ml-2" onClick={this.handleModalClose}>
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}



export default Bill;
