(() => {
	formContainer.addEventListener("submit", async (e) => {
		//阻止默认跳转事件
		e.preventDefault();
		//获取用户输入的账号密码
		const loginId = userName.value.trim();
		const loginPwd = userPassword.value.trim();
		//判断输入的用户名或密码是否为空
		if (!loginId || !loginPwd) {
			alert("用户名或密码为空");
			return;
		}
		//验证账号密码是否存在
		const res = await fetchFn({
			url: "/user/login",
			method: "POST",
			params: {
				loginId,
				loginPwd,
			},
		});
		//账户密码则跳转到相应地网页
		// window.location.replace("/");
		res && window.location.replace("index.html");
	});
})();
