import React from 'react';
import './Bill.css';

class Bill extends React.Component {
    state = {
        bills: [],
        memberId: '',
        errorMessage: '',
        successMessage: '',
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
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bill_id: billId, status }),
        })
            .then((res) => {
                if (res.ok) {
                    this.setState((prevState) => ({
                        bills: prevState.bills.map((bill) =>
                            bill.bill_id === billId ? { ...bill, payment_status: status } : bill
                        ),
                        errorMessage: '',
                        successMessage: `Bill status updated to "${status}" successfully!`,
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
                <br />
                <br />
                {this.state.errorMessage && (
                    <div className="alert alert-danger">{this.state.errorMessage}</div>
                )}
                {this.state.successMessage && (
                    <div className="alert alert-success">{this.state.successMessage}</div>
                )}
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
                                    <td>{bill.amount.toFixed(2)}</td>
                                    <td>{bill.bill_type}</td>
                                    <td>{bill.description || 'N/A'}</td>
                                    <td>{bill.payment_status}</td>
                                    <td>
                                        {bill.payment_status === 'Pending' && (
                                            <>
                                                <button
                                                    className="btn btn-primary"
                                                    onClick={() => this.updateBillStatus(bill.bill_id, 'Paid')}
                                                >
                                                    Mark as Paid
                                                </button>
                                                <button
                                                    className="btn btn-danger"
                                                    onClick={() => this.updateBillStatus(bill.bill_id, 'Cancelled')}
                                                >
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
            </div>
        );
    }
}

export default Bill;
