(() => {
	//获取元素
	const nickname = document.querySelector(".nick-name");
	const accountname = document.querySelector(".account-name");
	const logintime = document.querySelector(".login-time");
	const contentbody = document.querySelector(".content-body");
	const sendbtn = document.querySelector(".send-btn");
	const inputcontainer = document.querySelector(".input-container");
	const arrowcontainer = document.querySelector(".arrow-container");
	const selectcontainer = document.querySelector(".select-container");
	const selectitems = document.querySelectorAll(".select-item");
	const close = document.querySelector(".close");
	let page = 0;
	const size = 10;
	let chatTotal = 0; //总记录数
	let sendtype = "enter"; //默认发送方式

	//入口函数
	function init() {
		getuserinfo();
		chathistory("bottom");
		initEvent();
	}

	//事件函数入口
	function initEvent() {
		sendbtn.addEventListener("click", sendinfo);
		contentbody.addEventListener("scroll", onscrollload);
		arrowcontainer.addEventListener("click", onarrowcontainer);
		selectitems.forEach((item) => item.addEventListener("click", onitemclick));
		inputcontainer.addEventListener("keyup", oninputcontainerkeyup);
		close.addEventListener("click", onclose);
	}

	//关闭事件
	const onclose = () => {
		//清除sessionStorage中的token值
		sessionStorage.removeItem("token");
		//跳转到登陆界面
		window.location.replace("login.html");
	};

	//监听输入内容
	const oninputcontainerkeyup = (e) => {
		//判断是否满足条件
		if (
			(e.keyCode === 13 && sendtype === "enter" && !e.ctrlKey) ||
			(e.keyCode === 13 && sendtype === "ctrlEnter" && e.ctrlKey)
		) {
			//发送消息
			sendinfo();
		}
	};

	//发送方式绑定事件
	const onitemclick = function () {
		//去除高亮状态
		selectitems.forEach((item) => item.classList.remove("on"));
		this.classList.add("on");
		//为发送方式赋值
		sendtype = this.getAttribute("type");
		console.log(sendtype);
		//收起下拉菜单
		selectcontainer.style.display = "none";
	};

	//下拉箭头绑定点击事件
	const onarrowcontainer = () => {
		selectcontainer.style.display = "block";
	};

	//发送事件函数
	const sendinfo = async () => {
		const content = inputcontainer.value;
		//判断输入内容是否为空
		if (!content) {
			alert("发送消息不能为空");
			return;
		}
		//插入消息
		chatreflow([{ from: "user", content }], "bottom");
		inputcontainer.value = "";
		//电脑回复
		const res = await fetchFn({
			url: "/chat",
			method: "POST",
			params: { content },
		});
		//插入电脑回复消息
		chatreflow([{ from: "robot", content: res.content }], "bottom");
	};

	//向上滚动加载信息
	const onscrollload = function () {
		//判断到达临界值
		if (this.scrollTop === 0) {
			if (chatTotal <= (page + 1) * size) {
				return;
			}
			page++;
			chathistory("top");
		}
	};

	//获取用户数据
	const getuserinfo = async () => {
		const res = await fetchFn({ url: "/user/profile" });

		nickname.innerHTML = res.nickname;
		accountname.innerHTML = res.loginId;
		logintime.innerHTML = formaDate(res.lastLoginTime);
	};

	//渲染聊天记录
	const chathistory = async (direction) => {
		const res = await fetchFn({
			url: "/chat/history",
			params: { page, size },
		});
		//获取聊天总记录数
		chatTotal = res.chatTotal;
		//渲染数据
		chatreflow(res.data, direction);
	};

	//渲染数据函数
	const chatreflow = (list, direction) => {
		//没有聊天记录初始化
		if (!list.length) {
			contentbody.innerHTML = `
            <div class="chat-container robot-container">
							<img src="./img/robot.jpg" alt="" />
							<div class="chat-txt">
								您好！我是腾讯机器人，非常欢迎您的到来，有什么想和我聊聊的吗？
							</div>
            `;
			return;
		}
		//调整聊天记录的顺序
		list.reverse();
		//有聊天记录渲染数据
		const info = list.map((item) =>
			item.from === "robot"
				? `
                     <div class="chat-container robot-container">
                        <img src="./img/robot.jpg" alt="" />
                        <div class="chat-txt">${item.content}</div>
                    </div>
                `
				: `<div class="chat-container avatar-container">
                     <img src="./img/avtar.png" alt="" />
                     <div class="chat-txt"> ${item.content}</div>
                 </div>`
		);
		//判断当前为加载历史记录还是插入记录
		if (direction === "bottom") {
			contentbody.innerHTML += info.join("");
			//将滚动条移动最后
			const lastinfo =
				document.querySelectorAll(".chat-container")[
					document.querySelectorAll(".chat-container").length - 1
				];
			contentbody.scrollTop = lastinfo.offsetTop;
		} else {
			contentbody.innerHTML = info.join("") + contentbody.innerHTML;
		}
	};
	init();
})();
