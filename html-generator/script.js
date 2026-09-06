const titleInput = document.getElementById('titleText');
const parInput = document.getElementById('parText');
const bgColorInput = document.getElementById('bgColor');
const generateBtn = document.getElementById('generateBtn');
const codeDisplay = document.getElementById('codeDisplay');
const copyBtn = document.getElementById('copyBtn');

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
