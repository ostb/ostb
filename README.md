Open Source Textbooks
=========

OSTB is a platform for anyone, especially professors and teachers, to write powerful, interactive textbooks to share with the world. Our platform relies on shareJS for real-time collaboration, stackedit for our base markdown editor, and node for our backend. 

OSTB will allow users to download and deploy their pages/books to their own hosting/servers. To allow for the creation of interactive components, we integrate jQuery, D3, C3, and Tangle (others may be added). 


###How to Run Your Mongo Instance
- $ mkdir mongo_data/db/
- $ mongod --dbpath ...path.../open_source_textbook/ostb/mongo_data/db    
- $ mongo (connects to ^ mongod)
- > (^ in mongo shell) use userdb

###How to run mocha tests
- $ mocha test/...nameOfTest.js...