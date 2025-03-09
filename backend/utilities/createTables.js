const mysql = require('mysql2');
const cred = require('./credentials');

class TABLES {
    
    constructor(){
        
        this.db = mysql.createConnection({
            ...cred,
            database: 'library'
        });
// IF NOT EXISTS
        this.sql = {

            member: "CREATE TABLE IF NOT EXISTS MEMBER (member_id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(100) NOT NULL, email VARCHAR(100) UNIQUE NOT NULL, phone VARCHAR(20), membership_status ENUM('Active', 'Suspended', 'Expired') DEFAULT 'Active');",

            books: "CREATE TABLE IF NOT EXISTS BOOK (book_id INT PRIMARY KEY AUTO_INCREMENT, title VARCHAR(255) NOT NULL, author VARCHAR(255) NOT NULL, publication_year INT, available_copies INT DEFAULT 1, category VARCHAR(50));",

            borrow: "CREATE TABLE IF NOT EXISTS BORROW (member_id INT NOT NULL, book_id INT NOT NULL, borrow_date DATETIME DEFAULT CURRENT_TIMESTAMP, return_date DATE, status ENUM('Borrowed', 'Returned', 'Overdue') DEFAULT 'Borrowed', FOREIGN KEY (member_id) REFERENCES MEMBER(member_id), FOREIGN KEY (book_id) REFERENCES BOOK(book_id));",

            bill: "CREATE TABLE IF NOT EXISTS BILL (bill_id INT PRIMARY KEY AUTO_INCREMENT, member_id INT NOT NULL, issue_date DATETIME DEFAULT CURRENT_TIMESTAMP, amount DECIMAL(10,2) NOT NULL, bill_type ENUM('Fine', 'Membership', 'Reservation', 'Service', 'Other') NOT NULL, description VARCHAR(255), payment_status ENUM('Pending', 'Paid', 'Cancelled') DEFAULT 'Pending', FOREIGN KEY (member_id) REFERENCES MEMBER(member_id));"
            
        }; 
        
    }

    initTable() { 
        for(let i in this.sql){
            this.db.query(this.sql[i], (err, result) => {
                if(err)
                    console.log(`Couldn't create table ${i}`,err);
                else
                    console.log(`Successfully created table ${i}`);
            })
        }
    }
}

module.exports = TABLES;