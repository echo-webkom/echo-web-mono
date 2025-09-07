//! Module for all entity models.
//!
//! There should only be pure data structures in this module.
//!
//! Business logic should be implemented in services.
//!
//! There should also be no dependencies on other modules in this crate. You are
//! allowed to use external crates (i.e error handling), but try to keep
//! dependencies to a minimum.

pub mod access_request;
pub mod comment;
pub mod comment_reaction;
pub mod happening;
pub mod shared;
pub mod user;

pub use access_request::AccessRequest;
pub use comment::Comment;
pub use comment_reaction::CommentReaction;
pub use happening::Happening;
pub use user::User;
