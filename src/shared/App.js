import React, {useCallback, useEffect, useMemo} from "react";
import { ConnectedRouter } from "connected-react-router";
import { history } from "../redux/configStore";
import { Route, Switch, useLocation, withRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client"


import styled from "styled-components";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import Color from "./Color";
import GlobalStyle from "./GlobalStyle";
import "./Transition.css";

import instance from "./Request";
import { actionCreators as userActions } from "../redux/modules/user";
import OAuth2RedirectHandler from "./OAuth2RedirectHandler ";

//컴포넌트
import {Layout} from "../elements";
import {Navigation, Spinner} from "../components";
import {TreasureModal, SignoutModal} from "../modals";

import Home from "../pages/Home";
import Login from "../pages/Login";
import {ReviewDetail, ReviewWrite, BookDetail, Search} from "../pages/Review";
import {MyProfile, MyFeed, MyReview, MyReviewFind,Follow, OtherFollow, MyDepth, Notification} from "../pages/My";
import {ChangeName, ChangeProfileImg, Setting, VoiceOfCustomer} from "../pages/Setting";
import {ErrorPage, LevelHelp} from "../pages/ETC";
import {CollectionList, BookCollectionMain, CollectionDetail,  MakeCollection, EditCollection} from "../pages/Collection";

//ga
import ReactGA from 'react-ga';
const TRACKING_ID = "G-YDRFCGX56M"; // YOUR_OWN_TRACKING_ID
ReactGA.initialize(TRACKING_ID);


const socket = io.connect("http://13.209.10.67")

function App(props) {
  const dispatch = useDispatch();
  const is_nav = useSelector((state) => state.permit.is_nav);
  const is_modal = useSelector((state) => state.permit.is_modal);
  const user = localStorage.getItem("token") ? true : false;
  const token = localStorage.getItem('token');
  instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  const is_padding = useSelector(state => state.permit.is_padding)
  const is_treasure = useSelector(state => state.permit.is_treasure_modal)
  const userId = useSelector(state => state.user.user._id)

  const getUserInfo = useCallback(() => {dispatch(userActions.getUserSV(userId))}, [userId])
  
  
  useEffect(() => {
    if (user) {
      dispatch(userActions.loginCheck());
      dispatch(userActions.isMe());
    }

  }, [user]);



  useEffect(() => {
    if (userId) {
      getUserInfo()
      console.log("-------유저아이디", userId)
      socket.emit("login", userId)
      socket.on("login", (payload) => {
        console.log(socket.id)
        console.log(payload)
      })
    }
  }, [userId]);




  const location = useLocation();
  return (
    <React.Fragment>
      <GlobalStyle />
      <Layout >
      <Container is_modal_opened={is_modal ? "hidden" : "scroll"} is_padding={is_padding}>
        
        <TransitionGroup  >
        <CSSTransition key={location.pathname.includes("bookdetail") ||location.pathname.includes("collectiondetail") || location.pathname==="/changename"? location.pathname : null}  
        classNames="slide" timeout={300}>
        <ConnectedRouter history={history}>
          <Switch location={location}>
          <Route path="/" exact component={Home} />


          <Route path="/reviewdetail/:bookid/:reviewid" exact component={ReviewDetail}/>
          <Route path="/postwrite" exact component={ReviewWrite} />
          <Route path="/postwrite/:bookid/:reviewid" exact component={ReviewWrite}/>
          <Route path="/bookdetail/:bookid" exact component={BookDetail} />
          <Route path="/search" exact component={Search} />

          <Route path="/bookCollectionMain" exact component={BookCollectionMain} />
          <Route path="/collectiondetail/:collectionid" exact component={CollectionDetail}/>
          <Route path="/collectionlist/:type" exact component={CollectionList}/>
          <Route path="/makeCollection" exact component ={MakeCollection}/>
          <Route path="/editCollection/:collectionid" exact component ={EditCollection}/>
          
          


          <Route path="/login" exact component={Login} />
          <Route path="/api/users/kakao/callback" component={OAuth2RedirectHandler} />
          <Route path="/logincheck" component={Spinner} />
          <Route path="/modal" exact component={SignoutModal} />


          <Route path="/mydepth" exact component={MyDepth}/>
          <Route path="/levelhelp" exact component ={LevelHelp}/>

          <Route path="/myfeed" exact component={MyFeed} />
          <Route path="/otherUser/:otherId" exact component={MyFeed} />
          <Route path="/myreview" exact component={MyReview} />
          <Route path="/notification" exact component ={Notification}/>
          <Route path="/myreviewfind" exact component={MyReviewFind} />


          <Route path="/changename" exact component={ChangeName} />
          <Route path="/myprofile" exact component={MyProfile} />
          <Route path="/following" exact component={Follow}/>
          <Route path="/follower" exact component={Follow}/>
          <Route path="/following/:otherId" exact component={OtherFollow}/>
          <Route path="/follower/:otherId" exact component={OtherFollow}/>
          <Route path="/changeprofileimg" component ={ChangeProfileImg}/>
          <Route path="/setting" exact component={Setting}/>
          <Route path="/voiceOfCustomer" exact component={VoiceOfCustomer}/>

          <Route path="*" component={ErrorPage}/>

          </Switch>
          </ConnectedRouter>
          </CSSTransition>
        </TransitionGroup>
         
        {is_nav ? <Navigation /> : ""}
        <TreasureModal is_treasure={is_treasure}/>
      </Container>
      </Layout>
    </React.Fragment>
  );
}

const Container = styled.div`
position: absolute;
  width: 100vw;
  height: 100vh;
  background: ${Color.mainColor};
  overflow-y: ${(props) => props.is_modal_opened};
  overflow-x: hidden;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
  }
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  box-sizing: border-box;
  padding: ${(props) => props.is_padding ? "0px 0px 60px 0px" : "0"};
  position: relative;


  @media ${(props) => props.theme.tablet} {
    width:420px;
    height:100vh;
  }

  @media ${(props) => props.theme.desktop} {
    width:420px;
    height:100vh;
  }

`;

export default App;
