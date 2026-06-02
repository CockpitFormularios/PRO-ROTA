// ==================== SISTEMA DE COMUNICAÇÃO EM TEMPO REAL ====================

// Chave para armazenamento
const STORAGE_KEY = 'pro_rota_onibus';

// Dados iniciais
let dadosGlobais = {
    onibus: [
        { id: 1, numero: "3200", placa: "ABC-1234", modelo: "Mercedes O500", status: "parado", motorista: null, velocidade: 0, lat: -23.5505, lng: -46.6333, ultima_atualizacao: new Date().toISOString(), rota_ativa: false },
        { id: 2, numero: "3201", placa: "DEF-5678", modelo: "Volvo B340", status: "parado", motorista: null, velocidade: 0, lat: -23.5450, lng: -46.6400, ultima_atualizacao: new Date().toISOString(), rota_ativa: false },
        { id: 3, numero: "3202", placa: "GHI-9012", modelo: "Scania K360", status: "parado", motorista: null, velocidade: 0, lat: -23.5600, lng: -46.6200, ultima_atualizacao: new Date().toISOString(), rota_ativa: false },
        { id: 4, numero: "3203", placa: "JKL-3456", modelo: "Marcopolo Paradiso", status: "parado", motorista: null, velocidade: 0, lat: -23.5550, lng: -46.6450, ultima_atualizacao: new Date().toISOString(), rota_ativa: false },
        { id: 5, numero: "3204", placa: "MNO-7890", modelo: "Mercedes O400", status: "parado", motorista: null, velocidade: 0, lat: -23.5400, lng: -46.6300, ultima_atualizacao: new Date().toISOString(), rota_ativa: false }
    ],
    ultima_atualizacao: new Date().toISOString()
};

// Inicializar localStorage
function iniciarStorage() {
    if (!localStorage.getItem(STORAGE_KEY)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dadosGlobais));
    }
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
}

// Salvar dados no localStorage
function salvarDados(dados) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dados));
    // Disparar evento para todas as abas/janelas
    window.dispatchEvent(new StorageEvent('storage', {
        key: STORAGE_KEY,
        newValue: JSON.stringify(dados)
    }));
}

// Atualizar posição de um ônibus
function atualizarPosicaoOnibus(onibusId, lat, lng, velocidade) {
    const dados = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const onibus = dados.onibus.find(b => b.id === onibusId);
    if (onibus) {
        onibus.lat = lat;
        onibus.lng = lng;
        onibus.velocidade = velocidade;
        onibus.ultima_atualizacao = new Date().toISOString();
        if (onibus.rota_ativa) {
            onibus.status = "em_rota";
        }
        salvarDados(dados);
        return true;
    }
    return false;
}

// Iniciar rota
function iniciarRotaOnibus(onibusId, motoristaNome) {
    const dados = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const onibus = dados.onibus.find(b => b.id === onibusId);
    if (onibus) {
        onibus.rota_ativa = true;
        onibus.status = "em_rota";
        onibus.motorista = motoristaNome;
        onibus.ultima_atualizacao = new Date().toISOString();
        salvarDados(dados);
        return true;
    }
    return false;
}

// Encerrar rota
function encerrarRotaOnibus(onibusId) {
    const dados = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const onibus = dados.onibus.find(b => b.id === onibusId);
    if (onibus) {
        onibus.rota_ativa = false;
        onibus.status = "parado";
        onibus.motorista = null;
        onibus.velocidade = 0;
        onibus.ultima_atualizacao = new Date().toISOString();
        salvarDados(dados);
        return true;
    }
    return false;
}

// Obter todos os ônibus em rota
function getOnibusEmRota() {
    const dados = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return dados.onibus.filter(b => b.rota_ativa === true);
}

// Escutar mudanças em tempo real
function escutarMudancas(callback) {
    window.addEventListener('storage', (event) => {
        if (event.key === STORAGE_KEY) {
            const novosDados = JSON.parse(event.newValue);
            callback(novosDados);
        }
    });
}

// Exportar funções
window.ProRota = {
    iniciarStorage,
    salvarDados,
    atualizarPosicaoOnibus,
    iniciarRotaOnibus,
    encerrarRotaOnibus,
    getOnibusEmRota,
    escutarMudancas
};