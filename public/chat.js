window.onload = function () {
	var socket = io.connect();
	socket.on('connect', function () {
		// 通过join事件发送昵称
		socket.emit('join', prompt('输入你的昵称'));

		// 显示聊天窗口
		document.getElementById('chat').style.display = 'block';

		socket.on('announcement', function (msg) {
			document.getElementById('messages').appendChild(showTip(msg));
		});
	});

	var input = document.getElementById('input');
	document.getElementById('form').onsubmit = function () {
		// 将发送出去的消息显示出来
		var li = addMessage('me', input.value);
		// 发给服务端
		socket.emit('text', input.value, function (date) {
			// 回调函数里确认消息已被服务器接收
			li.className += ' confirmed';
			li.appendChild(successIcon());
			li.appendChild(showTime(date));
		});

		// 重置输入框
		input.value = '';
		input.focus();

		return false;
	};

	// 响应服务端发过来的 text 事件
	socket.on('text', addMessage);
};

function showTip(msg) {
	var li = document.createElement('li');
	li.className = 'tip-row';

	var tip = document.createElement('span');
	tip.className = 'tip';
	tip.innerHTML = msg;

	li.appendChild(tip);
	return li;
}

function addMessage(from, text) {
	var li = document.createElement('li');
	li.className = 'message';
	li.innerHTML = '<span class="user">' + from + '</span>' + text;

	var messages = document.getElementById('messages');
	messages.appendChild(li);
	// 滚动到底部
	if (messages.scrollHeight > messages.clientHeight)
		messages.scrollTo(0, messages.scrollHeight);
	return li;
}

function successIcon() {
	var img = document.createElement('img');
	img.src = '/success.png';
	img.className = 'icon';
	return img;
}

function showTime(timestamp) {
	var date = new Date(timestamp);
	var h = date.getHours();
	var m = date.getMinutes();
	var s = date.getSeconds();

	var elem = document.createElement('div');
	elem.className = 'time';
	elem.innerHTML = '(' + h + ':' + m + ':' + s + ')';
	return elem;
}
