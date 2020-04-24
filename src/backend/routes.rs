use serde_json;
use std::{io::prelude::*, fs};

pub fn get_routes() -> Vec<(String, String)> {
    match fs::File::open("static/routes.json") {
        Ok(mut file) => {
            let mut routes_json = String::new();

            file
                .read_to_string(&mut routes_json)
                .unwrap_or_default();

            match serde_json::from_str(&routes_json) {
                Ok(r) => {
                    let routes: Vec<(String, String)> = r;
                    println!("Registered routes: {:?}", routes);
                    return routes;
                },
                Err(e) => {
                    println!("error: {}", e);
                    return vec![];
                },
            }
        },
        Err(e) => {
            println!("error: {}", e);
            return vec![];
        }
    }
}
