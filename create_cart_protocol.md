Use stack:
Flask backend (tsx frontend)
mysql database
Docker

Frontend (tsx): 
Red and Black themes
admin/cart marshall screen
player/volunteer log cart screen
Dialog box popups for each of the crud endpoints with edit buttons on the referenced detail the endpoint refers to.


Backend:
    CRUD Endpoints:
        Create: New cart, New person
        Read: Existing Carts, Existing People (admin screen), Location of current carts, 
            who carts are rented to, Estimated charge/gas level of carts, 
            Time the carts left, and the time they need to be back by
        Update: Person info, Cart info
        Delete: Carts, Person(s)
    Flask Endpoints:
        Admin/Marshall Screen connection
        Player/volunteer screen connection

    Database:
        use mysql to create a database that will store all of this information.

Containerization:
    Create a docker container to store the front and backend so that the app can be hypothetically scaled.


