const express = require('express');
const mysql = require('mysql2');
const DATABASE = require('./utilities/createDB');
const TABLES = require('./utilities/createTables');
const cred = require('./utilities/credentials');

class LIBRARY {

    constructor(port, app) {

        this.port = port;
        this.app = app;
        this.app.use(express.json())
        this.temp = 0;

        //Initialize Database
        new DATABASE().initDB();

        //Initialize All The Tables
        new TABLES().initTable();
        
        this.db = mysql.createConnection({
            ...cred,
            database: 'library'
        });

    }

    get() {
        this.app.get('/api/getBills/:memberId', (req, res) => {
            const memberId = req.params.memberId;
            const sql = `SELECT * FROM BILL WHERE member_id = ?`;
        
            this.db.query(sql, [memberId], (err, result) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('Error fetching bills');
                } else {
                    res.send(result);
                }
            });
        });
        
        //GET LIST OF ALL THE BOOKS
        //done
        this.app.get('/api/getBooks', (req, res) => {
            const searchQuery = req.query.search || ''; // Get the search query from the request
            let sql = `SELECT * FROM book`;
        
            // If a search query is provided, add a WHERE clause
            if (searchQuery) {
                sql += ` WHERE title LIKE ?`;
            }
        
            const params = searchQuery ? [`%${searchQuery}%`] : [];
        
            this.db.query(sql, params, (err, result) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('Error fetching books');
                } else {
                    res.send(result);
                }
            });
        });
        ;

        // nosto
        //GET LIST OF BOOKS BY SEMESTER
        this.app.get('/api/getBooks/:id', (req, res) => {
            let sql = `SELECT * FROM book where semester = '${req.params.id}'`;
            this.db.query(sql, (err, result) => {
                if(err)
                    console.log(err);
                else
                    console.log("Successfully extracted books");
                res.send(result);
            });
        });

        //GET ALL THE ISSUED BOOKS BY A MEMBER
        //done
        this.app.get('/api/getIssues/:member_id', (req, res) => {
            
            let sql = `SELECT book.title as title, book.author as author, borrow.return_date as return_date, borrow.borrow_date as borrow_date, member.name as sname, member.member_id as member_id, book.book_id as book_id\
                       FROM book, member, borrow\
                       where borrow.member_id = '${req.params.member_id}' and book.book_id = borrow.book_id and member.member_id = '${req.params.member_id}'`;

            this.db.query(sql, (err, result) => {
                if(err)
                    console.log(err);
                else
                    console.log("Successfully extracted issues");
                res.send(result);
            });
        });

        //GET ALL THE STUDENTS WHO HAVE ISSUED A PARTICULAR BOOK
        this.app.get('/api/students/:id', (req, res) => {
            
            let sql = `SELECT student.name, borrow.date, borrow.deadline\
                       FROM student, borrow\
                       where borrow.idBook = '${req.params.id}' and student.id = borrow.idStudent`;

            this.db.query(sql, (err, result) => {
                if(err)
                    console.log("Couldn't get issues");
                else
                    console.log("Successfully extracted issues");
                res.send(result);
            });
        });
    }

    post(){
        this.app.post('/api/updateBillStatus', (req, res) => {
            const { bill_id, status } = req.body;
            const sql = `UPDATE BILL SET payment_status = ? WHERE bill_id = ?`;
        
            this.db.query(sql, [status, bill_id], (err, result) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('Error updating bill status');
                } else if (result.affectedRows === 0) {
                    res.status(404).send('Bill not found');
                } else {
                    res.send('Bill status updated successfully');
                }
            });
        });
        

        //done
        this.app.post('/api/addBook', (req, res) => {
            const { title, author, copies, publication_year, category } = req.body;
        
            // Step 1: Check if the book already exists
            let checkBookSql = `SELECT * FROM BOOK WHERE title = ?`;
            this.db.query(checkBookSql, [title], (err, result) => {
                if (err) {
                    console.error("Error while checking for the book:", err);
                    return res.status(500).send("Database error.");
                }
        
                if (result.length > 0) {
                    // Book exists: Update available copies
                    let updateCopiesSql = `UPDATE BOOK SET available_copies = available_copies + ? WHERE book_id = ?`;
                    this.db.query(updateCopiesSql, [copies, result[0].book_id], (err, updateResult) => {
                        if (err) {
                            console.error("Error while updating available copies:", err);
                            return res.status(500).send("Failed to update available copies.");
                        }
                        console.log("Successfully updated available copies.");
                        res.send("Book copies updated successfully.");
                    });
                } else {
                    // Book does not exist: Insert a new book
                    let insertBookSql = `INSERT INTO BOOK (title, author, publication_year, available_copies, category) VALUES (?, ?, ?, ?, ?)`;
                    this.db.query(insertBookSql, [title, author, publication_year, copies,category], (err, insertResult) => {
                        if (err) {
                            console.error("Error while inserting a new book:", err);
                            return res.status(500).send("Failed to insert new book.");
                        }
                        console.log("Successfully inserted a new book.");
                        res.send("New book added successfully.");
                    });
                }
            });
        });

        //done
        this.app.post('/api/addMember', (req, res) => {
            const { name, email, phone } = req.body;
        
            // Step 1: Check if the member already exists by email
            let checkMemberSql = `SELECT * FROM MEMBER WHERE email = ?`;
            this.db.query(checkMemberSql, [email], (err, result) => {
                if (err) {
                    console.error("Error while checking for the member:", err);
                    return res.status(500).send("Database error.");
                }
        
                if (result.length > 0) {
                    // Member exists: Update their details
                    let updateMemberSql = `UPDATE MEMBER SET name = ?, phone = ?, membership_status = 'Active' WHERE email = ?`;
                    this.db.query(updateMemberSql, [name, phone, email], (err, updateResult) => {
                        if (err) {
                            console.error("Error while updating member details:", err);
                            return res.status(500).send("Failed to update member details.");
                        }
                        console.log("Successfully updated member details.");
                        res.send("Member details updated successfully.");
                    });
                } else {
                    // Member does not exist: Insert a new member
                    let insertMemberSql = `INSERT INTO MEMBER (name, email, phone) VALUES (?, ?, ?)`;
                    this.db.query(insertMemberSql, [name, email, phone], (err, insertResult) => {
                        if (err) {
                            console.error("Error while inserting a new member:", err);
                            return res.status(500).send("Failed to add new member.");
                        }
                        console.log("Successfully added a new member.");
                        res.send("New member added successfully.");
                    });
                }
            });
        });

        //BORROW A BOOK
        //done
        this.app.post('/api/borrow', (req, res) => {
            let sql = [`INSERT INTO BORROW(member_id, book_id, return_date) VALUES (${req.body.member_id}, ${req.body.book_id}, ${req.body.return_date});`,
                       `Update BOOK SET count = count - 1 WHERE id = ${req.body.book_id}`];

                for(let i = 0; i < sql.length; i++){
                    this.db.query(sql[i], (err, result) => {
                        if(err){
                            console.log("Couldn't add", err);
                            this.temp = 1;
                        }
                        else
                            console.log("Successfully inserted");
                    });
                    if(this.temp)
                        break;
                }
        });

        //RETURN A BOOK, UPDATE FINE IF ANY
        //done
        this.app.post('/api/return', (req, res) => {
            const {book_id, member_id} = req.body;
            let sql = [`SELECT return_date from borrow\
                        WHERE book_id = ${book_id} and member_id = ${member_id}`,
                       `DELETE FROM borrow WHERE book_id = ${book_id} and member_id = ${member_id}`,
                       `UPDATE BOOK SET count = count + 1 WHERE id = ${book_id}`];

            for(let i = 0; i < sql.length; i++){
                this.db.query(sql[i], (err, result) => {
                    if(err){
                        console.log("Couldn't return", err);
                    }
                    // `UPDATE STUDENT SET fine = fine +  WHERE id = '${req.body.sid}'
                    //FOR FINE
                    else if(i == 0){
                        var d1 = new Date(result[0].return_date);
                        var d2 = new Date()
                        const timeDiff = d2 - d1;
                        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
                        if(daysDiff > 0) {
                            this.db.query(`INSERT INTO BILL (member_id, amount, bill_type, description) VALUES (?, ?, ?, ?)`,[member_id, daysDiff*10, 'Fine', `Fine for ${daysDiff} days delay.`], (err, result) => {
                                if(err)
                                    console.log(err);
                                else
                                    console.log("Fine Inserted Succesfully");
                            });
                        }
                    }

                });
            }
        });
    }

    listen() {
        this.app.listen(this.port, (err) => {
            if(err)
                console.log(err);
            else
                console.log(`Server Started On ${this.port}`);
        })
    }
    
}

let library = new LIBRARY(3001, express());
library.get();
library.post();
library.listen();