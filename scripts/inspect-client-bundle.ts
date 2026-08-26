import 'dotenv/config';

async function inspectDeployedBundle() {
  console.log('=== INSPECTING DEPLOYED CLIENT BUNDLE ===\n');
  const res = await fetch('https://growthpilot-ai-two.vercel.app/paddle-debug');
  const html = await res.text();
  console.log('HTML length:', html.length);

  // Extract all script src attributes
  const regex = /src="(\/_next\/static\/chunks\/[^"]+)"/g;
  let match;
  const scripts: string[] = [];
  while ((match = regex.exec(html)) !== null) {
    scripts.push(match[1]);
  }
  console.log('Found scripts count:', scripts.length);

  for (const s of scripts) {
    const url = 'https://growthpilot-ai-two.vercel.app' + s;
    const sRes = await fetch(url);
    const text = await sRes.text();
    if (text.includes('Paddle') || text.includes('paddle') || text.includes('NEXT_PUBLIC_PADDLE')) {
      console.log('\n--- Chunk:', s);
      const tokenMatches = text.match(/(?:test_|live_|pdl_)[a-zA-Z0-9_]{10,}/g);
      if (tokenMatches) {
        console.log('Tokens in chunk:', tokenMatches.map((t) => t.substring(0, 10) + '... (len: ' + t.length + ')'));
      } else {
        console.log('No token matches found in this chunk');
      }

      // Check how Environment.set is compiled
      if (text.includes('Environment.set') || text.includes('Initialize')) {
        console.log('Found Environment.set or Initialize in chunk!');
        const snippetIndex = text.indexOf('Environment.set');
        if (snippetIndex !== -1) {
          console.log('Snippet around Environment.set:', text.substring(Math.max(0, snippetIndex - 50), snippetIndex + 150));
        }
      }
    }
  }
}

inspectDeployedBundle().catch(console.error);
