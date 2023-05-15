# Use 'just' with https://github.com/casey/just
gen:
    cd proto && buf generate -v

dev-c:
    cd todo-client && yarn dev

# Source 'todo-server/.env' file before
dev-s:
    cd todo-server && cargo watch -x run

build-c:
    cd todo-client && yarn build

dev-build-s:
    cd todo-server && cargo build

build-s:
    cd todo-server && cargo build --release
