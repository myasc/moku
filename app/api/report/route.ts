import { Resend } from 'resend';
import { UserProfile } from '@/lib/types';
import { getDominantTraits } from '@/lib/scoring';
import { allCards } from '@/lib/data';

export async function POST(request: Request) {
  try {
    const { email, profile }: { email: string; profile: UserProfile } = await request.json();

    if (!email || !profile) {
      return new Response(JSON.stringify({ error: 'Missing email or profile data' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!process.env.RESEND_API_KEY) {
      return new Response(JSON.stringify({ error: 'Server configuration error: Missing API Key' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const dominantTraits = getDominantTraits(profile);

    // Generate HTML content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #1a1a1a; color: #d4af37; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 8px 8px; }
            .trait { background-color: #fff; padding: 10px; margin-bottom: 10px; border-left: 4px solid #d4af37; }
            .score-bar { height: 8px; background-color: #eee; border-radius: 4px; overflow: hidden; margin-top: 5px; }
            .score-fill { height: 100%; background-color: #d4af37; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #888; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${profile.name}'s Kundli Profile</h1>
            </div>
            <div class="content">
              <h2>Your Dominant Themes</h2>
              <p>Based on your responses, your strongest energies are:</p>
              <ul>
                ${dominantTraits.map(trait => `<li><strong>${trait}</strong></li>`).join('')}
              </ul>

              <h2>Detailed Breakdown</h2>
              ${allCards.map(card => {
      const score = profile.scores[card.id] || 0;
      const percentage = (score / 5) * 100;
      return `
                  <div class="trait">
                    <h3>${card.title} (${card.name})</h3>
                    <p>${card.description}</p>
                    <div>Score: ${score}/5</div>
                    <div class="score-bar">
                      <div class="score-fill" style="width: ${percentage}%"></div>
                    </div>
                  </div>
                `;
    }).join('')}
              
              <p><em>Note: This is a simplified report. Full astrological analysis requires precise birth time and location.</em></p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Modern Kundli. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    if (!process.env.RESEND_API_KEY) {
      return new Response(JSON.stringify({ error: 'Server configuration error: Missing API Key' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await resend.emails.send({
      from: 'Modern Kundli <onboarding@resend.dev>', // Default Resend testing domain
      to: [email],
      subject: `Your Detailed Kundli Report - ${profile.name}`,
      html: htmlContent,
    });

    if (data.error) {
      return new Response(JSON.stringify({ error: data.error.message }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Failed to send email' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
