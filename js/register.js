(() => {
	//当前账号是否存在的状态
	let isExists = false;
	function initEvents() {
		userName.addEventListener("blur", checkName);
		formContainer.addEventListener("submit", checkall);
	}

	//用户名失去焦点事件
	const checkName = async () => {
		//获取用户名
		const loginId = userName.value.trim();
		if (!loginId) {
			return;
		}
		const res = await fetchFn({
			url: "/user/exists",
			method: "GET",
			params: { loginId },
		});
		isExists = res;
		// const response = await fetch("https://study.duyiedu.com/api/user/exists", {
		// 	method: "POST",
		// 	headers: {
		// 		"content-Type": "application/json",
		// 	},
		// 	body: JSON.stringify({
		// 		loginId,
		// 	}),
		// });
		// const result = await response.json();
		// isExists = result.data;
		// console.log(isExists);
		// if (result.data) {
		// 	alert(result.msg);
		// 	return;
		// }
	};
	//注册提交事件
	const checkall = async (e) => {
		//阻止默认提交事件
		e.preventDefault();
		//获取数据
		const loginId = userName.value.trim();
		const nickname = userNickname.value.trim();
		const loginPwd = userPassword.value.trim();
		const confirmpwd = userConfirmPassword.value.trim();

		//数据都不为空
		if (checkform(loginId, nickname, loginPwd, confirmpwd)) {
			//调用封装的方法
			const res = await fetchFn({
				url: "/user/reg",
				method: "POST",
				params: { loginId, nickname, loginPwd },
			});
			res && window.location.replace("/");

			// const response = await fetch("https://study.duyiedu.com/api/user/reg", {
			// 	method: "POST",
			// 	headers: {
			// 		"content-Type": "application/json",
			// 	},
			// 	body: JSON.stringify({
			// 		loginId,
			// 		nickname,
			// 		loginPwd,
			// 	}),
			// });
			// const result = await response.json();
			// if (result.code !== 0) {
			// 	alert(result.msg);
			// 	return;
			// }
			// isExists && window.location.replace("/");
		}
	};

	//验证表单函数
	const checkform = (loginId, nickname, loginPwd, confirmpwd) => {
		//判断内容是否为空
		switch (true) {
			case !loginId: {
				alert("用户名不能为空");
				return;
			}
			case !nickname: {
				alert("昵称不能为空");
				return;
			}
			case !loginPwd: {
				alert("密码不能为空");
				return;
			}
			case !confirmpwd: {
				alert("确认密码不能为空");
				return;
			}
			case loginPwd !== confirmpwd: {
				alert("密码和确认密码不一致");
				return;
			}
			case isExists: {
				alert("账户已经注册过，请更换注册名称");
			}
			//都不为空返回true
			default: {
				return true;
			}
		}
	};
	initEvents();
})();
