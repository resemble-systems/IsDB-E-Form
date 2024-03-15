import { WebPartContext } from "@microsoft/sp-webpart-base";
import {
  SPHttpClient,
  SPHttpClientResponse,
  ISPHttpClientOptions,
} from "@microsoft/sp-http";

const handleResponse = async (response: SPHttpClientResponse) => {
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return await response.json();
};

const handleFetchError = (error: any) => {
  console.error("Request error:", error);
  return undefined;
};

const getData = async (
  context: WebPartContext,
  apiUrl: string
): Promise<any> => {
  try {
    const response = await context.spHttpClient.get(
      apiUrl,
      SPHttpClient.configurations.v1
    );
    return handleResponse(response);
  } catch (error) {
    handleFetchError(error);
  }
};

const postData = async (
  context: WebPartContext,
  apiUrl: string,
  headers: any,
  postBody: string
): Promise<any> => {
  const options: ISPHttpClientOptions = {
    headers,
    body: postBody,
  };
  try {
    const response = await context.spHttpClient.post(
      apiUrl,
      SPHttpClient.configurations.v1,
      options
    );
    if (response.ok) {
      return true;
    }
  } catch (error) {
    handleFetchError(error);
  }
};

const approvalFilter = (dataArray: any[], dataKey: string) => {
  if (dataArray) {
    const approvedItems = dataArray.filter(
      (data) => data[dataKey] === "Approved"
    );
    return approvedItems;
  } else return [];
};

const sortAscendingDate = (dataArray: any[], sortingKey: string) => {
  if (dataArray) {
    const sortedArray = dataArray.sort((a: any, b: any) => {
      const dateA = new Date(a[sortingKey]).getTime();
      const dateB = new Date(b[sortingKey]).getTime();
      console.log("SORT DATE", dateA, dateB, a[sortingKey], b[sortingKey]);

      if (!isNaN(dateA) && !isNaN(dateB)) return dateA - dateB;
      else return 0;
    });
    return sortedArray;
  } else return [];
};

const sortDecendingDate = (dataArray: any[], sortingKey: string) => {
  if (dataArray) {
    const sortedArray = dataArray.sort((a: any, b: any) => {
      const dateA = new Date(a[sortingKey]).getTime();
      const dateB = new Date(b[sortingKey]).getTime();
      console.log("SORT DATE", dateA, dateB);

      if (!isNaN(dateA) && !isNaN(dateB)) return dateB - dateA;
      else return 0;
    });
    return sortedArray;
  } else return [];
};

const sortAscendingAlphabetically = (dataArray: any[], sortingKey: string) => {
  if (dataArray) {
    const sortedArray = dataArray.slice().sort((a: any, b: any) => {
      const itemA = a[sortingKey].toLowerCase();
      const itemB = b[sortingKey].toLowerCase();

      if (itemA < itemB) return -1;
      if (itemA > itemB) return 1;
      return 0;
    });
    return sortedArray;
  } else return [];
};

const sortDescendingAlphabetically = (dataArray: any[], sortingKey: string) => {
  if (dataArray) {
    const sortedArray = dataArray.slice().sort((a: any, b: any) => {
      const itemA = a[sortingKey].toLowerCase();
      const itemB = b[sortingKey].toLowerCase();

      if (itemA > itemB) return -1;
      if (itemA < itemB) return 1;
      return 0;
    });
    return sortedArray;
  } else return [];
};

const bootstarp5CSS =
  "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css";
const fontAwesome =
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css";
const Montserrat =
  "https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&family=Open+Sans:wght@600&display=swap";
const Roboto =
  "https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap";

export {
  getData,
  postData,
  approvalFilter,
  sortAscendingDate,
  sortDecendingDate,
  sortAscendingAlphabetically,
  sortDescendingAlphabetically,
  bootstarp5CSS,
  fontAwesome,
  Montserrat,
  Roboto,
};