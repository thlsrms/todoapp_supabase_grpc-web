fn main() -> Result<(), Box<dyn std::error::Error>> {
    tonic_build::configure()
        .build_client(false)
        .out_dir("./src/services/auth/proto/")
        .include_file("mod.rs")
        .compile(
            &[
                // Auth proto files
                "../proto/auth_api/auth/v1/auth.proto",
            ],
            &["../proto"],
        )?;
    tonic_build::configure()
        .build_client(false)
        .out_dir("./src/services/todo/proto/")
        .include_file("mod.rs")
        .compile(
            &[
                // Todo proto files
                "../proto/todo_api/todo/v1/task.proto",
                "../proto/todo_api/todo/v1/todo.proto",
            ],
            &["../proto"],
        )?;

    Ok(())
}
