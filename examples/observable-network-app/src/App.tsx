import "./App.css";
import {
  HttpMethod,
  RequestFactory,
  useObservableHttpClient,
} from "test2-react-observable-network";
import { mapToPostModel, PostModel } from "./model/Posts/post.model";
import { axiosConfig } from "./config/axiosconfig";
import { mapToTodoModel, Todo } from "./model/Todos/todo.model";

function App() {
  // request creation
  const requestGetPost = RequestFactory<PostModel[]>({
    url: "/postss",
    mapper: (data) => mapToPostModel(data),
    httpMetod: HttpMethod.GET,
    config: axiosConfig,
    onErrorAction: (err) => {
      console.log(err);
    },
  });

  const requestGetTodo = RequestFactory<Todo[]>({
    url: "/todos",
    mapper: (data) => mapToTodoModel(data),
    httpMetod: HttpMethod.GET,
    config: axiosConfig,
  });

  const requestCreateNewPost = RequestFactory<any>({
    url: "/posts",
    mapper: (data) => data,
    httpMetod: HttpMethod.POST,
    body: {
      title: "foo",
      body: "bar",
      userId: 1,
    },
    config: axiosConfig,
  });

  // execution
  const postRequest = useObservableHttpClient(requestGetPost);
  const todoRequest = useObservableHttpClient(requestGetTodo);
  const createNewPost = useObservableHttpClient(requestCreateNewPost);

  return (
    <>
      <div className="button-container">
        <button
          onClick={() => {
            postRequest.fetchData();
          }}
        >
          fetch api post
        </button>
        <button
          onClick={() => {
            todoRequest.fetchData();
          }}
        >
          fetch api todo
        </button>

        <button
          onClick={() => {
            createNewPost.fetchData();
          }}
        >
          create new post
        </button>

        <button
          onClick={() => {
            postRequest.fetchData();
            todoRequest.fetchData();
            postRequest.fetchData();
            todoRequest.fetchData();
            postRequest.fetchData();
            todoRequest.fetchData();
            postRequest.fetchData();
            todoRequest.fetchData();
            postRequest.fetchData();
            todoRequest.fetchData();
          }}
        >
          multiple request
        </button>
      </div>
      <div>
        <input
          type="text"
          placeholder="title"
          onChange={() => {
            postRequest.fetchData();
          }}
        />
      </div>
      <div>
        {(postRequest.loading ||
          todoRequest.loading ||
          createNewPost.loading) && <div>loading...</div>}
        {(postRequest.error || todoRequest.error) && (
          <div>
            {postRequest.errorResponse?.message ||
              todoRequest.errorResponse?.message}
          </div>
        )}
        {createNewPost.success && <div>success create new post</div>}

        {postRequest.success &&
          postRequest.data &&
          postRequest.data.map((item) => (
            <div key={item.id}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </div>
          ))}
        {todoRequest.success &&
          todoRequest.data &&
          todoRequest.data.map((item) => (
            <div key={item.id}>
              <h3>{item.title}</h3>
              <p>{item.id.toString()}</p>
            </div>
          ))}
      </div>
    </>
  );
}

export default App;
