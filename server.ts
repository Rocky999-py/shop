import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Initialize Gemini API client with required User-Agent
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Seed product details for AI context
const AI_PRODUCT_CONTEXT = [
  {
    id: 'aether-headphones',
    name: 'Aether ANC Wireless Headphones',
    price: 349,
    originalPrice: 399,
    category: 'Electronics',
    tagline: 'Sound isolated in luxury.',
    description: 'Active noise-canceling wireless headphones crafted with soft-grain lambskin leather and solid anodized aluminum. High-density memory foam earcups, 40mm beryllium dynamic drivers, and up to 45 hours of battery life.'
  },
  {
    id: 'kallio-keyboard',
    name: 'Kallio Tactile Mechanical Keyboard',
    price: 189,
    category: 'Electronics',
    tagline: 'Artisanal tactile precision.',
    description: 'Compact 75% mechanical keyboard with silent tactile switches and dye-sublimated thick PBT keycaps. Bead-blasted aluminum housing. Gasket mounted with sound-dampening foam.'
  },
  {
    id: 'nordic-cashmere-coat',
    name: 'Nordic Double-Breasted Cashmere Overcoat',
    price: 580,
    category: 'Fashion',
    tagline: 'Tailored warmth, woven from clouds.',
    description: 'Tailored double-breasted overcoat woven from 100% pure Himalayan cashmere (420g/sm heavy weave). Half-unlined structure with premium silk-satin lined sleeves and horn buttons.'
  },
  {
    id: 'soma-tote',
    name: 'Soma Full-Grain Leather Tote',
    price: 290,
    category: 'Fashion',
    tagline: 'Sculptural form, structural purpose.',
    description: 'Everyday carryall tote handcrafted from drum-dyed, full-grain Italian calfskin. Hand-burnished raw edges, solid raw brass rivets, and floating interior zippered zipper pouch.'
  },
  {
    id: 'ceramic-vase',
    name: 'Clay & Basalt Sculptured Vase',
    price: 85,
    category: 'Home Decor',
    tagline: 'Brutalist clay, hand-thrown character.',
    description: 'Hand-thrown unglazed raw basalt clay textured vase from Kyoto. Glazed interior to hold water. Highly tactile, beautiful on its own or with botanicals.'
  },
  {
    id: 'linen-throw',
    name: 'French Flax Linen Bedding Set',
    price: 120,
    originalPrice: 145,
    category: 'Home Decor',
    tagline: 'Breathable stonewashed luxury.',
    description: 'Natural organic French flax linen throw (60"x80") and two matching standard cushion shams. Stonewashed for ultimate softness, thermal-regulating, Oeko-Tex certified.'
  },
  {
    id: 'facial-nectar',
    name: 'Aura Botanical Facial Nectar',
    price: 75,
    category: 'Wellness',
    tagline: 'Pure liquid cellular restoration.',
    description: 'Active hydrating facial oil with blue tansy, cold-pressed evening primrose, and organic sugarcane squalane. Restores and strengthens skin barrier. Herbs and floral aroma.'
  },
  {
    id: 'ceramic-diffuser',
    name: 'Minimalist Stone Diffuser',
    price: 95,
    category: 'Wellness',
    tagline: 'Ultrasonic vapor, porcelain architectural form.',
    description: 'Ultrasonic essential oil mist diffuser housed in a white porcelain stone cylinder with a warm LED light bar. Vibrates at 2.5 MHz to disperse continuous or intermittent mist.'
  }
];

// AI Shopping Assistant chat API endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'MY_GEMINI_API_KEY') {
      return res.status(200).json({
        text: "My apologies, but my intelligence engine is currently initializing. (To unlock my premium features, please add a valid `GEMINI_API_KEY` in the AI Studio **Settings > Secrets** panel.) In the meantime, I am happy to recommend our **Aether ANC Wireless Headphones ($349)** or our **Nordic Double-Breasted Cashmere Coat ($580)**—both are customer favorites!"
      });
    }

    // Prepare system instructions with full catalog info
    const systemInstruction = `You are Aura, the expert personal stylist, lifestyle designer, and intelligent shopping assistant for 'Luxe E-Commerce Store'.
Luxe E-Commerce Store is a highly curated, premium, and sophisticated minimalist boutique offering world-class electronics, fashion, home decor, and wellness items.

Your personality: Sophisticated, welcoming, objective, highly knowledgeable, and extremely helpful. You speak elegantly, clearly, and concisely. Keep formatting clean with beautiful typography.
Avoid generic greetings. Immediately focus on assisting the customer.

Here is the store's current active product catalog:
${JSON.stringify(AI_PRODUCT_CONTEXT, null, 2)}

Your absolute guidelines:
1. ALWAYS recommend products that exist in the active catalog listed above. Refer to them by their exact names.
2. Provide direct styling/usage advice (e.g., matching the Clay & Basalt Sculptured Vase with the French Flax Linen Bedding Set, or pairing the Soma Tote with the Nordic Cashmere Coat).
3. If the user asks for recommendations based on price, category, color, or vibe, match them to our catalog.
4. If a user expresses interest in buying or adding an item to their cart, encourage them and say they can click the direct "Add to Cart" button or "View Details" on that product card directly in the shop!
5. If they ask for discounts or coupon codes, politely share:
   - "AURA15": 15% off everything
   - "LUXE50": $50 off orders over $250
6. Keep your responses compact and scannable. Use Markdown bullet points, bold text, and italic accents elegantly.
7. Always communicate in a polite, premium brand voice. Avoid over-explaining or long preambles.`;

    // Map conversation messages to GenAI SDK contents structure
    const contents = messages.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    // Call Gemini 3.5 Flash model
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
        topP: 0.9,
      },
    });

    const aiText = response.text || "I apologize, I could not process that request. Let me know if you would like to explore our Luxe curated collection.";
    res.json({ text: aiText });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ error: error.message || 'Internal server error while calling intelligence engine' });
  }
});

// Setup Vite Dev Server / Compiled Static Serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Running in DEVELOPMENT mode with Vite middleware.');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('Running in PRODUCTION mode, serving compiled static assets.');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Luxe E-Commerce server running on http://localhost:${PORT}`);
  });
}

startServer();
