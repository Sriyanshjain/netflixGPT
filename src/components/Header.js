import { useDispatch, useSelector } from "react-redux";
import { ChevronDownIcon,ChevronUpIcon } from "@heroicons/react/24/solid";
import {  onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../utils/firebase";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { addUser, removeUser } from "../utils/userSlice";
import { NETFLIX_LOGO, USER_AVATAR } from "../utils/constants";
const Header = () => {
  const user = useSelector((store) => store.user);
  const navigate= useNavigate();
  const dispatch=useDispatch();
  const handleSignOut=()=>{
    signOut(auth).then(() => {
      // Sign-out successful.

    }).catch((error) => {
      // An error happened.
      navigate("/error")
    });
  }
  useEffect(()=>{
    const unsubscribe=onAuthStateChanged(auth, (user) => {
      if (user) {
        const {uid,email,displayName}=user;
        dispatch(addUser({uid:uid,email:email,displayName:displayName}));
        navigate("/browse")
        // ...
      } else {
        // User is signed out
        dispatch(removeUser());
        navigate("/")
      }
    });
    return ()=>unsubscribe();
  },[])
  return (
    <div className=" px-8 py-2 bg-gradient-to-b from-black z-10 flex flex-col md:flex-row justify-between backdrop-blur-xl md:backdrop-blur-none fixed top-0 w-full">
      <img
        className="w-44 mx-auto md:mx-0"
        src={NETFLIX_LOGO}
        alt="logo"
      />

{user && <div className="relative inline-block group p-2 mr-4 cursor-pointer">
  <div className="flex justify-around transition duration-300">
    <img
      className="p-2 w-16 h-16"
      src={USER_AVATAR}
      alt="Netflix Logo"
    />
    <div className="mt-4">
      <ChevronDownIcon className="h-6 w-6 text-white block group-hover:hidden" />
      <ChevronUpIcon className="h-6 w-6 text-white hidden group-hover:block " />
    </div>
  </div>
  <div className="bg-black rounded-md absolute cursor-pointer text-white hidden group-hover:block p-3 mt-4">
    <ul>
      <li onClick={handleSignOut}>Sign out</li>
    </ul>
  </div>
</div>}

    </div>
  );
};

export default Header;