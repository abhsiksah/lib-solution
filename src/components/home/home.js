import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { signout } from "../../domain/AppSlice";
import "./style.css";

const Home = () => {
  const [bookList, setBookList] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [Addopen, setAddOpen] = React.useState(false);

  const [openLoadRcd, setOpenLoadRcd] = React.useState(false);

  const [loader, setLoader] = React.useState(false);
  const [loanrcdBooks, setLoanrcdBooks] = useState([]);
  const [getSingleBook, setGetSingleBook] = useState({
    updatedBook: {
      title: "",
      description: "",
      price: "",
      author: "",
      publisher: "",
    },
    bookId: "",
  });
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleAddOpen = () => {
    setAddOpen(true);
  };
  const handleAddClose = () => {
    setAddOpen(false);
  };
  const handleloanrcdBooksClose = () => {
    setOpenLoadRcd(false);
  };
  const handleFetchBooks = async () => {
    const url = "http://localhost:3000";
    setLoader(true);
    try {
      let repsonse = await fetch(
        `${url}/search?query=${encodeURIComponent(searchedQuerry)}`
      );
      const parsedJsonSearch = await repsonse.json();

      setBookList(parsedJsonSearch);
      setLoader(false);
    } catch (error) {
      console.log(error, "testing");
      alert("we are facing some problem searching books.....");
    }
  };
  const handleDelete = async (item) => {
    const url = `http://localhost:3000/books/${item.id}`;
    try {
      setLoader(true);
      await fetch(
        url,

        {
          method: "DELETE",
        }
      );
      setGetSingleBook({
        updatedBook: {
          title: "",
          description: "",
          price: "",
          author: "",
          publisher: "",
        },
        bookId: "",
      });
      setBookList([]);
      await handleFetchBooks();
      setLoader(false);
    } catch (error) {
      console.log(error, "testing");
      alert("we are facing some problem in editing plz try again.....");
    }
  };
  const [searchedQuerry, setSearchedQuerry] = useState("");
  const dispatch = useDispatch();

  const appState = useSelector((state) => state.globalAppState);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      price: "",
      author: "",
      publisher: "",
      submit: null,
    },
    enableReinitialze: true,
    validationSchema: Yup.object({}),
    onSubmit: async (values) => {
      const url = `http://localhost:3000/books/${getSingleBook.bookId}`;
      setLoader(true);
      try {
        await fetch(
          url,

          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          }
        );
        setBookList([]);
        await handleFetchBooks();

        setGetSingleBook({
          updatedBook: {
            title: "",
            description: "",
            price: "",
            author: "",
            publisher: "",
          },
          bookId: "",
        });
        setLoader(false);
        handleClose();
      } catch (error) {
        console.log(error, "testing");
        alert("we are facing some problem in editing plz try again.....");
      }
    },
  });

  const Addformik = useFormik({
    initialValues: {
      title: "",
      description: "",
      price: "",
      author: "",
      publisher: "",
      submit: null,
    },
    enableReinitialze: true,
    validationSchema: Yup.object({}),
    onSubmit: async (values) => {
      const url = `http://localhost:3000/addbook`;
      setLoader(true);
      try {
        await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });
        setBookList([]);
        await handleFetchBooks();

        setGetSingleBook({
          updatedBook: {
            title: "",
            description: "",
            price: "",
            author: "",
            publisher: "",
          },
          bookId: "",
        });
        setLoader(false);
        handleAddClose();
      } catch (error) {
        console.log(error, "testing");
        alert("we are facing some problem in adding book plz try again.....");
      }
    },
  });

  useEffect(() => {
    formik.setValues({
      title: getSingleBook.updatedBook.title,
      description: getSingleBook.updatedBook.description,
      price: getSingleBook.updatedBook.price,
      author: getSingleBook.updatedBook.author,
      publisher: getSingleBook.updatedBook.publisher,
    });
  }, [getSingleBook]); //DO NOT ADD FORMIK AS DEPENDENCY AS IT WILL TRIGGER INFINITE RENDERING!!!!

  useEffect(() => {
    Addformik.setValues({
      title: "",
      description: "",
      price: "",
      author: "",
      publisher: "",
    });
  }, [Addopen]); //DO NOT ADD FORMIK AS DEPENDENCY AS IT WILL TRIGGER INFINITE RENDERING!!!!

  return (
    <>
      <div className="home-wrapper">
        <h1 style={{ color: "GrayText" }}>Book Search Application</h1>
        <div style={{ width: "70%" }}>
          <TextField
            id="outlined-basic"
            label="Search for books....."
            variant="standard"
            fullWidth
            onChange={(e) => setSearchedQuerry(e.target.value)}
          />
        </div>

        <Stack spacing={2} direction="row">
          <Button
            variant="contained"
            style={{ backgroundColor: "black" }}
            onClick={handleFetchBooks}
          >
            Search
          </Button>
          {appState.userdata.is_library_manager ? (
            <>
              <Button
                variant="contained"
                style={{ backgroundColor: "black" }}
                onClick={() => {
                  handleAddOpen();
                }}
              >
                Add Book
              </Button>
              <Button
                variant="contained"
                style={{ backgroundColor: "black" }}
                onClick={async () => {
                  const url = "http://localhost:3000/loan-records";
                  setLoader(true);
                  try {
                    let repsonse = await fetch(url);
                    const parsedJsonSearch = await repsonse.json();
                    setOpenLoadRcd(true);
                    setLoanrcdBooks(parsedJsonSearch.loanRecords);
                    setLoader(false);
                  } catch (error) {
                    console.log(error, "testing");
                    alert("we are facing some problem loan record books.....");
                  }
                }}
              >
                Existing Loan Records
              </Button>
              <Button
                variant="contained"
                style={{
                  position: "absolute",
                  right: "20px",
                  top: "20px",
                  backgroundColor: "gray",
                }}
                onClick={() => {
                  dispatch(signout());
                }}
              >
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="contained"
                style={{
                  position: "absolute",
                  right: "20px",
                  top: "20px",
                  backgroundColor: "gray",
                }}
                onClick={() => {
                  dispatch(signout());
                }}
              >
                Sign out
              </Button>
            </>
          )}
        </Stack>

        <div className="book-list">
          {loader ? (
            <Box sx={{ width: "100%" }}>
              <LinearProgress />
            </Box>
          ) : (
            <>
              {[...bookList].reverse().map((item) => (
                <>
                  <div className="single-book">
                    <span>
                      <span className="title-card">Title:</span> {item.title}
                    </span>
                    <span>
                      <span className="title-card">Publisher:</span>
                      {item.publisher}
                    </span>
                    <span>
                      <span className="title-card">Author:</span>
                      {item.author}
                    </span>
                    <span>
                      <span className="title-card">Price:</span>$ {item.price}
                    </span>
                    <span>
                      <span className="title-card">Description:</span>
                      {item.description}
                    </span>
                    {appState.userdata.is_library_manager && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "10px",
                          gap: "20px",
                        }}
                      >
                        <Button
                          variant="contained"
                          onClick={async () => {
                            const url = `http://localhost:3000/books/${item.id}`;
                            try {
                              setLoader(true);
                              let repsonse = await fetch(url);
                              const parsedJsonSearch = await repsonse.json();

                              setGetSingleBook({
                                updatedBook: parsedJsonSearch,
                                bookId: item.id,
                              });

                              handleOpen();
                              setLoader(false);
                            } catch (error) {
                              console.log(error, "testing");
                              alert(
                                "we are facing some problem in editing....."
                              );
                            }
                          }}
                          style={{ backgroundColor: "black" }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="contained"
                          onClick={async () => {
                            var userResponse = window.confirm(
                              "Do you want to proceed?"
                            );

                            // Check the user's response
                            if (userResponse) {
                              // The user clicked "OK"
                              await handleDelete(item);
                            } else {
                              // The user clicked "Cancel" or closed the dialog
                              alert(
                                "if you wish to delete you can click on the button again!"
                              );
                            }
                          }}
                          style={{ backgroundColor: "gray" }}
                        >
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>
                </>
              ))}
            </>
          )}
        </div>
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            transform: "translate(-50%, -50%)",
            left: "50%",
            height: "auto",
            padding: "20px",
            border: "2px solid #000",
            boxShadow: 24,
            borderRadius: "50px",
            width: "800px",
            backgroundColor: "white",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div>
              <Stack spacing={1} sx={{ mb: 10 }}>
                <Typography variant="h4" style={{ fontFamily: "fantasy" }}>
                  Edit Book
                </Typography>
              </Stack>

              <form noValidate onSubmit={formik.handleSubmit}>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Title"
                    name="title"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="text"
                    value={formik.values.title}
                  />
                  <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="text"
                    value={formik.values.description}
                  />
                  <TextField
                    fullWidth
                    label="Price"
                    name="price"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="text"
                    value={formik.values.price}
                  />
                  <TextField
                    fullWidth
                    label="Author"
                    name="author"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="text"
                    value={formik.values.author}
                  />
                  <TextField
                    fullWidth
                    helperText={formik.touched.email && formik.errors.email}
                    label="Publisher"
                    name="publisher"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="text"
                    value={formik.values.publisher}
                  />
                </Stack>
                <div style={{ display: "flex", gap: "20px", width: "600px" }}>
                  <Button
                    fullWidth
                    size="large"
                    sx={{
                      mt: 3,
                      backgroundColor: "black",
                    }}
                    type="submit"
                    variant="contained"
                  >
                    Submit
                  </Button>
                  <Button
                    fullWidth
                    size="large"
                    sx={{
                      mt: 3,
                      border: "2px solid black",
                      color: "black",
                      backgroundColor: "gray",
                    }}
                    onClick={() => {
                      handleClose();
                    }}
                    variant="outlined"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        open={Addopen}
        onClose={handleAddClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            transform: "translate(-50%, -50%)",
            left: "50%",
            height: "auto",
            padding: "20px",
            border: "2px solid #000",
            boxShadow: 24,
            borderRadius: "50px",
            width: "800px",
            backgroundColor: "white",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div>
              <Stack spacing={1} sx={{ mb: 10 }}>
                <Typography variant="h4" style={{ fontFamily: "fantasy" }}>
                  ADD Book
                </Typography>
              </Stack>

              <form noValidate onSubmit={Addformik.handleSubmit}>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Title"
                    name="title"
                    onBlur={Addformik.handleBlur}
                    onChange={Addformik.handleChange}
                    type="text"
                    value={Addformik.values.title}
                  />
                  <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    onBlur={Addformik.handleBlur}
                    onChange={Addformik.handleChange}
                    type="text"
                    value={Addformik.values.description}
                  />
                  <TextField
                    fullWidth
                    label="Price"
                    name="price"
                    onBlur={Addformik.handleBlur}
                    onChange={Addformik.handleChange}
                    type="text"
                    value={Addformik.values.price}
                  />
                  <TextField
                    fullWidth
                    label="Author"
                    name="author"
                    onBlur={Addformik.handleBlur}
                    onChange={Addformik.handleChange}
                    type="text"
                    value={Addformik.values.author}
                  />
                  <TextField
                    fullWidth
                    helperText={
                      Addformik.touched.email && Addformik.errors.email
                    }
                    label="Publisher"
                    name="publisher"
                    onBlur={Addformik.handleBlur}
                    onChange={Addformik.handleChange}
                    type="text"
                    value={Addformik.values.publisher}
                  />
                </Stack>
                <div style={{ display: "flex", gap: "20px", width: "600px" }}>
                  <Button
                    fullWidth
                    size="large"
                    sx={{
                      mt: 3,
                      border: "2px solid black",
                      backgroundColor: "black",
                    }}
                    type="submit"
                    variant="contained"
                  >
                    ADD
                  </Button>
                  <Button
                    fullWidth
                    size="large"
                    sx={{
                      mt: 3,
                      border: "2px solid black",
                      color: "black",
                      backgroundColor: "gray",
                    }}
                    onClick={() => {
                      handleAddClose();
                    }}
                    variant="outlined"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        open={openLoadRcd}
        onClose={handleloanrcdBooksClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <div
          className="remove-scroll"
          style={{
            position: "absolute",
            top: "50%",
            transform: "translate(-50%, -50%)",
            left: "50%",
            height: "650px",
            overflow: "scroll",
            padding: "30px",
            border: "2px solid #000",
            boxShadow: 24,
            borderRadius: "50px",
            width: "800px",
            backgroundColor: "white",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "30px",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="h4"
                style={{ fontFamily: "fantasy", marginBottom: "60px" }}
              >
                Loan Records
              </Typography>

              {loanrcdBooks.map((item, index) => (
                <div className="single-book-record" key={index}>
                  <span>
                    <span className="title-card">UserId: </span>
                    {item.user_id}
                  </span>
                  <span>
                    <span className="title-card">BookId:</span>
                    {item.book_id}
                  </span>
                  <span>
                    <span className="title-card">CopyId</span>: {item.copy_id}
                  </span>
                  <span>
                    <span className="title-card">Borrow Date</span>:{" "}
                    {item.borrow_date}
                  </span>
                  <span>
                    <span className="title-card">Due Date:</span>

                    {item.due_date}
                  </span>
                  <span>
                    <span className="title-card">Actual Return Date</span>:{" "}
                    {item.actual_return_date}
                  </span>
                  <span>
                    <span className="title-card">Extended Due Date:</span>

                    {item.extended_due_date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Home;
