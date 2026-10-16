/**
 * Floricultura Bia Presentes
 * Lógica da aplicação, Menu Mobile, Filtros de Galeria, Formulário Inteligente,
 * Modal Lightbox e Chatbot Interativo com WhatsApp.
 */

document.addEventListener('DOMContentLoaded', () => {
  const WHATSAPP_NUMBER = '5519989155900';

  // ==========================================================================
  // 1. HEADER FIXO COM SOMBRA AO ROLAR
  // ==========================================================================
  const headerMain = document.getElementById('headerMain');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      headerMain.style.boxShadow = '0 6px 20px rgba(116, 27, 52, 0.08)';
    } else {
      headerMain.style.boxShadow = 'none';
    }
  }, { passive: true });

  // ==========================================================================
  // 2. MENU GAVETA MOBILE (DRAWER)
  // ==========================================================================
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileDrawerClose = document.getElementById('mobileDrawerClose');
  const drawerOverlay = document.getElementById('drawerOverlay');

  function openDrawer() {
    mobileDrawer.classList.add('open');
    drawerOverlay.classList.add('active');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    mobileDrawer.classList.remove('open');
    drawerOverlay.classList.remove('active');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', openDrawer);
    mobileDrawerClose.addEventListener('click', closeDrawer);
    drawerOverlay.addEventListener('click', closeDrawer);

    // Fechar ao clicar em qualquer link da gaveta
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', closeDrawer);
    });
  }

  // ==========================================================================
  // 3. FILTROS DA GALERIA DE FOTOS
  // ==========================================================================
  const filterChips = document.querySelectorAll('.filter-chip');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      // Atualiza classe ativa nos botões
      filterChips.forEach(c => {
        c.classList.remove('active');
        c.setAttribute('aria-selected', 'false');
      });
      chip.classList.add('active');
      chip.setAttribute('aria-selected', 'true');

      const filter = chip.dataset.filter;

      galleryItems.forEach(item => {
        const categories = item.dataset.category || '';
        if (filter === 'todos' || categories.includes(filter)) {
          item.classList.remove('hide');
        } else {
          item.classList.add('hide');
        }
      });
    });
  });

  // ==========================================================================
  // 4. LIGHTBOX / MODAL DE FOTOS COM ENCOMENDA
  // ==========================================================================
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxZapBtn = document.getElementById('lightboxZapBtn');

  function openLightbox(imgSrc, titleText) {
    if (!lightboxModal) return;
    lightboxImg.src = imgSrc;
    lightboxImg.alt = titleText;
    lightboxTitle.textContent = titleText;

    const zapMsg = `Olá! Vi a foto do "${titleText}" no site da Floricultura Bia Presentes e gostaria de encomendar! Poderia me passar valores e disponibilidade?`;
    lightboxZapBtn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(zapMsg)}`;

    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.card-photo').forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      const titleElem = card.closest('.gallery-item')?.querySelector('.photo-title');
      const titleText = titleElem ? titleElem.textContent.trim() : 'Arranjo Floral Selecionado';
      openLightbox(img.src, titleText);
    });

    // Acessibilidade via teclado (Enter / Espaço)
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);

  // ==========================================================================
  // 5. FORMULÁRIO INTELIGENTE COM REDIRECIONAMENTO WHATSAPP
  // ==========================================================================
  const orderForm = document.getElementById('orderForm');
  if (orderForm) {
    orderForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nome = document.getElementById('formNome')?.value.trim();
      const whatsapp = document.getElementById('formWhatsapp')?.value.trim();
      const tipo = document.getElementById('formTipo')?.value;
      const dataEntrega = document.getElementById('formData')?.value;
      const cidade = document.getElementById('formCidade')?.value;
      const mensagem = document.getElementById('formMensagem')?.value.trim();

      // Formatação da data para o padrão brasileiro
      let dataFormatada = 'A combinar';
      if (dataEntrega) {
        const partes = dataEntrega.split('-');
        if (partes.length === 3) {
          dataFormatada = `${partes[2]}/${partes[1]}/${partes[0]}`;
        }
      }

      let zapText = `🌸 *Solicitação de Presente - Floricultura Bia Presentes*\n\n`;
      zapText += `👤 *Nome:* ${nome}\n`;
      zapText += `📱 *Telefone/WhatsApp:* ${whatsapp}\n`;
      zapText += `🌹 *Presente Desejado:* ${tipo || 'Flores'}\n`;
      zapText += `📅 *Data Desejada:* ${dataFormatada}\n`;
      zapText += `📍 *Local:* ${cidade || 'Hortolândia - SP'}\n`;

      if (mensagem) {
        zapText += `💬 *Detalhes / Mensagem:* ${mensagem}\n`;
      }

      zapText += `\nOlá! Poderia me passar os valores e opções disponíveis?`;

      const finalUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(zapText)}`;

      // Feedback visual e redirecionamento
      const submitBtn = document.getElementById('btnSubmitForm');
      if (submitBtn) {
        const originalHtml = submitBtn.innerHTML;
        submitBtn.innerHTML = `<span>Abrindo WhatsApp... 🚀</span>`;
        submitBtn.style.opacity = '0.85';
        setTimeout(() => {
          window.open(finalUrl, '_blank');
          submitBtn.innerHTML = originalHtml;
          submitBtn.style.opacity = '1';
        }, 400);
      } else {
        window.open(finalUrl, '_blank');
      }
    });
  }

  // ==========================================================================
  // 6. CHATBOT INTERATIVO
  // ==========================================================================
  const chatToggleBtn = document.getElementById('chatToggleBtn');
  const chatbotModal = document.getElementById('chatbotModal');
  const chatCloseBtn = document.getElementById('chatCloseBtn');
  const chatMessages = document.getElementById('chatMessages');
  const chatInput = document.getElementById('chatInput');
  const chatSendBtn = document.getElementById('chatSendBtn');

  let chatState = {
    tipoProduto: '',
    detalhes: '',
    cidade: ''
  };

  function toggleChatbot() {
    if (!chatbotModal) return;
    const isActive = chatbotModal.classList.toggle('active');
    if (chatToggleBtn) {
      chatToggleBtn.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    }
    if (isActive) {
      setTimeout(() => {
        if (chatInput) chatInput.focus();
        scrollChatToBottom();
      }, 200);
    }
  }

  function scrollChatToBottom() {
    if (!chatMessages) return;
    setTimeout(() => {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 100);
  }

  function addBotMessage(htmlContent, options = []) {
    if (!chatMessages) return;
    const msgDiv = document.createElement('div');
    msgDiv.className = 'msg msg-bot';
    msgDiv.innerHTML = htmlContent;

    if (options.length > 0) {
      const optsContainer = document.createElement('div');
      optsContainer.className = 'chatbot-quick-options';

      options.forEach(opt => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'quick-btn';
        btn.textContent = opt.label;
        btn.addEventListener('click', () => {
          handleChatOption(opt);
        });
        optsContainer.appendChild(btn);
      });

      msgDiv.appendChild(optsContainer);
    }

    chatMessages.appendChild(msgDiv);
    scrollChatToBottom();
  }

  function addUserMessage(text) {
    if (!chatMessages) return;
    const msgDiv = document.createElement('div');
    msgDiv.className = 'msg msg-user';
    msgDiv.textContent = text;
    chatMessages.appendChild(msgDiv);
    scrollChatToBottom();
  }

  function handleChatOption(opt) {
    addUserMessage(opt.label);

    if (opt.action === 'buque_rosas') {
      chatState.tipoProduto = 'Buquê de Rosas';
      setTimeout(() => {
        addBotMessage(
          'Excelente escolha! Nossos buquês de rosas são preparados com botões selecionados frescos do dia. 🌹<br><br>Qual combinação você mais gosta?',
          [
            { label: '🌹 Rosas Vermelhas Clássicas', action: 'cor_vermelha' },
            { label: '🌸 Rosas Rosa / Tons Suaves', action: 'cor_rosa' },
            { label: '🤍 Rosas Brancas & Lírios', action: 'cor_branca' },
            { label: '🍫 Buquê de Rosas com Chocolates', action: 'com_chocolate' }
          ]
        );
      }, 400);
    } else if (opt.action.startsWith('cor_') || opt.action === 'com_chocolate') {
      chatState.detalhes = opt.label;
      setTimeout(() => {
        addBotMessage(
          'Perfeito! E onde você gostaria que fizéssemos a entrega?',
          [
            { label: '📍 Hortolândia - SP', action: 'cidade_hortolandia' },
            { label: '📍 Monte Mor - SP', action: 'cidade_montemor' },
            { label: '📍 Outra cidade da região', action: 'cidade_regiao' },
            { label: '🏪 Retirar na loja', action: 'retirar_loja' }
          ]
        );
      }, 400);
    } else if (opt.action.startsWith('cidade_') || opt.action === 'retirar_loja') {
      chatState.cidade = opt.label.replace('📍 ', '').replace('🏪 ', '');
      const textoFinal = `Olá! Vim pelo site da Floricultura Bia Presentes e gostaria de encomendar:\n\n🌹 *Item:* ${chatState.tipoProduto || 'Buquê de Flores'}\n🎨 *Estilo:* ${chatState.detalhes || 'A combinar'}\n📍 *Entrega:* ${chatState.cidade}\n\nPoderia me passar valores e disponibilidade?`;
      const urlZap = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(textoFinal)}`;

      setTimeout(() => {
        addBotMessage(
          `Maravilha! Já organizei seu pedido. Clique no botão abaixo para concluir diretamente com a nossa florista no WhatsApp:<br><br><a href="${urlZap}" target="_blank" class="btn btn-primary btn-compact" style="width:100%;text-align:center;">Finalizar no WhatsApp 📲</a>`
        );
      }, 400);
    } else if (opt.action === 'cesta_presente') {
      chatState.tipoProduto = 'Cesta de Presente';
      setTimeout(() => {
        addBotMessage(
          'Nossas cestas gourmet são montadas com produtos selecionados, chocolates finos, bebidas ou pelúcias! 🧺<br><br>Deseja ver fotos e personalizar no WhatsApp agora?',
          [
            { label: 'Sim, montar cesta no WhatsApp 📲', action: 'ir_zap_cesta' },
            { label: 'Ver opções de buquês 🌹', action: 'buque_rosas' }
          ]
        );
      }, 400);
    } else if (opt.action === 'ir_zap_cesta') {
      const msg = `Olá! Quero montar uma cesta de presente personalizada na Floricultura Bia Presentes. Como funciona?`;
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
    } else if (opt.action === 'noiva') {
      const msg = `Olá! Gostaria de informações sobre Buquê de Noiva para casamento com a Floricultura Bia Presentes.`;
      setTimeout(() => {
        addBotMessage(
          `Que momento inesquecível! 👰💐 Criamos buquês de noiva exclusivos para casamentos.<br><br><a href="https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}" target="_blank" class="btn btn-primary btn-compact" style="width:100%;">Falar com a Florista no WhatsApp 📲</a>`
        );
      }, 400);
    } else if (opt.action === 'localizacao') {
      setTimeout(() => {
        addBotMessage(
          `📍 <strong>Onde atendemos e entregamos:</strong><br><br>Atendemos <strong>Hortolândia, Monte Mor e toda a região</strong> com entregas expressas e cuidadosas! 🛵<br><br>Quer calcular a taxa e o prazo para o seu bairro?`,
          [
            { label: 'Calcular entrega no WhatsApp 🛵', action: 'ir_zap_entrega' },
            { label: 'Ver buquês de rosas 🌹', action: 'buque_rosas' }
          ]
        );
      }, 400);
    } else if (opt.action === 'ir_zap_entrega') {
      const msg = `Olá! Gostaria de saber sobre a entrega para o meu endereço em Hortolândia/região.`;
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
    } else if (opt.action === 'falar_zap') {
      const msg = `Olá! Gostaria de atendimento com a Floricultura Bia Presentes.`;
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
    }
  }

  // Ações nos botões iniciais do HTML
  document.querySelectorAll('.chatbot-quick-options .quick-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      handleChatOption({ label: btn.textContent.trim(), action: btn.dataset.action });
    });
  });

  // Envio de texto livre digitado no input do Chatbot
  function handleUserChatInput() {
    if (!chatInput) return;
    const text = chatInput.value.trim();
    if (!text) return;

    addUserMessage(text);
    chatInput.value = '';

    const lower = text.toLowerCase();
    setTimeout(() => {
      if (lower.includes('rosa') || lower.includes('buque') || lower.includes('buquê') || lower.includes('flor')) {
        addBotMessage(
          'Temos opções deslumbrantes de buquês com rosas selecionadas! 🌹<br>Qual modelo você prefere conhecer?',
          [
            { label: '🌹 Ver Buquês de Rosas', action: 'buque_rosas' },
            { label: '📲 Conversar com a Florista', action: 'falar_zap' }
          ]
        );
      } else if (lower.includes('cesta') || lower.includes('chocolate') || lower.includes('pelúcia') || lower.includes('pelucia')) {
        addBotMessage(
          'Nossas cestas e caixas com chocolates e pelúcias são um sucesso! 🧺🍫 Deseja montar a sua?',
          [
            { label: '🧺 Montar Cesta no WhatsApp', action: 'ir_zap_cesta' },
            { label: 'Ver Buquês', action: 'buque_rosas' }
          ]
        );
      } else if (lower.includes('onde') || lower.includes('endereço') || lower.includes('hortolandia') || lower.includes('entrega')) {
        addBotMessage(
          'Fazemos entregas em toda <strong>Hortolândia, Monte Mor e região</strong> com total cuidado! 🛵<br>Deseja calcular a entrega para o seu bairro?',
          [
            { label: '🛵 Falar entrega no WhatsApp', action: 'ir_zap_entrega' },
            { label: '🌹 Ver Buquês', action: 'buque_rosas' }
          ]
        );
      } else {
        const zapLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Olá! Vim pelo site da Floricultura Bia Presentes com a seguinte dúvida: ' + text)}`;
        addBotMessage(
          `Entendido! Para te enviar fotos reais e tirar sua dúvida com agilidade, nossa florista está disponível no WhatsApp agora mesmo:<br><br><a href="${zapLink}" target="_blank" class="btn btn-primary btn-compact" style="width:100%;">Continuar no WhatsApp 📲</a>`
        );
      }
    }, 500);
  }

  if (chatToggleBtn) chatToggleBtn.addEventListener('click', toggleChatbot);
  if (chatCloseBtn) chatCloseBtn.addEventListener('click', toggleChatbot);

  if (chatSendBtn && chatInput) {
    chatSendBtn.addEventListener('click', handleUserChatInput);
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleUserChatInput();
      }
    });
  }

  // ==========================================================================
  // 7. TECLADO ESC FECHA QUALQUER MODAL ABERTO
  // ==========================================================================
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
      closeDrawer();
      if (chatbotModal && chatbotModal.classList.contains('active')) {
        toggleChatbot();
      }
    }
  });

  // Ano atual automático no rodapé
  const yearElem = document.getElementById('currentYear');
  if (yearElem) yearElem.textContent = new Date().getFullYear();
});
