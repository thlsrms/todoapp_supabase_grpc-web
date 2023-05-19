# Use 'just' with https://github.com/casey/just

# Source .env file
set dotenv-load

gen:
    cd proto && buf generate -v

dev-c:
    cd todo-client && yarn dev

dev-s:
    cd todo-server && cargo watch -x run

build-c:
    cd todo-client && yarn build

dev-build-s:
    cd todo-server && cargo build

build-s:
    cd todo-server && cargo build --release
