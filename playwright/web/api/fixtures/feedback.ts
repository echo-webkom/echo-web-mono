export const validFeedbacks = [
  {
    name: "John Doe",
    email: "johndoe@gmail.com",
    message: "Hello, world!",
  },
  {
    name: "John Doe",
    email: "",
    message: "Hello, world!",
  },
  {
    name: "",
    email: "johndoe@gmail.com",
    message: "Hello, world!",
  },
  {
    name: "",
    email: "",
    message: "Hello, world!",
  },
];

export const invalidFeedbacks = [
  {
    name: "John Doe",
    email: "",
    message: "",
  },
  {
    name: "",
    email: "",
    message: "",
  },
  {
    name: "",
    email: "",
  },
  {
    name: "",
    email: "john doe",
    message: "Hello, world!",
  },
];
