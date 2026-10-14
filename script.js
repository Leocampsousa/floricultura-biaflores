/**
 * Floricultura Bia Presentes
 * Lógica do site, chatbot interativo e integração direta com WhatsApp
 */

document.addEventListener('DOMContentLoaded', () => {
  const WHATSAPP_NUMBER = '5519989155900';
  const WHATSAPP_DISPLAY = '(19) 98915-5900';

  // ==========================================
  // 1. CHATBOT INTERATIVO
  // ==========================================
  const chatToggleBtn = document.getElementById('chatToggleBtn');
  const chatbotModal = document.getElementById('chatbotModal');
  const chatCloseBtn = document.getElementById('chatCloseBtn');
  const chatMessages = document.getElementById('chatMessages');
  const chatInput = document.getElementById('chatInput');
  const chatSendBtn = document.getElementById('chatSendBtn');

  // Estado da conversa guiada
  let chatState = {
    step: 'inicio',
    tipoProduto: '',
    detalhes: '',
    cidade: ''
  };

  // Abre/fecha chatbot
  if (chatToggleBtn && chatbotModal) {
    chatToggleBtn.addEventListener('click', () => {
      chatbotModal.classList.toggle('ativo');
      if (chatbotModal.classList.contains('ativo')) {
        chatInput.focus();
        scrollToBottom();
      }
    });

    chatCloseBtn.addEventListener('click', () => {
      chatbotModal.classList.remove('ativo');
    });
  }

  function scrollToBottom() {
    setTimeout(() => {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 100);
  }

  function addBotMessage(text, options = []) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'msg msg-bot';
    msgDiv.innerHTML = text;

    if (options.length > 0) {
      const optsContainer = document.createElement('div');
      optsContainer.className = 'chatbot-quick-options';

      options.forEach(opt => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'quick-btn';
        btn.textContent = opt.label;
        btn.addEventListener('click', () => {
          handleOptionClick(opt);
        });
        optsContainer.appendChild(btn);
      });

      msgDiv.appendChild(optsContainer);
    }

    chatMessages.appendChild(msgDiv);
    scrollToBottom();
  }

  function addUserMessage(text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'msg msg-user';
    msgDiv.textContent = text;
    chatMessages.appendChild(msgDiv);
    scrollToBottom();
  }

  function handleOptionClick(opt) {
    addUserMessage(opt.label);

    if (opt.action === 'buque_rosas') {
      chatState.tipoProduto = 'Buquê de Rosas';
      setTimeout(() => {
        addBotMessage(
          'Ótima escolha! Nossos buquês de rosas são montados na hora com flores frescas selecionadas. 🌹<br><br>Qual estilo ou cor você prefere?',
          [
            { label: '🌹 Rosas Vermelhas Clássicas', action: 'cor_vermelha' },
            { label: '🌸 Rosas Rosa / Tons Pastel', action: 'cor_rosa' },
            { label: '🤍 Rosas Brancas Elegance', action: 'cor_branca' },
            { label: '🍫 Buquê de Rosas com Chocolates', action: 'com_chocolate' }
          ]
        );
      }, 500);
    } else if (opt.action.startsWith('cor_') || opt.action === 'com_chocolate') {
      chatState.detalhes = opt.label;
      setTimeout(() => {
        addBotMessage(
          'Perfeito! E onde você gostaria que fizéssemos a entrega?',
          [
            { label: '📍 Hortolândia', action: 'cidade_hortolandia' },
            { label: '📍 Monte Mor', action: 'cidade_montemor' },
            { label: '📍 Outra cidade da região', action: 'cidade_regiao' },
            { label: '🏪 Retirar na loja', action: 'retirar_loja' }
          ]
        );
      }, 500);
    } else if (opt.action.startsWith('cidade_') || opt.action === 'retirar_loja') {
      chatState.cidade = opt.label.replace('📍 ', '').replace('🏪 ', '');
      const textoFinal = `Olá! Vim pelo site da Floricultura Bia Presentes e gostaria de encomendar:\n\n🌹 *Item:* ${chatState.tipoProduto || 'Flores'}\n🎨 *Estilo:* ${chatState.detalhes || 'A combinar'}\n📍 *Entrega:* ${chatState.cidade}\n\nPoderia me passar os valores e disponibilidade?`;
      const urlZap = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(textoFinal)}`;

      setTimeout(() => {
        addBotMessage(
          `Maravilha! Já organizei tudo para o seu atendimento. Clique no botão abaixo para concluir seu pedido diretamente com nossa equipe no WhatsApp: <br><br><a href="${urlZap}" target="_blank" class="botao botao--compacto" style="width:100%;margin-top:8px;">Continuar no WhatsApp 📲</a>`
        );
      }, 500);
    } else if (opt.action === 'cesta_presente') {
      chatState.tipoProduto = 'Cesta de Presente';
      setTimeout(() => {
        addBotMessage(
          'Nossas cestas de presente são super caprichadas, repletas de chocolates, guloseimas ou pelúcias! 🧺<br><br>Gostaria de personalizar pelo WhatsApp agora mesmo?',
          [
            { label: 'Sim, montar cesta no WhatsApp 📲', action: 'ir_zap_cesta' },
            { label: 'Ver opções de buquês 🌹', action: 'buque_rosas' }
          ]
        );
      }, 500);
    } else if (opt.action === 'ir_zap_cesta') {
      const msg = `Olá! Quero montar uma cesta de presente personalizada na Floricultura Bia Presentes. Como funciona?`;
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
    } else if (opt.action === 'noiva') {
      const msg = `Olá! Gostaria de informações sobre Buquê de Noiva para casamento com a Floricultura Bia Presentes.`;
      setTimeout(() => {
        addBotMessage(
          `Que momento especial! 👰💐 Fazemos buquês de noiva exclusivos para cerimônias inesquecíveis.<br><br><a href="https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}" target="_blank" class="botao botao--compacto" style="width:100%;margin-top:8px;">Falar com a Florista no WhatsApp 📲</a>`
        );
      }, 500);
    } else if (opt.action === 'localizacao') {
      setTimeout(() => {
        addBotMessage(
          `📍 <strong>Onde estamos e onde entregamos:</strong><br><br>Atendemos <strong>Hortolândia, Monte Mor e toda a região</strong> com entregas rápidas!<br><br>Quer calcular a taxa de entrega para o seu bairro?`,
          [
            { label: 'Calcular entrega no WhatsApp 🛵', action: 'ir_zap_entrega' },
            { label: 'Ver buquês de rosas 🌹', action: 'buque_rosas' }
          ]
        );
      }, 500);
    } else if (opt.action === 'ir_zap_entrega') {
      const msg = `Olá! Gostaria de saber sobre a entrega para o meu endereço em Hortolândia/região.`;
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
    } else if (opt.action === 'falar_zap') {
      const msg = `Olá! Gostaria de atendimento com a Floricultura Bia Presentes.`;
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
    }
  }

  // Botões rápidos iniciais (definidos no HTML)
  document.querySelectorAll('.quick-btn[data-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      handleOptionClick({ label: btn.textContent.trim(), action: btn.dataset.action });
    });
  });

  // Envio de mensagem pelo input de texto livre
  function processUserTextInput() {
    const text = chatInput.value.trim();
    if (!text) return;

    addUserMessage(text);
    chatInput.value = '';

    const lower = text.toLowerCase();
    setTimeout(() => {
      if (lower.includes('rosa') || lower.includes('buque') || lower.includes('buquê') || lower.includes('flor')) {
        addBotMessage(
          'Temos lindas opções de buquês de rosas frescas (vermelhas, cor-de-rosa, brancas e com chocolates)! 🌹<br>Gostaria de ver as opções e encomendar?',
          [
            { label: '🌹 Ver Buquês de Rosas', action: 'buque_rosas' },
            { label: '📲 Pedir agora no WhatsApp', action: 'falar_zap' }
          ]
        );
      } else if (lower.includes('cesta') || lower.includes('chocolate') || lower.includes('pelúcia') || lower.includes('pelucia')) {
        addBotMessage(
          'Trabalhamos com cestas de presentes recheadas, caixas com bombons finos e pelúcias fofas! 🍫🧸 Deseja encomendar uma?',
          [
            { label: '🧺 Montar Cesta no WhatsApp', action: 'ir_zap_cesta' },
            { label: 'Ver Buquês', action: 'buque_rosas' }
          ]
        );
      } else if (lower.includes('onde') || lower.includes('endereço') || lower.includes('endereco') || lower.includes('hortolandia') || lower.includes('monte mor') || lower.includes('entrega')) {
        addBotMessage(
          'Fazemos entregas em toda <strong>Hortolândia, Monte Mor e região</strong> com total cuidado! 🛵<br>Deseja informar seu CEP ou bairro para combinarmos?',
          [
            { label: '🛵 Falar entrega no WhatsApp', action: 'ir_zap_entrega' },
            { label: '🌹 Escolher Buquê', action: 'buque_rosas' }
          ]
        );
      } else {
        const zapLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Olá! Vim pelo site da Floricultura Bia Presentes: ' + text)}`;
        addBotMessage(
          `Entendi perfeitamente! Para te passar os detalhes com fotos e valores atualizados em tempo real, nossa florista está disponível no WhatsApp agora mesmo:<br><br><a href="${zapLink}" target="_blank" class="botao botao--compacto" style="width:100%;margin-top:6px;">Continuar no WhatsApp com minha dúvida 📲</a>`
        );
      }
    }, 600);
  }

  if (chatSendBtn && chatInput) {
    chatSendBtn.addEventListener('click', processUserTextInput);
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        processUserTextInput();
      }
    });
  }

  // ==========================================
  // 2. LIGHTBOX / MODAL DE FOTOS DA VITRINE
  // ==========================================
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxZapBtn = document.getElementById('lightboxZapBtn');

  const cardsVitrine = document.querySelectorAll('.card-foto');
  cardsVitrine.forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      const caption = card.closest('figure')?.querySelector('figcaption')?.innerText || 'Arranjo floral';
      const cleanTitle = caption.split('\n')[0].trim();

      if (lightboxModal && lightboxImg && lightboxTitle && lightboxZapBtn) {
        lightboxImg.src = img.src;
        lightboxImg.alt = cleanTitle;
        lightboxTitle.textContent = cleanTitle;

        const zapMsg = `Olá! Vi a foto do "${cleanTitle}" no site da Floricultura Bia Presentes e gostaria de encomendar!`;
        lightboxZapBtn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(zapMsg)}`;

        lightboxModal.classList.add('ativo');
      }
    });
  });

  if (lightboxClose && lightboxModal) {
    lightboxClose.addEventListener('click', () => {
      lightboxModal.classList.remove('ativo');
    });

    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        lightboxModal.classList.remove('ativo');
      }
    });
  }

  // Tecla ESC fecha modais
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (chatbotModal) chatbotModal.classList.remove('ativo');
      if (lightboxModal) lightboxModal.classList.remove('ativo');
    }
  });
});
