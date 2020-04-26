use actix_files as fs;
use actix_web::{Result};

#[get("/robots.txt")]
pub async fn robots() -> Result<fs::NamedFile> {
    Ok(fs::NamedFile::open("static/robots.txt")?)
}

#[get("/service-worker.js")]
pub async fn sw() -> Result<fs::NamedFile> {
    Ok(fs::NamedFile::open("static/service-worker.js")?)
}
