export const fetchApi = (Method, url, body, header, res_text = false) => {
    return new Promise((resolve, reject) => {
        let configData = {
            method: Method,
            headers: header,
        };
        if (Method !== "GET") configData.body = JSON.stringify(body)
        fetch(url, configData)
            .then(response => {
                // console.log("fetchApi_response",response);
                if (res_text) return response.text();
                return response.json();
            })
            .then(data => {
                // console.log("fetchApi_data",data);
                resolve(data)
            })
            .catch(error => {
                // console.log("fetchApi_fetchApi",error);
                reject(error)
            })
    })
}