import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";
import instance from "../../shared/Request";


//actions
const GET_COMMENT = "comment/GET_COMMENT";
const ADD_COMMENT = "comment/ADD_COMMENT";
const UPDATE_COMMENT = "comment/UPDATE_COMMENT";
const DELETE_COMMENT = "comment/DELETE_COMMENT";

//actioncreator
const getComment = createAction(GET_COMMENT, (comment) => ({ comment }));
const addComment = createAction(ADD_COMMENT, (comment) => ({ comment }));
const updateComment = createAction(UPDATE_COMMENT, (id, content) => ({id, content}));
const deleteComment = createAction(DELETE_COMMENT, (id) => ({id}));

//initial
const initialState = {
    comment_list:[{
        username:"닉네임",
        content:"정말 감명깊은 리뷰입니다",
    }]
};



//middle

//comment를 서버에 add 하는 함수를 만들던중.
// const addCommentSV = (commentInfo) => {
//     return function(dispatch){
//       //오늘 목표 불러오기
//       instance.post(`/books/:${commentInfo.bookId}/reviews/:${commentInfo.reviewId}/comments`,{
//           user:{commentInfo.userInfo},
//           content: commentInfo.content,
//       })
//         .then(function (response) {

//             dispatch(setTodayPlan(response.data));
//         })
//         .catch(function (error) {
//             console.log(error);
//         })

//     }
// }

const updateCommentSV = (comment_info) => {
  return function (dispatch, getState, {history}){
    instance
    .put(`books/:${comment_info.bookId}/reviews/:${comment_info.reviewId}/comments/:${comment_info.commentId}`,
    {content : comment_info.content})
    .then((res) => {
      if(comment_info.commentId){
        const comment = res.data.filter((l,idx) => {
          return l.id === parseInt(comment_info.commentId);
        })
      }
    })
  }
}

const deleteCommentSV = (comment_info) => {
  return function (dispatch, getState, {history}){
    instance
    .delete(`books/:${comment_info.bookId}/reviews/:${comment_info.reviewId}/comments/:${comment_info.commentId}`)
    .then((res)=>{})
    .catch((err)=> {
      console.log("comment delete error!",err)
    })
    dispatch(deleteComment(comment_info.commentId))
  }
}




//reducer
export default handleActions(
    {
        [GET_COMMENT]: (state, action) =>
        produce(state, (draft) => {
          draft.comment_list = action.payload.comment;
        }),
        [ADD_COMMENT]: (state, action) =>
        produce(state, (draft) => {
          draft.comment_list.unshift(action.payload.comment);
        }),
        [UPDATE_COMMENT]: (state, action) => produce(state, (draft) => {
          let idx = draft.comment_list.findIndex((l) => l.id === action.payload.id);
          draft.comment_list[idx].content = action.payload.content;
        }),
        [DELETE_COMMENT]: ( state, action) => produce(state, (draft) => {
          draft.comment_list = draft.comment_list.filter((l,idx) => {
            return l.id !== action.payload.id
          })
        })
    },
    initialState
  );
  

const actionCreators = {
    addComment,
    getComment,
};
  
export { actionCreators };