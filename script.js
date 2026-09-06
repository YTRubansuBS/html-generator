// --- CONFIGURATION SUPABASE ---
const SUPABASE_URL = 'VOTRE_URL_SUPABASE';
const SUPABASE_ANON_KEY = 'VOTRE_CLE_ANON_SUPABASE';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
// -----------------------------

const promptInput = document.getElementById('promptInput');
const generateBtn = document.getElementById('generateBtn');
const codeDisplay = document.getElementById('codeDisplay');
const copyBtn = document.getElementById('copyBtn');
const saveBtn = document.getElementById('saveBtn');
const saveStatus = document.getElementById('saveStatus');

// Appel à l'IA via la route sécurisée Vercel
generateBtn.addEventListener('click', async () => {
    const prompt = promptInput.value.trim();
    if (!prompt) {
        alert("Veuillez écrire une description pour l'IA !");
        return;
    }

    codeDisplay.textContent = "⏳ L'IA réfléchit et code votre demande...";
    generateBtn.disabled = true;

    try {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
        });

        const data = await response.json();

        if (data.html) {
            codeDisplay.textContent = data.html;
        } else {
            codeDisplay.textContent = "Erreur : " + (data.error || "Réponse invalide de l'IA");
        }
    } catch (err) {
        codeDisplay.textContent = "Erreur réseau : " + err.message;
    } finally {
        generateBtn.disabled = false;
    }
});

// Copier dans le presse-papier
copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(codeDisplay.textContent).then(() => {
        copyBtn.textContent = "Copié !";
        setTimeout(() => { copyBtn.textContent = "Copier le code"; }, 2000);
    });
});

// Enregistrer dans Supabase
saveBtn.addEventListener('click', async () => {
    const promptText = promptInput.value || "Génération IA";
    const content = codeDisplay.textContent;

    saveStatus.textContent = "Sauvegarde en cours...";
    saveStatus.style.color = "#38bdf8";

    const { error } = await supabase
        .from('generated_codes')
        .insert([{ title: promptText.substring(0, 50), content: content }]);

    if (error) {
        saveStatus.textContent = "Erreur : " + error.message;
        saveStatus.style.color = "#ef4444";
    } else {
        saveStatus.textContent = "Enregistré dans Supabase ! 🎉";
        saveStatus.style.color = "#10b981";
        setTimeout(() => { saveStatus.textContent = ""; }, 4000);
    }
});
