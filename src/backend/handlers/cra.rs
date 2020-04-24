use std::io::Read;

use actix_web::{HttpRequest, HttpResponse, Responder};

use std::collections::HashMap;

use crate::backend::routes::get_routes;

lazy_static! {
    static ref ROUTES: HashMap<String, String> = {
        let routes = get_routes();

        routes.iter().cloned().collect()
    };
}

pub async fn index(req: HttpRequest) -> impl Responder {
    let path_req = req
        .match_info()
        .query("tail")
        .get(1..)
        .unwrap_or_default()
        .trim()
        .clone();

    let path = if path_req.len() == 0 {
        "home"
    } else {
        match ROUTES.get(path_req) {
            Some(r) => r,
            None => "index"
        }
    };

    match std::fs::File::open(format!("static/{}.html", path)) {
        Ok(mut file) => {
            let mut contents = String::new();
            file.read_to_string(&mut contents).unwrap_or_default();

            HttpResponse::Ok()
                .content_type("text/html; charset=utf-8")
                .header("Cache-Control", "no-cache, no-store, max-age=0, must-revalidate")
                .header("pragma", "no-cache")
                .header("x-ua-compatible", "IE=edge, Chrome=1")
                .body(contents)
        },
        Err(e) => {
            println!("index.html is not found - {}", e);

            HttpResponse::Ok()
                .content_type("text/html; charset=utf-8")
                .header("Cache-Control", "no-cache, no-store, max-age=0, must-revalidate")
                .header("pragma", "no-cache")
                .header("x-ua-compatible", "IE=edge, Chrome=1")
                .body("Resource not found")
        }
    }
}
