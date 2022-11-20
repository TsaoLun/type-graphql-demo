use sqlx::{mysql::{MySqlPool, MySql}, Pool};
use std::env;

pub async fn get_pool() -> MySqlPool {
    MySqlPool::connect(&format!(
        "mysql://{}:{}@{}/{}",
        env::var("MARIA_DB_USER").unwrap(),
        env::var("MARIA_DB_PASS").unwrap(),
        env::var("MARIA_DB_URL").unwrap(),
        env::var("MARIA_DB_NAME").unwrap(),
    )).await.unwrap()
}