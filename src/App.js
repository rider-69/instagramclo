import React, { useState, useEffect } from "react";
import "./App.css";
import Post from "./Post";
import { db, auth } from "./firebase";
import ImageUpload from "./ImageUpload";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { Input } from "@mui/material";
import InstagramEmbed from 'react-instagram-embed';


const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  innerHeight: 100,
  width: 400,
  bgcolor: "white",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function App() {
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [openSignIn, setopenSignIn] = useState(false);
  // const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState("");

  //user auth
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //user has logged in
        console.log("dekh lo>>>>>>>>>>", authUser);
        setUser(authUser);
      } else {
        //user havs logged out
        setUser(null);
      }
    });
    return () => {
      //perform some cleanpu actions
      unsubscribe();
    };
  }, []);

  // useEffect ->
  useEffect(() => {
    // put code inside
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
  }, []);

  const signUp = (event) => {
    event.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));
  };
  const signIn = (event) => {
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));
    setopenSignIn(false);
  };

  return (
    <div className="app">
      {/* header */}

      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://clipart.info/images/ccovers/1522452762Instagram-logo-png-text.png"
          alt=""
        />
        {user ? (
          <Button onClick={() => auth.signOut()}> LogOut </Button>
        ) : (
          <div className="app__loginContainer">
            <Button className="app__button" onClick={() => setopenSignIn(true)}>
              Sign In{" "}
            </Button>
            <Button className="app__button" onClick={() => setOpen(true)}>
              Sign Up{" "}
            </Button>
          </div>
        )}
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerImage"
                src="https://clipart.info/images/ccovers/1522452762Instagram-logo-png-text.png"
                alt=""
              />
            </center>
            <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" onClick={signUp}>
              Sign Up
            </Button>
          </form>
        </Box>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={() => setopenSignIn(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerImage"
                src="https://clipart.info/images/ccovers/1522452762Instagram-logo-png-text.png"
                alt=""
              />
            </center>

            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" onClick={signIn}>
              Sign In
            </Button>
          </form>
        </Box>
      </Modal>
      
      {/* the id thing is to update the current content. save from reloading the whole site */}
      <div className="app__posts">
        <div className="app__postsLeft">
          {posts.map(({ post, id }) => (
            <Post
              user={user}
              key={id}
              postId={id}
              username={post.username}
              caption={post.caption}
              imageUrl={post.imageUrl}
              avatarUrl={post.avatarUrl}
            />
          ))}
        </div>
        <div className="app__postsRight">
        <InstagramEmbed
  url='https://instagr.am/p/Zw9o4/'
  clientAccessToken='123|456'
  maxWidth={320}
  hideCaption={false}
  containerTagName='div'
  protocol=''
  injectScript
  onLoading={() => {}}
  onSuccess={() => {}}
  onAfterRender={() => {}}
  onFailure={() => {}}
/>
        </div>
      </div>

      {/* posts */}

      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
        <h3>sorry you need to login</h3>
      )}
    </div>
  );
}

export default App;
