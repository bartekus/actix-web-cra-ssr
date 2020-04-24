use std::{ env, io };
use actix_files as fs;
use actix_session::{ CookieSession };
use actix_web::{ middleware, App, HttpServer, web, HttpResponse, guard };

use actix_web_cra_ssr::backend::handlers::{cra, misc};

#[actix_rt::main]
async fn main() -> io::Result<()> {
    env::set_var("RUST_LOG", "actix_server=info,actix_web=info");
    env_logger::init();

    HttpServer::new(|| {
        App::new()
            .wrap(CookieSession::signed(&[0; 32]).secure(false))
            .service(
                fs::
                Files::new("/static", "static")
                    .show_files_listing()
            )
            .service(misc::robots)
            .default_service(
                web::resource("")
                    .route(
                        web::get()
                            .to(cra::index)
                    )
                    .route(
                        web::route()
                            .guard(guard::Not(guard::Get()))
                            .to(|| HttpResponse::MethodNotAllowed()),
                    ),
            )
            .wrap(middleware::Compress::default())
            .wrap(middleware::DefaultHeaders::new().header("Cache-Control", "must-revalidatee, public, max-age=31536000"))
            .wrap(middleware::Logger::default())
    })
        .bind("127.0.0.1:8080")?
        .workers(8)
        .run()
        .await
}
