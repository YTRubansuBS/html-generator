// --- CONFIGURATION SUPABASE ---
const SUPABASE_URL = 'VOTRE_URL_SUPABASE';
const SUPABASE_ANON_KEY = 'VOTRE_CLE_ANON_SUPABASE';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
// -----------------------------

const titleInput = document.getElementById('titleText');
const parInput = document.getElementById('parText');
const bgColorInput = document.getElementById('bgColor');
const generateBtn = document.getElementById('generateBtn');
const codeDisplay = document.getElementById('codeDisplay');
const copyBtn = document.getElementById('copyBtn');
const saveBtn = document.getElementById('saveBtn');
const saveStatus = document.getElementById('saveStatus');

function generateCode() {
    const title = titleInput.value || "Titre par défaut";
    const text = parInput.value || "Texte par défaut";
    const bgColor = bgColorInput.value;

    const htmlCode = `<div style="background-color: ${bgColor}; padding: 20px; border-radius: 8px;">\n    <h1>${title}</h1>\n    <p>${text}</p>\n</div>`;

    codeDisplay.textContent = htmlCode;
}

generateBtn.addEventListener('click', generateCode);

// Mettre à jour en direct lors de la saisie
[titleInput, parInput, bgColorInput].forEach(element => {
    element.addEventListener('input', generateCode);
});

// Bouton pour copier dans le presse-papier
copyBtn.addEventListener('click', () => {
    const codeToCopy = codeDisplay.textContent;
    navigator.clipboard.writeText(codeToCopy).then(() => {
        copyBtn.textContent = "Copié !";
        setTimeout(() => {
            copyBtn.textContent = "Copier le code";
        }, 2000);
    });
});

// Bouton pour enregistrer dans Supabase
saveBtn.addEventListener('click', async () => {
    const title = titleInput.value || "Sans titre";
    const content = codeDisplay.textContent;

    saveStatus.textContent = "Enregistrement en cours...";
    saveStatus.style.color = "#3498db";

    const { error } = await supabase
        .from('generated_codes')
        .insert([{ title: title, content: content }]);

    if (error) {
        console.error(error);
        saveStatus.textContent = "Erreur : " + error.message;
        saveStatus.style.color = "#e74c3c";
    } else {
        saveStatus.textContent = "Sauvegardé avec succès dans Supabase ! 🎉";
        saveStatus.style.color = "#2ecc71";
        setTimeout(() => {
            saveStatus.textContent = "";
        }, 4000);
    }
});
