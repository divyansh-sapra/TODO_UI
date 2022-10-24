import axios from "axios";
import * as constants from "./Constants";

const baseUrl = constants.BASE_URL;
export const fetchData = async (endpoint, body, token) => {
  let data = null;
  let url = baseUrl + endpoint;
  let headers = {
      Authorization: 'Bearer ' + token
    };
  await axios.post(url, body, {headers: headers}).then((res) => {
    data = res.data;
  });
  return data;
};
export const fetchGetData = async (endpoint, body = {}, token) => {
  let data = null;
  let url = baseUrl + endpoint;
  let config = {
    body: body,
    headers: {
      Authorization: 'Bearer ' + token
    }
  }
  await axios
    .get(url, config)
    .then((res) => {
      data = res.data;
    });
  return data;
};
export const navigateTo = (navigation, screenName, route={}) => {
  navigation.navigate(screenName, route);
};
