export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { prompt } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'La clé GEMINI_API_KEY est manquante dans les variables Vercel.' });
    }

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Tu es un expert en développement web frontend. Génère uniquement du code HTML propre avec du style CSS inline (directement dans les balises avec style="..." pour que le bloc soit autonome). Réponds STRICTEMENT avec le code HTML brut, sans balises markdown (pas de \`\`\`html), sans texte d'introduction ni de conclusion, juste le code. Demande de l'utilisateur : ${prompt}`
                    }]
                }]
            })
        });

        const data = await response.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
        
        // Nettoyage de sécurité si l'IA ajoute des blocs markdown
        const cleanHtml = rawText.replace(/```html/g, '').replace(/```/g, '').trim();

        return res.status(200).json({ html: cleanHtml });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
