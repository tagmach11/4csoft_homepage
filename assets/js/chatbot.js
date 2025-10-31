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
	
	// 대화창에 폼 추가
	function addFormToChat() {
		const chatTab = chatbotModal.querySelector('#chatTab');
		if (chatTab) {
			const messageExamples = chatTab.querySelector('.message-examples');
			if (messageExamples) {
				// 기존 폼이 있으면 제거
				const existingForm = messageExamples.querySelector('.chat-inquiry-form');
				if (existingForm) {
					existingForm.remove();
				}
				
				const formDiv = document.createElement('div');
				formDiv.className = 'bot-message-example chat-inquiry-form';
				formDiv.style.cssText = 'display: flex; gap: 8px; margin-bottom: 12px;';
				formDiv.innerHTML = `
					<div class="message-avatar">
						<img src="assets/images/clients/챗봇이미지.png" alt="LX2">
					</div>
					<div class="message-bubble" style="padding: 0; border-radius: 18px; background: #f2f2f7; max-width: 85%; width: 100%;">
						<div style="padding: 16px;">
							<h3 style="margin: 0 0 16px 0; font-size: 1.1rem; font-weight: 600;">무료 컨설팅 신청</h3>
							<form class="inquiry-form" id="chatInquiryForm" style="margin: 0;">
								<div class="inquiry-form-group" style="margin-bottom: 16px;">
									<label class="inquiry-form-label" for="chat-inquiry-name" style="display: block; margin-bottom: 6px; font-size: 0.9rem; font-weight: 500;">이름 <span style="color:#dc3545">*</span></label>
									<input class="inquiry-form-input" id="chat-inquiry-name" name="name" type="text" placeholder="이름을 입력해주세요" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 0.9rem;">
									<div class="inquiry-form-error" id="chat-inquiry-nameError" style="color: #dc3545; font-size: 0.8rem; margin-top: 4px;"></div>
								</div>
								<div class="inquiry-form-group" style="margin-bottom: 16px;">
									<label class="inquiry-form-label" for="chat-inquiry-email" style="display: block; margin-bottom: 6px; font-size: 0.9rem; font-weight: 500;">이메일 <span style="color:#dc3545">*</span></label>
									<input class="inquiry-form-input" id="chat-inquiry-email" name="email" type="email" placeholder="이메일을 입력해주세요" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 0.9rem;">
									<div class="inquiry-form-error" id="chat-inquiry-emailError" style="color: #dc3545; font-size: 0.8rem; margin-top: 4px;"></div>
								</div>
								<div class="inquiry-form-group" style="margin-bottom: 16px;">
									<label class="inquiry-form-label" for="chat-inquiry-phone" style="display: block; margin-bottom: 6px; font-size: 0.9rem; font-weight: 500;">연락처 <span style="color:#dc3545">*</span></label>
									<input class="inquiry-form-input" id="chat-inquiry-phone" name="phone" type="tel" placeholder="예: 010-1234-5678" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 0.9rem;">
									<div class="inquiry-form-error" id="chat-inquiry-phoneError" style="color: #dc3545; font-size: 0.8rem; margin-top: 4px;"></div>
								</div>
								<div class="inquiry-form-group" style="margin-bottom: 16px;">
									<label class="inquiry-form-label" for="chat-inquiry-message" style="display: block; margin-bottom: 6px; font-size: 0.9rem; font-weight: 500;">문의내용 <span style="color:#dc3545">*</span></label>
									<textarea class="inquiry-form-textarea" id="chat-inquiry-message" name="message" placeholder="내용을 입력해주세요." required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 0.9rem; min-height: 80px; resize: vertical; font-family: inherit;"></textarea>
									<div class="inquiry-form-error" id="chat-inquiry-messageError" style="color: #dc3545; font-size: 0.8rem; margin-top: 4px;"></div>
								</div>
								<div class="inquiry-form-privacy" style="margin-bottom: 16px;">
									<label style="display:flex; gap:8px; align-items:flex-start; font-size:0.85rem;">
										<input type="checkbox" id="chat-inquiry-privacyAgree" style="margin-top:2px;" required>
										<span>개인정보 수집ㆍ이용에 동의합니다.</span>
									</label>
									<div class="inquiry-form-error" id="chat-inquiry-privacyError" style="color: #dc3545; font-size: 0.8rem; margin-top: 4px;"></div>
								</div>
								<div class="inquiry-form-actions" style="display: flex; gap: 8px; margin-top: 16px;">
									<button type="submit" class="inquiry-btn-primary" style="flex: 1; padding: 10px; background: #007AFF; color: white; border: none; border-radius: 8px; font-size: 0.9rem; font-weight: 600; cursor: pointer;">신청하기</button>
								</div>
							</form>
						</div>
					</div>
				`;
				messageExamples.appendChild(formDiv);
				
				// 폼 이벤트 리스너 추가
				setupChatInquiryForm();
				
				// 스크롤
				const chatContainer = chatTab.querySelector('.chat-messages-container');
				if (chatContainer) {
					chatContainer.scrollTop = chatContainer.scrollHeight;
				}
			}
		}
	}
	
	// 대화창 폼 설정
	function setupChatInquiryForm() {
		const chatForm = document.getElementById('chatInquiryForm');
		if (!chatForm) return;
		
		// 이미 이벤트 리스너가 추가되었는지 확인
		if (chatForm.dataset.listenerAdded === 'true') return;
		chatForm.dataset.listenerAdded = 'true';
		
		chatForm.addEventListener('submit', function(e) {
			e.preventDefault();
			
			// 에러 메시지 초기화
			const errorElements = chatForm.querySelectorAll('.inquiry-form-error');
			errorElements.forEach(el => el.textContent = '');
			
			// 값 가져오기
			const name = document.getElementById('chat-inquiry-name').value.trim();
			const email = document.getElementById('chat-inquiry-email').value.trim();
			const phone = document.getElementById('chat-inquiry-phone').value.trim();
			const message = document.getElementById('chat-inquiry-message').value.trim();
			const privacyAgree = document.getElementById('chat-inquiry-privacyAgree').checked;
			
			let isValid = true;
			
			// 이름 검증
			if (!name) {
				document.getElementById('chat-inquiry-nameError').textContent = '이름을 입력해주세요.';
				isValid = false;
			}
			
			// 이메일 검증
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!email) {
				document.getElementById('chat-inquiry-emailError').textContent = '이메일을 입력해주세요.';
				isValid = false;
			} else if (!emailRegex.test(email)) {
				document.getElementById('chat-inquiry-emailError').textContent = '올바른 이메일 형식이 아닙니다.';
				isValid = false;
			}
			
			// 전화번호 검증
			const phoneRegex = /^[0-9-]+$/;
			if (!phone) {
				document.getElementById('chat-inquiry-phoneError').textContent = '연락처를 입력해주세요.';
				isValid = false;
			} else if (!phoneRegex.test(phone)) {
				document.getElementById('chat-inquiry-phoneError').textContent = '올바른 전화번호 형식이 아닙니다.';
				isValid = false;
			}
			
			// 문의내용 검증
			if (!message) {
				document.getElementById('chat-inquiry-messageError').textContent = '문의내용을 입력해주세요.';
				isValid = false;
			}
			
			// 개인정보 동의 검증
			if (!privacyAgree) {
				document.getElementById('chat-inquiry-privacyError').textContent = '개인정보 수집ㆍ이용에 동의해주세요.';
				isValid = false;
			}
			
			if (isValid) {
				// 폼 제출 성공 메시지
				addBotMessageToChat('신청이 완료되었습니다!<br>빠른 시일 내에 연락드리겠습니다. 😊');
				
				// 폼 리셋
				chatForm.reset();
				
				// 폼 제거 (선택사항)
				const formDiv = chatForm.closest('.chat-inquiry-form');
				if (formDiv) {
					setTimeout(() => {
						formDiv.style.opacity = '0.5';
					}, 500);
				}
			}
		});
	}
	
	// 도입 문의 폼 모달 열기
	function openInquiryFormModal() {
		const modal = document.getElementById('inquiryFormModal');
		if (modal) {
			modal.classList.add('active');
			document.body.style.overflow = 'hidden';
		} else {
			console.warn('inquiryFormModal not found');
		}
	}
	
	// 도입 문의 폼 모달 닫기
	function closeInquiryFormModal() {
		const modal = document.getElementById('inquiryFormModal');
		if (modal) {
			modal.classList.remove('active');
			document.body.style.overflow = '';
			// 폼 리셋
			const form = document.getElementById('inquiryForm');
			if (form) {
				form.reset();
				// 에러 메시지 숨기기
				const errors = form.querySelectorAll('.inquiry-form-error');
				errors.forEach(err => {
					err.textContent = '';
					err.style.display = 'none';
				});
			}
		}
	}
	
	// 응답 표시
	function showResponse(contentKey, userMessageText) {
		const responses = {
			phone: "전화 상담을 연결해드리겠습니다.<br><br>📞 전화번호: <strong>02-544-2822</strong><br>🕐 운영시간: 10:00 ~ 17:00 (월~금)<br><br>상담원이 직접 연결해드리겠습니다.",
			trial: "무료 체험을 신청해주세요!<br><br>🔗 체험하기 바로가기<br><br>✅ 30일 무료 체험<br>✅ 모든 기능 사용 가능<br>✅ 별도 가입 절차 없음",
			about: "LX2는 AI 기반 맞춤형 학습관리 시스템입니다.<br><br>🎯 주요 특징:<br>• 20년의 검증된 기술력<br>• AI 기반 개인화 학습<br>• 통합 교육 관리 플랫폼<br>• 압도적 가성비",
			consulting: "무료 컨설팅 신청 폼을 준비해드리겠습니다."
		};
		
		// consulting인 경우 대화창으로 전환하고 폼 표시
		if (contentKey === 'consulting') {
			// 대화 탭으로 전환
			switchTab('chat');
			
			if (userMessageText) {
				addUserMessageToChat(userMessageText);
				setTimeout(() => {
					addBotMessageToChat(responses[contentKey]);
					setTimeout(() => {
						addFormToChat();
					}, 500);
				}, 800);
			} else {
				// 바로 폼 표시
				setTimeout(() => {
					addBotMessageToChat(responses[contentKey]);
					setTimeout(() => {
						addFormToChat();
					}, 500);
				}, 300);
			}
		} else {
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
	
	// 도입 문의 폼 모달 생성 (없으면 생성)
	let inquiryFormModal = document.getElementById('inquiryFormModal');
	if (!inquiryFormModal) {
		const modalHTML = `
			<div id="inquiryFormModal" class="inquiry-form-modal">
				<div class="inquiry-form-overlay"></div>
				<div class="inquiry-form-content">
					<div class="inquiry-form-header">
						<h3>무료 컨설팅 신청</h3>
						<button class="inquiry-form-close" aria-label="닫기">×</button>
					</div>
					<form class="inquiry-form" id="inquiryForm">
						<div class="inquiry-form-group">
							<label class="inquiry-form-label" for="inquiry-name">이름 <span style="color:#dc3545">*</span></label>
							<input class="inquiry-form-input" id="inquiry-name" name="name" type="text" placeholder="이름을 입력해주세요" required>
							<div class="inquiry-form-error" id="inquiry-nameError"></div>
						</div>
						<div class="inquiry-form-group">
							<label class="inquiry-form-label" for="inquiry-email">이메일 <span style="color:#dc3545">*</span></label>
							<input class="inquiry-form-input" id="inquiry-email" name="email" type="email" placeholder="이메일을 입력해주세요" required>
							<div class="inquiry-form-error" id="inquiry-emailError"></div>
						</div>
						<div class="inquiry-form-group">
							<label class="inquiry-form-label" for="inquiry-phone">연락처 <span style="color:#dc3545">*</span></label>
							<input class="inquiry-form-input" id="inquiry-phone" name="phone" type="tel" placeholder="예: 010-1234-5678" required>
							<div class="inquiry-form-error" id="inquiry-phoneError"></div>
						</div>
						<div class="inquiry-form-group">
							<label class="inquiry-form-label" for="inquiry-message">문의내용 <span style="color:#dc3545">*</span></label>
							<textarea class="inquiry-form-textarea" id="inquiry-message" name="message" placeholder="내용을 입력해주세요." required></textarea>
							<div class="inquiry-form-error" id="inquiry-messageError"></div>
						</div>
						<div class="inquiry-form-privacy">
							<label style="display:flex; gap:8px; align-items:flex-start; font-size:0.85rem;">
								<input type="checkbox" id="inquiry-privacyAgree" style="margin-top:2px;" required>
								<span>개인정보 수집ㆍ이용에 동의합니다.</span>
							</label>
							<div class="inquiry-form-error" id="inquiry-privacyError"></div>
						</div>
						<div class="inquiry-form-actions">
							<button type="button" class="inquiry-btn-secondary" id="inquiryFormCancel">취소</button>
							<button type="submit" class="inquiry-btn-primary">신청하기</button>
						</div>
					</form>
				</div>
			</div>
		`;
		document.body.insertAdjacentHTML('beforeend', modalHTML);
		inquiryFormModal = document.getElementById('inquiryFormModal');
	}
	
	const inquiryFormClose = inquiryFormModal.querySelector('.inquiry-form-close');
	const inquiryFormOverlay = inquiryFormModal.querySelector('.inquiry-form-overlay');
	const inquiryFormCancel = document.getElementById('inquiryFormCancel');
	const inquiryForm = document.getElementById('inquiryForm');
	
	if (inquiryFormClose) {
		inquiryFormClose.addEventListener('click', closeInquiryFormModal);
	}
	
	if (inquiryFormOverlay) {
		inquiryFormOverlay.addEventListener('click', closeInquiryFormModal);
	}
	
	if (inquiryFormCancel) {
		inquiryFormCancel.addEventListener('click', closeInquiryFormModal);
	}
	
	// ESC 키로 모달 닫기
	document.addEventListener('keydown', function(e) {
		if (e.key === 'Escape' && inquiryFormModal?.classList.contains('active')) {
			closeInquiryFormModal();
		}
	});
	
	// 폼 제출 처리
	if (inquiryForm) {
		inquiryForm.addEventListener('submit', function(e) {
			e.preventDefault();
			let ok = true;
			
			function showError(id, msg) {
				const el = document.getElementById(id);
				if (el) {
					el.textContent = msg;
					el.style.display = 'block';
				}
			}
			
			function hideError(id) {
				const el = document.getElementById(id);
				if (el) {
					el.style.display = 'none';
				}
			}
			
			const name = document.getElementById('inquiry-name').value.trim();
			if (!name) {
				showError('inquiry-nameError', '이름을 입력해주세요.');
				ok = false;
			} else {
				hideError('inquiry-nameError');
			}
			
			const email = document.getElementById('inquiry-email').value.trim();
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!email || !emailRegex.test(email)) {
				showError('inquiry-emailError', '올바른 이메일 주소를 입력해주세요.');
				ok = false;
			} else {
				hideError('inquiry-emailError');
			}
			
			const phone = document.getElementById('inquiry-phone').value.trim();
			const phoneRegex = /^01[0-9]-\d{3,4}-\d{4}$/;
			if (!phone || !phoneRegex.test(phone)) {
				showError('inquiry-phoneError', '올바른 연락처를 입력해주세요. (예: 010-1234-5678)');
				ok = false;
			} else {
				hideError('inquiry-phoneError');
			}
			
			const message = document.getElementById('inquiry-message').value.trim();
			if (!message) {
				showError('inquiry-messageError', '문의내용을 입력해주세요.');
				ok = false;
			} else {
				hideError('inquiry-messageError');
			}
			
			const agree = document.getElementById('inquiry-privacyAgree').checked;
			if (!agree) {
				showError('inquiry-privacyError', '개인정보 수집 이용에 동의해주세요.');
				ok = false;
			} else {
				hideError('inquiry-privacyError');
			}
			
			if (ok) {
				alert('문의가 접수되었습니다. 빠르게 연락드리겠습니다.');
				closeInquiryFormModal();
			}
		});
		
		// 전화 입력 자동 하이픈
		const phoneInput = document.getElementById('inquiry-phone');
		if (phoneInput) {
			phoneInput.addEventListener('input', function(e) {
				let v = e.target.value.replace(/\D/g, '');
				if (v.length >= 4 && v.length < 8) {
					v = v.slice(0, 3) + '-' + v.slice(3);
				} else if (v.length >= 8) {
					v = v.slice(0, 3) + '-' + v.slice(3, 7) + '-' + v.slice(7, 11);
				}
				e.target.value = v;
			});
		}
	}
	
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
