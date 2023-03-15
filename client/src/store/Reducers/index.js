import { combineReducers } from "redux";
import AuthReducer from "./AuthReducer.js";
import UserReducer from "./UserReducer.js";
import LoadingReducer from "./LoadingReducer.js";
import OnlineReducer from "./OnlineReducer.js";
import ConversationsReducer from "./ConversationsReducer.js";
import NewMessageReducer from "./NewMessageReducer.js";
import NotificationsReducer from "./NotificationReducer.js";
import FriendRequestReducer from "./FriendRequestReducer.js";
import ComponentLoadingReducer from "./ComponentLoadingReducer.js";
import FadingReducer from "./FadingReducer.js";
import ConfirmReducer from "./ConfirmReducer.js";

const reducers = combineReducers({
  Auth: AuthReducer,
  User: UserReducer,
  Loading: LoadingReducer,
  Online: OnlineReducer,
  Conversations: ConversationsReducer,
  NewMessage: NewMessageReducer,
  Notifications: NotificationsReducer,
  FriendRequest: FriendRequestReducer,
  ComponentLoading: ComponentLoadingReducer,
  Fading: FadingReducer,
  Confirm: ConfirmReducer,
});

export default reducers;
