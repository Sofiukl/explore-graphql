import { RESTDataSource } from "apollo-datasource-rest";
import axios from "axios";

class TodoAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "http://localhost:5000";
  }
  public async getTasks() {
    const url = `${this.baseURL}/list`;
    console.log(`@todoAPI: calling ${url}`);

    const resp = await axios.get(url, {
      headers: {
        Accept: "application/json",
      },
    });
    return resp.data;
  }
}

export default new TodoAPI();
