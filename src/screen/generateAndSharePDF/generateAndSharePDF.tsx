// Install karo pehle:
// npm install react-native-html-to-pdf react-native-share
// npx pod-install

import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';

const generateAndSharePDF = async () => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: -apple-system, sans-serif; }
        body { background: #F4F7FB; padding: 20px; }
        .header { background: #7B61FF; border-radius: 16px; padding: 30px 20px; text-align: center; margin-bottom: 20px; }
        .header h1 { color: white; font-size: 22px; margin-bottom: 6px; }
        .header p { color: #D4CEFF; font-size: 13px; }
        .card { background: white; border-radius: 16px; padding: 20px; margin-bottom: 16px; }
        .value-card { text-align: center; }
        .value-label { color: #667085; font-size: 13px; margin-bottom: 8px; }
        .value { font-size: 32px; font-weight: 800; color: #101828; }
        .growth { color: #12B76A; font-size: 14px; font-weight: 700; margin-top: 6px; }
        .chart-title { font-size: 15px; font-weight: 700; color: #101828; margin-bottom: 14px; }
        .info-row { display: flex; justify-content: space-between; align-items: center;
                    padding: 11px 0; border-bottom: 1px solid #EEF1F5; }
        .info-row:last-child { border-bottom: none; }
        .info-label { color: #667085; font-size: 13px; display: flex; align-items: center; gap: 8px; }
        .dot { width: 8px; height: 8px; border-radius: 50%; background: #7B61FF; display: inline-block; }
        .info-value { font-size: 13px; font-weight: 700; color: #101828; }
        .share-btn { background: #34C759; border-radius: 30px; padding: 16px;
                     text-align: center; color: white; font-weight: 700; font-size: 15px; margin-top: 4px; }
        .footer { text-align: center; color: #8B93A1; font-size: 10px; margin-top: 16px; }
        
        /* Chart SVG */
        .chart-wrap { width: 100%; }
      </style>
    </head>
    <body>
      <div class="header">
        <div style="font-size:18px; font-weight:800; color:white; margin-bottom:4px">QFinance</div>
        <h1>Mi Escenario de Inversión</h1>
        <p>Simulada con QFinance</p>
      </div>

      <div class="card value-card">
        <div class="value-label">Valor estimado en ${data.horizon} Años</div>
        <div class="value">${formatCurrency(data.fv || 0)}</div>
        <div class="growth">+${formatCurrency(data.growth || 0)} (${(data.gainPct || 0).toFixed(1)}%)</div>
      </div>

      <div class="card">
        <div class="chart-title">Crecimiento proyectado de la cartera</div>
        <div class="chart-wrap">
          ${generateChartSVG(data)}
        </div>
        <div style="display:flex; align-items:center; margin-top:10px; gap:6px">
          <div style="width:10px; height:10px; border-radius:50%; background:#7B61FF;"></div>
          <span style="color:#667085; font-size:12px;">${data.returnRate}% Rendimiento anual</span>
        </div>
      </div>

      <div class="card">
        ${[
          ['Tipo de inversor', 'Dinámica'],
          ['Rendimiento anual', `${data.returnRate}%`],
          ['Período de inversión', `${data.horizon} años`],
          [getContributionLabel(data.frequency), formatCurrency(data.monthly || 0)],
          ['Capital inicial', formatCurrency(data.capital || 0)],
          ['Total invertido', formatCurrency(data.invested || 0)],
        ].map(([label, value]) => `
          <div class="info-row">
            <div class="info-label"><span class="dot"></span>${label}</div>
            <div class="info-value">${value}</div>
          </div>
        `).join('')}
      </div>

      <div class="share-btn">Compartir mi plan →</div>
      <div class="footer">Documento solo informativo. Rendimientos pasados no garantizan resultados futuros. © QFinance</div>
    </body>
    </html>
  `;

  try {
    const file = await RNHTMLtoPDF.convert({
      html: htmlContent,
      fileName: `QFinance_Plan_${Date.now()}`,
      directory: 'Documents',
      width: 595,   // A4 width in points
      height: 842,  // A4 height in points
    });

    if (file.filePath) {
      await Share.open({
        url: `file://${file.filePath}`,
        type: 'application/pdf',
        title: 'Mi Plan de Inversión - QFinance',
        subject: 'Mi escenario de inversión simulado con QFinance',
      });
    }
  } catch (error) {
    console.error('PDF generation failed:', error);
  }
};

// Chart SVG helper (add this function in your component file)
const generateChartSVG = (data: FinancialDataType): string => {
  const chartData = generateChartData({
    capital: data.capital || 0,
    contribution: data.monthly || 0,
    annualRate: Number(data.returnRate || 0),
    years: data.horizon || 1,
    frequency: data.frequency || 'monthly',
  });

  const W = 500, H = 160;
  const padL = 40, padR = 10, padT = 10, padB = 20;
  const maxVal = Math.max(...chartData.map(d => d.value)) * 1.15 || 1;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const horizon = data.horizon || 1;

  const points = chartData.map(d => ({
    x: padL + (d.year / horizon) * plotW,
    y: padT + plotH - (d.value / maxVal) * plotH,
  }));

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const lastPt = points[points.length - 1];

  return `
    <svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" width="100%">
      ${[0,1,2,3,4].map(i => {
        const gy = padT + (plotH / 4) * i;
        const label = Math.round(maxVal * (1 - i/4));
        const labelStr = label >= 1000 ? `€${Math.round(label/1000)}k` : `€${label}`;
        return `
          <line x1="${padL}" y1="${gy}" x2="${W - padR}" y2="${gy}"
                stroke="${i === 0 ? '#D8DDE7' : '#EEF1F5'}" stroke-width="0.8"/>
          <text x="2" y="${gy + 4}" font-size="8" fill="#667085">${labelStr}</text>
        `;
      }).join('')}
      ${Array.from({length: horizon + 1}, (_, i) => {
        const gx = padL + (i / horizon) * plotW;
        return `<text x="${gx}" y="${H - 4}" font-size="8" fill="#667085" text-anchor="middle">${i}</text>`;
      }).join('')}
      <path d="${pathD}" stroke="#C5BEE8" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="${lastPt.x}" cy="${lastPt.y}" r="5" fill="#7B61FF"/>
    </svg>
  `;
};