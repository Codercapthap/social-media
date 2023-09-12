import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Messenger from "./pages/messenger/Messenger";
import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import PostPage from "./pages/postPage/PostPage.jsx";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentAuth } from "./store/Actions/AuthAction";
import { setCurrentUser } from "./store/Actions/UserAction";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { socket } from "./helpers/http";
import { socketHandle } from "./socket";
import Search from "./pages/search/Search";
import Loading from "./pages/loading/Loading";
import NotFound from "./pages/notFound/NotFound";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
function App() {
  const dispatch = useDispatch();
  const currentAuth = useSelector((state) => {
    return state.Auth.auth;
  });
  const loading = useSelector((state) => {
    return state.Loading.loading;
  });
  const { i18n } = useTranslation();
  useEffect(() => {
    const lang = JSON.parse(localStorage.getItem("lang"));
    if (lang) {
      i18n.changeLanguage(lang);
    }
  }, []);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      dispatch(setCurrentAuth(user));
      if (user) {
        socket.emit("addUser", user.uid);
        dispatch(setCurrentUser(user));
        socketHandle(socket, dispatch);
      } else {
        dispatch({ type: "FINISH_LOADING" });
      }
    });
  }, [currentAuth]);

  // TODO: if not auth, redirect to login page
  const ProtectedRoute = ({ children }) => {
    if (!currentAuth) {
      return <Navigate to="/login"></Navigate>;
    } else {
      return <>{children}</>;
    }
  };

  return (
    <>
      <AnimatePresence
        initial={false}
        mode="wait"
        onExitComplete={() => {
          return null;
        }}
      >
        {loading && (
          <motion.div
            initial={{ opacity: 0, position: "fixed" }}
            animate={{ opacity: 1, position: "fixed" }}
            exit={{ opacity: 0, position: "fixed" }}
            transition={{ duration: 0.5 }}
          >
            <Loading></Loading>
          </motion.div>
        )}
      </AnimatePresence>

      {!loading && (
        <div>
          <Router>
            <Routes>
              <Route
                exact
                path="/"
                element={
                  currentAuth ? (
                    <ProtectedRoute>
                      <Home></Home>
                    </ProtectedRoute>
                  ) : (
                    <Login></Login>
                  )
                }
              ></Route>
              <Route
                path="/login"
                element={
                  currentAuth ? <Navigate to="/"></Navigate> : <Login></Login>
                }
              ></Route>
              <Route
                path="/register"
                element={
                  currentAuth ? (
                    <Navigate to="/"></Navigate>
                  ) : (
                    <Register></Register>
                  )
                }
              ></Route>
              <Route
                exact
                path="/messenger"
                element={
                  currentAuth ? (
                    <ProtectedRoute>
                      <Messenger></Messenger>
                    </ProtectedRoute>
                  ) : (
                    <Login></Login>
                  )
                }
              ></Route>
              <Route
                path="/profile/:uid"
                element={
                  currentAuth ? (
                    <ProtectedRoute>
                      <Profile></Profile>
                    </ProtectedRoute>
                  ) : (
                    <Login></Login>
                  )
                }
              ></Route>
              <Route
                path="/post/:postId"
                element={
                  currentAuth ? (
                    <ProtectedRoute>
                      <PostPage></PostPage>
                    </ProtectedRoute>
                  ) : (
                    <Login></Login>
                  )
                }
              ></Route>
              <Route
                path="/search"
                element={
                  currentAuth ? (
                    <ProtectedRoute>
                      <Search></Search>
                    </ProtectedRoute>
                  ) : (
                    <Login></Login>
                  )
                }
              ></Route>
              <Route path="*" element={<NotFound></NotFound>} />
            </Routes>
          </Router>
        </div>
      )}
    </>
  );
}

export default App;
