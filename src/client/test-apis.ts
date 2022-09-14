import axios from "axios";

const url = "http://localhost:3000/dev/graphql";
const headers = {
  "content-type": "application/json",
};
const data = {
  query: `mutation UserAuth($username: String!, $password: String!) { login(username: $username, password: $password) {token} }`,
  variables: {
    username: "sofikul",
    password: "password",
  },
};

axios({
  url,
  method: "POST",
  headers,
  data: data,
})
  .then((response) => console.log(response.data))
  .catch((response) => console.log(response.errors));
