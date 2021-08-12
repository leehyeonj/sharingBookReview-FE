import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";
import axios from "axios";
import instance from "../../shared/Request";
import { history } from "../configStore";


//actions
const IS_MAKE_COLLECTION = "collection/IS_MAKE_COLLECTION";
const SELECT_BOOKS = "collection/SELECT_BOOKS";
const MORE_SELECT = "collection/MORE_SELECT";
const RESET_SELECTED = "collection/RESET_SELECTED";
const GET_TAG_COLLECTIONS = "collection/GET_TAG_COLLECTIONS";
const GET_CUSTOM_COLLLECTIONS = "collection/GET_CUSTOM_COLLLECTIONS";
const ADD_COLLECTION = "collections/ADD_COLLECTION";
const ADD_COLLECTION_CONTENTS = "collections/ADD_COLLECTION_CONTENTS";


//actioncreator
const isMakeCollection = createAction(IS_MAKE_COLLECTION, (is_make_collection)=>({is_make_collection}));
const selectBooks = createAction(SELECT_BOOKS, (book) => ({ book }));
const moreSelect = createAction(MORE_SELECT, (more_select)=>({more_select}));
const resetSelected =  createAction(RESET_SELECTED, (book)=>({book}));
const getTagCollections = createAction(GET_TAG_COLLECTIONS, (collection_list)=> ({collection_list}));
const getCustomCollections = createAction(GET_CUSTOM_COLLLECTIONS, (collection_list)=> ({collection_list}));
const addCollection = createAction(ADD_COLLECTION, (collection)=>({collection}));
const addCollection_content = createAction(ADD_COLLECTION_CONTENTS, (collection)=>({collection}));

//initial
const initialState = {
    selected_Books: [],
    more_select : false,
    tag_collection_list : [],
    custom_collection_list: [],
    collection_contents :[],
    is_make_collection : false,
};



//middle
//책 하나씩 불러와서 선택한 책 배열에 넣기
const selectBooksSV = (id)=>{
  return function(dispatch){
      instance.get(`/books/${id}`)
      .then((res)=>{
          dispatch(selectBooks({
            title: res.data.title,
            image: res.data.image,
            author: res.data.author,
            isbn: res.data.isbn
          }));
      })
      .catch((err)=>{
          window.alert("책 하나 로드 실패");
          console.log("책로드 하나 실패", err)
      })
  }
}

//태그 기반 collection불러오기
const getTagCollectionsSV = ()=>{
  return function(dispatch){
    instance.get('/collections',{
      params: {
        type: "tag"
      }
    })
    .then((res)=>{
      dispatch(getTagCollections(res.data.collections));
    })
    .catch((err)=>{
      console.log(err)
    })
  }
}

//사용자가 올린 collection불러오기
const getCustomCollectionsSV = ()=>{
  return function(dispatch){
    instance.get('/collections',{
      params: {
        type: "custom"
      }
    })
    .then((res)=>{
      console.log(res.data)
      dispatch(getCustomCollections(res.data.collections));
    })
    .catch((err)=>{
      console.log(err)
    })
  }
}

//collection추가하기
const addCollectionSV = (formData)=>{
  return function(dispatch,{hitory}){
    instance.post('/collections', formData, {
      headers: {
          "Content-Type": "multipart/form-data",
      },
  })
  .then((res)=>{
    console.log(res.data)
    dispatch(addCollection(res.data))
    history.push('/bookCollectionMain')
  })
  .catch((err) => {
    console.log("post작성 실패", err);
   
  })
  }
}



//reducer
export default handleActions(
    {
      [IS_MAKE_COLLECTION]: (state, action) =>
      produce(state, (draft) => {
        draft.is_make_collection = action.payload.is_make_collection;
      }),
        [SELECT_BOOKS]: (state, action) =>
        produce(state, (draft) => {
          let index = draft.selected_Books.findIndex((p) => p.isbn === action.payload.book.isbn);
         if(index>-1){
           window.alert("중복되는 책입니다.");
           return;
         }
          draft.selected_Books.push(action.payload.book);
        }),
        [MORE_SELECT]: (state, action) =>
        produce(state, (draft) => {
          draft.more_select = action.payload.more_select;
        }),
        [RESET_SELECTED]: (state, action) =>
        produce(state, (draft) => {
          draft.selected_Books = [];
        }),
        [GET_TAG_COLLECTIONS]:(state, action)=>
        produce(state, (draft)=>{
          draft.tag_collection_list = action.payload.collection_list;
        }),
        [GET_CUSTOM_COLLLECTIONS]:(state, action)=>
        produce(state, (draft)=>{
          draft.custom_collection_list = action.payload.collection_list;
        }),
        [ADD_COLLECTION]:(state, action)=>
        produce(state, (draft)=>{
          draft.custom_collection_list?.unshift(action.payload.collection);
        }),
        [ADD_COLLECTION_CONTENTS]:(state, action)=>
        produce(state, (draft)=>{
          draft.collection_contents.push(action.payload.collection);
        }),

 
 
    },
    initialState
  );
  

const actionCreators = {
  isMakeCollection,
  selectBooksSV,
  moreSelect,
  resetSelected,
  getTagCollectionsSV,
  getCustomCollectionsSV,
  addCollectionSV,
  addCollection_content
};
  
export { actionCreators };