const baseUrl = "https://study.duyiedu.com/api";

const fetchFn = async ({ url, method = "GET", params = {} }) => {
	let result;
	//权限设置
	let extendsobj = {};
	sessionStorage.token &&
		(extendsobj.authorization = "Bearer " + sessionStorage.token);

	if (method === "GET" && Object.keys(params).length) {
		url +=
			"?" +
			Object.keys(params)
				.map((key) => `${key}=${params[key]}`)
				.join("&");
	}

	try {
		const response = await fetch(baseUrl + url, {
			method,
			headers: { "content-Type": "application/json", ...extendsobj },
			body: method === "GET" ? null : JSON.stringify(params),
		});

		//获取后端的token值
		const token = response.headers.get("authorization");
		token && (sessionStorage.token = token);

		result = await response.json();
		if (result.code === 0) {
			if (result.hasOwnProperty("chatTotal")) {
				return { chatTotal: result.chatTotal, data: result.data };
			}
			//返回状态
			return result.data;
		} else {
			if (result.status === 401) {
				alert("权限token设置错误");
				//删除当前错误的token
				sessionStorage.removeItem("token");
				window.location.replace("login.html");
				return;
			}
			alert(result.msg);
		}
	} catch (error) {
		console.error(error);
	}
};
