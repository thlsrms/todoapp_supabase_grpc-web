## TodoApp 
CRUD web application using Rust and Supabase on the backend with grpc services.

<br>
This is only a simple experimental project.
<br>
There's no form validation, caching or session management.

<hr>

### Running
Setup a supabase project and run the **tasks_table.sql**.
<br>
Rename the **.env.example** file to **.env** and set your own project variables.

<br>

You can use [just](https://github.com/casey/just) and run the recipes available in the *.justfile*

<br>

`just dev-s` to run the server and `just dev-c` to run the client.

<br>

Or manually source your *.env* file and run:
<br>

Server: `cd todo-server` and `cargo run`
<br>

Client: `cd todo-client` and `yarn dev`
<br>
