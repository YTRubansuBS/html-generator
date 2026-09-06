// --- CONFIGURATION SUPABASE ---
const SUPABASE_URL = 'https://mtwwjhgjgurzvjzscttw.supabase.co/rest/v1/';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10d3dqaGdqZ3VyenZqenNjdHR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg2OTg0MzAsImV4cCI6MjEwNDI3NDQzMH0.bXNZq9YnhL9Ge4wmFqvTLeOGS3XDp9rPljaWanQLil0';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
// -----------------------------

const promptInput = document.getElementById('promptInput');
const generateBtn = document.getElementById('generateBtn');
const codeDisplay = document.getElementById('codeDisplay');
const copyBtn = document.getElementById('copyBtn');
const saveBtn = document.getElementById('saveBtn');
const saveStatus = document.getElementById('saveStatus');

// Moteur de génération intelligent basé sur la description textuelle
function generateFromPrompt() {
    const text = (promptInput.value || "").toLowerCase();
    
    // 1. Gestion du fond
    let bgColor = "#f9f9f9";
    let textColor = "#333333";
    if (text.includes('fond noir') || text.includes('sombre') || text.includes('dark')) {
        bgColor = "#111111";
        textColor = "#ffffff";
    } else if (text.includes('fond bleu')) {
        bgColor = "#1e3a8a";
        textColor = "#ffffff";
    } else if (text.includes('fond rouge')) {
        bgColor = "#991b1b";
        textColor = "#ffffff";
    }

    // 2. Gestion de l'alignement
    let align = "left";
    if (text.includes('centré') || text.includes('milieu') || text.includes('centre')) {
        align = "center";
    } else if (text.includes('droite')) {
        align = "right";
    }

    // 3. Construction du HTML
    let html = `<div style="padding: 30px; font-family: sans-serif; background: ${bgColor}; color: ${textColor}; border-radius: 12px;">\n`;
    html += `    <div style="text-align: ${align};">\n`;

    // Titre
    if (text.includes('titre') || text.includes('h1')) {
        html += `        <h1 style="font-size: 2rem; margin-bottom: 15px;">Mon Projet Généré</h1>\n`;
    } else {
        html += `        <h1 style="font-size: 2rem; margin-bottom: 15px;">Page Web</h1>\n`;
    }

    // Paragraphe
    if (text.includes('texte') || text.includes('paragraphe') || text.includes('description')) {
        html += `        <p style="font-size: 1rem; margin-bottom: 20px; opacity: 0.9;">Voici le contenu textuel généré automatiquement selon vos consignes.</p>\n`;
    }

    // Bouton
    if (text.includes('bouton') || text.includes('cta') || text.includes('lien')) {
        let btnBg = '#10b981';
        if (text.includes('bouton rouge')) btnBg = '#ef4444';
        if (text.includes('bouton bleu')) btnBg = '#3b82f6';
        if (text.includes('bouton jaune')) btnBg = '#f59e0b';
        
        html += `        <button style="background: ${btnBg}; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 1rem;">Cliquez ici</button>\n`;
    }

    html += `    </div>\n`;
    html += `</div>`;

    codeDisplay.textContent = html;
}

generateBtn.addEventListener('click', generateFromPrompt);
promptInput.addEventListener('input', generateFromPrompt);

// Copier dans le presse-papier
copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(codeDisplay.textContent).then(() => {
        copyBtn.textContent = "Copié !";
        setTimeout(() => { copyBtn.textContent = "Copier le code"; }, 2000);
    });
});

// Enregistrer dans Supabase
saveBtn.addEventListener('click', async () => {
    const promptText = promptInput.value || "Génération automatique";
    const content = codeDisplay.textContent;

    saveStatus.textContent = "Sauvegarde en cours...";
    saveStatus.style.color = "#38bdf8";

    const { error } = await supabase
        .from('generated_codes')
        .insert([{ title: promptText.substring(0, 50), content: content }]);

    if (error) {
        console.erres = error;
        saveStatus.textContent = "Erreur : " + error.message;
        saveStatus.style.color = "#ef4444";
    } else {
        saveStatus.textContent = "Enregistré dans Supabase ! 🎉";
        saveStatus.style.color = "#10b981";
        setTimeout(() => { saveStatus.textContent = ""; }, 4000);
    }
});
