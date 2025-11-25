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
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #e0e0e0; background-color: #121212; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; background-color: #1a1a1a; }
            .header { background-color: #000000; color: #d4af37; padding: 30px 20px; text-align: center; border-bottom: 1px solid #333; }
            .header h1 { margin: 0; font-size: 24px; font-weight: 300; letter-spacing: 1px; }
            .content { padding: 30px 20px; }
            .section-title { color: #d4af37; font-size: 18px; margin-top: 30px; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #333; padding-bottom: 10px; }
            .intro { color: #a0a0a0; font-size: 16px; margin-bottom: 30px; text-align: center; }
            .trait-list { list-style: none; padding: 0; margin: 0; text-align: center; }
            .trait-item { display: inline-block; background-color: #333; color: #d4af37; padding: 8px 16px; margin: 5px; border-radius: 20px; font-size: 14px; }
            .card { background-color: #222; padding: 20px; margin-bottom: 20px; border-radius: 8px; border: 1px solid #333; }
            .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
            .card-title { color: #fff; font-size: 16px; font-weight: 600; margin: 0; }
            .card-score { color: #d4af37; font-size: 14px; font-weight: bold; }
            .card-desc { color: #ccc; font-size: 14px; margin: 0; }
            .score-bar-bg { height: 6px; background-color: #333; border-radius: 3px; overflow: hidden; margin-top: 15px; }
            .score-bar-fill { height: 100%; background-color: #d4af37; }
            .footer { text-align: center; padding: 30px 20px; font-size: 12px; color: #666; background-color: #000; }
            .footer p { margin: 5px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${profile.name}'s Kundli Profile</h1>
            </div>
            <div class="content">
              <p class="intro">Here is your personalized breakdown of your cosmic blueprint.</p>
              
              <div class="section-title">Dominant Themes</div>
              <ul class="trait-list">
                ${dominantTraits.map(trait => `<li class="trait-item">${trait}</li>`).join('')}
              </ul>

              <div class="section-title">Detailed Analysis</div>
              ${allCards.map(card => {
      const score = profile.scores[card.id] || 0;
      // Score is 3-15. Normalize to percentage for bar width.
      // (Score - 3) / (15 - 3) * 100 = (Score - 3) / 12 * 100
      // Or just simple percentage of max: (Score / 15) * 100
      const percentage = (score / 15) * 100;

      return `
                  <div class="card">
                    <div class="card-header">
                      <h3 class="card-title">${card.title} (${card.name})</h3>
                      <span class="card-score">${score}/15</span>
                    </div>
                    <p class="card-desc">${card.description}</p>
                    <div class="score-bar-bg">
                      <div class="score-bar-fill" style="width: ${percentage}%"></div>
                    </div>
                  </div>
                `;
    }).join('')}
              
              <p style="margin-top: 40px; font-size: 14px; color: #888; text-align: center;">
                <em>Note: This report is based on your self-assessment and psychological introspection.</em>
              </p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Modern Kundli. All rights reserved.</p>
              <p>Sent via SelfKundli</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const data = await resend.emails.send({
      from: 'Modern Kundli <noreply@selfkundli.fit>',
      to: [email],
      subject: `Your Detailed Kundli Report - ${profile.name}`,
      html: htmlContent,
    });

    if (data.error) {
      console.error('Resend Error:', data.error);
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
    console.error('Server Error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Failed to send email' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
