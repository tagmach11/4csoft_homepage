function initChatbot() {
	const chatbotModal = document.getElementById('chatbotModal');
	const chatbotButton = document.getElementById('chatbotButton');
	
	if (!chatbotModal || !chatbotButton) {
		console.warn('Chatbot elements not found');
		return;
	}
	
	const chatbotClose = chatbotModal.querySelector('.chatbot-close');
	const chatbotOverlay = chatbotModal.querySelector('.chatbot-modal-overlay');
	const tabBtns = chatbotModal.querySelectorAll('.tab-btn');
	const mainInquiryBtn = document.getElementById('mainInquiryBtn');
	const emailInquiryBtn = document.getElementById('emailInquiryBtn');
	const phoneInquiryBtn = document.getElementById('phoneInquiryBtn');
	const methodBtns = chatbotModal.querySelectorAll('.method-btn');
	const operatingHoursBtn = chatbotModal.querySelector('.chatbot-operating-hours');
	
	// 운영시간 보기 클릭 이벤트
	if (operatingHoursBtn) {
		operatingHoursBtn.addEventListener('click', function(e) {
			e.preventDefault();
			e.stopPropagation();
			showOperatingHoursInChat();
		});
	}
	
	// 운영시간 대화창에 표시 함수
	function showOperatingHoursInChat() {
		// 대화 탭으로 전환
		const chatTabBtn = chatbotModal.querySelector('[data-tab="chat"]');
		if (chatTabBtn) {
			chatTabBtn.click();
		}
		
		// 약간의 지연 후 운영시간 메시지 추가
		setTimeout(() => {
			const hoursInfo = `🕐 <strong>LX2 상담 운영시간</strong>

<b>평일 (월~금)</b><br>
10:00 ~ 17:00

<b>주말 및 공휴일</b><br>
휴무

📞 <b>긴급 문의 연락처</b><br>
전화: 02-1234-5678<br>
이메일: info@4csoft.com

※ 운영시간 외 문의는 이메일로 남겨주시면<br>
   평일 운영시간 내 답변 드립니다.`;
			
			// 채팅 메시지로 추가
			const chatTab = chatbotModal.querySelector('#chatTab');
			if (chatTab) {
				const chatMessagesContainer = chatTab.querySelector('.chat-messages-container');
				if (chatMessagesContainer) {
					// 운영시간 메시지 추가
					setTimeout(() => {
						addBotMessageWithHTML(hoursInfo);
					}, 300);
				} else {
					// chat-messages-container가 없으면 message-examples에 추가
					const messageExamples = chatTab.querySelector('.message-examples');
					if (messageExamples) {
						const hoursMessage = document.createElement('div');
						hoursMessage.className = 'bot-message-example';
						hoursMessage.innerHTML = `
							<div class="message-avatar">
								<img src="assets/images/clients/챗봇이미지.png" alt="LX2">
							</div>
							<div class="message-bubble">
								${hoursInfo.replace(/\n/g, '<br>')}
							</div>
						`;
						messageExamples.appendChild(hoursMessage);
					}
				}
			}
		}, 100);
	}
	
	// HTML 포함 봇 메시지 추가
	function addBotMessageWithHTML(htmlContent) {
		const chatMessages = document.getElementById('chatMessages');
		if (!chatMessages) {
			// chatMessages가 없으면 chat-messages-container 내의 message-examples에 추가
			const chatTab = chatbotModal.querySelector('#chatTab');
			if (chatTab) {
				const messageExamples = chatTab.querySelector('.message-examples');
				if (messageExamples) {
					const hoursMessage = document.createElement('div');
					hoursMessage.className = 'bot-message-example';
					hoursMessage.innerHTML = `
						<div class="message-avatar">
							<img src="assets/images/clients/챗봇이미지.png" alt="LX2">
						</div>
						<div class="message-bubble">
							${htmlContent.replace(/\n/g, '<br>')}
						</div>
					`;
					messageExamples.appendChild(hoursMessage);
					
					// 스크롤
					const chatContainer = chatTab.querySelector('.chat-messages-container');
					if (chatContainer) {
						chatContainer.scrollTop = chatContainer.scrollHeight;
					}
				}
			}
			return;
		}
		
		const messageDiv = document.createElement('div');
		messageDiv.className = 'message bot-message';
		messageDiv.innerHTML = `
			<div class="message-avatar">
				<img src="assets/images/clients/챗봇이미지.png" alt="LX2">
			</div>
			<div class="message-content">
				<div class="message-bubble">${htmlContent.replace(/\n/g, '<br>')}</div>
				<div class="message-time">방금 전</div>
			</div>
		`;
		chatMessages.appendChild(messageDiv);
		scrollToBottom();
	}
	
	// 챗봇 열기
	chatbotButton.addEventListener('click', function() {
		chatbotModal.classList.add('active');
		document.body.style.overflow = 'hidden';
		// 홈 탭을 기본으로 표시
		switchTab('home');
	});
	
	// 챗봇 닫기
	function closeChatbot() {
		chatbotModal.classList.remove('active');
		document.body.style.overflow = '';
	}
	
	chatbotClose.addEventListener('click', closeChatbot);
	
	// ESC 키로 닫기
	document.addEventListener('keydown', function(e) {
		if (e.key === 'Escape' && chatbotModal.classList.contains('active')) {
			closeChatbot();
		}
	});
	
	// 탭 전환
	tabBtns.forEach(btn => {
		btn.addEventListener('click', function() {
			const tabType = this.getAttribute('data-tab');
			switchTab(tabType);
		});
	});
	
	// 탭 전환 처리
	function switchTab(tabType) {
		// 모든 탭 버튼 비활성화
		tabBtns.forEach(tab => tab.classList.remove('active'));
		
		// 모든 탭 콘텐츠 숨기기
		const allTabs = chatbotModal.querySelectorAll('.chatbot-tab-content');
		allTabs.forEach(tab => {
			tab.classList.remove('active');
			tab.style.display = 'none';
		});
		
		// 선택된 탭 활성화
		const activeTabBtn = chatbotModal.querySelector(`[data-tab="${tabType}"]`);
		const activeTabContent = chatbotModal.querySelector(`#${tabType}Tab`);
		
		if (activeTabBtn) activeTabBtn.classList.add('active');
		if (activeTabContent) {
			activeTabContent.style.display = 'flex';
			// 약간의 지연 후 active 클래스 추가로 부드러운 전환
			setTimeout(() => {
				activeTabContent.classList.add('active');
			}, 10);
			
			// 채팅 탭인 경우 초기 메시지 스크롤
			if (tabType === 'chat') {
				setTimeout(() => {
					const chatContainer = activeTabContent.querySelector('.chat-messages-container');
					if (chatContainer) {
						chatContainer.scrollTop = 0;
					}
				}, 100);
			}
		}
	}
	
	// 대화 탭 콘텐츠
	function showChatContent() {
		let chatContent = chatbotModal.querySelector('.chatbot-chat-content');
		if (!chatContent) {
			chatContent = document.createElement('div');
			chatContent.className = 'chatbot-chat-content';
			chatContent.innerHTML = `
				<div class="chat-messages" id="chatMessages">
					<div class="message bot-message">
						<div class="message-avatar">
							<img src="assets/images/clients/챗봇이미지.png" alt="LX2">
						</div>
						<div class="message-content">
							<div class="message-bubble">
								<p>안녕하세요! LX2 학습관리시스템 상담사입니다. 👋</p>
								<p>무엇을 도와드릴까요?</p>
							</div>
							<div class="message-time">방금 전</div>
						</div>
					</div>
					
					<div class="message bot-message">
						<div class="message-avatar">
							<img src="assets/images/clients/챗봇이미지.png" alt="LX2">
						</div>
						<div class="message-content">
							<div class="message-bubble">
								<p>빠른 문의를 위해 아래 버튼을 선택해주세요:</p>
							</div>
							<div class="message-time">방금 전</div>
						</div>
					</div>
					
					<div class="quick-options">
						<button class="quick-option" data-content="phone">📞 전화 상담</button>
						<button class="quick-option" data-content="trial">🎯 무료 체험</button>
						<button class="quick-option" data-content="about">ℹ️ LX2 소개</button>
						<button class="quick-option" data-content="consulting">💼 무료 컨설팅</button>
						<button class="quick-option" data-content="faq1">📋 소개서/견적서</button>
						<button class="quick-option" data-content="error1">🔧 기술 지원</button>
					</div>
				</div>
			`;
			chatbotModal.querySelector('.chatbot-content').appendChild(chatContent);
			
			// 빠른 옵션 클릭
			const quickOptions = chatContent.querySelectorAll('.quick-option');
			quickOptions.forEach(option => {
				option.addEventListener('click', function() {
					const contentKey = this.getAttribute('data-content');
					showResponse(contentKey);
				});
			});
		}
		chatContent.style.display = 'flex';
	}
	
	// 메시지 전송 함수
	function sendMessage() {
		const chatInput = document.getElementById('chatInput');
		const message = chatInput.value.trim();
		
		if (message) {
			addUserMessage(message);
			chatInput.value = '';
			
			// 봇 응답 시뮬레이션
			setTimeout(() => {
				addBotMessage("죄송합니다. 현재 상담사가 연결 중입니다. 빠른 문의를 위해 아래 버튼을 이용해주세요.");
			}, 1500);
		}
	}
	
	// 사용자 메시지 추가
	function addUserMessage(message) {
		const chatMessages = document.getElementById('chatMessages');
		const messageDiv = document.createElement('div');
		messageDiv.className = 'message user-message';
		messageDiv.innerHTML = `
			<div class="message-content">
				<div class="message-bubble">${message}</div>
				<div class="message-time">방금 전</div>
			</div>
		`;
		chatMessages.appendChild(messageDiv);
		scrollToBottom();
	}
	
	// 봇 메시지 추가
	function addBotMessage(message) {
		const chatMessages = document.getElementById('chatMessages');
		const messageDiv = document.createElement('div');
		messageDiv.className = 'message bot-message';
		messageDiv.innerHTML = `
			<div class="message-avatar">
				<img src="assets/images/clients/챗봇이미지.png" alt="LX2">
			</div>
			<div class="message-content">
				<div class="message-bubble">${message}</div>
				<div class="message-time">방금 전</div>
			</div>
		`;
		chatMessages.appendChild(messageDiv);
		scrollToBottom();
	}
	
	// 채팅 스크롤을 맨 아래로
	function scrollToBottom() {
		const chatMessages = document.getElementById('chatMessages');
		if (chatMessages) {
			chatMessages.scrollTop = chatMessages.scrollHeight;
		}
	}
	
	// 설정 탭 콘텐츠
	function showSettingsContent() {
		let settingsContent = chatbotModal.querySelector('.chatbot-settings-content');
		if (!settingsContent) {
			settingsContent = document.createElement('div');
			settingsContent.className = 'chatbot-settings-content';
			settingsContent.innerHTML = `
				<div class="settings-section">
					<h4>언어 및 번역 설정</h4>
					<div class="setting-item">
						<label>
							<input type="checkbox" checked>
							메시지 자동 번역 기능 지원
						</label>
					</div>
					<div class="setting-item">
						<label>지원 언어</label>
						<div class="language-options">
							<button class="lang-btn active">한국어</button>
							<button class="lang-btn">영어</button>
							<button class="lang-btn">일본어</button>
							<button class="lang-btn">중국어</button>
							<button class="lang-btn">베트남어</button>
						</div>
					</div>
				</div>
			`;
			chatbotModal.querySelector('.chatbot-content').appendChild(settingsContent);
		}
		settingsContent.style.display = 'block';
	}
	
	// 대화창에 사용자 메시지 추가
	function addUserMessageToChat(userMessage) {
		const chatTab = chatbotModal.querySelector('#chatTab');
		if (chatTab) {
			const messageExamples = chatTab.querySelector('.message-examples');
			if (messageExamples) {
				const userMessageDiv = document.createElement('div');
				userMessageDiv.className = 'user-message-example';
				userMessageDiv.style.cssText = 'display: flex; justify-content: flex-end; margin-bottom: 12px;';
				userMessageDiv.innerHTML = `
					<div class="message-bubble" style="background: #007AFF; color: white; padding: 12px 16px; border-radius: 18px; max-width: 70%;">
						${userMessage}
					</div>
				`;
				messageExamples.appendChild(userMessageDiv);
				
				// 스크롤
				const chatContainer = chatTab.querySelector('.chat-messages-container');
				if (chatContainer) {
					chatContainer.scrollTop = chatContainer.scrollHeight;
				}
			}
		}
	}
	
	// 대화창에 봇 메시지 추가
	function addBotMessageToChat(htmlContent) {
		const chatTab = chatbotModal.querySelector('#chatTab');
		if (chatTab) {
			const messageExamples = chatTab.querySelector('.message-examples');
			if (messageExamples) {
				const botMessageDiv = document.createElement('div');
				botMessageDiv.className = 'bot-message-example';
				botMessageDiv.style.cssText = 'display: flex; gap: 8px; margin-bottom: 12px;';
				botMessageDiv.innerHTML = `
					<div class="message-avatar">
						<img src="assets/images/clients/챗봇이미지.png" alt="LX2">
					</div>
					<div class="message-bubble" style="padding: 12px 16px; border-radius: 18px; background: #f2f2f7; max-width: 70%;">
						${htmlContent.replace(/\n/g, '<br>')}
					</div>
				`;
				messageExamples.appendChild(botMessageDiv);
				
				// 스크롤
				const chatContainer = chatTab.querySelector('.chat-messages-container');
				if (chatContainer) {
					chatContainer.scrollTop = chatContainer.scrollHeight;
				}
			}
		}
	}
	
	// 응답 표시
	function showResponse(contentKey, userMessageText) {
		const responses = {
			phone: "전화 상담을 연결해드리겠습니다.<br><br>📞 전화번호: <strong>02-544-2822</strong><br>🕐 운영시간: 10:00 ~ 17:00 (월~금)<br><br>상담원이 직접 연결해드리겠습니다.",
			trial: "무료 체험을 신청해주세요!<br><br>🔗 체험하기 바로가기<br><br>✅ 30일 무료 체험<br>✅ 모든 기능 사용 가능<br>✅ 별도 가입 절차 없음",
			about: "LX2는 AI 기반 맞춤형 학습관리 시스템입니다.<br><br>🎯 주요 특징:<br>• 20년의 검증된 기술력<br>• AI 기반 개인화 학습<br>• 통합 교육 관리 플랫폼<br>• 압도적 가성비",
			consulting: "무료 컨설팅을 신청해주세요!<br><br>📋 컨설팅 내용:<br>• 맞춤형 솔루션 제안<br>• 도입 계획 수립<br>• 비용 산정<br>• 기술 지원 방안<br><br>📞 문의: 02-544-2822<br>📧 이메일: leo4@4csoft.com"
		};
		
		const response = responses[contentKey];
		if (response && userMessageText) {
			// 사용자 메시지 추가
			addUserMessageToChat(userMessageText);
			
			// 약간의 지연 후 봇 응답 추가
			setTimeout(() => {
				addBotMessageToChat(response);
			}, 800);
		}
	}
	
	// 메인 문의하기 버튼
	mainInquiryBtn.addEventListener('click', function() {
		// 대화 탭으로 전환
		switchTab('chat');
		// 약간의 지연 후 환영 메시지 표시
		setTimeout(() => {
			const chatMessagesContainer = document.querySelector('#chatTab .chat-messages-container');
			if (chatMessagesContainer) {
				// 기본 메시지 예시 아래에 환영 메시지 추가
				setTimeout(() => {
					addBotMessageWithHTML('안녕하세요! LX2 학습관리시스템 상담사입니다. 👋<br>무엇을 도와드릴까요?');
				}, 300);
			}
		}, 100);
	});
	
	// 이메일 문의하기 버튼
	if (emailInquiryBtn) {
		emailInquiryBtn.addEventListener('click', function() {
			// 대화 탭으로 전환
			switchTab('chat');
			// 약간의 지연 후 이메일 주소 표시
			setTimeout(() => {
				const chatMessagesContainer = document.querySelector('#chatTab .chat-messages-container');
				if (chatMessagesContainer) {
					setTimeout(() => {
						addBotMessageWithHTML('📧 이메일 주소: <strong>leo4@4csoft.com</strong>');
					}, 300);
				}
			}, 100);
		});
	}
	
	// 전화 문의하기 버튼
	if (phoneInquiryBtn) {
		phoneInquiryBtn.addEventListener('click', function() {
			// 대화 탭으로 전환
			switchTab('chat');
			// 약간의 지연 후 전화번호 표시
			setTimeout(() => {
				const chatMessagesContainer = document.querySelector('#chatTab .chat-messages-container');
				if (chatMessagesContainer) {
					setTimeout(() => {
						addBotMessageWithHTML('📱 전화 번호: <strong>02-544-2822</strong>');
					}, 300);
				}
			}, 100);
		});
	}
	
	// 다른 문의 방법 버튼
	methodBtns.forEach(btn => {
		btn.addEventListener('click', function() {
			const method = this.getAttribute('data-method');
			if (method === 'chat') {
				// 대화 탭으로 전환
				tabBtns[1].click();
			} else if (method === 'phone') {
				switchTab('chat');
				setTimeout(() => {
					showResponse('phone', '전화 상담 연결');
				}, 300);
			}
		});
	});
	
	// 메뉴 카드 클릭 이벤트
	const menuCards = chatbotModal.querySelectorAll('.menu-card');
	menuCards.forEach(card => {
		card.addEventListener('click', function() {
			const contentKey = this.getAttribute('data-content');
			const menuText = this.querySelector('span')?.textContent || '';
			if (contentKey) {
				// 대화 탭으로 전환
				switchTab('chat');
				// 약간의 지연 후 사용자 메시지와 봇 응답 표시
				setTimeout(() => {
					showResponse(contentKey, menuText);
				}, 300);
			}
		});
	});
	
	// 초기 상태: 홈 탭 표시
	switchTab('home');
	
}

// 전역 함수로도 등록 (HTML에서 직접 호출 가능하도록)
function toggleRecommendedMenu(element) {
	const menuCards = element.nextElementSibling;
	if (menuCards && menuCards.classList.contains('menu-cards')) {
		menuCards.classList.toggle('collapsed');
		element.classList.toggle('active');
	}
}
